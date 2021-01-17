const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const path = require("path");
const pdf = require("html-pdf");
const pdfTemplateAssitanceGrades = require("../../templates/assistanceGrades");
const pdfTemplateCertificate = require("../../templates/certificate");
const pdfTemplateCambridgeCertificate = require("../../templates/cambridgeCertificate");
const pdfTemplateReportCard = require("../../templates/reportCard");

const Grade = require("../../models/Grade");
const Enrollment = require("../../models/Enrollment");

//@route    GET api/grade/:class_id
//@desc     Get all grades for a class
//@access   Private
router.get("/:class_id", [auth], async (req, res) => {
   try {
      const grades = await Grade.find({
         classroom: req.params.class_id,
      })
         .populate({
            path: "gradetype",
            model: "gradetypes",
            select: "name",
         })
         .populate({
            path: "student",
            model: "user",
            select: ["name", "lastname"],
         });

      const tableGrades = await buildClassTable(
         grades,
         req.params.class_id,
         res
      );

      res.json(tableGrades);
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
   }
});

//@route    GET api/grade/student/:class_id/:user_id
//@desc     Get all grades for a user
//@access   Private
router.get("/student/:class_id/:user_id", [auth], async (req, res) => {
   try {
      if (req.params.class_id === "null") {
         return res.status(400).json({
            msg: "No está registrado en ninguna clase",
         });
      }

      const grades = await Grade.find({
         classroom: req.params.class_id,
         student: req.params.user_id,
         period: { $in: [1, 2, 3, 4] },
      })
         .populate({
            path: "gradetype",
            model: "gradetypes",
            select: "name",
         })
         .sort({ gradetype: 1 });

      if (grades.length === 0) {
         return res.status(400).json({
            msg: "No se encontraron notas con dichas descripciones",
         });
      }

      const studentTable = buildStudentTable(grades);

      res.json(studentTable);
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
   }
});

//@route    GET api/grade/list/fetch-list
//@desc     Get the pdf of the class grades during a period
//@access   Private
router.get("/list/fetch-list", (req, res) => {
   res.sendFile(path.join(__dirname, "../../reports/grades.pdf"));
});

//@route    GET api/grade/certificate/fetch-list
//@desc     Get the pdf of the class grades during a period
//@access   Private
router.get("/certificate/fetch-list", (req, res) => {
   res.sendFile(path.join(__dirname, "../../reports/certificate.pdf"));
});

//@route    GET api/grade/certificate/fetch-list
//@desc     Get the pdf of a student report card
//@access   Private
router.get("/pdf/report-card", (req, res) => {
   res.sendFile(path.join(__dirname, "../../reports/reportcard.pdf"));
});

//@route    POST api/grade/period
//@desc     Add or remove grades from a period
//@access   Private
router.post("/period", auth, async (req, res) => {
   const periodRows = req.body;

   const date = new Date();
   const year = date.getFullYear();

   try {
      const period = periodRows[0][0].period;
      const classroom = periodRows[0][0].classroom;

      for (let x = 0; x < periodRows.length; x++) {
         let average = 0;
         let count = 0;
         const student = periodRows[x][0].student;

         for (let y = 0; y < periodRows[x].length; y++) {
            const filter = {
               student,
               gradetype: periodRows[x][y].gradetype,
               classroom,
               period,
            };

            let value = periodRows[x][y].value;

            if (value !== 0 && value !== "") {
               value = parseFloat(value);

               if (value > 10 || value < 0) {
                  return res.status(400).json({
                     errors: [{ msg: "La nota debe ser entre 0 y 10" }],
                  });
               }

               average += value;
               count++;

               const grade = await Grade.findOneAndUpdate(filter, {
                  value: value,
               });

               if (!grade) {
                  const data = {
                     ...filter,
                     value: value,
                  };
                  const newGrade = new Grade(data);

                  newGrade.save();
               }
            } else {
               await Grade.findOneAndRemove(filter);
            }
         }

         average = average / count;
         average = Math.round((average + Number.EPSILON) * 100) / 100;

         const filter2 = { year, student };

         const enrollment = await Enrollment.findOne(filter2);

         let periodAverage = [];
         let allAverage = 0;

         if (enrollment.classroom.periodAverage.length === 0)
            periodAverage = new Array(6).fill(0);
         else periodAverage = [...enrollment.classroom.periodAverage];

         periodAverage[period - 1] = parseFloat(average);

         let full = 0;
         for (let y = 0; y < 5; y++) {
            if (periodAverage[y] !== 0) {
               allAverage += periodAverage[y];
               full++;
            }
         }

         allAverage = allAverage / full;
         allAverage = Math.round((allAverage + Number.EPSILON) * 100) / 100;

         await Enrollment.findOneAndUpdate(
            { _id: enrollment._id },
            {
               "classroom.periodAverage": periodAverage,
               "classroom.average": allAverage,
            }
         );
      }

      res.json({ msg: "Grades Updated" });
   } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
   }
});

