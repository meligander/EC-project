const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const adminAuth = require("../../middleware/adminAuth");

const Town = require("../../models/Town");
const Neighbourhood = require("../../models/Neighbourhood");

//@route    GET api/town
//@desc     get all towns
//@access   Private
router.get("/", [auth], async (req, res) => {
   try {
      let towns = await Town.find().sort({ name: 1 });

      if (towns.length === 0) {
         return res.status(400).json({
            msg: "No se encontraron localidades con dichas descripciones",
         });
      }

      res.json(towns);
   } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
   }
});

//@route    POST api/town
//@desc     Update all towns
//@access   Private
router.post("/", [auth, adminAuth], async (req, res) => {
   //An array of towns
   const towns = req.body;
   let town = {};
   let newTowns = [];

   try {
      for (let x = 0; x < towns.length; x++) {
         if (towns[x].name === "")
            return res
               .status(400)
               .json({ msg: "El nombre debe estar definidor" });

         let name = towns[x].name;
         let id = towns[x]._id;

         if (id === "") {
            town = new Town({ name });
            await town.save();
         } else {
            town = await Town.findOneAndUpdate(
               { _id: id },
               { $set: { name } },
               { new: true }
            );
         }
         newTowns.push(town);
      }

      res.json(newTowns);
   } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
   }
});

//@route    DELETE api/town/:id
//@desc     Delete a town and all its neighbourhoods
//@access   Private
router.delete("/:id", [auth, adminAuth], async (req, res) => {
   try {
      //Remove Town
      await Town.findOneAndRemove({ _id: req.params.id });

      const neighbh = await Neighbourhood.find({ town: req.params.id });

      for (let x = 0; x < neighbh.length; x++) {
         await Neighbourhood.findOneAndRemove({ _id: neighbh[x]._id });
      }

      res.json({ msg: "Town deleted" });
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
   }
});

module.exports = router;
