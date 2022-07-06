const router = require("express").Router();
const path = require("path");

const generatePDF = require("../../../other/generatePDF");

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
      .map((item, index) => {
         const march = item.value / 2;
         const values = [item.value, item.value * 0.9, march, march * 0.9];
         return `<tr>
               <td>${item.name}</td>
               ${values
                  .map(
                     (subitem, subindex) =>
                        `<td>${
                           index === 0 && subindex !== 0
                              ? "-"
                              : "$" +
                                new Intl.NumberFormat("de-DE").format(
                                   Math.ceil((subitem + Number.EPSILON) / 10) *
                                      10
                                )
                        }</td>`
                  )
                  .join("")} 
            </tr>`;
      })
      .join("");

   const thead =
      "<th>Nombre</th> <th>Valor</th> <th>Dto Hnos</th> <th>Marzo</th> <th>Dto Marzo</th>";

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
