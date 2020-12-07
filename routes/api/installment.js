const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const adminAuth = require("../../middleware/adminAuth");
const { check, validationResult } = require("express-validator");
const path = require("path");
const pdf = require("html-pdf");
const pdfTemplate = require("../../templates/list");

const Installment = require("../../models/Installment");
const Enrollment = require("../../models/Enrollment");
const Penalty = require("../../models/Penalty");

//@route    GET api/installment
//@desc     Get all installments
//@access   Private
router.get("/", [auth, adminAuth], async (req, res) => {
   try {
      let installments = [];

      const compareDate = new Date();
      const month = compareDate.getMonth() + 1;
      const year = compareDate.getFullYear();

      const filter = req.query;

      let initialInstallments = await Installment.find({
         value: { $ne: 0 },
         year: { $lte: year },
      }).populate({
         path: "student",
         model: "user",
         select: ["name", "lastname"],
         match: {
            ...(filter.name && {
               name: { $regex: `.*${filter.name}.*`, $options: "i" },
            }),
            ...(filter.lastname && {
               lastname: {
                  $regex: `.*${filter.lastname}.*`,
                  $options: "i",
               },
            }),
         },
      });

      if (Object.entries(filter).length === 0) {
         for (let x = 0; x < initialInstallments.length; x++) {
            if (
               initialInstallments[x].year === year &&
               initialInstallments[x].number > month
            ) {
               continue;
            }
            installments.push(initialInstallments[x]);
         }
      } else {
         let startYear = 2000;
         let startMonth = 0;
         if (filter.startDate) {
            startYear = new Date(filter.startDate).getFullYear();
            startMonth = new Date(filter.startDate).getMonth();
         }
         const endYear = new Date(filter.endDate).getFullYear();
         const endMonth = new Date(filter.endDate).getMonth() + 2;

         for (let x = 0; x < initialInstallments.length; x++) {
            const number = initialInstallments[x].number;
            if (initialInstallments[x].student) {
               const year = initialInstallments[x].year;
               if (year >= startYear && year <= endYear) {
                  if (startYear === year) {
                     if (startMonth <= number) {
                        installments.push(initialInstallments[x]);
                        continue;
                     }
                  }
                  if (endYear === year) {
                     if (endMonth >= number)
                        installments.push(initialInstallments[x]);
                  } else installments.push(initialInstallments[x]);
               }
            }
         }

         installments = installments.filter(
            (installment) => installment.student
         );
      }

      installments = sortArray(installments);

      if (installments.length === 0) {
         return res.status(400).json({
            msg: "No se encontraron deudas con dichas descripciones",
         });
      }

      res.json(installments);
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
   }
});

//@route    GET api/installment/:id
//@desc     Get one installment
//@access   Private
router.get("/:id", [auth, adminAuth], async (req, res) => {
   try {
      const installment = await Installment.findOne({
         _id: req.params.id,
      }).populate({
         path: "student",
         model: "user",
         select: ["name", "lastname", "_id"],
      });

      res.json(installment);
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
   }
});

//@route    GET api/installment/student/:id
//@desc     Get all users's installments
//@access   Private
router.get("/student/:id/:admin", auth, async (req, res) => {
   try {
      let installments = await Installment.find({
         student: req.params.id,
      })
         .sort({ year: 1, number: 1 })
         .populate({
            path: "student",
            model: "user",
            select: ["name", "lastname", "studentnumber"],
         });
      if (installments.length === 0)
         return res.status(400).json({ msg: "No se encontraron cuotas" });

      installments = buildTable(installments);

      res.json(installments);
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
   }
});

