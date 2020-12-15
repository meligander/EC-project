const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const adminAuth = require("../../middleware/adminAuth");
const { check, validationResult } = require("express-validator");
const path = require("path");
const pdf = require("html-pdf");
const pdfTemplate = require("../../templates/list");

const Category = require("../../models/Category");
const Installment = require("../../models/Installment");
const Enrollment = require("../../models/Enrollment");

//@route    GET api/category
//@desc     get all categories
//@access   Private
router.get("/", [auth], async (req, res) => {
   try {
      let categories = await Category.find();

      if (categories.length === 0) {
         return res.status(400).json({
            msg: "No se encontraron categorías con dichas descripciones",
         });
      }

      res.json(categories);
   } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
   }
});

//@route    POST api/category/create-list
//@desc     Create a pdf of categories
//@access   Private
router.post("/create-list", (req, res) => {
   const name = "reports/categories.pdf";

   const category = req.body;

   let tbody = "";

   for (let x = 0; x < category.length; x++) {
      const categoryName = "<td>" + category[x].name + "</td>";
      const value = "<td>" + category[x].value + "</td>";

      tbody += "<tr>" + categoryName + value + "</tr>";
   }

   const thead = "<th>Nombre</th> <th>Valor</th>";

   const img = path.join(
      "file://",
      __dirname,
      "../../templates/assets/logo.png"
   );
   const css = path.join(
      "file://",
      __dirname,
      "../../templates/list/style.css"
   );

   const options = {
      format: "A4",
      header: {
         height: "15mm",
         contents: `<div></div>`,
      },
      footer: {
         height: "17mm",
         contents:
            '<footer class="footer">Villa de Merlo English Center</footer>',
      },
   };

   pdf.create(
      pdfTemplate(css, img, "categorías", thead, tbody, true),
      options
   ).toFile(name, (err) => {
      if (err) {
         res.send(Promise.reject());
      }

      res.send(Promise.resolve());
   });
});

//@route    GET api/category/fetch-list
//@desc     Get the pdf of categories
//@access   Private
router.get("/fetch-list", (req, res) => {
   res.sendFile(path.join(__dirname, "../../reports/categories.pdf"));
});

//@route    POST api/category
//@desc     Add a category
//@access   Private
router.post(
   "/",
   [auth, adminAuth, check("name", "El nombre es necesario").not().isEmpty()],
   async (req, res) => {
      const { name, value } = req.body;

      let errors = [];
      const errorsResult = validationResult(req);
      if (!errorsResult.isEmpty()) {
         errors = errorsResult.array();
         return res.status(400).json({ errors });
      }

      try {
         let data = { name, value };

         let category = new Category(data);

         await category.save();

         res.json(category);
      } catch (err) {
         console.error(err.message);
         return res.status(500).send("Server Error");
      }
   }
);

//@route    PUT api/category/:id_category
//@desc     Update a category
//@access   Private
router.put("/:id_category", [auth, adminAuth], async (req, res) => {
   const { value } = req.body;

   try {
      const category = await Category.findOneAndUpdate(
         { _id: req.params.id_category },
         { $set: { value } },
         { new: true }
      );

      res.json(category);
   } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
   }
});

//@route    PUT api/category
//@desc     Update all categories
//@access   Private
router.put(
   "/",
   [
      auth,
      adminAuth,
      check("month", "El mes de actualización es necesario").not().isEmpty(),
   ],
   async (req, res) => {
      //An array of categories
      const { categories, month } = req.body;
      const date = new Date();
      const year = date.getFullYear();
      let newCategories = [];

      let errors = [];
      const errorsResult = validationResult(req);
      if (!errorsResult.isEmpty()) {
         errors = errorsResult.array();
         return res.status(400).json({ errors });
      }
      try {
         for (let x = 0; x < categories.length; x++) {
            let value = categories[x].value;
            let category = await Category.findOneAndUpdate(
               { _id: categories[x]._id },
               { value },
               { new: true }
            );
            newCategories.push(category);

            const enrollments = await Enrollment.find({
               year: { $in: [year, year + 1] },
               category: categories[x]._id,
            });

            for (let y = 0; y < enrollments.length; y++) {
               const installments = await Installment.find({
                  student: enrollments[y].student,
                  ...(enrollments[y].year.toString() === year && {
                     number: { $gte: month },
                  }),
                  year,
               }).populate({ path: "student", select: "-password" });
               for (let z = 0; z < installments.length; z++) {
                  let newValue =
                     value - (value * installments[z].student.discount) / 100;
                  await Installment.findOneAndUpdate(
                     { _id: installments[z]._id },
                     { value: installments[z].number === 0 ? value : newValue }
                  );
               }
            }
         }

         res.json(newCategories);
      } catch (err) {
         console.error(err.message);
         return res.status(500).send("Server Error");
      }
   }
);

//@route    DELETE api/category/:id
//@desc     Delete a category
//@access   Private
router.delete("/:id", [auth, adminAuth], async (req, res) => {
   try {
      //Remove Category
      await Category.findOneAndRemove({ _id: req.params.id });

      res.json({ msg: "Category deleted" });
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
   }
});

module.exports = router;
