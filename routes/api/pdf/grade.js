const router = require("express").Router();
const path = require("path");

const generatePDF = require("../../../other/generatePDF");

//Middlewares
const auth = require("../../../middleware/auth");
const adminAuth = require("../../../middleware/adminAuth");

const periodName = [
   "1° Bimestre",
   "2° Bimestre",
   "3° Bimestre",
   "4° Bimestre",
   "Final",
];

const highDegree = ["6° Año", "CAE", "Proficiency"];

const fileName = path.join(__dirname, "../../../reports/grades.pdf");

//@route    POST /api/pdf/grade/period-list
//@desc     Create a pdf of the class grades during a period
//@access   Private
router.post("/period-list", auth, async (req, res) => {
   const { header, grades, info } = req.body;

   if (!header || header.length === 0)
      return res.status(400).json({
         msg: "Debe registrar fechas antes de generar el PDF",
      });

   const head = ["Nombre", ...header.map((item) => item.name)];

   const body = info.students.map((item, i) => [
      item.lastname + ", " + item.name,
      ...grades[i].map((grade) => getGrade(grade, info.category, false)),
   ]);

   try {
      await generatePDF(
         fileName,
         {
            type: "grades",
            title: "Notas " + periodName[info.period],
            head,
            body,
            teacher: info.teacher,
            category: info.category,
         },
         { type: "list", img: "logo", margin: true, landscape: false }
      );
      res.sendFile(fileName);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "PDF Error" });
   }
});

//@route    POST /api/pdf/grade/list
//@desc     Create a pdf of all the class grades
//@access   Private
router.post("/list", auth, async (req, res) => {
   const { header, grades, info } = req.body;

   const periodName = [
      "Infantil A",
      "Infantil B",
      "Junior",
      "Preparatorio",
   ].includes(info.category)
      ? ["1° B", "2° B", "3° B", "4° B", "Final", "Cambridge"]
      : ["1° B", "2° B", "3° B", "4° B", "Final"];

   const headArray = [];
   const body = [];

   for (let x = 0; x < periodName.length; x++)
      if (header[x])
         for (let y = 0; y < header[x].length; y++)
            headArray.push({
               class:
                  y + 1 === header[x].length
                     ? "border-right border-bottom"
                     : y === 0
                     ? "border-bottom border-left"
                     : "border-bottom",
               value: header[x][y].name
                  .split(" ")
                  .map((x) => x[0])
                  .join(""),
               colspan: 1,
            });

   const head = [
      [
         { class: "no-border", value: "", colspan: 1 },
         ...periodName
            .filter((item, i) => header[i])
            .map((item, i) => {
               return {
                  class: "border",
                  value: item,
                  colspan: header[i].length === 0 ? 1 : header[i].length,
               };
            }),
      ],
      [
         { class: "no-border border-right", value: "", colspan: 1 },
         ...headArray,
      ],
   ];

   for (let x = 0; x < info.students.length; x++) {
      const allGrades = [];
      for (let y = 0; y < grades.length; y++)
         for (let z = 0; z < grades[y][x].length; z++)
            allGrades.push({
               class: z + 1 === grades[y][x].length ? "border-right" : "",
               value: getGrade(grades[y][x][z], info.category, true),
            });
      body.push([
         {
            value: info.students[x].lastname + ", " + info.students[x].name,
            class: "border-right",
         },
         ...allGrades,
      ]);
   }

   try {
      await generatePDF(
         fileName,
         {
            title: `Notas ${info.category} de ${info.teacher}`,
            head,
            body,
         },
         { type: "allGrades", img: "logo", margin: true, landscape: true }
      );
      res.sendFile(fileName);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "PDF Error" });
   }
});

