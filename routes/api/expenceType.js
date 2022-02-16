const router = require("express").Router();

//Middlewares
const auth = require("../../middleware/auth");
const adminAuth = require("../../middleware/adminAuth");

//Models
const ExpenceType = require("../../models/ExpenceType");

//@route    GET /api/expence-type
//@desc     Get all expence types
//@access   Private && Admin
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
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    GET /api/expence-type/withdrawal
//@desc     Get all withdrawal types
//@access   Private && Admin
router.get("/withdrawal", [auth, adminAuth], async (req, res) => {
   try {
      const expenceTypes = await ExpenceType.find({ type: "withdrawal" }).sort({
         name: 1,
      });

      if (expenceTypes.length === 0) {
         return res.status(400).json({
            msg: "No se encontraron retiros de dinero con dichas descripciones",
         });
      }

      res.json(expenceTypes);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    POST /api/expence-type
//@desc     Update all expence types
//@access   Private && Admin
router.post("/", [auth, adminAuth], async (req, res) => {
   //An array of expence types

   const expenceTypes = req.body;

   if (expenceTypes.some((item) => item.name === "" || item.type === ""))
      return res
         .status(400)
         .json({ msg: "El nombre y el tipo debe estar definido" });

   try {
      await expenceTypes.forEach(async (item) => {
         const data = {
            name: item.name,
            type: item.type,
         };

         if (item._id === 0) {
            let expenceType = await ExpenceType.findOne(data);

            if (!expenceType) {
               expenceType = new ExpenceType(data);
               await expenceType.save();
            }
         } else
            await ExpenceType.findOneAndUpdate(
               { _id: item._id },
               { $set: data }
            );
      });

      res.json({ msg: "Expence Types Updated" });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    DELETE /api/expence-type/:id
//@desc     Delete an exence type
//@access   Private && Admin
router.delete("/:id", [auth, adminAuth], async (req, res) => {
   try {
      //Remove expencetype
      await ExpenceType.findOneAndRemove({ _id: req.params.id });

      res.json({ msg: "Expence Type Deleted" });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

module.exports = router;
