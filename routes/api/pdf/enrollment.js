const router = require("express").Router();
const path = require("path");
const format = require("date-fns/format");

const generatePDF = require("../../../other/generatePDF");

//PDF Templates
const pdfTemplate = require("../../../templates/list");

//Middlewares
const adminAuth = require("../../../middleware/adminAuth");
const auth = require("../../../middleware/auth");

const fileName = path.join(__dirname, "../../../reports/enrollments.pdf");

//@route    GET /api/pdf/enrollment/fetch
//@desc     Get the pdf of enrollments
//@access   Private && Admin
router.get("/fetch", [auth, adminAuth], (req, res) => {
   res.sendFile(fileName);
});

//@route    POST /api/pdf/enrollment/list
//@desc     Create a pdf of enrollments
//@access   Private && Admin
router.post("/list", [auth, adminAuth], (req, res) => {
   const enrollments = req.body;

   if (enrollments.length === 0)
      return res
         .status(400)
         .json({ msg: "Primero debe realizar una búsqueda" });

   const tbody = enrollments
      .map(
         (item) => `<tr>
      <td>${format(new Date(item.date), "dd/MM/yy")}</td>
      <td>${item.student.studentnumber}</td>
      <td>${item.student.lastname + ", " + item.student.name}</td>
      <td>${item.category.name}</td>
      <td>${item.year}</td>
   </tr>`
      )
      .join("");

   const thead =
      "<th>Fecha</th><th>Legajo</th><th>Nombre</th><th>Categoría</th><th>Año</th>";

   try {
      generatePDF(
         fileName,
         pdfTemplate,
         "list",
         {
            title: "Inscripciones",
            table: { thead, tbody },
         },
         "portrait",
         "Inscripciones",
         res
      );
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "PDF Error" });
   }
});

module.exports = router;
