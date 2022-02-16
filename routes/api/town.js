const router = require("express").Router();

//Middleware
const auth = require("../../middleware/auth");
const adminAuth = require("../../middleware/adminAuth");

//Models
const Town = require("../../models/Town");
const Neighbourhood = require("../../models/Neighbourhood");

//@route    GET /api/town
//@desc     get all towns
//@access   Private
router.get("/", auth, async (req, res) => {
   try {
      const towns = await Town.find().sort({ name: 1 });

      if (towns.length === 0) {
         return res.status(400).json({
            msg: "No se encontraron localidades con dichas descripciones",
         });
      }

      res.json(towns);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    POST /api/town
//@desc     Update all towns
//@access   Private && Admin
router.post("/", [auth, adminAuth], async (req, res) => {
   //An array of towns
   const towns = req.body;

   if (towns.some((item) => item.name === ""))
      return res.status(400).json({ msg: "El nombre debe estar definido" });

   try {
      let newTowns = [];

      for (let x = 0; x < towns.length; x++) {
         let town;

         if (towns[x]._id === 0) {
            town = new Town({ name: towns[x].name });
            await town.save();
         } else {
            town = await Town.findOneAndUpdate(
               { _id: towns[x]._id },
               { $set: { name: towns[x].name } },
               { new: true }
            );
         }
         newTowns.push(town);
      }

      res.json(newTowns);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    DELETE /api/town/:id
//@desc     Delete a town and all its neighbourhoods
//@access   Private && Admin
router.delete("/:id", [auth, adminAuth], async (req, res) => {
   try {
      //Remove Town
      await Town.findOneAndRemove({ _id: req.params.id });

      const neighbh = await Neighbourhood.find({ town: req.params.id });

      await neighbh.forEach(
         async (item) => await Neighbourhood.findOneAndRemove({ _id: item._id })
      );

      res.json({ msg: "Town deleted" });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

module.exports = router;
