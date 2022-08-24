const router = require("express").Router();
const path = require("path");

const generatePDF = require("../../../other/generatePDF");

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

//@route    POST /api/installment/list
//@desc     Create a pdf of installments
//@access   Private && Admin
router.post("/list", [auth, adminAuth], async (req, res) => {
   const debts = req.body;

   const head = ["Nombre", "Cuota", "Año", "Categoría", "Valor"];

   const body = debts.map((item) => [
      item.student.lastname + ", " + item.student.name,
      installments[item.number],
      item.year,
      item.enrollment && item.enrollment.category.name,
      new Intl.NumberFormat("de-DE").format(item.value),
   ]);

   try {
      await generatePDF(
         fileName,
         {
            head,
            body,
            title: "Deudas",
         },
         { type: "list", img: "logo", margin: true, landscape: false }
      );
      res.sendFile(fileName);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "PDF Error" });
   }
});

module.exports = router;
