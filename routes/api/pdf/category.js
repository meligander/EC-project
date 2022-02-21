const router = require("express").Router();
const path = require("path");

const generatePDF = require("../../../config/generatePDF");

//PDF Templates
const pdfTemplate = require("../../../templates/list");

//Middlewares
const adminAuth = require("../../../middleware/adminAuth");
const auth = require("../../../middleware/auth");

const fileName = path.join(__dirname, "../../../reports/categories.pdf");

//@route    GET /api/pdf/category/fetch
//@desc     Get the pdf of categories
//@access   Private && Admin
router.get("/fetch", [auth, adminAuth], (req, res) => {
   res.sendFile(fileName);
});

//@route    POST api/pdf/category/list
//@desc     Create a pdf of categories
//@access   Private && Admin
router.post("/list", [auth, adminAuth], (req, res) => {
   const category = req.body;

   const tbody = category
      .map(
         (item) =>
            `<tr><td>${item.name}</td><td>$${new Intl.NumberFormat(
               "de-DE"
            ).format(item.value)}</td></tr>`
      )
      .join("");

   const thead = "<th>Nombre</th> <th>Valor</th>";

   try {
      generatePDF(
         fileName,
         pdfTemplate,
         "list",
         {
            title: "Categorías",
            table: { thead, tbody },
            small: true,
         },
         "portrait",
         null,
         res
      );
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "PDF Error" });
   }
});

module.exports = router;
