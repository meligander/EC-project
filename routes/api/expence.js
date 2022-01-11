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
      let transactions = [];

      if (Object.entries(req.query).length === 0) {
         expences = await Expence.find().populate("expencetype");
         invoices = await Invoice.find().populate("user");
      } else {
         const filter = req.query;

         if (!filter.transactionType || filter.transactionType === "income") {
            invoices = await Invoice.find({
               ...((filter.startDate || filter.endDate) && {
                  date: {
                     ...(filter.startDate && {
                        $gte: new Date(filter.startDate).setHours(00, 00, 00),
                     }),
                     ...(filter.endDate && {
                        $lte: new Date(filter.endDate).setHours(23, 59, 59),
                     }),
                  },
               }),
            }).populate("user");
         }
         if (filter.transactionType !== "income") {
            expences = await Expence.find({
               ...((filter.startDate || filter.endDate) && {
                  date: {
                     ...(filter.startDate && {
                        $gte: new Date(filter.startDate).setHours(00, 00, 00),
                     }),
                     ...(filter.endDate && {
                        $lte: new Date(filter.endDate).setHours(23, 59, 59),
                     }),
                  },
               }),
            }).populate({
               path: "expencetype",
            });
         }

         if (filter.transactionType && filter.transactionType !== "income") {
            let filteredExpences = [];
            for (let x = 0; x < expences.length; x++) {
               console.log(expences[x]);
               if (expences[x].expencetype.type === filter.transactionType)
                  filteredExpences.push(expences[x]);
            }
            expences = filteredExpences;
         }
      }

      transactions = expences.concat(invoices);
      transactions = sortArray(transactions);

      if (transactions.length === 0) {
         return res.status(400).json({
            msg: "No se encontraron movimientos con dichas descripciones",
         });
      }

      res.json(transactions);
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
      let allWithdrawals = [];
      let withdrawals = [];

      if (Object.entries(req.query).length === 0) {
         allWithdrawals = await Expence.find()
            .populate({
               path: "expencetype",
               model: "expencetype",
               match: {
                  type: "withdrawal",
               },
            })
            .sort({ date: -1 });
      } else {
         const filter = req.query;

         allWithdrawals = await Expence.find({
            ...((filter.startDate || filter.endDate) && {
               date: {
                  ...(filter.startDate && {
                     $gte: new Date(filter.startDate).setHours(00, 00, 00),
                  }),
                  ...(filter.endDate && {
                     $lte: new Date(filter.endDate).setHours(23, 59, 59),
                  }),
               },
            }),
         })
            .populate({
               path: "expencetype",
               model: "expencetype",
               match: {
                  type: "withdrawal",
                  ...(filter.expencetype && { _id: filter.expencetype }),
               },
            })
            .sort({ date: -1 });
      }

      for (let x = 0; x < allWithdrawals.length; x++) {
         if (allWithdrawals[x].expencetype) withdrawals.push(allWithdrawals[x]);
      }

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

         let last = await Register.find().sort({ $natural: -1 }).limit(1);
         last = last[0];

         const msg =
            "Primero debe ingresar dinero a la caja antes de hacer cualquier transacción";

         if (!last)
            return res.status(400).json({
               msg,
            });

         if (last.registermoney === 0)
            return res.status(400).json({
               msg,
            });

         if (
            expencetypeinfo.type !== "special-income" &&
            last.registermoney < value
         )
            return res.status(400).json({
               msg: "No se puede utilizar más dinero del que hay en caja",
            });

         //search for the last expence
         let expence = await Expence.find()
            .populate("expencetype")
            .sort({ $natural: -1 })
            .limit(1);
         expence = expence[0];

         if (typeof value === "string") {
            value = value.replace(/,/g, ".");
            value = Number(value);
         }

         if (Number.isNaN(value))
            return res.status(400).json({
               msg: "Ingrese un número válido",
            });

         const plusvalue = Math.floor((last.registermoney + value) * 100) / 100;
         const minusvalue =
            Math.floor((last.registermoney - value) * 100) / 100;

         if (last.temporary) {
            await Register.findOneAndUpdate(
               { _id: last.id },
               {
                  ...(expencetypeinfo.type === "expence" && {
                     expence: !last.expence
                        ? value
                        : Math.floor((last.expence + value) * 100) / 100,
                     registermoney: minusvalue,
                  }),
                  ...(expencetypeinfo.type === "special-income" && {
                     cheatincome: !last.cheatincome
                        ? value
                        : Math.floor((last.cheatincome + value) * 100) / 100,
                     registermoney: plusvalue,
                  }),
                  ...(expencetypeinfo.type === "withdrawal" && {
                     withdrawal: !last.withdrawal
                        ? value
                        : Math.floor((last.withdrawal + value) * 100) / 100,
                     registermoney: minusvalue,
                  }),
               }
            );
         } else {
            const data = {
               temporary: true,
               difference: 0,
               ...(expencetypeinfo.type === "expence" && {
                  expence: value,
                  registermoney: minusvalue,
               }),
               ...(expencetypeinfo.type === "special-income" && {
                  cheatincome: value,
                  registermoney: plusvalue,
               }),
               ...(expencetypeinfo.type === "withdrawal" && {
                  withdrawal: value,
                  registermoney: minusvalue,
               }),
            };

            const register = new Register(data);

            await register.save();

            last = await Register.find().sort({ $natural: -1 }).limit(1);
            last = last[0];
         }

         let data = { value, expencetype, description, register: last._id };

         expence = new Expence(data);

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
      const expence = await Expence.findOneAndRemove({ _id: req.params.id });
      const expencetypeinfo = await ExpenceType.findOne({
         _id: expence.expencetype,
      });

      let last = await Register.find().sort({ $natural: -1 }).limit(1);
      last = last[0];

      await Register.findByIdAndUpdate(
         { _id: last.id },
         {
            ...(expencetypeinfo.type === "expence" && {
               expence: last.expence - expence.value,
               registermoney: last.registermoney + expence.value,
            }),
            ...(expencetypeinfo.type === "special-income" && {
               cheatincome: last.cheatincome - expence.value,
               registermoney: last.registermoney - expence.value,
            }),
            ...(expencetypeinfo.type === "withdrawal" && {
               withdrawal: last.withdrawal - expence.value,
               registermoney: last.registermoney + expence.value,
            }),
         }
      );

      res.json({ msg: "Expence deleted" });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

const sortArray = (array) => {
   let sortedArray = array.sort((a, b) => {
      if (a.date > b.date) return -1;
      if (a.date < b.date) return 1;
   });

   return sortedArray;
};

// const formatNumber = (number) => {
//    return new Intl.NumberFormat("de-DE").format(number);
// };

module.exports = router;
