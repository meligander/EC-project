const router = require("express").Router();
const path = require("path");
const format = require("date-fns/format");

const generatePDF = require("../../../other/generatePDF");

//PDF Templates
const pdfTemplate = require("../../../templates/list");
const pdfTemplate2 = require("../../../templates/classInfo");

//Middlewares
const auth = require("../../../middleware/auth");

const fileName = path.join(__dirname, "../../../reports/classes.pdf");

//@route    GET /api/pdf/class/fetch
//@desc     Get the pdf of classes
//@access   Private
router.get("/fetch", auth, (req, res) => {
   res.sendFile(fileName);
});

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
            style: "list",
         },
         true
      );
      res.json({ msg: "PDF generated" });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "PDF Error" });
   }
});

//@route    POST /api/pdf/class/one
//@desc     Create a pdf of a class
//@access   Private
router.post("/one", auth, (req, res) => {
   const info = req.body;

   const tbody = info.students
      .map(
         (item) => `<tr>
      <td>${item.studentnumber}</td>
      <td>${item.lastname + ", " + item.name}</td>
      <td>${
         item.dob ? format(new Date(item.dob.slice(0, -1)), "dd/MM/yy") : ""
      }</td>
      <td>${
         item.dni ? new Intl.NumberFormat("de-DE").format(item.dni) : ""
      }</td>
      <td>${
         item.cel
            ? item.cel
            : item.relatedCellphones.length > 0
            ? `${item.relatedCellphones[0].cel} - ${item.relatedCellphones[0].name} (${item.relatedCellphones[0].relation})`
            : ""
      }</td>
   </tr>`
      )
      .join("");

   try {
      generatePDF(
         fileName,
         pdfTemplate2,
         "classInfo",
         {
            title: "Alumnos",
            table: { tbody },
            info,
         },
         "portrait",
         ` - Alumnos ${info.category} de ${info.teacher}`,
         res
      );
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "PDF Error" });
   }
});

module.exports = router;
