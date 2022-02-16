const router = require("express").Router();

//Middleware
const auth = require("../../middleware/auth");
const adminAuth = require("../../middleware/adminAuth");

//Models
const Neighbourhood = require("../../models/Neighbourhood");

//@route    GET /api/neighbourhood
//@desc     get all neighbourhoods
//@access   Private && Admin
router.get("/", [auth, adminAuth], async (req, res) => {
   try {
      const neighbourhoods = await Neighbourhood.find().sort({ name: 1 });

      if (neighbourhoods.length === 0) {
         return res.status(400).json({
            msg: "No se encontraron barrios con dichas descripciones",
         });
      }

      res.json(neighbourhoods);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    GET /api/neighbourhood/town/:id
//@desc     get all neighbourhoods by town
//@access   Private
router.get("/town/:id", auth, async (req, res) => {
   try {
      const neighbourhoods = await Neighbourhood.find({
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
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    POST /api/neighbourhood
//@desc     Update all neighbourhoods
//@access   Private && Admin
router.post("/", [auth, adminAuth], async (req, res) => {
   const neighbourhoods = req.body;

   if (neighbourhoods.some((item) => item.name === "" || item.town === ""))
      return res
         .status(400)
         .json({ msg: "El nombre y la localidad deben estar definidos" });

   try {
      let newNeighbourhoods = [];

      for (let x = 0; x < neighbourhoods.length; x++) {
         const data = {
            name: neighbourhoods[x].name,
            town: neighbourhoods[x].town,
         };

         let neighbourhood;

         if (neighbourhoods[x]._id === 0) {
            neighbourhood = new Neighbourhood(data);
            await neighbourhood.save();
         } else {
            neighbourhood = await Neighbourhood.findOneAndUpdate(
               { _id: neighbourhoods[x]._id },
               { $set: data },
               { new: true }
            );
         }

         newNeighbourhoods.push(neighbourhood);
      }

      res.json(newNeighbourhoods);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    DELETE /api/neighbourhood/:id
//@desc     Delete a neighbourhood
//@access   Private && Admin
router.delete("/:id", [auth, adminAuth], async (req, res) => {
   try {
      //Remove neighbourhood
      await Neighbourhood.findOneAndRemove({ _id: req.params.id });

      res.json({ msg: "Neighbourhood Deleted" });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

module.exports = router;
