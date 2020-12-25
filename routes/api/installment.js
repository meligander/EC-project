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
      let initialInstallments = [];

      const compareDate = new Date();
      const month = compareDate.getMonth() + 1;
      const year = compareDate.getFullYear();

      const filter = req.query;

      if (Object.entries(filter).length === 0) {
         initialInstallments = await Installment.find({
            value: { $ne: 0 },
            year: { $lte: year },
         }).populate({
            path: "student",
            model: "user",
            select: ["name", "lastname"],
         });

         for (let x = 0; x < initialInstallments.length; x++) {
            if (initialInstallments[x].student) {
               if (
                  initialInstallments[x].year === year &&
                  initialInstallments[x].number > month
               ) {
                  continue;
               }
               installments.push(initialInstallments[x]);
            }
         }
      } else {
         const numberStart =
            filter.startDate && new Date(filter.startDate).getMonth() + 2;
         const numberEnd = new Date(filter.endDate).getMonth() + 2;

         installments = await Installment.find({
            value: { $ne: 0 },
            year: {
               ...(filter.startDate && {
                  $gte: new Date(filter.startDate).getFullYear(),
               }),
               $lte: new Date(filter.endDate).getFullYear(),
            },
            number: {
               ...(filter.startDate && {
                  $gte: numberStart,
               }),
               $lte: numberEnd,
            },
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
      const student = req.params.id;
      let installments = await Installment.find({
         student,
      })
         .sort({ year: -1, number: 1 })
         .populate({
            path: "student",
            model: "user",
            select: ["name", "lastname", "studentnumber"],
         });

      if (installments.length === 0) return [];

      installments = buildTable(installments, req.params.admin === "true");

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
   const name = "reports/debt.pdf";

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
         ", " +
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

   pdf.create(pdfTemplate(css, img, "deudas", thead, tbody), options).toFile(
      name,
      (err) => {
         if (err) {
            res.send(Promise.reject());
         }

         res.send(Promise.resolve());
      }
   );
});

//@route    GET api/installment/fetch-list
//@desc     Get the pdf of installments
//@access   Private
router.get("/list/fetch-list", (req, res) => {
   res.sendFile(path.join(__dirname, "../../reports/debt.pdf"));
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
         let errors = [];
         const errorsResult = validationResult(req);
         if (!errorsResult.isEmpty()) {
            errors = errorsResult.array();
            return res.status(400).json({ errors });
         }

         const enrollment = await Enrollment.findOne({ year, student });
         if (enrollment) {
            const installment = await Installment.findOne({
               enrollment: enrollment.id,
               year,
               number,
            });

            if (installment) {
               return res.status(400).json({
                  msg: "Ya existe una cuota de ese alumno para dicho año y mes",
               });
            }
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

         res.json({ msg: "Cuota Agregada" });
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

      let errors = [];
      const errorsResult = validationResult(req);
      if (!errorsResult.isEmpty()) {
         errors = errorsResult.array();
         return res.status(400).json({ errors });
      }

      try {
         await Installment.findOneAndUpdate(
            { _id: req.params.id },
            { $set: { value, expired } },
            { new: true }
         );

         res.json({ msg: "Cuota Modificada" });
      } catch (err) {
         console.error(err.message);
         return res.status(500).send("Server Error");
      }
   }
);

//@route    PUT api/installment
//@desc     Update the installment's price when expired
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

function buildTable(installments, admin) {
   let rows = [];
   let years = [];

   //Divide the installments by years
   let installmentsByYear = [];

   let count = 0;
   let sameYear = 0;

   for (let x = 0; x < installments.length; x++) {
      if (installments[x].year === sameYear) {
         installmentsByYear[count].push(installments[x]);
      } else {
         if (x !== 0) count++;
         sameYear = installments[x].year;
         years.push(installments[x].year);
         installmentsByYear[count] = [];
         installmentsByYear[count].push(installments[x]);
      }
   }

   let newYears = [];

   for (let x = 0; x < installmentsByYear.length; x++) {
      //get all the installments for that year
      const dividedInstallments = installmentsByYear[x];

      //Create a row with all the items in the table
      let row = Array.from(Array(11), () => ({
         _id: "",
         expired: false,
         value: "",
         year: x,
      }));

      let valid = false;

      for (let x = 0; x < dividedInstallments.length; x++) {
         valid = dividedInstallments[x].value !== 0;
         const number =
            dividedInstallments[x].number !== 0
               ? dividedInstallments[x].number - 2
               : 0;

         row[number] = dividedInstallments[x];
      }

      if (valid) {
         rows.push(row);
      } else {
         if (admin) {
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
   const sortedArray = array.sort((a, b) => {
      if (a.student.lastname > b.student.lastname) return 1;
      if (a.student.lastname < b.student.lastname) return -1;

      if (a.student.name > b.student.name) return 1;
      if (a.student.name < b.student.name) return -1;

      if (a.student.year > b.student.year) return 1;
      if (a.student.year < b.student.year) return -1;

      if (a.student.number > b.student.number) return 1;
      if (a.student.number < b.student.number) return -1;
   });

   return sortedArray;
}

module.exports = router;
