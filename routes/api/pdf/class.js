const router = require("express").Router();
const path = require("path");
const format = require("date-fns/format");

const generatePDF = require("../../../other/generatePDF");

//Middlewares
const auth = require("../../../middleware/auth");

const fileName = path.join(__dirname, "../../../reports/classes.pdf");

//@route    POST /api/pdf/class/list
//@desc     Create a pdf of classes
//@access   Private
router.post("/list", auth, async (req, res) => {
   const classes = req.body;

   const head = [
      "Profesor",
      "Categoría",
      "Día 1",
      "Entrada",
      "Salida",
      "Día 2",
      "Entrada",
      "Salida",
   ];

   const body = classes.map((item) => [
      item.teacher.lastname + ", " + item.teacher.name,
      item.category.name,
      item.day1 ? item.day1 : "",
      item.hourin1 ? format(new Date(item.hourin1.slice(0, -1)), "HH:mm") : "",
      item.hourout1
         ? format(new Date(item.hourout1.slice(0, -1)), "HH:mm")
         : "",
      item.day2 ? item.day2 : "",
      item.hourin2 ? format(new Date(item.hourin2.slice(0, -1)), "HH:mm") : "",
      item.hourout2
         ? format(new Date(item.hourout2.slice(0, -1)), "HH:mm")
         : "",
   ]);

   try {
      await generatePDF(
         fileName,
         {
            head,
            body,
            title: "Clases",
         },
         { type: "list", img: "logo", margin: true, landscape: false }
      );
      res.sendFile(fileName);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "PDF Error" });
   }
});

//@route    POST /api/pdf/class/one
//@desc     Create a pdf of a class
//@access   Private
router.post("/one", auth, async (req, res) => {
   const {
      students,
      category,
      teacher,
      hourin1,
      hourin2,
      hourout1,
      hourout2,
      day1,
      day2,
   } = req.body;

   const head = ["Legajo", "Nombre", "Fecha de Nacimiento", "DNI", "Celular"];

   const body = students.map((item) => [
      item.studentnumber,
      item.lastname + ", " + item.name,
      item.dob ? format(new Date(item.dob.slice(0, -1)), "dd/MM/yy") : "",
      item.dni ? new Intl.NumberFormat("de-DE").format(item.dni) : "",
      item.cel
         ? item.cel
         : item.relatedCellphones.length > 0
         ? `${item.relatedCellphones[0].cel} - ${item.relatedCellphones[0].name} (${item.relatedCellphones[0].relation})`
         : "",
   ]);

   try {
      await generatePDF(
         fileName,
         {
            head,
            body,
            title: `Alumnos ${category} de ${teacher}`,
            category,
            teacher,
            day1,
            hourin1,
            hourout1,
            day2,
            hourin2,
            hourout2,
         },
         { type: "class", img: "logo", margin: true, landscape: false }
      );
      res.sendFile(fileName);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "PDF Error" });
   }
});

module.exports = router;
