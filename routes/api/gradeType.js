const router = require("express").Router();

//Middleware
const auth = require("../../middleware/auth");
const adminAuth = require("../../middleware/adminAuth");

//Models
const GradeType = require("../../models/GradeType");
const Category = require("../../models/Category");

//@route    GET /api/grade-type
//@desc     get all grade types
//@access   Private && Admin
router.get("/", [auth, adminAuth], async (req, res) => {
   try {
      const gradetypes = await GradeType.find().sort({ name: 1 });

      if (gradetypes.length === 0) {
         return res.status(400).json({
            msg: "No se encontraron tipo de notas con esas características",
         });
      }

      const tableGrades = await buildTable(gradetypes);

      res.json(tableGrades);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    GET /api/grade-type/category/:id
//@desc     get all grade types || by categories
//@access   Private
router.get("/category/:id", auth, async (req, res) => {
   try {
      const gradetypes = await GradeType.find({
         categories: req.params.id,
      }).sort({ name: 1 });

      if (gradetypes.length === 0) {
         return res.status(400).json({
            msg: "No se encontraron tipo de notas con esas características",
         });
      }

      res.json(gradetypes);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    POST /api/grade-type
//@desc     Update all grade types
//@access   Private && Admin
router.post("/", [auth, adminAuth], async (req, res) => {
   //An array of expence types
   const gradeTypes = req.body;

   let newGradeTypes = [];

   if (gradeTypes.some((item) => item.name === ""))
      return res.status(400).json({ msg: "El nombre debe estar definido" });

   try {
      for (let x = 0; x < gradeTypes.length; x++) {
         let data = {
            name: gradeTypes[x].name,
            categories: [],
            percentage: false,
         };

         await gradeTypes[x].categories.forEach((item) => {
            if (item.category) {
               if (item.checks) data.categories.push(item.category);
            } else data.percentage = item.checks;
         });

         let gradeType = {};
         if (gradeTypes[x]._id === 0) {
            gradeType = new GradeType(data);
            await gradeType.save();
         } else
            gradeType = await GradeType.findOneAndUpdate(
               { _id: gradeTypes[x]._id },
               { $set: data },
               { new: true }
            );

         newGradeTypes.push(gradeType);
      }

      const table = await buildTable(newGradeTypes);

      res.json(table);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    DELETE /api/grade-type/:id
//@desc     Delete a grade type
//@access   Private && Admin
router.delete("/:id", [auth, adminAuth], async (req, res) => {
   try {
      //Remove Town
      await GradeType.findOneAndRemove({ _id: req.params.id });

      res.json({ msg: "Grade Type Deleted" });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@desc Function to create the table to show on the front-end
const buildTable = async (gradetypes) => {
   const categories = await Category.find({ name: { $ne: "Inscripción" } });

   let rows = [];

   for (let x = 0; x < gradetypes.length; x++) {
      let row = Array.from(Array(categories.length), (item, index) => {
         const exists = gradetypes[x].categories.some(
            (item) => item.toString() === categories[index]._id.toString()
         );
         return {
            category: categories[index]._id,
            checks: exists,
         };
      });
      row.push({ category: null, checks: gradetypes[x].percentage });
      rows.push({
         ...gradetypes[x].toJSON(),
         categories: row,
      });
   }
   return rows;
};

module.exports = router;
