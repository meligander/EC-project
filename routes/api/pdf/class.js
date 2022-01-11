const router = require("express").Router();
const path = require("path");
const pdf = require("html-pdf");
const format = require("date-fns/format");

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
router.post("/list", auth, (req, res) => {
   const classes = req.body;

   let htmlstring = "";

   for (let x = 0; x < classes.length; x++) {
      const teacher =
         "<td>" +
         classes[x].teacher.lastname +
         ", " +
         classes[x].teacher.name +
         "</td>";
      const category = "<td>" + classes[x].category.name + "</td>";
      const day1 = "<td>" + (classes[x].day1 ? classes[x].day1 : "") + "</td>";
      const hourin1 =
         "<td>" +
         (classes[x].hourin1
            ? format(new Date(classes[x].hourin1.slice(0, -1)), "HH:mm")
            : "") +
         "</td>";
      const hourout1 =
         "<td>" +
         (classes[x].hourout1
            ? format(new Date(classes[x].hourout1.slice(0, -1)), "HH:mm")
            : "") +
         "</td>";
      const day2 = "<td>" + (classes[x].day2 ? classes[x].day2 : "") + "</td>";
      const hourin2 =
         "<td>" +
         (classes[x].hourin2
            ? format(new Date(classes[x].hourin2.slice(0, -1)), "HH:mm")
            : "") +
         "</td>";
      const hourout2 =
         "<td>" +
         (classes[x].hourout2
            ? format(new Date(classes[x].hourout2.slice(0, -1)), "HH:mm")
            : "") +
         "</td>";

      htmlstring +=
         "<tr>" +
         teacher +
         category +
         day1 +
         hourin1 +
         hourout1 +
         day2 +
         hourin2 +
         hourout2 +
         "</tr>";
   }

   const table =
      "<th>Profesor</th> <th>Categoría</th> <th>Día 1</th> <th>Comienzo</th> <th>Fin</th> <th>Día 2</th> <th>Comienzo</th> <th>Fin</th>";

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
         pdfTemplate(css, img, "cursos", table, htmlstring),
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

//@route    POST /api/pdf/class/one
//@desc     Create a pdf of a class
//@access   Private
router.post("/one", auth, (req, res) => {
   const classInfo = req.body;

   let tbody = "";

   for (let x = 0; x < classInfo.students.length; x++) {
      const studentnumber =
         "<td>" + classInfo.students[x].studentnumber + "</td>";
      const studentname =
         "<td>" +
         classInfo.students[x].lastname +
         ", " +
         classInfo.students[x].name +
         "</td>";
      const dob =
         "<td>" +
         (classInfo.students[x].dob
            ? format(
                 new Date(classInfo.students[x].dob.slice(0, -1)),
                 "dd/MM/yy"
              )
            : "") +
         "</td>";
      const cel =
         "<td>" +
         (classInfo.students[x].cel ? classInfo.students[x].cel : "") +
         "</td>";

      tbody += "<tr>" + studentnumber + studentname + dob + cel + "</tr>";
   }

   const img = path.join(
      "file://",
      __dirname,
      "../../templates/assets/logo.png"
   );
   const css = path.join(
      "file://",
      __dirname,
      "../../templates/classInfo/style.css"
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
      pdf.create(pdfTemplate2(css, img, tbody, classInfo), options).toFile(
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

//@route    POST /api/pdf/class/blank
//@desc     Create a pdf of the class  for attendances and grades
//@access   Private
router.post("/blank", auth, (req, res) => {
   const classInfo = req.body;

   let tbody = "";

   const columns = 23;

   let thead = "<tr><th>Nombre</th>";
   for (let y = 0; y < columns; y++) {
      thead += "<th class='blank'></th>";
   }

   thead += "</tr>";

   for (let x = 0; x < classInfo.students.length; x++) {
      tbody +=
         "<tr> <td class='name'>" +
         classInfo.students[x].lastname +
         ", " +
         classInfo.students[x].name +
         "</td>";

      for (let y = 0; y < columns; y++) {
         tbody += "<td></td>";
      }

      tbody += "</tr>";
   }

   const img = path.join(
      "file://",
      __dirname,
      "../../templates/assets/logo.png"
   );
   const css = path.join(
      "file://",
      __dirname,
      "../../templates/classInfo/style.css"
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
         pdfTemplate2(css, img, tbody, classInfo, thead),
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
