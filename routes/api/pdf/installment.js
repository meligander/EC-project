const router = require("express").Router();
const path = require("path");

const generatePDF = require("../../../other/generatePDF");

//Middleware
const auth = require("../../../middleware/auth");
const adminAuth = require("../../../middleware/adminAuth");

const Category = require("../../../models/Category");

const fileName = path.join(__dirname, "../../../reports/installments.pdf");

const installmentsName = [
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
   const { installments, discount } = req.body;

   const head = ["Nombre", "Cuota", "Año", "Categoría", "Valor", "Ctdo"];

   let installment0;
   try {
      installment0 = await Category.findById("5ebb3477397c2d2610a4eab7");
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }

   const body = installments.map((item) => [
      item.student.lastname + ", " + item.student.name,
      installmentsName[item.number],
      item.year,
      item.enrollment && item.enrollment.category.name,
      "$" + new Intl.NumberFormat("de-DE").format(item.value),
      item.number !== 0 ||
      item.value.toString() === installment0.value.toString()
         ? "$" +
           new Intl.NumberFormat("de-DE").format(
              //Descuento efectivo
              Math.ceil(
                 (item.value * (1 - discount / 100) + Number.EPSILON) / 100
              ) * 100
           )
         : "-",
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
