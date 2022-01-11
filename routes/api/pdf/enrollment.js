const router = require("express").Router();
const path = require("path");
const pdf = require("html-pdf");
const format = require("date-fns/format");

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

   let tbody = "";

   for (let x = 0; x < enrollments.length; x++) {
      const date =
         "<td>" + format(new Date(enrollments[x].date), "dd/MM/yy") + "</td>";
      const studentnumber =
         "<td>" + enrollments[x].student.studentnumber + "</td>";
      const studentname =
         "<td>" +
         enrollments[x].student.lastname +
         ", " +
         enrollments[x].student.name +
         "</td>";
      const category = "<td>" + enrollments[x].category.name + "</td>";
      const year = "<td>" + enrollments[x].year + "</td>";

      tbody +=
         "<tr>" +
         date +
         studentnumber +
         studentname +
         category +
         year +
         "</tr>";
   }

   const thead =
      "<th>Fecha</th> <th>Legajo</th> <th>Nombre</th> <th>Categoría</th> <th>Año</th>";

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
      pdf.create(
         pdfTemplate(css, img, "inscripciones", thead, tbody),
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

//@route    POST /api/pdf/enrollment/averages-list
//@desc     Create a pdf of the students' averages
//@access   Private && Admin
router.post("/averages-list", [auth, adminAuth], (req, res) => {
   const enrollments = req.body;

   if (enrollments.length === 0)
      return res
         .status(400)
         .json({ msg: "Primero debe realizar una búsqueda" });

   let tbody = "";

   for (let x = 0; x < enrollments.length; x++) {
      const studentnumber =
         "<td>" + enrollments[x].student.studentnumber + "</td>";
      const studentname =
         "<td>" +
         enrollments[x].student.lastname +
         ", " +
         enrollments[x].student.name +
         "</td>";
      const category = "<td>" + enrollments[x].category.name + "</td>";
      const average = "<td>" + enrollments[x].classroom.average + "</td>";

      tbody +=
         "<tr>" + studentnumber + studentname + category + average + "</tr>";
   }

   const thead =
      "<th>Legajo</th> <th>Nombre</th> <th>Categoría</th> <th>Promedio</th>";

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
      pdf.create(
         pdfTemplate(css, img, "Mejores Promedios", thead, tbody),
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

//@route    POST /api/pdf/enrollment/absences-list
//@desc     Create a pdf of the students' absences
//@access   Private && Admin
router.post("/absences-list", [auth, adminAuth], (req, res) => {
   const enrollments = req.body;

   if (enrollments.length === 0)
      return res
         .status(400)
         .json({ msg: "Primero debe realizar una búsqueda" });

   let tbody = "";

   for (let x = 0; x < enrollments.length; x++) {
      const studentnumber =
         "<td>" + enrollments[x].student.studentnumber + "</td>";
      const studentname =
         "<td>" +
         enrollments[x].student.lastname +
         ", " +
         enrollments[x].student.name +
         "</td>";
      const category = "<td>" + enrollments[x].category.name + "</td>";

      let type;

      switch (enrollments[x].classroom.absence) {
         case 0:
            type = "Perfecta";
            break;
         case 1:
            type = "Excelente";
            break;
         case 2:
            type = "Muy Buena";
            break;
         case 3:
         case 4:
            "Buena";
         default:
            type = "Regular";
            break;
      }

      type = "<td>" + type + "</td>";
      const absence = "<td>" + enrollments[x].classroom.absence + "</td>";

      tbody +=
         "<tr>" +
         studentnumber +
         studentname +
         category +
         type +
         absence +
         "</tr>";
   }

   const thead =
      "<th>Legajo</th> <th>Nombre</th> <th>Categoría</th> <th>Tipo</th> <th>Faltas</th>";

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
      pdf.create(
         pdfTemplate(css, img, "Mejores Asistencias", thead, tbody),
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
