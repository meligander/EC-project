const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const path = require("path");
const pdf = require("html-pdf");
const pdfTemplate = require("../../templates/assistanceGrades");
const pdfTemplate1 = require("../../templates/certificate");
const pdfTemplate2 = require("../../templates/cambridgeCertificate");

const Grade = require("../../models/Grade");
const User = require("../../models/User");

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

      const tableGrades = await buildTable(grades, req.params.class_id, res);

      res.json(tableGrades);
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
   }
});

//@route    GET api/grade/user/:id
//@desc     Get all grades for a user
//@access   Private
router.get("/user/:id", [auth], async (req, res) => {
   try {
      const date = new Date();
      const start = new Date(date.getFullYear(), 01, 01);
      const end = new Date(date.getFullYear(), 12, 31);
      const grades = await Grade.find({
         student: req.params.id,
         date: {
            $gte: start,
            $lt: end,
         },
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

      let obj = grades.reduce((res, curr) => {
         if (res[curr.gradetype.name]) res[curr.gradetype.name].push(curr);
         else Object.assign(res, { [curr.gradetype.name]: [curr] });

         return res;
      }, {});

      let rows = [];
      let headers = Object.getOwnPropertyNames(obj);

      for (const x in obj) {
         const dividedGrades = obj[x];
         let row = Array.from(Array(5), () => ({
            value: "",
         }));
         for (let x = 0; x < dividedGrades.length; x++) {
            row[dividedGrades[x].period - 1] = dividedGrades[x];
         }
         rows.push(row);
      }

      res.json({ headers, rows });
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
   }
});

//@route    POST api/grade/create-list
//@desc     Create a pdf of the class grades during a period
//@access   Private
router.post("/create-list", (req, res) => {
   const name = "reports/grades.pdf";

   const { students, header, periods, classInfo, period } = req.body;

   const periodName = [
      "1° Bimestre",
      "2° Bimestre",
      "3° Bimestre",
      "4° Bimestre",
      "Final",
   ];

   let tbody = "";

   let thead = "<tr><th>Nombre</th>";

   const title = "Notas de " + periodName[period];

   for (let x = 0; x < header.length; x++) {
      thead += "<th>" + header[x] + "</th>";
   }

   thead += "</tr>";

   for (let x = 0; x < students.length; x++) {
      if (students[x].name !== "") {
         tbody += "<tr> <td>" + students[x].name + "</td>";

         for (let y = 0; y < periods[x].length; y++) {
            if (classInfo.category.name === "Kinder") {
               switch (true) {
                  case periods[x][y].value < 4:
                     tbody += "<td> Malo </td>";
                     break;
                  case periods[x][y].value >= 4 && periods[x][y].value < 6:
                     tbody += "<td> Regular </td>";
                     break;
                  case periods[x][y].value >= 6 && periods[x][y].value < 7.5:
                     tbody += "<td> Bueno </td>";
                     break;
                  case periods[x][y].value >= 7.5 && periods[x][y].value < 9:
                     tbody += "<td> Muy Bueno </td>";
                     break;
                  case periods[x][y].value >= 9 && periods[x][y].value <= 10:
                     tbody += "<td> Sobresaliente </td>";
                     break;
                  default:
                     break;
               }
            } else tbody += "<td>" + periods[x][y].value + "</td>";
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
      pdfTemplate(css, img, title, thead, tbody, classInfo),
      options
   ).toFile(name, (err) => {
      if (err) {
         res.send(Promise.reject());
      }

      res.send(Promise.resolve());
   });
});

//@route    GET api/grade/list/fetch-list
//@desc     Get the pdf of the class grades during a period
//@access   Private
router.get("/list/fetch-list", (req, res) => {
   res.sendFile(path.join(__dirname, "../../reports/grades.pdf"));
});

//@route    POST api/grade/all/create-list
//@desc     Create a pdf of all the class grades
//@access   Private
router.post("/all/create-list", (req, res) => {
   const name = "reports/grades.pdf";

   const { students, header, periods, classInfo } = req.body;

   const tableGrades = buildAllGradesTable(
      students,
      periods,
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
         header[x].length === 0 ? 1 : header[x].length
      } >${periodName[x]}</th>`;
   }

   thead += "</tr><tr><th class='no-border border-right'></th>";

   for (let x = 0; x < 5; x++) {
      for (let y = 0; y < header[x].length; y++) {
         thead += `<th class='${
            y + 1 === header[x].length
               ? "border-right border-bottom"
               : "border-bottom"
         }'> ${header[x][y].substring(0, 1)}</th>`;
      }
   }

   thead += "</tr><tr>";

   for (let x = 0; x < tableGrades.length; x++) {
      let border = 0;
      let number = 0;
      tbody += "<tr>";
      for (let y = 0; y < tableGrades[x].length; y++) {
         if (number < y) {
            number += header[border].length;
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
      pdfTemplate(css, img, title, thead, tbody, classInfo, null, true),
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
router.post("/certificate/create-list", (req, res) => {
   const name = "reports/certificate.pdf";

   let { student, header, period, classInfo, certificateDate } = req.body;

   student.dni = student.dni.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

   let certificateInfo = "";
   let finalGrades = " <tr>";
   let finalHeader = "";
   let finalGrade = "";
   let body = "";
   let highCertificate = false;
   let pass = true;
   let average = 0;
   let count = 0;

   for (let x = 0; x < period.length; x++) {
      if (
         classInfo.category.name === "6° Año" ||
         classInfo.category.name === "CAE" ||
         classInfo.category.name === "Proficency"
      ) {
         average += period[x].value;
         if (x + 1 === period.length) {
            average = average / period.length;
            if (average < 6) {
               pass = false;
               break;
            } else {
               highCertificate = true;
            }
         }
         finalGrade += `<td>${period[x].value * 10}%</td>`;
         finalHeader += `<th>${header[x]}</th>`;
         if ((x + 1) % 3 === 0 || x + 1 === period.length) {
            if (x + 1 === period.length) {
               average = Math.round((average + Number.EPSILON) * 100) / 100;
               average = average * 10;
               finalGrade += `<td>${average}%</td>`;
               finalHeader += "<th>Promedio</th>";
               finalGrades +=
                  finalHeader + "</tr><tr>" + finalGrade + "</tr></table>";
               break;
            } else {
               finalGrades +=
                  finalHeader +
                  "</tr><tr>" +
                  finalGrade +
                  "</tr></table>" +
                  "<table class='grades-table full no-border-top'> <tr>";

               finalHeader = "";
               finalGrade = "";
            }
         }
      } else {
         if (classInfo.category.name === "Kinder") {
            if (x === period.length - 1) break;
            for (let y = 0; y < period[x][period[4]].length; y++) {
               average += period[x][period[4]][y].value;
               count++;
               if (
                  x === period.length - 2 &&
                  y === period[x][period[4]].length - 1
               ) {
                  average = average / count;
                  average = Math.round((average + Number.EPSILON) * 100) / 100;
               }
            }
         } else {
            if (period[x].value < 6) {
               pass = false;
               break;
            } else {
               finalHeader += `<th>${header[x]}</th>`;
               finalGrade += `<td>${period[x].value.toFixed(2)}</td>`;
               if ((x + 1) % 2 === 0) {
                  finalGrades +=
                     finalHeader + "</tr><tr>" + finalGrade + "</tr></table>";
                  finalHeader = "";
                  finalGrade = "";
                  if (x + 1 !== period.length)
                     finalGrades +=
                        "<table class='grades-table no-border-top'> <tr>";
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
         certificateInfo += `<p>correspondiente a <span class="capital"> &nbsp; ${classInfo.category.name}</span> a nivel <span class="capital">&nbsp;${certificate}</span> </p>`;
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

   if (classInfo.category.name === "Kinder") {
      let grade = "";
      switch (true) {
         case average < 4:
            grade = "Malo";
            break;
         case average >= 4 && average < 6:
            grade = "Regular";
            break;
         case average >= 6 && average < 7.5:
            grade = "Bueno";
            break;
         case average >= 7.5 && average < 9:
            grade = "Muy Bueno";
            break;
         case average >= 9 && average <= 10:
            grade = "Sobresaliente";
            break;
         default:
            break;
      }
      body += `<p class="mention"><span class="title">Mención:</span> &nbsp; ${grade}</p>`;
   } else {
      if (pass) body = certificateInfo + finalGrades + "</div>";
   }

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

   pdf.create(pdfTemplate1(css, img, student, body, certificateDate), {
      format: "A4",
   }).toFile(name, (err) => {
      if (err) {
         res.send(Promise.reject());
      }

      res.send(Promise.resolve());
   });
});

//@route    GET api/grade/certificate/fetch-list
//@desc     Get the pdf of the class grades during a period
//@access   Private
router.get("/certificate/fetch-list", (req, res) => {
   res.sendFile(path.join(__dirname, "../../reports/certificate.pdf"));
});

//@route    POST api/grade/certificate-cambridge/create-list
//@desc     Create all cambridge certificate pdfs of the class
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
         average = (Math.round((average + Number.EPSILON) * 100) / 100).toFixed(
            2
         );
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
      pdfTemplate2(
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

//@route    POST api/grades
//@desc     Add a grade
//@access   Private
router.post("/", auth, async (req, res) => {
   const { student, period, classroom, gradetype, value } = req.body;
   const data = { student, period, classroom, gradetype, value };
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

      const tableGrades = await buildTable(grades, classroom, res);

      res.json(tableGrades);
   } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
   }
});

//@route    POST api/grade/period
//@desc     Add or remove grades from a period
//@access   Private
router.post("/period", auth, async (req, res) => {
   const periodRows = req.body;

   try {
      for (let x = 0; x < periodRows.length; x++) {
         for (let y = 0; y < periodRows[x].length; y++) {
            const filter = {
               student: periodRows[x][y].student,
               gradetype: periodRows[x][y].gradetype,
               classroom: periodRows[x][y].classroom,
               period: periodRows[x][y].period,
            };

            if (periodRows[x][y].value !== 0 && periodRows[x][y].value !== "") {
               if (periodRows[x][y].value > 10 || periodRows[x][y].value < 0) {
                  return res.status(400).json({
                     errors: [{ msg: "La nota debe ser entre 0 y 10" }],
                  });
               }

               const grade = await Grade.findOneAndUpdate(filter, {
                  value: periodRows[x][y].value,
               });

               if (!grade) {
                  const data = {
                     ...filter,
                     value: periodRows[x][y].value,
                  };
                  const newGrade = new Grade(data);

                  newGrade.save();
               }
            } else {
               await Grade.findOneAndRemove(filter);
            }
         }
      }

      res.json({ msg: "Grades Updated" });
   } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
   }
});

//@route    DELETE api/grade/:id
//@desc     Delete a grade
//@access   Private
router.delete("/:id", auth, async (req, res) => {
   try {
      //Remove grade
      await Grade.findOneAndRemove({ _id: req.params.id });

      res.json({ msg: "Grade deleted" });
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
   }
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

      const tableGrades = await buildTable(grades, req.params.classroom, res);

      res.json(tableGrades);
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
   }
});

async function buildTable(grades, class_id, res) {
   let users = [];

   try {
      users = await User.find({
         type: "Alumno",
         classroom: class_id,
      }).sort({ lastname: 1, name: 1 });
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
   }

   let header = [];
   let periods = [];

   //Get the student's header
   let students = users.map((user) => {
      return { name: user.lastname + ", " + user.name, dni: user.dni };
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
            if (users[z] === undefined) {
               count++;
               rowNumber++;
               continue;
            }

            row[rowNumber].student = users[z]._id;

            let added = false;

            if (studentsArray[studentNumber] !== undefined) {
               if (
                  studentsArray[studentNumber][0].student._id.toString() ===
                  users[z]._id.toString()
               ) {
                  for (
                     let y = 0;
                     y < studentsArray[studentNumber].length;
                     y++
                  ) {
                     if (
                        studentsArray[studentNumber][y].gradetype.name === index
                     ) {
                        row[rowNumber]._id =
                           studentsArray[studentNumber][y]._id;
                        row[rowNumber].value =
                           studentsArray[studentNumber][y].value;

                        count++;
                        added = true;
                        break;
                     }
                  }
               }
            }

            if (!added) count++;

            rowNumber++;
         }

         if (
            users[z] !== undefined &&
            studentsArray[studentNumber] !== undefined
         ) {
            if (
               users[z]._id.toString() ===
               studentsArray[studentNumber][0].student._id.toString()
            ) {
               studentNumber++;
            }
         }
         period.push(row);
      }
      periods.push(period);
   }

   return { header, students, periods };
}

function buildAllGradesTable(students, periods, className) {
   let table = [];

   for (let x = 0; x < students.length - 1; x++) {
      let row = [];
      let count = 0;
      row[count] = students[x].name;

      let numberOfPeriods = 5;
      if (className === "Kinder") numberOfPeriods = 4;
      for (let y = 0; y < numberOfPeriods; y++) {
         for (let z = 0; z < periods[y][x].length; z++) {
            count++;
            if (className === "Kinder") {
               switch (true) {
                  case periods[y][x][z].value < 4:
                     row[count] = "M";
                     break;
                  case periods[y][x][z].value >= 4 &&
                     periods[y][x][z].value < 6:
                     row[count] = "Reg";
                     break;
                  case periods[y][x][z].value >= 6 &&
                     periods[y][x][z].value < 7.5:
                     row[count] = "B";
                     break;
                  case periods[y][x][z].value >= 7.5 &&
                     periods[y][x][z].value < 9:
                     row[count] = "MB";
                     break;
                  case periods[y][x][z].value >= 9 &&
                     periods[y][x][z].value <= 10:
                     row[count] = "Sobr";
                     break;
                  default:
                     break;
               }
            } else {
               row[count] = periods[y][x][z].value;
            }
         }
      }
      table.push(row);
   }

   return table;
}

module.exports = router;
