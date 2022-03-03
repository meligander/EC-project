const router = require("express").Router();
const path = require("path");
const format = require("date-fns/format");

const generatePDF = require("../../../config/generatePDF");

//PDF templates
const pdfTemplate = require("../../../templates/assistanceGrades");
const pdfTemplate2 = require("../../../templates/list");

//Middlewares
const auth = require("../../../middleware/auth");
const adminAuth = require("../../../middleware/adminAuth");

const fileName = path.join(__dirname, "../../../reports/attendances.pdf");

const periodName = ["1° Bimestre", "2° Bimestre", "3° Bimestre", "4° Bimestre"];

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
   const { header, attendances, info } = req.body;

   if (!header || header.length === 0)
      return res.status(400).json({
         msg: "Debe registrar fechas antes de generar el PDF",
      });

   const thead = `<tr><th>Nombre</th>
      ${header
         .map(
            (item) => `<th>${format(new Date(item.slice(0, -1)), "dd/MM")}</th>`
         )
         .join("")}
      </tr>`;

   const tbody = info.students
      .map(
         (item, i) =>
            `<tr><td>${
               item.lastname.split(" ")[0] + ", " + item.name.split(" ")[0]
            }</td>${
               attendances
                  ? attendances[i]
                       .map(
                          (att) =>
                             `<td>${
                                !att.inassistance ? "<div>✓</div>" : ""
                             }</td>`
                       )
                       .join("")
                  : header.map(() => `<td></td>`).join("")
            }</tr>`
      )
      .join("");

   try {
      generatePDF(
         fileName,
         pdfTemplate,
         "assistanceGrades",
         {
            type: "attendance",
            title: "Asistencias " + periodName[info.period],
            info,
            table: { thead, tbody },
         },
         "landscape",
         ` - Asistencias ${periodName[info.period]} ${info.category} de ${
            info.teacher
         }`,
         res
      );
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "PDF Error" });
   }
});

//@route    POST /api/pdf/attendance/best
//@desc     Create a pdf of the students' absences
//@access   Private && Admin
router.post("/best", [auth, adminAuth], (req, res) => {
   const { attendances } = req.body;

   if (attendances.length === 0)
      return res
         .status(400)
         .json({ msg: "Primero debe realizar una búsqueda" });

   const tbody = attendances
      .map(
         (item) => `<tr>
      <td>${item.student.studentnumber}</td>
      <td>${item.student.lastname + ", " + item.student.name}</td>
      <td>${item.category.name}</td>
      <td>${getType(item.quantity)}</td>
      <td>${item.quantity}</td>
   </tr>`
      )
      .join("");

   const thead =
      "<th>Legajo</th> <th>Nombre</th> <th>Categoría</th> <th>Tipo</th> <th>Faltas</th>";

   try {
      generatePDF(
         fileName,
         pdfTemplate2,
         "list",
         {
            title: "Mejores Asistencias",
            table: { thead, tbody },
         },
         "portrait",
         "Mejores Asistencias",
         res
      );
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "PDF Error" });
   }
});

//@desc Function to get the type of attendance by quantity
const getType = (quantity) => {
   switch (quantity) {
      case 0:
         return "Perfecta";
      case 1:
         return "Excelente";
      case 2:
         return "Muy Buena";
      case 3:
      case 4:
         return "Buena";
      default:
         return "Regular";
   }
};

module.exports = router;
