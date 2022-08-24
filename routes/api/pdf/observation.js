const router = require("express").Router();
const path = require("path");

const generatePDF = require("../../../other/generatePDF");

//Middlewares
const auth = require("../../../middleware/auth");

const Grade = require("../../../models/Grade");
const Attendance = require("../../../models/Attendance");

const fileName = path.join(__dirname, "../../../reports/reportCard.pdf");

const highDegree = ["6° Año", "CAE", "Proficiency"];

//@route    POST /api/observation/report-card
//@desc     Create a pdf of student's report card
//@access   Private
router.post("/report-card", auth, async (req, res) => {
   const {
      student,
      info: { period, classroom, teacher, category },
      keepOpen,
   } = req.body;

   const high = highDegree.some((item) => item === category);

   let grades = [];
   let attendances = [];
   let finalGrades = [];
   let finals = [];
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
      if (!res[curr.gradetype.name])
         Object.assign(res, { [curr.gradetype.name]: new Array(4).fill({}) });
      res[curr.gradetype.name][curr.period - 1] = curr;
      return res;
   }, []);

   const gradesTable = Object.keys(grades).map((key) => [
      key,
      ...grades[key].map((item) =>
         item.value ? getGrade(item, category) : ""
      ),
   ]);

   const average = high
      ? Math.round(
           ((finalGrades.reduce((accum, item) => accum + item.value, 0) /
              finalGrades.length) *
              10 +
              Number.EPSILON) *
              100
        ) / 100
      : 0;

   if (finalGrades.length > 0 && period === 4) {
      let headers = [];
      let body = [];

      for (let x = 0; x < finalGrades.length; x++) {
         headers.push(finalGrades[x].gradetype.name);
         body.push(getGrade(finalGrades[x], category));

         if (
            (high && (x + 1) % 3 === 0) ||
            (!high && (x + 1) % 2 === 0) ||
            (high && x + 1 === finalGrades.length)
         ) {
            finals.push(
               high && x + 1 === finalGrades.length
                  ? [...headers, "Promedio"]
                  : headers
            );
            finals.push(
               high && x + 1 === finalGrades.length
                  ? [...body, average + "%"]
                  : body
            );
            headers = [];
            body = [];
         }
      }
   }

   const attendancesTable = [
      ...Object.keys(attendances).map((key) =>
         key > period
            ? ""
            : attendances[key].length > 0
            ? attendances[key].length
            : "-"
      ),
      totalAttendances,
   ];

   try {
      await generatePDF(
         fileName,
         {
            student: student.name,
            teacher,
            high,
            category,
            allGrades: gradesTable,
            finals,
            attendances: attendancesTable,
            observation: student.observation.description,
         },
         { type: "reportCard", img: "logo", margin: false, landscape: false },
         keepOpen
      );
      res.sendFile(fileName);
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
