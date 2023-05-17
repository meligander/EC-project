const router = require("express").Router();
const { check, validationResult } = require("express-validator");

//Middleware
const auth = require("../../middleware/auth");
const adminAuth = require("../../middleware/adminAuth");

//Models
const Global = require("../../models/Global");

//@route    GET /api/global/penalty
//@desc     get last penalty
//@access   Private && Admin
router.get("/penalty", [auth, adminAuth], async (req, res) => {
   try {
      const penalty = await Global.findOne({ type: "penalty" });

      if (!penalty) {
         return res.status(400).json({
            msg: "No se encontraron recargos con dichas descripciones",
         });
      }

      res.json(penalty);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    GET /api/global/discount
//@desc     get last discount
//@access   Private && Admin
router.get("/discount", [auth, adminAuth], async (req, res) => {
   try {
      const discount = await Global.findOne({ type: "discount" });

      if (!discount) {
         return res.status(400).json({
            msg: "No se encontraron recargos con dichas descripciones",
         });
      }

      res.json(discount);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    GET /api/global/salaries
//@desc     get all salaries
//@access   Private && Admin
router.get("/salaries", [auth, adminAuth], async (req, res) => {
   try {
      let salaries = await Global.find({ type: { $ne: "penalty" } });

      if (salaries.length === 0) {
         return res.status(400).json({
            msg: "Los salarios no están cargados",
         });
      }

      salaries = salaries.reduce((res, curr) => {
         Object.assign(res, { [curr.type]: curr.number });
         return res;
      }, {});

      res.json(salaries);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    POST /api/global/values
//@desc     Add or modify the penalty and/or discount value
//@access   Private && Admin
router.post("/values", [auth, adminAuth], async (req, res) => {
   try {
      if (Object.keys(req.body).length === 0)
         return res.status(400).json({
            msg: "Debe ingresar por lo menos uno de los valores.",
         });

      let values = {
         penalty: {},
         discount: {},
      };

      for (const x in values)
         values[x] = !req.body[x]
            ? await Global.findOne({ type: x })
            : await saveGlobal(x, req.body[x]);

      res.json(values);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    POST /api/global/salaries
//@desc     Add or modify the salaries
//@access   Private && Admin
router.post("/salaries", [auth, adminAuth], async (req, res) => {
   try {
      let salaries = {};

      for (const x in req.body) {
         const salary = await saveGlobal(x, req.body[x]);
         salaries[x] = salary.number;
      }

      res.json(salaries);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

const saveGlobal = async (type, number) => {
   if (typeof number === "string") number = Number(number.replace(/,/g, "."));

   let global = await Global.findOneAndUpdate(
      { type },
      {
         $set: {
            number,
            date: new Date(),
         },
      },
      { new: true }
   );

   if (!global) {
      global = new Global({ number, type });
      await global.save();
   }

   return global;
};

module.exports = router;
