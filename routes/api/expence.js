const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const addHours = require("date-fns/addHours");

//Middlewares
const adminAuth = require("../../middleware/adminAuth");
const auth = require("../../middleware/auth");

//Models
const Expence = require("../../models/Expence");
const ExpenceType = require("../../models/ExpenceType");
const Register = require("../../models/Register");
const Invoice = require("../../models/Invoice");

const employeePaymentID = "5fe813b999e13c3f807a0d79";

const months = [
   "Enero",
   "Febrero",
   "Marzo",
   "Abril",
   "Mayo",
   "Junio",
   "Julio",
   "Agosto",
   "Septiembre",
   "Octubre",
   "Noviembre",
   "Diciembre",
];

//@route    GET /api/expence
//@desc     get all expences || with filter
//@access   Private && Admin
router.get("/", [auth, adminAuth], async (req, res) => {
   try {
      let expences = [];
      let invoices = [];
      const year = new Date().getFullYear();

      if (Object.entries(req.query).length === 0) {
         expences = await Expence.find({
            date: { $gte: new Date(`${year}-01-01`) },
         }).populate("expencetype");
         invoices = await Invoice.find({
            date: { $gte: new Date(`${year}-01-01`) },
         }).populate({
            path: "user.user_id",
            model: "user",
            select: ["name", "lastname"],
         });
      } else {
         const { transactionType, startDate, endDate, isNotAdmin } = req.query;

         const date = {
            ...(startDate && { $gte: addHours(new Date(startDate), 3) }),
            ...(endDate && { $lt: addHours(new Date(endDate), 27) }),
         };

         if (
            (!transactionType || transactionType === "income") &&
            !isNotAdmin
         ) {
            invoices = await Invoice.find({
               date:
                  startDate || endDate
                     ? date
                     : { $gte: new Date(`${year}-01-01`) },
            }).populate({
               path: "user.user_id",
               model: "user",
               select: ["name", "lastname"],
            });
         }
         if (transactionType !== "income") {
            expences = await Expence.find({
               date:
                  startDate || endDate
                     ? date
                     : { $gte: new Date(`${year}-01-01`) },
            }).populate({
               path: "expencetype",
               ...((transactionType || isNotAdmin) && {
                  match: {
                     type: transactionType
                        ? transactionType
                        : isNotAdmin && "expence",
                  },
               }),
            });
         }
         expences = expences.filter((item) => item.expencetype);
      }

      const total = sortArray([...invoices, ...expences]);

      if (total.length === 0) {
         return res.status(400).json({
            msg: "No se encontraron movimientos con dichas descripciones",
         });
      }

      res.json(total);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    GET /api/expence/withdrawals
//@desc     get all withdrawals || with filter
//@access   Private && Admin
router.get("/withdrawal", [auth, adminAuth], async (req, res) => {
   try {
      let withdrawals = [];
      const year = new Date().getFullYear();

      if (Object.entries(req.query).length === 0) {
         withdrawals = await Expence.find({
            date: { $gte: new Date(`${year}-01-01`) },
         })
            .populate({
               path: "expencetype",
               model: "expencetype",
               match: {
                  type: "withdrawal",
               },
            })
            .sort({ date: -1 });
      } else {
         const { startDate, endDate, expencetype } = req.query;

         const date = {
            ...(startDate && { $gte: addHours(new Date(startDate), 3) }),
            ...(endDate && { $lt: addHours(new Date(endDate), 27) }),
         };

         withdrawals = await Expence.find({
            date:
               startDate || endDate
                  ? date
                  : { $gte: new Date(`${year}-01-01`) },
         })
            .populate({
               path: "expencetype",
               model: "expencetype",
               match: {
                  type: "withdrawal",
                  ...(expencetype && { _id: expencetype }),
               },
            })
            .sort({ date: -1 });
      }

      withdrawals = withdrawals.filter((item) => item.expencetype);

      if (withdrawals.length === 0) {
         return res.status(400).json({
            msg: "No se encontraron retiros de dinero con dichas descripciones",
         });
      }

      res.json(withdrawals);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    GET /api/expence/withdrawal/bymonth
//@desc     get money collected every month
//@access   Private && Admin
router.get("/withdrawal/bymonth", [auth, adminAuth], async (req, res) => {
   try {
      const { year } = req.query;

      const expencetypes = await ExpenceType.find({ type: "withdrawal" }).sort({
         name: 1,
      });

      const withdrawals = await Expence.find({
         date: {
            $gte: new Date(year ? year : new Date().getFullYear(), 0, 1),
            $lte: new Date(year ? year : new Date().getFullYear(), 11, 1),
         },
      })
         .populate({
            path: "expencetype",
            model: "expencetype",
            match: {
               type: "withdrawal",
            },
         })
         .sort({ date: -1 });

      const totals = { month: "Total" };
      expencetypes.forEach((type) => (totals[type.name] = 0));

      const allMonths = withdrawals
         .filter((item) => item.expencetype)
         .reduce(
            (res, curr) => {
               console.log(
                  `Original: ${curr.date}\nDia: ${new Date(
                     curr.date
                  )}\nMes: ${new Date(curr.date).getMonth()}\n`
               );
               res[new Date(curr.date).getMonth()][curr.expencetype.name] +=
                  curr.value;
               totals[curr.expencetype.name] += curr.value;
               return res;
            },
            Array.from(Array(months.length), (item, index) => {
               const items = {
                  month: months[index],
               };
               expencetypes.forEach((type) => (items[type.name] = 0));
               return items;
            })
         );

      allMonths.push(totals);

      res.json(allMonths);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    POST /api/expence
//@desc     Add an expence
//@access   Private && Admin
router.post(
   "/",
   [
      auth,
      adminAuth,
      check("value", "El valor es necesario").not().isEmpty(),
      check("expencetype", "El tipo de gasto es necesario").not().isEmpty(),
   ],
   async (req, res) => {
      let { value, teacher, description, expencetype } = req.body;

      if (typeof value === "string") value = Number(value.replace(/,/g, "."));

      if (isNaN(value))
         return res.status(400).json({
            msg: "Ingrese un número válido",
         });

      if (expencetype === employeePaymentID) {
         if (teacher._id === undefined)
            return res.status(400).json({
               msg: "Debe seleccionar un empleado",
            });
         else
            description = `${
               expencetype === employeePaymentID && teacher._id
                  ? `Pago a ${teacher.lastname}, ${teacher.name}. `
                  : ""
            }${description}`;
      }

      let errors = [];
      const errorsResult = validationResult(req);
      if (!errorsResult.isEmpty()) {
         errors = errorsResult.array();
         return res.status(400).json({ errors });
      }

      try {
         let register = await Register.find().sort({ $natural: -1 }).limit(1);
         register = register[0];

         if (!register || register.registermoney === 0)
            return res.status(400).json({
               msg: "Primero debe ingresar dinero a la caja antes de hacer cualquier transacción",
            });

         if (register.registermoney < value)
            return res.status(400).json({
               msg: "No se puede utilizar más dinero del que hay en caja",
            });

         const registermoney = Math.round(
            ((register.registermoney - value + Number.EPSILON) * 100) / 100
         );

         if (register.temporary) {
            await Register.findOneAndUpdate(
               { _id: register._id },
               { $set: { registermoney } }
            );
         } else {
            register = new Register({ registermoney });

            await register.save();
         }

         const expence = new Expence({
            ...req.body,
            description,
            value,
            register: register._id,
         });

         await expence.save();

         res.json({ msg: "Expence Register" });
      } catch (err) {
         console.error(err.message);
         res.status(500).json({ msg: "Server Error" });
      }
   }
);

//@route    DELETE /api/expence/:id
//@desc     Delete an expence
//@access   Private && Admin
router.delete("/:id", [auth, adminAuth], async (req, res) => {
   try {
      //Remove Expence
      const expence = await Expence.findOneAndRemove({
         _id: req.params.id,
      })
         .populate({
            path: "expencetype",
            model: "expencetype",
         })
         .populate({
            path: "register",
            model: "register",
         });

      const registermoney = expence.register.registermoney + expence.value;

      await Register.findByIdAndUpdate(
         { _id: expence.register._id },
         { $set: { registermoney } }
      );

      res.json({ msg: "Expence deleted" });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@desc Function to sort an array by date
const sortArray = (array) => {
   return array.sort((a, b) => {
      if (a.date > b.date) return -1;
      if (a.date < b.date) return 1;
   });
};

module.exports = router;
