const express = require("express");
const router = express.Router();

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
      let gradetypes = await GradeType.find().sort({ name: 1 });

      if (gradetypes.length === 0) {
         return res.status(400).json({
            msg: "No se encontraron tipo de notas con esas características",
         });
      }

      const tableGrades = await buildTable(gradetypes);

      res.json(tableGrades);
   } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
   }
});

//@route    GET /api/grade-type/category/:id
//@desc     get all grade types || by categories
//@access   Private
router.get("/category/:id", auth, async (req, res) => {
   try {
      let gradetypes = await GradeType.find({
         "categories.category": req.params.id,
      }).sort({ name: 1 });

      if (gradetypes.length === 0) {
         return res.status(400).json({
            msg: "No se encontraron tipo de notas con esas características",
         });
      }

      res.json(gradetypes);
   } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
   }
});

//@route    POST /api/grade-type
//@desc     Update all grade types
//@access   Private && Admin
router.post("/", [auth, adminAuth], async (req, res) => {
   //An array of expence types
   const gradeTypes = req.body;

   let gradeType;
   let newGradeTypes = [];

   let checkForValidMongoDbID = new RegExp("^[0-9a-fA-F]{24}$");

   try {
      for (let x = 0; x < gradeTypes.length; x++) {
         gradeType = {
            _id: "",
            name: "",
            categories: [],
         };
         for (let y = 0; y < gradeTypes[x].length; y++) {
            if (y === 0) {
               if (gradeTypes[x][y].name === "")
                  return res
                     .status(400)
                     .json({ msg: "El nombre debe estar definido" });
               else {
                  gradeType._id = gradeTypes[x][y]._id;
                  gradeType.name = gradeTypes[x][y].name;
               }
            } else {
               if (gradeTypes[x][y].checks) {
                  gradeType.categories.push({
                     category: gradeTypes[x][y].category,
                  });
               }
            }
         }
         let gType;
         if (!checkForValidMongoDbID.test(gradeType._id)) {
            gType = new GradeType({
               name: gradeType.name,
               categories: gradeType.categories,
            });
            await gType.save();
         } else {
            gType = await GradeType.findOneAndUpdate(
               { _id: gradeType._id },
               {
                  $set: {
                     name: gradeType.name,
                     categories: gradeType.categories,
                  },
               },
               { new: true }
            );
         }
         newGradeTypes.push(gType);
      }

      newGradeTypes = await buildTable(newGradeTypes);

      res.json(newGradeTypes);
   } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
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
      res.status(500).send("Server error");
   }
});

const buildTable = async (gradetypes) => {
   let categories = [];

   try {
      categories = await Category.find();
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
   }

   let rows = [];

   for (let x = 0; x < gradetypes.length + 1; x++) {
      let row = new Array(categories.length);
      if (x === gradetypes.length) row[0] = { _id: "", name: "" };
      else row[0] = { _id: gradetypes[x]._id, name: gradetypes[x].name };

      let gradetypeNumber = 0;

      for (let y = 1; y < categories.length; y++) {
         let obj = {
            category: categories[y]._id,
            checks: false,
         };

         if (x !== gradetypes.length) {
            if (gradetypes[x].categories[gradetypeNumber]) {
               if (
                  gradetypes[x].categories[
                     gradetypeNumber
                  ].category.toString() === categories[y]._id.toString()
               ) {
                  obj.checks = true;
                  gradetypeNumber++;
               }
            }
         }
         row[y] = obj;
      }

      if (x !== gradetypes.length) rows.push(row);
   }
   return rows;
};

module.exports = router;
