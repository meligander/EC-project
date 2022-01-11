const router = require("express").Router();
const path = require("path");
const pdf = require("html-pdf");

//PDF Templates
const pdfTemplate = require("../../../templates/list");

//Middleware
const auth = require("../../../middleware/auth");
const adminAuth = require("../../../middleware/adminAuth");

const fileName = path.join(__dirname, "../../../reports/installments.pdf");

//@route    GET /api/pdf/installment/fetch
//@desc     Get the pdf of installments
//@access   Private && Admin
router.get("/fetch", [auth, adminAuth], (req, res) => {
   res.sendFile();
});

//@route    POST /api/installment/list
//@desc     Create a pdf of installments
//@access   Private && Admin
router.post("/list", [auth, adminAuth], (req, res) => {
   const debts = req.body;

   const installments = [
      "Inscripción",
      "",
      "",
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

   let tbody = "";

   for (let x = 0; x < debts.length; x++) {
      const studentname =
         "<td>" +
         debts[x].student.lastname +
         ", " +
         debts[x].student.name +
         "</td>";
      const installment = "<td>" + installments[debts[x].number] + "</td>";
      const year = "<td>" + debts[x].year + "</td>";
      const value = "<td> $" + formatNumber(debts[x].value) + "</td>";

      tbody += "<tr>" + studentname + installment + year + value + "</tr>";
   }

   const thead = "<th>Nombre</th> <th>Cuota</th> <th>Año</th> <th>Valor</th>";

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
            '<footer class="footer">Villa de Merlo English Center <span class="pages">{{page}}/{{pages}}</span></footer>',
      },
   };

   try {
      pdf.create(pdfTemplate(css, img, "deudas", thead, tbody), options).toFile(
         fileName,
         (err) => {
            if (err) res.send(Promise.reject());
            else res.send(Promise.resolve());
         }
      );
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "PDF Error" });
   }
});

module.exports = router;
