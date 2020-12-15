const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const adminAuth = require("../../middleware/adminAuth");
const { check, validationResult } = require("express-validator");

const ExpenceType = require("../../models/ExpenceType");

//@route    GET api/expence-type
//@desc     Get all expence types
//@access   Private
router.get("/", [auth, adminAuth], async (req, res) => {
   try {
      const expenceTypes = await ExpenceType.find().sort({ name: 1 });

      if (expenceTypes.length === 0) {
         return res.status(400).json({
            msg: "No se encontraron tipos de gastos con dichas descripciones",
         });
      }

      res.json(expenceTypes);
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
   }
});

//@route    GET api/expence-type/:id
//@desc     Get one expence type
//@access   Public
router.get("/:id", [auth, adminAuth], async (req, res) => {
   try {
      const expenceType = await ExpenceType.findOne({ _id: req.params.id });

      if (!expenceType) {
         return res.status(400).json({
            msg: "No se encontró un tipo de gasto con dichas descripciones",
         });
      }

      res.json(expenceTypes);
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
   }
});

//@route    POST api/expence-type
//@desc     Add an expence type
//@access   Private
router.post(
   "/one",
   [auth, adminAuth, check("name", "El nombre es necesario").not().isEmpty()],
   async (req, res) => {
      const { name, type } = req.body;
      let expenceType;

      let errors = [];
      const errorsResult = validationResult(req);
      if (!errorsResult.isEmpty()) {
         errors = errorsResult.array();
         return res.status(400).json({ errors });
      }

      try {
         expenceType = new ExpenceType({ name, type });

         await expenceType.save();

         res.json(expenceType);
      } catch (err) {
         console.error(err.message);
         return res.status(500).send("Server Error");
      }
   }
);

//@route    PUT api/expence-type/:id
//@desc     Update an expence-type
//@access   Private
router.put(
   "/:id",
   [
      auth,
      adminAuth,
      check("name", "El nombre es necesario").not().isEmpty(),
      check("type", "El tipo es necesario").not().isEmpty(),
   ],
   async (req, res) => {
      const { name, type } = req.body;

      let errors = [];
      const errorsResult = validationResult(req);
      if (!errorsResult.isEmpty()) {
         errors = errorsResult.array();
         return res.status(400).json({ errors });
      }

      try {
         let expenceType = await ExpenceType.findOneAndUpdate(
            { _id: req.params.id },
            { $set: { name, type } },
            { new: true }
         );

         res.json(expenceType);
      } catch (err) {
         console.error(err.message);
         return res.status(500).send("Server Error");
      }
   }
);

//@route    POST api/expence-type
//@desc     Update all expence types
//@access   Private
router.post("/", [auth, adminAuth], async (req, res) => {
   //An array of expence types
   const expenceTypes = req.body;
   let expenceType;
   let newExpenceTypes = [];

   try {
      for (let x = 0; x < expenceTypes.length; x++) {
         if (expenceTypes[x].name === "")
            return res
               .status(400)
               .json({ msg: "El nombre debe estar definido" });
         if (expenceTypes[x].type === 0)
            return res.status(400).json({ msg: "El tipo debe estar definido" });
      }
      let oldExpenceTypes = await ExpenceType.find();
      for (let x = 0; x < expenceTypes.length; x++) {
         let name = expenceTypes[x].name;
         let id = expenceTypes[x]._id;
         let type = expenceTypes[x].type;

         if (id === "") {
            expenceType = new ExpenceType({ name, type });

            await expenceType.save();
         } else {
            expenceType = await ExpenceType.findOneAndUpdate(
               { _id: id },
               { $set: { name, type } },
               { new: true }
            );
            for (let y = 0; y < oldExpenceTypes.length; y++) {
               if (oldExpenceTypes[y]._id.toString() === id) {
                  oldExpenceTypes.splice(y, 1);
                  break;
               }
            }
         }
         newExpenceTypes.push(expenceType);
      }

      for (let x = 0; x < oldExpenceTypes.length; x++) {
         await ExpenceType.findOneAndRemove({ _id: oldExpenceTypes[x]._id });
      }

      res.json(newExpenceTypes);
   } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
   }
});

//@route    DELETE api/expence-type/:id
//@desc     Delete an exence type
//@access   Private
router.delete("/:id", [auth, adminAuth], async (req, res) => {
   try {
      //Remove expencetype
      await ExpenceType.findOneAndRemove({ _id: req.params.id });

      res.json({ msg: "Expence type deleted" });
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
   }
});

module.exports = router;
