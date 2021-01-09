const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const adminAuth = require("../../middleware/adminAuth");

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

//@route    POST api/expence-type
//@desc     Update all expence types
//@access   Private
router.post("/", [auth, adminAuth], async (req, res) => {
   //An array of expence types

   const expenceTypes = req.body;
   let newExpeceTypes = [];
   let expenceType = {};

   let checkForValidMongoDbID = new RegExp("^[0-9a-fA-F]{24}$");

   try {
      for (let x = 0; x < expenceTypes.length; x++) {
         if (expenceTypes[x].name === "")
            return res
               .status(400)
               .json({ msg: "El nombre debe estar definido" });
         if (expenceTypes[x].type === "")
            return res.status(400).json({ msg: "El tipo debe estar definido" });
      }

      for (let x = 0; x < expenceTypes.length; x++) {
         expenceType = {
            name: expenceTypes[x].name,
            type: expenceTypes[x].type,
         };

         if (!checkForValidMongoDbID.test(expenceTypes[x]._id)) {
            expenceType = new ExpenceType(expenceType);

            await expenceType.save();
         } else {
            expenceType = await ExpenceType.findOneAndUpdate(
               { _id: expenceTypes[x]._id },
               { $set: expenceType },
               { new: true }
            );
         }
         newExpeceTypes.push(expenceType);
      }

      res.json(newExpeceTypes);
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

      res.json({ msg: "Expence Type Deleted" });
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
   }
});

module.exports = router;