//@route    POST api/grades
//@desc     Add a grade
//@access   Private
router.post("/", auth, async (req, res) => {
   const { period, classroom, gradetype, periods } = req.body;

   if (!gradetype)
      return res.status(400).json({
         msg: "Primero debe elegir un tipo de nota",
      });

   if (period !== 1 && !periods[period - 2])
      return res.status(400).json({
         msg: "Debe agregar por lo menos una nota en los bimestres anteriores",
      });

   const data = { period, classroom, gradetype };
   let grade;

   try {
      grade = new Grade(data);

      await grade.save();

      const grades = await Grade.find({
         classroom,
      })
         .populate({
            path: "student",
            model: "user",
            select: ["name", "lastname"],
            option: { sort: { lastname: -1, name: -1 } },
         })
         .populate({
            path: "gradetype",
            model: "gradetypes",
            select: "name",
         });

      const tableGrades = await buildClassTable(grades, classroom, res);

      res.json(tableGrades);
   } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
   }
});

//@route    POST api/grade/create-list
//@desc     Create a pdf of the class grades during a period
//@access   Private
router.post("/create-list", (req, res) => {
   const name = "reports/grades.pdf";

   const { students, header, period, classInfo, periodNumber } = req.body;

   const periodName = [
      "1° Bimestre",
      "2° Bimestre",
      "3° Bimestre",
      "4° Bimestre",
      "Final",
   ];

   let tbody = "";

   let thead = "<tr><th>Nombre</th>";

   const title = "Notas " + periodName[periodNumber];

   for (let x = 0; x < header.length; x++) {
      thead += "<th>" + header[x] + "</th>";
   }

   thead += "</tr>";

   for (let x = 0; x < students.length; x++) {
      if (students[x].name !== "") {
         tbody += "<tr> <td>" + students[x].name + "</td>";

         for (let y = 0; y < period[x].length; y++) {
            if (classInfo.category.name === "Kinder")
               tbody += `<td>${kinderGrade(period[x][y].value)}</td>`;
            else tbody += "<td>" + period[x][y].value + "</td>";
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

   pdf.create(
      pdfTemplateAssitanceGrades(css, img, title, thead, tbody, classInfo),
      options
   ).toFile(name, (err) => {
      if (err) {
         res.send(Promise.reject());
      }

      res.send(Promise.resolve());
   });
});

//@route    POST api/grade/all/create-list
//@desc     Create a pdf of all the class grades
//@access   Private
router.post("/all/create-list", (req, res) => {
   const name = "reports/grades.pdf";

   const { students, header, period, classInfo } = req.body;

   const tableGrades = buildAllGradesTable(
      students,
      period,
      classInfo.category.name
   );

   let periodName = [];
   if (classInfo.category.name === "Kinder")
      periodName = ["1° B", "2° B", "3° B", "4° B"];
   else periodName = ["1° B", "2° B", "3° B", "4° B", "Final"];

   let tbody = "";

   let thead = "<tr><th class='no-border'></th>";

   const title = "Todas las notas";

   for (let x = 0; x < periodName.length; x++) {
      thead += `<th class='border' colspan=${
         !header[x] || header[x].length === 0 ? 1 : header[x].length
      } >${periodName[x]}</th>`;
   }

   thead += "</tr><tr><th class='no-border border-right'></th>";

   for (let x = 0; x < periodName.length; x++) {
      if (header[x]) {
         for (let y = 0; y < header[x].length; y++) {
            thead += `<th class='${
               y + 1 === header[x].length
                  ? "border-right border-bottom"
                  : "border-bottom"
            }'> ${header[x][y]
               .split(" ")
               .map((x) => x[0])
               .join("")}</th>`;
         }
      } else {
         thead += "<th class='border-right border-bottom'></th>";
      }
   }

   thead += "</tr><tr>";

   for (let x = 0; x < tableGrades.length; x++) {
      let border = 0;
      let number = 0;
      tbody += "<tr>";
      for (let y = 0; y < tableGrades[x].length; y++) {
         if (number < y) {
            number += header[border] ? header[border].length : 1;
            border++;
         }
         tbody += `<${y === 0 ? "th" : "td"} class='${
            y === number ? "border-right" : ""
         }'>${tableGrades[x][y]}</${y === 0 ? "th" : "td"}>`;
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

   pdf.create(
      pdfTemplateAssitanceGrades(
         css,
         img,
         title,
         thead,
         tbody,
         classInfo,
         null,
         true
      ),
      options
   ).toFile(name, (err) => {
      if (err) {
         res.send(Promise.reject());
      }

      res.send(Promise.resolve());
   });
});

//@route    POST api/grade/certificate/create-list
//@desc     Create all certificate pdfs of the class
//@access   Private
router.post("/certificate/create-list", async (req, res) => {
   const name = "reports/certificate.pdf";

   let { student, header, period, classInfo, certificateDate } = req.body;

   if (!certificateDate)
      return res.status(400).json({
         msg: "Debe seleccionar una fecha",
      });

   let pass = true;
   for (let x = 0; x < period.length; x++) {
      for (let y = 0; y < period[x].length; y++) {
         if (period[x][y].value === "") {
            pass = false;
            break;
         }
      }
      if (!pass) break;
   }

   if (!pass)
      return res.status(400).json({
         msg: "Todos los alumnos deben tener las notas cargadas",
      });

   student.dni = student.dni.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

   const date = new Date();
   const year = date.getFullYear();

   let certificateInfo = "";
   let finalGrades = "";
   let body = "";
   let highCertificate = false;
   let average = 0;

   const high =
      classInfo.category.name === "6° Año" ||
      classInfo.category.name === "CAE" ||
      classInfo.category.name === "Proficency";

   let enrollment;

   if (high || classInfo.category.name === "Kinder") {
      try {
         enrollment = await Enrollment.findOne({
            year,
            student: student._id,
         });
      } catch (err) {
         console.error(err.message);
         res.status(500).send("Server error");
      }
   }

   if (high) {
      if (enrollment.classroom.periodAverage[4] < 6) {
         pass = false;
      } else {
         highCertificate = true;
      }
   }

   let fBody = "";
   let fHeader = "";

   for (let x = 0; x < period.length; x++) {
      if (high) {
         fHeader += `<th>${header[x]}</th>`;
         fBody += `<td>${period[x].value * 10}%</td>`;

         if (x + 1 === period.length) {
            average = enrollment.classroom.periodAverage[4] * 10;
            average = Math.round((average + Number.EPSILON) * 100) / 100;

            fBody += `<td>${average}%</td>`;
            fHeader += "<th>Promedio</th>";
            finalGrades +=
               "<tr>" + fHeader + "</tr><tr>" + fBody + "</tr></table>";
         } else {
            if ((x + 1) % 3 === 0) {
               finalGrades += "<tr>" + fHeader + "</tr><tr>" + fBody + "</tr>";
               fHeader = "";
               fBody = "";
            }
         }
      } else {
         if (classInfo.category.name === "Kinder") {
            average = enrollment.classroom.average;
         } else {
            if (period[x].value < 6) {
               pass = false;
               break;
            } else {
               fHeader += `<th>${header[x]}</th>`;
               fBody += `<td>${period[x].value.toFixed(2)}</td>`;

               if ((x + 1) % 2 === 0) {
                  finalGrades +=
                     "<tr>" + fHeader + "</tr><tr>" + fBody + "</tr>";
                  fHeader = "";
                  fBody = "";
               }
               if (x + 1 === period.length) {
                  if (fHeader !== "")
                     finalGrades +=
                        "<tr>" +
                        fHeader +
                        "</tr><tr>" +
                        fBody +
                        "</tr></table>";
                  else finalGrades += "</table>";
               }
            }
         }
      }
   }

   if (!pass || classInfo.category.name === "Kinder") {
      body = `<p>Quien ha cursado durante el año el curso de inglés denominado: </p>`;
      body += `<p class="category ${
         classInfo.category.name !== "Kinder" ? "not-passed" : ""
      }">${classInfo.category.name}</p>`;
   } else {
      if (highCertificate) {
         let certificate = "";
         switch (classInfo.category.name) {
            case "6° Año":
               certificate = "First Certificate in English";
               break;
            case "CAE":
               certificate = "Certificate of Advanced English";
               break;
            case "Proficency":
               certificate = "Certificate of Proficiency in English";
               break;
            default:
               break;
         }
         certificateInfo =
            "<div class='subtitle'><p>Quien ha culminado el curso de inglés conforme al plan de estudios, </p>";
         certificateInfo += `<p>correspondiente a <span class="capital"> &nbsp; ${classInfo.category.name} &nbsp;</span> a nivel <span class="capital">&nbsp;${certificate}</span> </p>`;
         certificateInfo +=
            "<p>con las siguientes calificaciones:</p> </div>" +
            '<div class="table"> <table class="grades-table full">';
      } else {
         certificateInfo =
            "<p>Quien ha rendido los exámenes correspondientes a:</p>";
         certificateInfo += `<p class="category">${classInfo.category.name}</p>`;
         certificateInfo += "<p>con las siguientes calificaciones: </p>";
         certificateInfo += ' <div class="table"> <table class="grades-table">';
      }
   }

   if (classInfo.category.name === "Kinder")
      body += `<p class="mention"><span class="title">Mención:</span> &nbsp; ${kinderGrade(
         average
      )}</p>`;
   else if (pass) body = certificateInfo + finalGrades + "</div>";

   const img = path.join(
      "file://",
      __dirname,
      "../../templates/assets/logo.png"
   );
   const css = path.join(
      "file://",
      __dirname,
      "../../templates/certificate/style.css"
   );

   pdf.create(
      pdfTemplateCertificate(css, img, student, body, certificateDate),
      {
         format: "A4",
      }
   ).toFile(name, (err) => {
      if (err) {
         res.send(Promise.reject());
      }

      res.send(Promise.resolve());
   });
});

//@route    POST api/grade/certificate-cambridge/create-list
//@desc     Create all cambridge certificate pdfs of the class (starter, movers, flyers)
//@access   Private
router.post("/certificate-cambridge/create-list", (req, res) => {
   const name = "reports/certificate.pdf";

   let { student, header, period, classInfo, certificateDate } = req.body;

   student.dni = student.dni.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

   let level = "";
   let body = "<table>";
   let average = 0;

   const imgBlack = path.join(
      "file://",
      __dirname,
      "../../templates/assets/logo.png"
   );
   const imgGray = path.join(
      "file://",
      __dirname,
      "../../templates/assets/grayLogo.png"
   );
   const imgHalfAndHalf = path.join(
      "file://",
      __dirname,
      "../../templates/assets/halfAndHalf.png"
   );

   switch (classInfo.category.name) {
      case "Infantil A":
         level = "Starter";
         break;
      case "Preparatorio":
         level = "Movers";
         break;
      case "Junior":
         level = "Flyers";
         break;
      default:
         break;
   }

   const even = (num) => {
      for (let y = 0; y < 5; y++) {
         if (y <= num) body += `<td><img src="${imgBlack}" alt="logo"/></td>`;
         else body += `<td><img src="${imgGray}" alt="logo gris"/></td>`;
      }
   };

   const odd = (num) => {
      for (let y = 0; y < 5; y++) {
         if (y < num) body += `<td><img src="${imgBlack}" alt="logo"/></td>`;
         else {
            if (y === num)
               body += `<td><img src="${imgHalfAndHalf}" alt="logo a la mitad"/></td>`;
            else body += `<td><img src="${imgGray}" alt="logo gris"/></td>`;
         }
      }
   };

   for (let x = 0; x < period.length; x++) {
      average += period[x].value * 10;
      let value = period[x].value * 10;
      if (x === period.length - 1) {
         average = average / period.length;
         average = Math.round((average + Number.EPSILON) * 100) / 100;
      }
      body += `<tr> <td class='name'>${header[x]}</td>`;

      switch (true) {
         case value < 15:
            for (let y = 0; y < 5; y++) {
               if (y === 0)
                  body += `<td><img src="${imgHalfAndHalf}" alt="logo a la mitad"/></td>`;
               else body += `<td><img src="${imgGray}" alt="logo gris"/></td>`;
            }
            break;
         case value < 25:
            even(0);
            break;
         case value < 35:
            odd(1);
            break;
         case value < 45:
            even(1);
            break;
         case value < 55:
            odd(2);
            break;
         case value < 65:
            even(2);
            break;
         case value < 75:
            odd(3);
            break;
         case value < 85:
            even(3);
            break;
         case value < 95:
            odd(4);
            break;
         case value <= 100:
            for (let y = 0; y < 5; y++) {
               if (y < 5)
                  body += `<td><img src="${imgBlack}" alt="logo"/></td>`;
               else
                  body += `<td><img src="${imgHalfAndHalf}" alt="logo a la mitad"/></td>`;
            }
            break;
         default:
            break;
      }

      body += `<td class='percentage'>${value}%</td></tr>`;
   }

   body += "</table>";

   const css = path.join(
      "file://",
      __dirname,
      "../../templates/cambridgeCertificate/style.css"
   );

   pdf.create(
      pdfTemplateCambridgeCertificate(
         css,
         imgBlack,
         student,
         level,
         body,
         average,
         certificateDate
      ),
      {
         format: "A4",
      }
   ).toFile(name, (err) => {
      if (err) {
         res.send(Promise.reject());
      }

      res.send(Promise.resolve());
   });
});

//@route    POST api/grade/report-card
//@desc     Create a pdf of student's report card
//@access   Private
router.post("/report-card", async (req, res) => {
   const name = "reports/reportcard.pdf";
   const { student, observation, classInfo } = req.body;

   let grades = [];
   let finalExamGrades = [];
   let enrollment = {};

   try {
      grades = await Grade.find({
         classroom: classInfo._id,
         student: student._id,
         period: { $in: [1, 2, 3, 4] },
      })
         .populate({
            path: "gradetype",
            model: "gradetypes",
            select: "name",
         })
         .sort({ gradetype: 1 });

      finalExamGrades = await Grade.find({
         classroom: classInfo._id,
         student: student._id,
         period: 5,
      })
         .populate({
            path: "gradetype",
            model: "gradetypes",
            select: "name",
         })
         .sort({ gradetype: 1 });

      if (grades.length === 0)
         return res.status(400).json({
            msg: "El alumno no tiene notas cargadas",
         });

      enrollment = await Enrollment.findOne({
         "classroom._id": classInfo._id,
         student: student._id,
      });
   } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
   }

   const studentTable = buildStudentTable(grades, true);

   let finalGrades = "";
   let allGrades = "";
   let attendance = "";

   const higherExams =
      classInfo.category === "6° Año" ||
      classInfo.category === "CAE" ||
      classInfo.category === "Proficency";

   if (classInfo.category !== "Kinder") {
      finalGrades = `<h3 class='center'>Exámen Final</h3> <table class='final-grades ${
         !higherExams ? "small" : ""
      }'><tbody>`;

      let header = "";
      let body = "";

      for (let x = 0; x < finalExamGrades.length; x++) {
         header += `<th>${finalExamGrades[x].gradetype.name}</th>`;
         body += `<td>${
            !higherExams
               ? finalExamGrades[x].value.toFixed(2)
               : finalExamGrades[x].value * 10 + "%"
         }</td>`;

         if (
            ((x + 1) % 3 === 0 && higherExams) ||
            (!higherExams && (x + 1) % 2 === 0)
         ) {
            finalGrades += "<tr>" + header + "</tr><tr>" + body + "</tr>";
            header = "";
            body = "";
         }

         if (x + 1 === finalExamGrades.length) {
            if (higherExams) {
               let average = enrollment.classroom.periodAverage[4] * 10;
               average = Math.round((average + Number.EPSILON) * 100) / 100;

               header += "<th>Promedio</th>";
               body += `<td>${average}%</td>`;

               finalGrades +=
                  "<tr>" +
                  header +
                  "</tr><tr>" +
                  body +
                  "</tr></tbody></table>";
            } else {
               if (header !== "")
                  finalGrades +=
                     "<tr>" +
                     header +
                     "</tr><tr>" +
                     body +
                     "</tr></tbody></table>";
               else finalGrades += "</tbody></table>";
            }
         }
      }

      if (finalExamGrades.length === 0) finalGrades = "";
   }

   for (let x = 0; x < studentTable.rows.length; x++) {
      if (studentTable.headers[x]) {
         allGrades += `<tr><th>${studentTable.headers[x]}</th>`;
         for (let y = 0; y < studentTable.rows[x].length; y++) {
            if (
               studentTable.headers[x] === "Ket" ||
               studentTable.headers[x] === "Pet" ||
               studentTable.headers[x] === "First" ||
               studentTable.headers[x] === "CAE" ||
               studentTable.headers[x] === "Proficiency"
            ) {
               allGrades += `<td>${
                  studentTable.rows[x][y].value
                     ? studentTable.rows[x][y].value * 10 + "%"
                     : ""
               }</td>`;
            } else {
               let value = "";
               if (studentTable.rows[x][y].value)
                  value = studentTable.rows[x][y].value.toFixed(2);
               allGrades += `<td>${
                  classInfo.category !== "Kinder"
                     ? value
                     : kinderGrade(studentTable.rows[x][y].value)
               }</td>`;
            }
         }
         allGrades += "</tr>";
      }
   }

   for (let x = 0; x < 4; x++) {
      attendance += `<td>${
         enrollment.classroom.periodAbsence[x]
            ? enrollment.classroom.periodAbsence[x]
            : ""
      }</td>`;
   }

   attendance += `<td>${
      enrollment.classroom.absence ? enrollment.classroom.absence : 0
   }</td>`;

   const img = path.join(
      "file://",
      __dirname,
      "../../templates/assets/logo.png"
   );
   const css = path.join(
      "file://",
      __dirname,
      "../../templates/reportCard/style.css"
   );

   const options = {
      format: "A4",
   };

   pdf.create(
      pdfTemplateReportCard(
         css,
         img,
         student.name,
         classInfo.teacher,
         classInfo.category,
         allGrades,
         finalGrades,
         attendance,
         observation
      ),
      options
   ).toFile(name, (err) => {
      if (err) {
         res.send(Promise.reject());
      }

      res.send(Promise.resolve());
   });
});

//@route    DELETE api/grade/:type/:classroom/:period
//@desc     Delete grades of the same type
//@access   Private
router.delete("/:type/:classroom/:period", auth, async (req, res) => {
   try {
      //Remove grades
      const gradesToDelete = await Grade.find({
         gradetype: req.params.type,
         classroom: req.params.classroom,
         period: req.params.period,
      });

      for (let x = 0; x < gradesToDelete.length; x++) {
         await Grade.findOneAndRemove({ _id: gradesToDelete[x].id });
      }
      const grades = await Grade.find({
         classroom: req.params.classroom,
      })
         .populate({
            path: "student",
            model: "user",
            select: ["name", "lastname"],
            option: { sort: { lastname: -1, name: -1 } },
         })
         .populate({
            path: "gradetype",
            model: "gradetypes",
            select: "name",
         });

      const tableGrades = await buildClassTable(
         grades,
         req.params.classroom,
         res
      );

      res.json(tableGrades);
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
   }
});

function buildStudentTable(grades, reportCard) {
   let obj = grades.reduce((res, curr) => {
      if (res[curr.gradetype.name]) {
         res[curr.gradetype.name].push(curr);
      } else Object.assign(res, { [curr.gradetype.name]: [curr] });
      return res;
   }, {});

   let rows = [];

   for (const x in obj) {
      if (!reportCard && obj[x][0].value === "") delete obj[x];

      const dividedGrades = obj[x];
      let row = Array.from(Array(4), () => ({
         value: "",
      }));
      for (let x = 0; x < dividedGrades.length; x++) {
         row[dividedGrades[x].period - 1] = dividedGrades[x];
      }
      rows.push(row);
   }

   let headers = Object.getOwnPropertyNames(obj);

   return { headers, rows };
}

async function buildClassTable(grades, class_id, res) {
   let users = [];

   try {
      enrollments = await Enrollment.find({
         "classroom._id": class_id,
      }).populate({
         model: "user",
         path: "student",
         select: ["name", "lastname", "dni"],
      });
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
   }

   users = enrollments.sort((a, b) => {
      if (a.student.lastname > b.student.lastname) return 1;
      if (a.student.lastname < b.student.lastname) return -1;

      if (a.student.name > b.student.name) return 1;
      if (a.student.name < b.student.name) return -1;
   });

   let header = [];
   let periods = [];

   let students = users.map((user) => {
      return {
         _id: user.student._id,
         name: user.student.lastname + ", " + user.student.name,
         dni: user.student.dni,
      };
   });

   //Add last row for the eliminate button
   students = [...students, { name: "", dni: "" }];

   //Divide all the periods in different objects between '{}'
   let allPeriods = grades.reduce((res, curr) => {
      if (res[curr.period]) res[curr.period].push(curr);
      else Object.assign(res, { [curr.period]: [curr] });

      return res;
   }, {});

   //this for works only for objects
   for (const x in allPeriods) {
      let count = 0;
      let period = [];

      //Get all the grade types for each period
      let gradeType = allPeriods[x].reduce((res, curr) => {
         if (res[curr.gradetype.name]) res[curr.gradetype.name].push(curr);
         else Object.assign(res, { [curr.gradetype.name]: [curr] });

         return res;
      }, {});

      header.push(Object.getOwnPropertyNames(gradeType));

      //Divide all grades per student in this particular period
      let classStudents = allPeriods[x].reduce((res, curr) => {
         if (curr.student !== null && curr.student !== undefined) {
            if (res[curr.student._id]) res[curr.student._id].push(curr);
            else Object.assign(res, { [curr.student._id]: [curr] });
         }
         return res;
      }, {});

      //Amount of grade types for this period
      const gradesNumber = Object.keys(gradeType).length;

      //Generates an array from every object
      let studentsArray = Object.keys(classStudents).map(
         (i) => classStudents[i]
      );

      //Sort them in the same order as users
      studentsArray = studentsArray.sort((a, b) => {
         if (a[0].student.lastname > b[0].student.lastname) return 1;
         if (a[0].student.lastname < b[0].student.lastname) return -1;

         if (a[0].student.name > b[0].student.name) return 1;
         if (a[0].student.name < b[0].student.name) return -1;
      });

      let studentNumber = 0;
      for (let z = 0; z < students.length; z++) {
         let rowNumber = 0;

         //create an array with the amount of grade types for the cells in the row
         //every item in the array goes with that basic info
         let row = Array.from(Array(gradesNumber), () => ({
            _id: "",
            classroom: class_id,
            period: x,
            value: "",
            name: "",
         }));

         //Add or modify the info that is in every item in the array row
         for (const index in gradeType) {
            row[rowNumber].gradetype = gradeType[index][0].gradetype._id;
            row[rowNumber].name = "input" + count;

            //For the items that are buttons (doesnt have a user related)
            if (!users[z]) {
               count++;
               rowNumber++;
               continue;
            }

            row[rowNumber].student = users[z].student._id;

            let added = false;

            if (
               studentsArray[studentNumber] &&
               studentsArray[studentNumber][0].student._id.toString() ===
                  users[z].student._id.toString()
            ) {
               for (let y = 0; y < studentsArray[studentNumber].length; y++) {
                  if (
                     studentsArray[studentNumber][y].gradetype.name === index
                  ) {
                     row[rowNumber]._id = studentsArray[studentNumber][y]._id;
                     row[rowNumber].value =
                        studentsArray[studentNumber][y].value;

                     count++;
                     added = true;
                     break;
                  }
               }
            }

            if (!added) count++;

            rowNumber++;
         }

         if (
            users[z] &&
            studentsArray[studentNumber] &&
            users[z].student._id.toString() ===
               studentsArray[studentNumber][0].student._id.toString()
         ) {
            studentNumber++;
         }
         period.push(row);
      }
      periods.push(period);
   }

   return { header, students, periods };
}

function buildAllGradesTable(students, periods, className) {
   let table = [];

   for (let x = 0; x < students.length; x++) {
      let row = [];
      let count = 0;
      row[count] = students[x].lastname + ", " + students[x].name;
      let numberOfPeriods = 5;
      if (className === "Kinder") numberOfPeriods = 4;

      for (let y = 0; y < numberOfPeriods; y++) {
         if (periods[y] && periods[y][x]) {
            for (let z = 0; z < periods[y][x].length; z++) {
               count++;
               if (periods[y][x][z]) {
                  if (className === "Kinder")
                     row[count] =
                        kinderGrade(periods[y][x][z].value) === "Muy Bueno"
                           ? "MB"
                           : kinderGrade(periods[y][x][z].value).substring(
                                0,
                                1
                             );
                  else if (periods[y][x]) row[count] = periods[y][x][z].value;
               } else row[count] = "";
            }
         } else {
            count++;
            row[count] = "";
         }
      }
      table.push(row);
   }

   return table;
}

function kinderGrade(grade) {
   switch (true) {
      case grade === "":
         return "";
      case grade < 4:
         return "Malo";
      case grade >= 4 && grade < 6:
         return "Regular";
      case grade >= 6 && grade < 7.5:
         return "Bueno";
      case grade >= 7.5 && grade < 9:
         return "Muy Bueno";
      case grade >= 9 && grade <= 10:
         return "Sobresaliente";
      default:
         return "";
   }
}

module.exports = router;
