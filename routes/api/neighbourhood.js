const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const adminAuth = require("../../middleware/adminAuth");

const Neighbourhood = require("../../models/Neighbourhood");

//@route    GET api/neighbourhood
//@desc     get all neighbourhoods
//@access   Private
router.get("/", [auth, adminAuth], async (req, res) => {
   try {
      let neighbourhoods = await Neighbourhood.find().sort({ name: 1 });

      if (neighbourhoods.length === 0) {
         return res.status(400).json({
            msg: "No se encontraron barrios con dichas descripciones",
         });
      }

      res.json(neighbourhoods);
   } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
   }
});

//@route    GET api/neighbourhood/town/:id
//@desc     get all neighbourhoods by town
//@access   Private
router.get("/town/:id", [auth], async (req, res) => {
   try {
      let neighbourhoods = await Neighbourhood.find({
         town: req.params.id,
      }).sort({ name: 1 });

      if (neighbourhoods.length === 0) {
         return res.status(400).json({
            msg: "No se encontraron barrios con dichas descripciones",
         });
      }

      res.json(neighbourhoods);
   } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
   }
});

//@route    POST api/neighbourhood
//@desc     Update all neighbourhoods
//@access   Private
router.post("/", [auth, adminAuth], async (req, res) => {
   const neighbourhoods = req.body;
   let neighbourhood = {};
   let newNeighbourhoods = [];

   try {
      for (let x = 0; x < neighbourhoods.length; x++) {
         if (neighbourhoods[x].name === "")
            return res
               .status(400)
               .json({ msg: "El nombre debe estar definido" });
         if (neighbourhoods[x].town === 0)
            return res
               .status(400)
               .json({ msg: "La localidad debe estar definida" });

         let name = neighbourhoods[x].name;
         let town = neighbourhoods[x].town;
         let id = neighbourhoods[x]._id;

         if (id === "") {
            neighbourhood = new Neighbourhood({ name, town });
            await neighbourhood.save();
         } else {
            neighbourhood = await Neighbourhood.findOneAndUpdate(
               { _id: id },
               { $set: { name, town } },
               { new: true }
            );
         }
         newNeighbourhoods.push(neighbourhood);
      }

      res.json(newNeighbourhoods);
   } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
   }
});

//@route    DELETE api/neighbourhood/:id
//@desc     Delete a neighbourhood
//@access   Private
router.delete("/:id", [auth, adminAuth], async (req, res) => {
   try {
      //Remove neighbourhood
      await Neighbourhood.findOneAndRemove({ _id: req.params.id });

      res.json({ msg: "Neighbourhood Deleted" });
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
   }
});

module.exports = router;
