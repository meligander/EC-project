const router = require("express").Router();
const path = require("path");
const pdf = require("html-pdf");

//PDF Templates
const pdfTemplateAssitanceGrades = require("../../../templates/assistanceGrades");
const pdfTemplateCertificate = require("../../../templates/certificate");
const pdfTemplateCambridgeCertificate = require("../../../templates/cambridgeCertificate");
const pdfTemplateReportCard = require("../../../templates/reportCard");

//Middlewares
const auth = require("../../../middleware/auth");

const Enrollment = require("../../../models/Enrollment");
const Grade = require("../../../models/Grade");

const cambridgeTests = [
   "Starters",
   "Movers",
   "Flyers",
   "Ket",
   "Pet",
   "First",
   "CAE",
   "Proficiency",
];

const fileName = path.join(__dirname, "../../../reports/grades.pdf");

//@route    GET /api/pdf/grade/fetch
//@desc     Get the pdf of the class grades during a period
//@access   Private
router.get("/fetch", auth, (req, res) => {
   res.sendFile(fileName);
});

//@route    POST /api/pdf/grade/period-list
//@desc     Create a pdf of the class grades during a period
//@access   Private
router.post("/period-list", auth, (req, res) => {
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
         tbody +=
            "<tr> <td>" +
            students[x].lastname +
            ", " +
            students[x].name +
            "</td>";

         for (let y = 0; y < period[x].length; y++) {
            if (classInfo.category.name === "Kinder")
               tbody += `<td>${kinderGrade(period[x][y].value)}</td>`;
            else
               tbody += `<td> ${
                  cambridgeTests.some(
                     (test) => test === period[x][y].gradetype.name
                  ) && period[x][y].value !== ""
                     ? period[x][y].value * 10 + "%"
                     : period[x][y].value
               }</td>`;
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

   try {
      pdf.create(
         pdfTemplateAssitanceGrades(css, img, title, thead, tbody, classInfo),
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

//@route    POST /api/pdf/grade/list
//@desc     Create a pdf of all the class grades
//@access   Private
router.post("/list", auth, (req, res) => {
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

   try {
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
      ).toFile(fileName, (err) => {
         if (err) res.send(Promise.reject());
         else res.send(Promise.resolve());
      });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "PDF Error" });
   }
});

//@route    POST /api/grade/certificate
//@desc     Create all certificate pdfs of the class
//@access   Private
router.post("/certificate", auth, async (req, res) => {
   let { student, header, period, classInfo, date } = req.body;

   if (!date)
      return res.status(400).json({
         msg: "Debe seleccionar una fecha",
      });

   // if (!student.dni || student.dni === "")
   //    return res
   //       .status(400)
   //       .json({ msg: "Todos los alumnos deben tener el dni cargado" });

   if (
      !student.dni ||
      student.dni === "" ||
      period.some((periodA) => periodA.some((grade) => grade.value === ""))
   )
      return res.status(400).json({
         msg: `Todos los alumnos deben tener ${
            !student.dni || student.dni === ""
               ? "el dni cargado"
               : "las notas cargadas"
         }las notas cargadas`,
      });

   // let pass = true;
   // for (let x = 0; x < period.length; x++) {
   //    for (let y = 0; y < period[x].length; y++) {
   //       if (period[x][y].value === "") {
   //          pass = false;
   //          break;
   //       }
   //    }
   //    if (!pass) break;
   // }

   // if (!pass)
   //    return res.status(400).json({
   //       msg: "Todos los alumnos deben tener las notas cargadas",
   //    });

   student.dni =
      student.dni &&
      student.dni.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

   const year = new Date().getFullYear();

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
         res.status(500).json({ msg: "Server Error" });
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

   try {
      pdf.create(pdfTemplateCertificate(css, img, student, body, date), {
         format: "A4",
      }).toFile(fileName, (err) => {
         if (err) res.send(Promise.reject());
         else res.send(Promise.resolve());
      });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "PDF Error" });
   }
});

//@route    POST /api/grade/cambridge
//@desc     Create all cambridge certificate pdfs of the class (starter, movers, flyers)
//@access   Private
router.post("/cambridge", auth, (req, res) => {
   let { student, header, period, classInfo, date } = req.body;

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
      case "Infantil B":
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

   try {
      pdf.create(
         pdfTemplateCambridgeCertificate(
            css,
            imgBlack,
            student,
            level,
            body,
            average,
            date
         ),
         {
            format: "A4",
         }
      ).toFile(fileName, (err) => {
         if (err) res.send(Promise.reject());
         else res.send(Promise.resolve());
      });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "PDF Error" });
   }
});

//@route    POST /api/grade/report-card
//@desc     Create a pdf of student's report card
//@access   Private
router.post("/report-card", auth, async (req, res) => {
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

      enrollment = await Enrollment.findOne({
         classroom: classInfo._id,
         student: student._id,
      });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "PDF Error" });
   }

   if (grades.length > 0) {
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
                  cambridgeTests.some(
                     (test) => test === studentTable.headers[x]
                  )
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

      try {
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
         ).toFile(fileName, (err) => {
            if (err) res.send(Promise.reject());
            else res.send(Promise.resolve());
         });
      } catch (err) {
         console.error(err.message);
         res.status(500).json({ msg: "PDF Error" });
      }
   } else {
      res.json({ msg: "Alumno sin notas" });
   }
});

const buildAllGradesTable = (students, periods, className) => {
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
                  else if (periods[y][x]) {
                     row[count] =
                        cambridgeTests.some(
                           (test) => test === periods[y][x][z].gradetype.name
                        ) && periods[y][x][z].value !== ""
                           ? periods[y][x][z].value * 10 + "%"
                           : periods[y][x][z].value;
                  }
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
};

const kinderGrade = (grade) => {
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
};

module.exports = router;