//@route    GET api/installment/month/debts
//@desc     Get all installments
//@access   Private
router.get("/month/debts", [auth, adminAuth], async (req, res) => {
   try {
      const date = new Date();
      const month = date.getMonth() + 1;
      const installmentsExpired = await Installment.find({
         value: { $ne: 0 },
         expired: true,
      });
      const MonthInstallments = await Installment.find({
         value: { $ne: 0 },
         expired: false,
         number: { $in: [month, 0] },
      });

      const installments = installmentsExpired.concat(MonthInstallments);

      let totalDebt = 0;
      for (let x = 0; x < installments.length; x++) {
         totalDebt = totalDebt + installments[x].value;
      }

      res.json(totalDebt);
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
   }
});

//@route    POST api/installment/create-list
//@desc     Create a pdf of installments
//@access   Private
router.post("/create-list", (req, res) => {
   const name = "Reports/debt.pdf";

   const debts = req.body;

   const installments = [
      "Inscripción",
      "",
      "",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
   ];

   let tbody = "";

   for (let x = 0; x < debts.length; x++) {
      const studentname =
         "<td>" +
         debts[x].student.lastname +
         " " +
         debts[x].student.name +
         "</td>";
      const installment = "<td>" + installments[debts[x].number] + "</td>";
      const year = "<td>" + debts[x].year + "</td>";
      const value = "<td> $" + debts[x].value + "</td>";

      tbody += "<tr>" + studentname + installment + year + value + "</tr>";
   }

   const thead = "<th>Nombre</th> <th>Cuota</th> <th>Año</th> <th>Valor</th>";

   const img = path.join(
      "file://",
      __dirname,
      "../../templates/assets/logo.png"
   );
   const css = path.join(
      "file://",
      __dirname,
      "../../templates/styles/list.css"
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
      pdfTemplate(css, img, "movimientos", thead, tbody),
      options
   ).toFile(name, (err) => {
      if (err) {
         res.send(Promise.reject());
      }

      res.send(Promise.resolve());
   });
});

//@route    GET api/installment/fetch-list
//@desc     Get the pdf of installments
//@access   Private
router.get("/list/fetch-list", (req, res) => {
   res.sendFile(path.join(__dirname, "../../Reports/debt.pdf"));
});

//@route    POST api/installment
//@desc     Add an installment
//@access   Private
router.post(
   "/",
   [
      auth,
      adminAuth,
      check("number", "La cuota es necesaria").not().isEmpty(),
      check("student", "El alumno es necesario").not().isEmpty(),
      check("year", "El año es necesario").not().isEmpty(),
      check("value", "El valor es necesario").not().isEmpty(),
   ],
   async (req, res) => {
      const { number, year, student, value, expired } = req.body;

      try {
         let errors = validationResult(req);
         errors = errors.array();

         const enrollment = await Enrollment.findOne({ year, student });
         if (enrollment) {
            const installment = await Installment.findOne({
               enrollment: enrollment.id,
               year,
               number,
            });

            if (installment) {
               errors.push({
                  msg: "Ya existe una cuota de ese alumno para dicho año y mes",
               });
            }
         }
         if (errors.length > 0) {
            return res.status(400).json({ errors });
         }
         let data = {
            number,
            value,
            ...(enrollment && { enrollment: enrollment.id }),
            student,
            year,
            expired,
         };

         installment = new Installment(data);

         await installment.save();

         let installments = await Installment.find({
            student: installment.student,
         })
            .sort({ year: 1, number: 1 })
            .populate({
               path: "student",
               model: "user",
               select: ["name", "lastname", "studentnumber"],
            });

         installments = buildTable(installments);

         res.json(installments);
      } catch (err) {
         console.error(err.message);
         return res.status(500).send("Server Error");
      }
   }
);

//@route    PUT api/installment/:id
//@desc     Update an installment
//@access   Private
router.put(
   "/:id",
   [auth, adminAuth, check("value", "El valor es necesario").not().isEmpty()],
   async (req, res) => {
      const { value, expired } = req.body;

      let errors = validationResult(req);
      if (!errors.isEmpty()) {
         errors = errors.array();
         return res.status(400).json({ errors });
      }

      try {
         installment = await Installment.findOneAndUpdate(
            { _id: req.params.id },
            { $set: { value, expired } },
            { new: true }
         );

         res.json(installment);
      } catch (err) {
         console.error(err.message);
         return res.status(500).send("Server Error");
      }
   }
);

