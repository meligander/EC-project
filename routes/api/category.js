const express = require("express");
const { check, validationResult } = require("express-validator");
const path = require("path");
const pdf = require("html-pdf");
const router = express.Router();

//PDF Templates
const pdfTemplate = require("../../templates/list");

//Middlewares
const adminAuth = require("../../middleware/adminAuth");
const auth = require("../../middleware/auth");

//Models
const Category = require("../../models/Category");
const Installment = require("../../models/Installment");
const Enrollment = require("../../models/Enrollment");

//@route    GET /api/category
//@desc     get all categories
//@access   Private && Admin
router.get("/", [auth, adminAuth], async (req, res) => {
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

//@route    GET /api/category/fetch-list
//@desc     Get the pdf of categories
//@access   Private && Admin
router.get("/fetch-list", [auth, adminAuth], (req, res) => {
   res.sendFile(path.join(__dirname, "../../reports/categories.pdf"));
});

//@route    POST /api/category
//@desc     Add a category
//@access   Private && Admin
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

//@route    POST api/category/create-list
//@desc     Create a pdf of categories
//@access   Private && Admin
router.post("/create-list", [auth, adminAuth], (req, res) => {
   const category = req.body;

   let tbody = "";

   for (let x = 0; x < category.length; x++) {
      const name = "<td>" + category[x].name + "</td>";
      const value = "<td>" + category[x].value + "</td>";

      tbody += "<tr>" + name + value + "</tr>";
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

   try {
      pdf.create(
         pdfTemplate(css, img, "categorías", thead, tbody, true),
         options
      ).toFile(path.join(__dirname, "../../reports/categories.pdf"), (err) => {
         if (err) {
            res.send(Promise.reject());
         }

         res.send(Promise.resolve());
      });
   } catch (err) {
      console.error(err.message);
      return res.status(500).send("PDF Error");
   }
});

//@route    PUT /api/category
//@desc     Update all categories
//@access   Private && Admin
router.put(
   "/",
   [
      auth,
      adminAuth,
      check("date", "El mes de actualización es necesario").not().isEmpty(),
   ],
   async (req, res) => {
      //An array of categories
      const { categories, date } = req.body;

      const dateToday = new Date();

      const month = parseInt(date.substring(5));
      const year = parseInt(date.substring(0, 4));

      let errors = [];
      const errorsResult = validationResult(req);
      if (!errorsResult.isEmpty()) {
         errors = errorsResult.array();
         return res.status(400).json({ errors });
      }

      for (let x = 0; x < categories.length; x++) {
         if (categories[x].value === 0 || categories[x].value === "")
            return res
               .status(400)
               .json({ msg: "El valor debe estar definido y ser mayor a 0" });
      }

      try {
         for (let x = 0; x < categories.length; x++) {
            let value = parseFloat(categories[x].value);

            await Category.findOneAndUpdate(
               { _id: categories[x]._id },
               { value }
            );

            const enrollments = await Enrollment.find({
               year: { $in: [year, year + 1] },
               category: categories[x]._id,
            });

            if (x === 0) {
               const installmentsInsc = await Installment.find({
                  number: 0,
                  year: { $in: [year, year + 1] },
                  value: { $ne: 0 },
               });
               for (let y = 0; y < installmentsInsc.length; y++) {
                  await Installment.findOneAndUpdate(
                     { _id: installmentsInsc[y]._id },
                     {
                        value,
                     }
                  );
               }
               continue;
            }

            if (enrollments.length !== 0) {
               for (let y = 0; y < enrollments.length; y++) {
                  //chenged
                  const installments = await Installment.find({
                     enrollment: enrollments[y]._id,
                     number:
                        enrollments[y].year === year &&
                        year === dateToday.getFullYear()
                           ? { $gte: month, $ne: 0 }
                           : {
                                $ne: 0,
                             },
                     year: { $in: [year, year + 1] },
                     value: { $ne: 0 },
                  }).populate({ path: "student", select: "-password" });

                  for (let z = 0; z < installments.length; z++) {
                     let newValue = installments[z].student.discount
                        ? value -
                          (value * installments[z].student.discount) / 100
                        : value;

                     await Installment.findOneAndUpdate(
                        { _id: installments[z]._id },
                        {
                           value: newValue,
                           expired: false,
                        }
                     );
                  }
               }
            }
         }

         res.json({ msg: "Categories Prices Updated" });
      } catch (err) {
         console.error(err.message);
         return res.status(500).send("Server Error");
      }
   }
);

module.exports = router;