//@route    POST /api/pdf/grade/certificate
//@desc     Create a certificate for the class
//@access   Private
router.post("/certificate", auth, async (req, res) => {
   const { student, grades, info, date } = req.body;

   const finals = [];

   if (!student.dni)
      return res.status(400).json({
         msg: `Debe registrar el dni del alumno ${student.name} para generar el certificado`,
      });

   if (grades.some((grade) => grade.value === ""))
      return res.status(400).json({
         msg: `Las notas del alumno ${student.name} deben estar cargadas`,
      });

   const average =
      Math.round(
         ((grades.reduce((accum, item) => accum + item.value, 0) /
            grades.length) *
            10 +
            Number.EPSILON) *
            100
      ) / 100;

   const high = highDegree.some((cat) => cat === info.category);

   if (average >= 60 && info.category !== "Kinder" && grades.length > 0) {
      let headers = [];
      let body = [];

      for (let x = 0; x < grades.length; x++) {
         headers.push(grades[x].gradetype.name);
         body.push(getGrade(grades[x], info.category));

         if (
            (high && (x + 1) % 3 === 0) ||
            (!high && (x + 1) % 2 === 0) ||
            (high && x + 1 === grades.length)
         ) {
            finals.push(
               high && x + 1 === grades.length
                  ? [...headers, "Promedio"]
                  : headers
            );
            finals.push(
               high && x + 1 === grades.length ? [...body, average + "%"] : body
            );
            headers = [];
            body = [];
         }
      }
   }

   try {
      await generatePDF(
         fileName,
         {
            date: date.replace("º ", " "),
            student: student.name,
            dni: new Intl.NumberFormat("de-DE").format(student.dni),
            high,
            pass: average >= 60 && info.category !== "Kinder",
            category: info.category,
            title: getCertificateTitle(info.category),
            mention: info.category === "Kinder" && kinderGraden(average),
            finals,
         },
         { type: "certificate", img: "logo", margin: false, landscape: false }
      );
      res.sendFile(fileName);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "PDF Error" });
   }
});

//@route    POST /api/pdf/grade/cambridge
//@desc     Create all cambridge certificate pdfs of the class (starter, movers, flyers)
//@access   Private
router.post("/cambridge", auth, async (req, res) => {
   const { student, grades, info, date } = req.body;

   if (!student.dni)
      return res.status(400).json({
         msg: `Debe registrar el dni del alumno ${student.name} para generar el certificado`,
      });

   if (grades.some((grade) => grade.value === ""))
      return res.status(400).json({
         msg: `Las notas del alumno ${student.name} deben estar cargadas`,
      });

   const average =
      Math.round(
         ((grades.reduce((accum, item) => accum + item.value, 0) /
            grades.length) *
            10 +
            Number.EPSILON) *
            100
      ) / 100;

   const body = grades.map((item) => {
      return {
         name: item.gradetype.name,
         imgs: [20, 40, 60, 80, 100],
         value: item.value * 10,
         average: getGrade(item, info.category, false),
      };
   });

   try {
      await generatePDF(
         fileName,
         {
            date: date.replace("º ", " "),
            student: student.name,
            dni: new Intl.NumberFormat("de-DE").format(student.dni),
            level: getCertificateTitle(info.category),
            average,
            grades: body,
         },
         { type: "cambridge", img: "all", margin: false, landscape: false }
      );
      res.sendFile(fileName);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "PDF Error" });
   }
});

//@route    POST /api/pdf/grade/best
//@desc     Create a pdf of the students' averages
//@access   Private && Admin
router.post("/best", [auth, adminAuth], async (req, res) => {
   const { grades } = req.body;

   if (grades.length === 0)
      return res
         .status(400)
         .json({ msg: "Primero debe realizar una búsqueda" });

   const head = ["Legajo", "Nombre", "Categoría", "Promedio"];

   const body = grades.map((item) => [
      item.student.studentnumber,
      item.student.lastname + ", " + item.student.name,
      item.category.name,
      item.average,
   ]);

   try {
      await generatePDF(
         fileName,
         {
            head,
            body,
            title: "Mejores Promedios",
         },
         { type: "list", img: "logo", margin: true, landscape: false }
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
      case grade < 40:
         return "Malo";
      case grade >= 40 && grade < 60:
         return "Regular";
      case grade >= 60 && grade < 75:
         return "Bueno";
      case grade >= 75 && grade < 90:
         return "Muy Bueno";
      case grade >= 90 && grade <= 100:
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

//@desc Function to get the value of a grade
const getCertificateTitle = (category) => {
   switch (category) {
      case "Infantil A":
      case "Infantil B":
         return "Starter";
      case "Preparatorio":
         return "Movers";
      case "Junior":
         return "Flyers";
      case "6° Año":
         return "First Certificate in English (B2)";
      case "CAE":
         return "Certificate of Advanced English (C1)";
      case "Proficiency":
         return "Certificate of Proficiency in English (C2)";
      default:
         return "";
   }
};

module.exports = router;
