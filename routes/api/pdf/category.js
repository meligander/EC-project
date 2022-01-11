const router = require("express").Router();
const path = require("path");
const pdf = require("html-pdf");

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

   let tbody = "";

   for (let x = 0; x < category.length; x++) {
      const name = "<td>" + category[x].name + "</td>";
      const value = "<td>$" + formatNumber(category[x].value) + "</td>";

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
      ).toFile(fileName, (err) => {
         if (err) res.send(Promise.reject());
         else res.send(Promise.resolve());
      });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "PDF Error" });
   }
});

module.exports = router;
