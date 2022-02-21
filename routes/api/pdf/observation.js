const router = require("express").Router();
const path = require("path");

const generatePDF = require("../../../config/generatePDF");

//PDF Templates
const pdfTemplate = require("../../../templates/reportCard");

//Middlewares
const adminAuth = require("../../../middleware/adminAuth");
const auth = require("../../../middleware/auth");

const Grade = require("../../../models/Grade");
const Attendance = require("../../../models/Attendance");

const fileName = path.join(__dirname, "../../../reports/reportCard.pdf");

const highDegree = ["6° Año", "CAE", "Proficency"];

//@route    GET /api/pdf/observation/fetch
//@desc     Get the pdf of observation
//@access   Private && Admin
router.get("/fetch", [auth, adminAuth], (req, res) => {
   res.sendFile(fileName);
});

//@route    POST /api/observation/report-card
//@desc     Create a pdf of student's report card
//@access   Private
router.post("/report-card", auth, async (req, res) => {
   const {
      student,
      info: { period, classroom, teacher, category },
   } = req.body;

   const high = highDegree.some((item) => item === category);

   let grades = [];
   let attendances = [];
   let finalGrades = [];
   let totalAttendances = 0;

   try {
      const filter = {
         classroom,
         student: student._id,
         period: { $lte: period },
      };

      grades = await Grade.find(filter)
         .populate({
            path: "gradetype",
            model: "gradetype",
         })
         .sort({ gradetype: 1 });

      finalGrades = await Grade.find({ ...filter, period: 5 })
         .populate({
            path: "gradetype",
            model: "gradetype",
         })
         .sort({ gradetype: 1 });

      attendances = await Attendance.find(filter);

      totalAttendances = attendances.length;

      attendances = attendances.reduce(
         (res, curr) => {
            res[curr.period].push(curr);
            return res;
         },
         { 1: [], 2: [], 3: [], 4: [] }
      );
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }

   if (grades.length === 0)
      return res.status(400).json({
         msg: `Debe cargar las notas del alumno ${student.name}`,
      });

   grades = grades.reduce((res, curr) => {
      if (res[curr.gradetype.name]) {
         res[curr.gradetype.name].push(curr);
      } else Object.assign(res, { [curr.gradetype.name]: [curr] });
      return res;
   }, []);

   for (const x in grades) while (grades[x].length < 4) grades[x].push({});

   const gradesTable = Object.keys(grades)
      .map(
         (key) => `
   <tr>
        <td>${key}</td>
        ${grades[key]
           .map(
              (item) => `<td>${item.value ? getGrade(item, category) : ""}</td>`
           )
           .join("")}
   </tr>`
      )
      .join("");

   let finalTable = "";

   if (finalGrades.length > 0 && period === 4) {
      let fHeader = "";
      let fBody = "";
      let average =
         finalGrades.reduce((accum, item) => accum + item.value, 0) /
         finalGrades.length;

      for (let x = 0; x < finalGrades.length; x++) {
         fHeader += `<th>${finalGrades[x].gradetype.name}</th>`;
         fBody += `<td>${getGrade(finalGrades[x], category, false)}</td>`;

         if (x + 1 === finalGrades.length) {
            if (high) {
               average =
                  Math.round((average * 10 + Number.EPSILON) * 100) / 100;

               fBody += `<td>${average}%</td>`;
               fHeader += "<th>Promedio</th>";
               finalTable +=
                  "<tr>" + fHeader + "</tr><tr>" + fBody + "</tr></table>";
            } else {
               if (fHeader !== "")
                  finalTable +=
                     "<tr>" + fHeader + "</tr><tr>" + fBody + "</tr></table>";
               else finalTable += "</table>";
            }
         } else {
            if ((high && (x + 1) % 3 === 0) || (!high && (x + 1) % 2 === 0)) {
               finalTable += "<tr>" + fHeader + "</tr><tr>" + fBody + "</tr>";
               fHeader = "";
               fBody = "";
            }
         }
      }

      finalTable = `<h4 class='center grade-title'>Exámen Final</h4>
    <table class='final-grades' ${!high ? "small" : ""}${finalTable}</table>`;
   }

   const attendancesTable = `<tbody>
        ${Object.keys(attendances)
           .map((key) => `<td>${attendances[key].length}</td>`)
           .join("")}
        <td>${totalAttendances}</td>
   </tbody>`;

   try {
      generatePDF(
         fileName,
         pdfTemplate,
         "reportCard",
         {
            student,
            category,
            teacher,
            attendances: attendancesTable,
            finalTable,
            gradesTable,
         },
         null,
         null,
         res
      );
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "PDF Error" });
   }
});

//@desc Function to get the type of grade when the category is Kinder
const kinderGraden = (grade) => {
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

//@desc Function to get the value of a grade
const getGrade = (grade, category, small) => {
   let value = grade.value;

   if (category === "Kinder") {
      value = small
         ? kinderGraden(value)
              .split(" ")
              .map((x) => x[0])
              .join("")
         : kinderGraden(value);
   } else {
      if (value !== "") {
         if (grade.gradetype.percentage) value = value * 10 + "%";
         else if (value % 1 !== 0) value = Number(value).toFixed(2);
      }
   }

   return value;
};

module.exports = router;