//@route    PUT api/installment
//@desc     Update the installments
//@access   Private
router.put("/", [auth], async (req, res) => {
   try {
      const date = new Date();
      //HARKODEADOOOOO
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const installments = await Installment.find({
         number: { $lte: month, $ne: 0 },
         year: { $lte: date.getFullYear() },
         value: { $ne: 0 },
      }).populate({
         path: "student",
         model: "user",
         select: "chargeday",
      });
      let penalty = await Penalty.find().sort({ $natural: -1 }).limit(1);
      penalty = penalty[0];
      for (let x = 0; x < installments.length; x++) {
         if (
            (installments[x].number < month && !installments[x].expired) ||
            (installments[x].number === month &&
               installments[x].student.chargeday < day &&
               !installments[x].expired)
         ) {
            const charge =
               (installments[x].value * penalty.percentage) / 100 +
               installments[x].value;
            const value = Math.round(charge / 10) * 10;

            await Installment.findOneAndUpdate(
               { _id: installments[x].id },
               { value, expired: true }
            );
         }
      }

      res.json({ msg: "Installments updated" });
   } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
   }
});

//@route    DELETE api/installment/:id
//@desc     Delete an installment
//@access   Private
router.delete("/:id", [auth, adminAuth], async (req, res) => {
   try {
      //Remove Installment
      await Installment.findOneAndRemove({ _id: req.params.id });

      res.json({ msg: "Installment deleted" });
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
   }
});

function buildTable(array) {
   let rows = [];

   let obj = array.reduce((res, curr) => {
      if (res[curr.year]) res[curr.year].push(curr);
      else Object.assign(res, { [curr.year]: [curr] });

      return res;
   }, {});

   let years = Object.getOwnPropertyNames(obj);
   let newYears = [];

   for (const x in obj) {
      const dividedDebts = obj[x];
      let row = Array.from(Array(11), () => ({
         _id: "",
         expired: false,
         value: "",
         year: x,
      }));
      let valid = false;
      for (let x = 0; x < dividedDebts.length; x++) {
         valid = dividedDebts[x].value !== 0 && true;
         const number =
            dividedDebts[x].number !== 0 ? dividedDebts[x].number - 2 : 0;
         row[number] = dividedDebts[x];
      }
      if (valid) {
         rows.push(row);
      } else {
         if (req.params.admin) {
            rows.push(row);
         } else {
            const yearOut = years[x];
            newYears = years.filter((year) => year !== yearOut);
         }
      }
   }
   if (newYears.length > 0) years = newYears;
   return { years, rows };
}

function sortArray(array) {
   array.sort((a, b) => {
      if (a.student.lastname > b.student.lastname) return 1;
      if (
         a.student.lastname === b.student.lastname &&
         a.student.name > b.student.name
      )
         return 1;
      if (
         a.student.lastname === b.student.lastname &&
         a.student.name === b.student.name &&
         a.year > b.year
      )
         return 1;
      if (
         a.student.lastname === b.student.lastname &&
         a.student.name === b.student.name &&
         a.year === b.year &&
         a.number > b.number
      )
         return 1;

      if (a.student.lastname < b.student.lastname) return -1;
      if (
         a.student.lastname === b.student.lastname &&
         a.student.name < b.student.name
      )
         return -1;
      if (
         a.student.lastname === b.student.lastname &&
         a.student.name === b.student.name &&
         a.year < b.year
      )
         return -1;
      if (
         a.student.lastname === b.student.lastname &&
         a.student.name === b.student.name &&
         a.year === b.year &&
         a.number < b.number
      )
         return -1;
      return 0;
   });

   return array;
}

module.exports = router;
