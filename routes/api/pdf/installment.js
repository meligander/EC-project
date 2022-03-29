const router = require("express").Router();
const path = require("path");

const generatePDF = require("../../../other/generatePDF");

//PDF Templates
const pdfTemplate = require("../../../templates/list");

//Middleware
const auth = require("../../../middleware/auth");
const adminAuth = require("../../../middleware/adminAuth");

const fileName = path.join(__dirname, "../../../reports/installments.pdf");

const installments = [
   "Inscripción",
   "Clases Particulares",
   "Examen Libre",
   "Marzo",
   "Abril",
   "Mayo",
   "Junio",
   "Julio",
   "Agosto",
   "Septiembre",
   "Octubre",
   "Noviembre",
   "Diciembre",
];

//@route    GET /api/pdf/installment/fetch
//@desc     Get the pdf of installments
//@access   Private && Admin
router.get("/fetch", [auth, adminAuth], (req, res) => {
   res.sendFile(fileName);
});

//@route    POST /api/installment/list
//@desc     Create a pdf of installments
//@access   Private && Admin
router.post("/list", [auth, adminAuth], (req, res) => {
   const debts = req.body;

   const tbody = debts
      .map(
         (item) => `
      <tr>
         <td>${item.student.lastname + ", " + item.student.name}</td>
         <td>${installments[item.number]}</td>
         <td>${item.year}</td>
         <td>${new Intl.NumberFormat("de-DE").format(item.value)}</td>
      </tr>`
      )
      .join("");

   const thead = "<th>Nombre</th> <th>Cuota</th> <th>Año</th> <th>Valor</th>";

   try {
      generatePDF(
         fileName,
         pdfTemplate,
         "list",
         {
            title: "Deudas",
            table: { thead, tbody },
         },
         "portrait",
         "Deudas",
         res
      );
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "PDF Error" });
   }
});

module.exports = router;
