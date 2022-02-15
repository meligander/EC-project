const router = require("express").Router();
const { check, validationResult } = require("express-validator");

//Middleware
const auth = require("../../middleware/auth");
const adminAuth = require("../../middleware/adminAuth");

//Models
const Register = require("../../models/Register");
const Invoice = require("../../models/Invoice");
const Expence = require("../../models/Expence");

//@route    GET /api/register
//@desc     get all cashier register || with filter
//@access   Private && Admin
router.get("/", [auth, adminAuth], async (req, res) => {
   try {
      let registers;

      if (Object.entries(req.query).length === 0) {
         registers = await Register.find().sort({ date: -1 });
      } else {
         const filter = req.query;

         registers = await Register.find({
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
         }).sort({ date: -1 });
      }

      if (registers.length === 0) {
         return res.status(400).json({
            msg: "No se encontró información de la caja con dichas descripciones",
         });
      }

      res.json(registers);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    GET /api/register/last
//@desc     get last register info
//@access   Private && Admin
router.get("/last", [auth, adminAuth], async (req, res) => {
   try {
      let register = await Register.find().sort({ $natural: -1 }).limit(1);
      register = register[0];

      if (!register) {
         return res.status(400).json({
            msg: "No se encontró información de la caja con dichas descripciones",
         });
      }
      if (register.temporary) {
         const income = await Invoice.find({ register: register._id });
         const expences = await Expence.find({
            register: register._id,
         }).populate({
            path: "expencetype",
         });

         const allExpences = expences.reduce((res, curr) => {
            if (res[curr.expencetype.type])
               res[curr.expencetype.type].push(curr);
            else Object.assign(res, { [curr.expencetype.type]: [curr] });

            return res;
         }, {});

         register = {
            ...register.toJSON(),
            income: income.reduce((sum, item) => {
               return item.value ? sum + item.value : sum + item.total;
            }, 0),
            expence:
               allExpences.expence &&
               allExpences.expence.reduce((sum, item) => sum + item.value, 0),
            withdrawal:
               allExpences.withdrawal &&
               allExpences.withdrawal.reduce(
                  (sum, item) => sum + item.value,
                  0
               ),
            cheatincome:
               allExpences.cheatincome &&
               allExpences.cheatincome.reduce(
                  (sum, item) => sum + item.value,
                  0
               ),
         };
      }

      res.json(register);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    GET /api/register/year/bymonth
//@desc     get money collected every month
//@access   Private && Admin
router.get("/year/bymonth", [auth, adminAuth], async (req, res) => {
   try {
      let registerByMonth = [];
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
      let firstDay = new Date();
      firstDay.setUTCMonth(0);
      firstDay.setUTCDate(1);
      firstDay.setUTCHours(0, 0, 0, 0);

      let lastDate = new Date();
      lastDate.setUTCMonth(11);
      lastDate.setUTCDate(31);
      lastDate.setUTCHours(23, 59, 59);

      let registers = await Register.find({
         date: {
            $gte: firstDay,
            $lte: lastDate,
         },
      });

      let monthCount = 0;
      let monthRegister = {
         month: "",
         income: 0,
         expence: 0,
         withdrawal: 0,
         cheatincome: 0,
         difference: 0,
      };

      for (let x = 0; x < registers.length; x++) {
         const date = new Date(registers[x].date);
         if (date.getMonth() === monthCount) {
            monthRegister.income += registers[x].income
               ? registers[x].income
               : 0;
            monthRegister.expence += registers[x].expence
               ? registers[x].expence
               : 0;
            monthRegister.withdrawal += registers[x].withdrawal
               ? registers[x].withdrawal
               : 0;
            monthRegister.cheatincome += registers[x].cheatincome
               ? registers[x].cheatincome
               : 0;
            monthRegister.difference = !registers[x].difference
               ? monthRegister.difference
               : registers[x].negative
               ? monthRegister.difference - registers[x].difference
               : monthRegister.difference + registers[x].difference;
         } else {
            monthRegister = roundData(monthRegister, monthCount, months);
            registerByMonth.push(monthRegister);
            monthRegister = {
               month: "",
               income: 0,
               expence: 0,
               withdrawal: 0,
               cheatincome: 0,
               difference: 0,
            };
            monthCount++;
            x--;
         }
      }

      monthRegister = roundData(monthRegister, monthCount, months);
      registerByMonth.push(monthRegister);
      monthCount++;

      for (let x = monthCount; x < 12; x++) {
         monthRegister = {
            month: months[x],
            income: 0,
            expence: 0,
            withdrawal: 0,
            cheatincome: 0,
            difference: 0,
         };

         registerByMonth.push(monthRegister);
      }

      res.json(registerByMonth);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    POST /api/register
//@desc     Add first register
//@access   Private && Admin
router.post(
   "/",
   [
      auth,
      adminAuth,
      check(
         "difference",
         "Debe colocar la 'DIFERENCIA' para agregar el dinero inicial en la caja"
      )
         .not()
         .isEmpty(),
   ],
   async (req, res) => {
      const { difference, description } = req.body;

      let errors = [];
      const errorsResult = validationResult(req);
      if (!errorsResult.isEmpty()) {
         errors = errorsResult.array();
         return res.status(400).json({ errors });
      }

      try {
         let data = {
            temporary: true,
            ...(description && { description }),
            registermoney: Math.floor(difference * 100) / 100,
         };

         let register = new Register(data);

         await register.save();

         res.json(register);
      } catch (err) {
         console.error(err.message);
         res.status(500).json({ msg: "Server Error" });
      }
   }
);

//@route    PUT /api/register
//@desc     Update a register
//@access   Private && Admin
router.put("/", [auth, adminAuth], async (req, res) => {
   const { difference, negative, description } = req.body;

   try {
      let last = await Register.find().sort({ $natural: -1 }).limit(1);
      last = last[0];

      if (!last.temporary) {
         return res
            .status(400)
            .json({ msg: "No se ha registrado ningún movimiento en la caja" });
      }
      let value = last.registermoney;

      if (difference) {
         if (negative) {
            value =
               Math.floor((last.registermoney - Number(difference)) * 100) /
               100;
         } else {
            value =
               Math.floor((last.registermoney + Number(difference)) * 100) /
               100;
         }
      }

      const date = new Date();

      let data = {
         ...(difference && {
            difference,
            registermoney: value,
            negative,
         }),
         ...(description && description),
         temporary: false,
         dateclose: date,
      };

      await Register.findOneAndUpdate({ _id: last.id }, data);

      res.json({ msg: "Register Closed" });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    DELETE /api/register/:id
//@desc     Delete a register
//@access   Private && Admin
router.delete("/:id", [auth, adminAuth], async (req, res) => {
   try {
      const register = await Register.findOne({ _id: req.params.id });

      if (register.temporary) {
         return res
            .status(400)
            .json({ msg: "La caja no se ha cerrado todavía" });
      }
      if (register.difference !== 0) {
         let registermoney;
         if (register.negative) {
            registermoney = register.registermoney + register.difference;
         } else {
            registermoney = register.registermoney - register.difference;
         }
         await Register.findOneAndUpdate(
            { _id: req.params.id },
            {
               temporary: true,
               difference: 0,
               registermoney,
            }
         );
      } else {
         //Remove register
         await Register.findOneAndUpdate(
            { _id: req.params.id },
            {
               temporary: true,
            }
         );
      }

      res.json({ msg: "Register deleted" });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

const roundData = (monthRegister, monthCount, months) => {
   const monthRegisters = {
      month: months[monthCount],
      income: Math.floor(monthRegister.income * 100) / 100,
      expence: Math.floor(monthRegister.expence * 100) / 100,
      withdrawal: Math.floor(monthRegister.withdrawal * 100) / 100,
      cheatincome: Math.floor(monthRegister.cheatincome * 100) / 100,
      difference: Math.floor(monthRegister.difference * 100) / 100,
   };

   return monthRegisters;
};

module.exports = router;
