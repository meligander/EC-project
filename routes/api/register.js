const router = require("express").Router();
const addHours = require("date-fns/addHours");
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
         registers = await Register.find().sort({ date: -1 }).limit(10);
      } else {
         const { startDate, endDate } = req.query;

         const date = {
            ...(startDate && { $gte: addHours(new Date(startDate), 3) }),
            ...(endDate && { $lt: addHours(new Date(endDate), 27) }),
         };

         registers = await Register.find({
            date:
               startDate || endDate
                  ? date
                  : { $gte: new Date(`${year}-01-01`) },
         }).sort({ date: -1 });
      }
      for (let x = 0; x < registers.length; x++)
         registers[x] = await getInfo(registers[x]);

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
      if (register.temporary) register = await getInfo(register);

      res.json(register);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    GET /api/register/year
//@desc     get money collected every month
//@access   Private && Admin
router.get("/year/bymonth", [auth, adminAuth], async (req, res) => {
   try {
      const { year } = req.query;

      let allMonths = [];

      const month = [
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

      for (let x = 0; x < 12; x++) {
         const registers = await Register.find({
            date: {
               $gte: new Date(year ? year : new Date().getFullYear(), x, 1),
               $lte: new Date(year ? year : new Date().getFullYear(), x + 1, 1),
            },
         });
         const find = {
            register: { $in: registers.map((item) => item._id) },
         };

         const income = await Invoice.find(find);
         const expences = await Expence.find(find).populate({
            path: "expencetype",
         });

         let monthRegister = {
            month: month[x],
            income: income.reduce((sum, item) => sum + item.total, 0),
            expence: 0,
            withdrawal: 0,
            difference: registers.reduce(
               (sum, item) => sum + item.difference,
               0
            ),
         };

         expences.forEach(
            (item) => (monthRegister[item.expencetype.type] += item.value)
         );

         allMonths.push(monthRegister);
      }

      res.json(allMonths);
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
//@desc     Update the last register
//@access   Private && Admin
router.put("/", [auth, adminAuth], async (req, res) => {
   let { difference, description } = req.body;

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
         difference =
            typeof difference === "string"
               ? Number(difference.replace(/,/g, "."))
               : difference;
         value =
            Math.round((last.registermoney + Number(difference)) * 100) / 100;
      }

      await Register.findOneAndUpdate(
         { _id: last.id },
         {
            $set: {
               ...(difference && {
                  difference,
                  registermoney: value,
               }),
               description,
               temporary: false,
               dateclose: new Date(),
            },
         }
      );

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

      await Register.findOneAndUpdate(
         { _id: req.params.id },
         {
            $set: {
               temporary: true,
               ...(register.difference !== 0 && {
                  registermoney: register.registermoney - register.difference,
                  difference: 0,
               }),
            },
         }
      );

      res.json({ msg: "Register deleted" });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@desc Function to get the register related info
const getInfo = async (register) => {
   const income = await Invoice.find({ register: register._id });
   const expences = await Expence.find({
      register: register._id,
   }).populate({
      path: "expencetype",
   });

   register = {
      ...register.toJSON(),
      income: income.reduce((sum, item) => {
         return item.value ? sum + item.value : sum + item.total;
      }, 0),
      expence: 0,
      withdrawal: 0,
   };

   expences.forEach((item) => (register[item.expencetype.type] += item.value));

   return register;
};

module.exports = router;
