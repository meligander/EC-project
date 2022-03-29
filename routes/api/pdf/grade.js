const router = require("express").Router();
const path = require("path");

const generatePDF = require("../../../other/generatePDF");

//PDF Templates
const pdfTemplateAssitanceGrades = require("../../../templates/assistanceGrades");
const pdfTemplateCertificate = require("../../../templates/certificate");
const pdfTemplateCambridgeCertificate = require("../../../templates/cambridgeCertificate");
const pdfTemplateList = require("../../../templates/list");

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

const highDegree = ["6° Año", "CAE", "Proficency"];

const imgBlack = path.join(
   "file://",
   __dirname,
   "../../../templates/assets/logo.png"
);
const imgGray = path.join(
   "file://",
   __dirname,
   "../../../templates/assets/grayLogo.png"
);
const imgHalfAndHalf = path.join(
   "file://",
   __dirname,
   "../../../templates/assets/halfAndHalf.png"
);

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
   const { header, grades, info } = req.body;

   if (!header || header.length === 0)
      return res.status(400).json({
         msg: "Debe registrar fechas antes de generar el PDF",
      });

   const thead = `<tr><th>Nombre</th>${header
      .map((item) => `<th>${item.name}</th>`)
      .join("")}</tr>`;

   const tbody = info.students
      .map(
         (item, i) =>
            `<tr><td>${item.lastname + ", " + item.name}</td>${grades[i]
               .map(
                  (grade) => `<td>${getGrade(grade, info.category, false)}</td>`
               )
               .join("")}</tr>`
      )
      .join("");

   try {
      generatePDF(
         fileName,
         pdfTemplateAssitanceGrades,
         "assistanceGrades",
         {
            title: "Notas " + periodName[info.period],
            info,
            table: { thead, tbody },
         },
         "portrait",
         `Notas ${periodName[info.period]} ${info.category} de ${info.teacher}`,
         res
      );
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "PDF Error" });
   }
});

//@route    POST /api/pdf/grade/list
//@desc     Create a pdf of all the class grades
//@access   Private
router.post("/list", auth, (req, res) => {
   const { header, grades, info } = req.body;

   const periodName = ["1° B", "2° B", "3° B", "4° B", "Final"];

   let tbody = info.students
      .map(
         (item, i) =>
            `<tr><td>${item.lastname + ", " + item.name}</td>${grades
               .map((period) =>
                  period[i]
                     .map(
                        (grade) =>
                           `<td>${getGrade(grade, info.category, true)}</td>`
                     )
                     .join("")
               )
               .join("")}</tr>`
      )
      .join("");

   const thead = `<tr>
         <th class='no-border'></th>
         ${periodName
            .map(
               (item, i) =>
                  header[i] &&
                  `<th class='border' colspan=${
                     header[i].length === 0 ? 1 : header[i].length
                  }>${item}</th>`
            )
            .join("")}
      </tr>
      <tr>
            <th class='no-border border-right'></th>
            ${periodName
               .map(
                  (item, i) =>
                     header[i] &&
                     header[i]
                        .map(
                           (item2, index) =>
                              `<th class='${
                                 index + 1 === header[i].length
                                    ? "border-right border-bottom"
                                    : "border-bottom"
                              }'>
                        ${item2.name
                           .split(" ")
                           .map((x) => x[0])
                           .join("")}
                     </th>`
                        )
                        .join("")
               )
               .join("")}
      </tr>`;

   try {
      generatePDF(
         fileName,
         pdfTemplateAssitanceGrades,
         "assistanceGrades",
         {
            title: `Notas ${info.category}`,
            info: { category: info.category },
            table: { thead, tbody },
            type: "all-grades",
         },
         "landscape",
         ` - Notas ${info.category} de ${info.teacher}`,
         res
      );
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "PDF Error" });
   }
});

