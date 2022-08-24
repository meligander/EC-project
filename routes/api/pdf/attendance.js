const router = require("express").Router();
const path = require("path");
const format = require("date-fns/format");

const generatePDF = require("../../../other/generatePDF");

//Middlewares
const auth = require("../../../middleware/auth");
const adminAuth = require("../../../middleware/adminAuth");

const fileName = path.join(__dirname, "../../../reports/attendances.pdf");

const periodName = ["1° Bimestre", "2° Bimestre", "3° Bimestre", "4° Bimestre"];

//@route    POST /api/pdf/attendance/list
//@desc     Create a pdf of the class attendances
//@access   Private
router.post("/list", auth, async (req, res) => {
   const { header, attendances, info } = req.body;

   if (!header || header.length === 0)
      return res.status(400).json({
         msg: "Debe registrar fechas antes de generar el PDF",
      });

   const head = [
      "Nombre",
      ...header.map((item) => format(new Date(item.slice(0, -1)), "dd/MM")),
   ];

   const body = info.students.map((item, i) => {
      const lastname = item.lastname.split(" ");
      const name = item.name.split(" ");

      const studentName = `${lastname[0]}${lastname
         .slice(1)
         .map((item) => ` ${item.charAt(0)}`)}, ${name[0]}${name
         .slice(1)
         .map((item) => ` ${item.charAt(0)}`)}`;

      return attendances
         ? [
              studentName,
              ...attendances[i].map((att) => (!att.inassistance ? "✓" : "")),
           ]
         : [studentName, ...header.map(() => "")];
   });

   try {
      await generatePDF(
         fileName,
         {
            type: "attendance",
            title: `Asistencias ${periodName[info.period]}`,
            head,
            body,
            teacher: info.teacher,
            category: info.category,
         },
         { type: "list", img: "logo", margin: true, landscape: true }
      );
      res.sendFile(fileName);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "PDF Error" });
   }
});

//@route    POST /api/pdf/attendance/best
//@desc     Create a pdf of the students' absences
//@access   Private && Admin
router.post("/best", [auth, adminAuth], async (req, res) => {
   const { attendances } = req.body;

   if (attendances.length === 0)
      return res
         .status(400)
         .json({ msg: "Primero debe realizar una búsqueda" });

   const head = ["Legajo", "Nombre", "Categoría", "Tipo", "Faltas"];

   const body = attendances.map((item) => [
      item.student.studentnumber,
      item.student.lastname + ", " + item.student.name,
      item.category.name,
      getType(item.quantity),
      item.quantity,
   ]);

   try {
      await generatePDF(
         fileName,
         {
            head,
            body,
            title: "Mejores Asistencias",
         },
         { type: "list", img: "logo", margin: true, landscape: false }
      );
      res.sendFile(fileName);
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
