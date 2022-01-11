const router = require("express").Router();
const pdf = require("html-pdf");
const path = require("path");

//PDF templates
const pdfTemplate = require("../../../templates/assistanceGrades");

//Middlewares
const auth = require("../../../middleware/auth");

const fileName = path.join(__dirname, "../../../reports/attendances.pdf");

//@route    GET /api/pdf/attendance/fetch
//@desc     Get the pdf of the class attendances
//@access   Private
router.get("/fetch", auth, (req, res) => {
   res.sendFile(fileName);
});

//@route    POST /api/pdf/attendance/list
//@desc     Create a pdf of the class attendances
//@access   Private
router.post("/list", auth, (req, res) => {
   const { header, students, attendances, period, classInfo } = req.body;

   const periodName = [
      "1° Bimestre",
      "2° Bimestre",
      "3° Bimestre",
      "4° Bimestre",
   ];

   let tbody = "";

   let thead = "<tr><th>Nombre</th>";

   const title = "Asistencias " + periodName[period];

   if (!header)
      return res.status(400).json({
         msg: "Debe registrar fechas antes de generar el PDF",
      });

   for (let x = 0; x < header.length; x++) {
      thead += "<th>" + header[x] + "</th>";
   }

   thead += "</tr>";

   for (let x = 0; x < students.length; x++) {
      if (students[x] !== "") {
         tbody += "<tr> <td>" + students[x] + "</td>";

         for (let y = 0; y < attendances[x].length; y++) {
            tbody +=
               "<td>" +
               (!attendances[x][y].inassistance ? "<div>✓</div>" : "") +
               "</td>";
         }

         tbody += "</tr>";
      }
   }

   const img = path.join(
      "file://",
      __dirname,
      "../../templates/assets/logo.png"
   );
   const css = path.join(
      "file://",
      __dirname,
      "../../templates/assistanceGrades/style.css"
   );

   const options = {
      format: "A4",
      orientation: "landscape",
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
      pdf.create(
         pdfTemplate(css, img, title, thead, tbody, classInfo, true),
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