//@route    POST /api/pdf/grade/certificate
//@desc     Create a certificate for the class
//@access   Private
router.post("/certificate", auth, async (req, res) => {
   const { student, header, grades, info, date } = req.body;

   if (!student.dni)
      return res.status(400).json({
         msg: `Debe registrar el dni del alumno ${student.name} para generar el certificado`,
      });

   if (grades.some((grade) => grade.value === ""))
      return res.status(400).json({
         msg: `Las notas del alumno ${student.name} deben estar cargadas`,
      });

   let average =
      grades.reduce((accum, item) => accum + item.value, 0) / grades.length;

   const high = highDegree.some((cat) => cat === info.category);

   let body = "";

   if (average < 6 || info.category === "Kinder") {
      body = `
      <p>Quien ha cursado durante el año el curso de inglés denominado: </p>
      <p class="category alone">${info.category}</p>
      <p class='certificate-name'>conforme al nivel <span>${getCertificateTitle(
         info.category
      )}</span></p>
      ${
         info.category === "Kinder"
            ? `<p class="mention"><span class="title">Mención:</span> &nbsp; ${kinderGraden(
                 average
              )}</p>`
            : ""
      }
      `;
   } else {
      if (high) {
         body = `
         <div class='subtitle'>
            <p>Quien ha culminado el curso de inglés conforme al plan de estudios, </p>
            <p>correspondiente a
               <span class="capital"> &nbsp; ${info.category} &nbsp;</span>
                a nivel <span class="capital">&nbsp;${getCertificateTitle(
                   info.category
                )}</span>
            </p>
            <p>con las siguientes calificaciones:</p>
         </div>`;
      } else {
         body = `
         <p>Quien ha rendido los exámenes correspondientes a:</p>
         <p class="category">${info.category}</p>
         <p>con las siguientes calificaciones: </p>
         `;
      }

      let finalGrades = "";
      let fBody = "";
      let fHeader = "";

      for (let x = 0; x < grades.length; x++) {
         fHeader += `<th>${header[x].name}</th>`;
         fBody += `<td>${getGrade(grades[x], info.category, false)}</td>`;

         if (x + 1 === grades.length) {
            if (high) {
               average =
                  Math.round((average * 10 + Number.EPSILON) * 100) / 100;

               fBody += `<td>${average}%</td>`;
               fHeader += "<th>Promedio</th>";
               finalGrades +=
                  "<tr>" + fHeader + "</tr><tr>" + fBody + "</tr></table>";
            } else {
               if (fHeader !== "")
                  finalGrades +=
                     "<tr>" + fHeader + "</tr><tr>" + fBody + "</tr></table>";
               else finalGrades += "</table>";
            }
         } else {
            if ((high && (x + 1) % 3 === 0) || (!high && (x + 1) % 2 === 0)) {
               finalGrades += "<tr>" + fHeader + "</tr><tr>" + fBody + "</tr>";
               fHeader = "";
               fBody = "";
            }
         }
      }

      body += `<table class="grades-table ${
         high ? "full" : ""
      }">${finalGrades}`;
   }

   try {
      generatePDF(
         fileName,
         pdfTemplateCertificate,
         "certificate",
         {
            student: {
               ...student,
               dni: new Intl.NumberFormat("de-DE").format(student.dni),
            },
            body,
            date,
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

//@route    POST /api/pdf/grade/cambridge
//@desc     Create all cambridge certificate pdfs of the class (starter, movers, flyers)
//@access   Private
router.post("/cambridge", auth, (req, res) => {
   const { student, header, grades, info, date } = req.body;

   if (!student.dni)
      return res.status(400).json({
         msg: `Debe registrar el dni del alumno ${student.name} para generar el certificado`,
      });

   if (grades.some((grade) => grade.value === ""))
      return res.status(400).json({
         msg: `Las notas del alumno ${student.name} deben estar cargadas`,
      });

   let body = "<table>";

   const average =
      grades.reduce((accum, item) => accum + item.value, 0) / grades.length;

   for (let x = 0; x < grades.length; x++) {
      body += `<tr>
                     <td class='name'>${header[x].name}</td>
                     ${getImages(Math.ceil(grades[x].value - 0.4) / 2)}
                     <td class='percentage'>${getGrade(
                        grades[x],
                        info.category,
                        false
                     )}</td>
               </tr>`;
   }
   body += "</table>";

   try {
      generatePDF(
         fileName,
         pdfTemplateCambridgeCertificate,
         "cambridgeCertificate",
         {
            student: {
               ...student,
               dni: new Intl.NumberFormat("de-DE").format(student.dni),
            },
            body,
            date,
            level: getCertificateTitle(info.category),
            average: Math.round((average * 10 + Number.EPSILON) * 100) / 100,
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

//@route    POST /api/pdf/grade/best
//@desc     Create a pdf of the students' averages
//@access   Private && Admin
router.post("/best", [auth, adminAuth], (req, res) => {
   const { grades } = req.body;

   if (grades.length === 0)
      return res
         .status(400)
         .json({ msg: "Primero debe realizar una búsqueda" });

   const tbody = grades
      .map(
         (item) => `<tr>
      <td>${item.student.studentnumber}</td>
      <td>${item.student.lastname + ", " + item.student.name}</td>
      <td>${item.category.name}</td>
      <td>${item.average}</td>
   </tr>`
      )
      .join("");

   const thead =
      "<th>Legajo</th> <th>Nombre</th> <th>Categoría</th> <th>Promedio</th>";

   try {
      generatePDF(
         fileName,
         pdfTemplateList,
         "list",
         {
            title: "Mejores Promedios",
            table: { thead, tbody },
         },
         "portrait",
         "Mejores Promedios",
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
         return "First Certificate in English";
      case "CAE":
         return "Certificate of Advanced English";
      case "Proficency":
         return "Certificate of Proficiency in English";
      default:
         return "";
   }
};

//@desc Function to get the correct img depending on the grade
const getImages = (num) => {
   let images = "";

   const even = num % 1 === 0;

   num = Math.floor(num);

   if (even) {
      for (let y = 0; y < 5; y++) {
         if (y < num) images += `<td><img src="${imgBlack}" alt="logo"/></td>`;
         else images += `<td><img src="${imgGray}" alt="logo gris"/></td>`;
      }
   } else {
      for (let y = 0; y < 5; y++) {
         if (y < num) images += `<td><img src="${imgBlack}" alt="logo"/></td>`;
         else {
            if (y === num)
               images += `<td><img src="${imgHalfAndHalf}" alt="logo a la mitad"/></td>`;
            else images += `<td><img src="${imgGray}" alt="logo gris"/></td>`;
         }
      }
   }

   return images;
};

module.exports = router;
