const router = require("express").Router();
const { check, validationResult } = require("express-validator");

//Middlewares
const adminAuth = require("../../middleware/adminAuth");
const auth = require("../../middleware/auth");

//Models
const Expence = require("../../models/Expence");
const Register = require("../../models/Register");
const ExpenceType = require("../../models/ExpenceType");
const Invoice = require("../../models/Invoice");

//@route    GET /api/expence
//@desc     get all expences || with filter
//@access   Private && Admin
router.get("/", [auth, adminAuth], async (req, res) => {
   try {
      let expences = [];
      let invoices = [];

      if (Object.entries(req.query).length === 0) {
         expences = await Expence.find().populate("expencetype");
         invoices = await Invoice.find().populate({
            path: "user.user_id",
            model: "user",
            select: ["name", "lastname"],
         });
      } else {
         const { transactionType, startDate, endDate } = req.query;

         const date = {
            ...(startDate && {
               $gte: new Date(startDate).setHours(00, 00, 00),
            }),
            ...(endDate && {
               $lte: new Date(endDate).setHours(23, 59, 59),
            }),
         };

         if (!transactionType || transactionType === "income") {
            invoices = await Invoice.find({
               ...((startDate || endDate) && { date }),
            }).populate({
               path: "user.user_id",
               model: "user",
               select: ["name", "lastname"],
            });
         }
         if (transactionType !== "income") {
            expences = await Expence.find({
               ...((startDate || endDate) && { date }),
            }).populate({
               path: "expencetype",
               ...(transactionType && {
                  match: { type: transactionType },
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

      if (Object.entries(req.query).length === 0) {
         withdrawals = await Expence.find()
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

         withdrawals = await Expence.find({
            ...((startDate || endDate) && {
               date: {
                  ...(startDate && {
                     $gte: new Date(startDate).setHours(00, 00, 00),
                  }),
                  ...(endDate && {
                     $lte: new Date(endDate).setHours(23, 59, 59),
                  }),
               },
            }),
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
      let { value, expencetype, description } = req.body;

      value = Number(
         typeof value === "string" ? value.replace(/,/g, ".") : value
      );

      if (isNaN(value))
         return res.status(400).json({
            msg: "Ingrese un número válido",
         });

      let errors = [];
      const errorsResult = validationResult(req);
      if (!errorsResult.isEmpty()) {
         errors = errorsResult.array();
         return res.status(400).json({ errors });
      }

      try {
         const expencetypeinfo = await ExpenceType.findOne({
            _id: expencetype,
         });

         let register = await Register.find().sort({ $natural: -1 }).limit(1);
         register = register[0];

         if (!register || register.registermoney === 0)
            return res.status(400).json({
               msg: "Primero debe ingresar dinero a la caja antes de hacer cualquier transacción",
            });

         if (
            expencetypeinfo.type !== "cheatincome" &&
            register.registermoney < value
         )
            return res.status(400).json({
               msg: "No se puede utilizar más dinero del que hay en caja",
            });

         const registermoney =
            expencetypeinfo.type !== "cheatincome"
               ? register.registermoney - value
               : register.registermoney + value;

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
            value,
            expencetype,
            description,
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

      const registermoney =
         expence.expencetype.type !== "cheatincome"
            ? expence.register.registermoney + expence.value
            : expence.register.registermoney - expence.value;

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
