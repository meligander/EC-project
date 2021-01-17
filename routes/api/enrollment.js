const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const adminAuth = require("../../middleware/adminAuth");
const { check, validationResult } = require("express-validator");
const path = require("path");
const pdf = require("html-pdf");
const pdfTemplate = require("../../templates/list");
const moment = require("moment");

const Enrollment = require("../../models/Enrollment");
const Installment = require("../../models/Installment");
const Attendance = require("../../models/Attendance");
const Grade = require("../../models/Grade");
const Category = require("../../models/Category");

//@route    GET api/enrollment
//@desc     get all enrollments || with filter
//@access   Private
router.get("/", [auth, adminAuth], async (req, res) => {
   try {
      let date = new Date();
      let enrollments;
      if (Object.entries(req.query).length === 0) {
         enrollments = await Enrollment.find({
            year: { $in: [date.getFullYear(), date.getFullYear() + 1] },
         })
            .populate({
               path: "student",
               model: "user",
               select: ["name", "lastname", "studentnumber"],
            })
            .populate({
               path: "category",
               model: "category",
            })
            .sort({ date: -1 });
      } else {
         const filter = req.query;

         enrollments = await Enrollment.find({
            ...((filter.startDate || filter.endDate) && {
               date: {
                  ...(filter.startDate && {
                     $gte: new Date(filter.startDate).setHours(00, 00, 00),
                  }),
                  ...(filter.endDate && {
                     $lte: new Date(filter.endDate).setHours(23, 59, 59),
                  }),
               },
            }),
            ...(filter.category && { category: filter.category }),
            year: filter.year
               ? filter.year
               : { $in: [date.getFullYear(), date.getFullYear() + 1] },
            ...(filter.student && { student: filter.student }),
         })
            .populate({
               path: "student",
               model: "user",
               select: ["name", "lastname", "studentnumber"],
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
            })
            .populate({
               path: "category",
               model: "category",
            })
            .sort({ date: -1 });

         enrollments = enrollments.filter((enroll) => enroll.student);
      }

      if (enrollments.length === 0) {
         return res.status(400).json({
            msg: "No se encontraron inscripciones con dichas descripciones",
         });
      }

      res.json(enrollments);
   } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
   }
});

//@route    GET api/enrollment/average
//@desc     get all student's average
//@access   Private
router.get("/average", [auth, adminAuth], async (req, res) => {
   try {
      let date = new Date();

      let enrollments;
      const filter = req.query;

      enrollments = await Enrollment.find({
         category: filter.category
            ? filter.category
            : { $ne: "5ebb3498397c2d2610a4eab8" },
         "classroom.average": { $exists: true },
         year: date.getFullYear(),
      })
         .populate({
            path: "student",
            model: "user",
            select: ["name", "lastname", "studentnumber"],
         })
         .populate({
            path: "category",
            model: "category",
         })
         .sort({ "classroom.average": -1 })
         .limit(filter.amount ? parseInt(filter.amount) : 50);

      if (enrollments.length === 0) {
         return res.status(400).json({
            msg: "No se encontraron alumnos con dichas descripciones",
         });
      }

      res.json(enrollments);
   } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
   }
});

//@route    GET api/enrollment/absences
//@desc     get all student's absences
//@access   Private
router.get("/absences", [auth, adminAuth], async (req, res) => {
   try {
      let date = new Date();

      const filter = req.query;

      const enrollments = await Enrollment.find({
         ...(filter.category && { category: filter.category }),
         ...(filter.absence && {
            "classroom.absence": { $lte: filter.absence },
         }),
         year: date.getFullYear(),
      })
         .populate({
            path: "student",
            model: "user",
            select: ["name", "lastname", "studentnumber"],
         })
         .populate({
            path: "category",
            model: "category",
         })
         .sort({ "classroom.absence": 1 });

      if (enrollments.length === 0) {
         return res.status(400).json({
            msg: "No se encontraron alumnos con dichas descripciones",
         });
      }

      res.json(enrollments);
   } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
   }
});

//@route    GET api/enrollment/one/:id
//@desc     get one enrollment
//@access   Private
router.get("/one/:id", [auth, adminAuth], async (req, res) => {
   try {
      let enrollment = await Enrollment.findOne({ _id: req.params.id })
         .populate({
            path: "student",
            model: "user",
            select: ["name", "lastname", "studentnumber"],
         })
         .populate({
            path: "category",
            model: "category",
         });

      if (!enrollment)
         return res.status(400).json({
            msg: "No se encontraró una inscripción con dichas descripciones",
         });

      res.json(enrollment);
   } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
   }
});

//@route    GET api/enrollment/year
//@desc     get year's enrollments
//@access   Private
router.get("/year", [auth, adminAuth], async (req, res) => {
   try {
      const date = new Date();
      const year = date.getFullYear() + 1;

      let enrollments = await Enrollment.find({ year });
      if (enrollments.length === 0)
         enrollments = await Enrollment.find({ year: date.getFullYear() });

      let yearEnrollments = {
         length: 0,
         year: 0,
      };
      if (enrollments.length !== 0) {
         yearEnrollments = {
            length: enrollments.length,
            year: enrollments[0].year,
         };
      }

      res.json(yearEnrollments);
   } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
   }
});

//@route    GET api/enrollment/fetch-list
//@desc     Get the pdf of enrollments
//@access   Private
router.get("/fetch-list", (req, res) => {
   res.sendFile(path.join(__dirname, "../../reports/enrollments.pdf"));
});

//@route    GET api/enrollment/averages/fetch-list
//@desc     Get the pdf of enrollments
//@access   Private
router.get("/averages/fetch-list", (req, res) => {
   res.sendFile(path.join(__dirname, "../../reports/averages.pdf"));
});

//@route    GET api/enrollment/absences/fetch-list
//@desc     Get the pdf of enrollments
//@access   Private
router.get("/absences/fetch-list", (req, res) => {
   res.sendFile(path.join(__dirname, "../../reports/absences.pdf"));
});

//@route    POST api/enrollment
//@desc     Add an enrollment
//@access   Private
router.post(
   "/",
   [
      auth,
      adminAuth,
      check("student", "El alumno es necesario.").not().isEmpty(),
      check("category", "La categoría es necesaria.").not().isEmpty(),
      check("year", "El año es necesario.").not().isEmpty(),
      check("month", "El mes es necesario.").not().isEmpty(),
   ],
   async (req, res) => {
      const { student, category, year, month } = req.body;

      let errors = [];
      const errorsResult = validationResult(req);
      if (!errorsResult.isEmpty()) {
         errors = errorsResult.array();
         return res.status(400).json({ errors });
      }

      let enrollment;

      try {
         enrollment = await Enrollment.findOne({ student, year });
         if (enrollment)
            return res
               .status(400)
               .json({ msg: "El alumno ya está inscripto para dicho año" });

         let data = { student, year, category };

         enrollment = new Enrollment(data);

         await enrollment.save();

         enrollment = await Enrollment.find()
            .sort({ $natural: -1 })
            .populate({ path: "category" })
            .populate({
               path: "student",
               model: "user",
               select: "-password",
            })
            .limit(1);
         enrollment = enrollment[0];

         let number = 0;
         let categoryInstallment = await Category.findOne({
            name: "Inscripción",
         });
         let installment;

         installment = new Installment({
            year,
            student,
            number,
            value: categoryInstallment.value,
            expired: false,
            enrollment: enrollment.id,
            debt: true,
         });
         installment.save();

         if (month !== 0) number = month;
         else number = 3;

         let value = enrollment.category.value;
         let half = value / 2;

         const discount = enrollment.student.discount;
         if (discount && discount !== 0) {
            let disc = (value * discount) / 100;
            value = Math.round((value - disc) / 10) * 10;
            if (number === 3) {
               if (discount === 50) number = 4;
               else {
                  disc = (half * discount) / 100;
                  half = Math.round((half - disc) / 10) * 10;
               }
            }
         }

         const amount = 13 - number;
         for (let x = 0; x < amount; x++) {
            installment = new Installment({
               number,
               year,
               student,
               value: x === 0 && number === 3 ? half : value,
               expired: false,
               enrollment: enrollment.id,
            });

            number++;

            await installment.save();
         }

         res.json({ msg: "Enrollment Registered" });
      } catch (err) {
         console.error(err.message);
         return res.status(500).send("Server Error");
      }
   }
);

//@route    POST api/enrollment/create-list
//@desc     Create a pdf of enrollment
//@access   Private
router.post("/create-list", (req, res) => {
   const name = "reports/enrollments.pdf";

   const enrollments = req.body;

   if (enrollments.length === 0)
      return res
         .status(400)
         .json({ msg: "Primero debe realizar una búsqueda" });

   let tbody = "";

   for (let x = 0; x < enrollments.length; x++) {
      const date =
         "<td>" + moment(enrollments[x].date).format("DD/MM/YY") + "</td>";
      const studentnumber =
         "<td>" + enrollments[x].student.studentnumber + "</td>";
      const studentname =
         "<td>" +
         enrollments[x].student.lastname +
         ", " +
         enrollments[x].student.name +
         "</td>";
      const category = "<td>" + enrollments[x].category.name + "</td>";
      const year = "<td>" + enrollments[x].year + "</td>";

      tbody +=
         "<tr>" +
         date +
         studentnumber +
         studentname +
         category +
         year +
         "</tr>";
   }

   const thead =
      "<th>Fecha</th> <th>Legajo</th> <th>Nombre</th> <th>Categoría</th> <th>Año</th>";

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

   pdf.create(
      pdfTemplate(css, img, "inscripciones", thead, tbody),
      options
   ).toFile(name, (err) => {
      if (err) {
         res.send(Promise.reject());
      }

      res.send(Promise.resolve());
   });
});

//@route    POST api/enrollment/averages/create-list
//@desc     Create a pdf of the students' averages
//@access   Private
router.post("/averages/create-list", (req, res) => {
   const name = "reports/averages.pdf";

   const enrollments = req.body;

   if (enrollments.length === 0)
      return res
         .status(400)
         .json({ msg: "Primero debe realizar una búsqueda" });

   let tbody = "";

   for (let x = 0; x < enrollments.length; x++) {
      const studentnumber =
         "<td>" + enrollments[x].student.studentnumber + "</td>";
      const studentname =
         "<td>" +
         enrollments[x].student.lastname +
         ", " +
         enrollments[x].student.name +
         "</td>";
      const category = "<td>" + enrollments[x].category.name + "</td>";
      const average = "<td>" + enrollments[x].classroom.average + "</td>";

      tbody +=
         "<tr>" + studentnumber + studentname + category + average + "</tr>";
   }

   const thead =
      "<th>Legajo</th> <th>Nombre</th> <th>Categoría</th> <th>Promedio</th>";

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

   pdf.create(
      pdfTemplate(css, img, "Mejores Promedios", thead, tbody),
      options
   ).toFile(name, (err) => {
      if (err) {
         res.send(Promise.reject());
      }

      res.send(Promise.resolve());
   });
});

//@route    POST api/enrollment/absences/create-list
//@desc     Create a pdf of the students' absences
//@access   Private
router.post("/absences/create-list", (req, res) => {
   const name = "reports/absences.pdf";

   const enrollments = req.body;

   if (enrollments.length === 0)
      return res
         .status(400)
         .json({ msg: "Primero debe realizar una búsqueda" });

   let tbody = "";

   for (let x = 0; x < enrollments.length; x++) {
      const studentnumber =
         "<td>" + enrollments[x].student.studentnumber + "</td>";
      const studentname =
         "<td>" +
         enrollments[x].student.lastname +
         ", " +
         enrollments[x].student.name +
         "</td>";
      const category = "<td>" + enrollments[x].category.name + "</td>";

      let type;

      switch (enrollments[x].classroom.absence) {
         case 0:
            type = "Perfecta";
            break;
         case 1:
            type = "Excelente";
            break;
         case 2:
            type = "Muy Buena";
            break;
         case 3:
         case 4:
            "Buena";
         default:
            type = "Regular";
            break;
      }

      type = "<td>" + type + "</td>";
      const absence = "<td>" + enrollments[x].classroom.absence + "</td>";

      tbody +=
         "<tr>" +
         studentnumber +
         studentname +
         category +
         type +
         absence +
         "</tr>";
   }

   const thead =
      "<th>Legajo</th> <th>Nombre</th> <th>Categoría</th> <th>Tipo</th> <th>Faltas</th>";

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

   pdf.create(
      pdfTemplate(css, img, "Mejores Asistencias", thead, tbody),
      options
   ).toFile(name, (err) => {
      if (err) {
         res.send(Promise.reject());
      }

      res.send(Promise.resolve());
   });
});

//@route    PUT api/enrollment/:id
//@desc     Update the category of the enrollment
//@access   Private
router.put(
   "/:id",
   [
      auth,
      adminAuth,
      check("category", "La categoría es necesaria.").not().isEmpty(),
      check("month", "El mes es necesario.").not().isEmpty(),
   ],
   async (req, res) => {
      const { category, month } = req.body;

      let errors = [];
      const errorsResult = validationResult(req);
      if (!errorsResult.isEmpty()) {
         errors = errorsResult.array();
         return res.status(400).json({ errors });
      }

      let enrollment;

      try {
         enrollment = await Enrollment.findOne({ _id: req.params.id }).populate(
            {
               path: "category",
               model: "category",
            }
         );

         if (enrollment.category._id.toString() !== category) {
            await deleteInfoRelated(
               enrollment.classroom._id,
               enrollment.student
            );

            enrollment = await Enrollment.findOneAndUpdate(
               { _id: req.params.id },
               {
                  category: category,
                  classroom: {
                     _id: null,
                     average: null,
                     absence: null,
                     periodAbsence: [],
                     periodAverage: [],
                  },
               },
               { new: true }
            )
               .populate({
                  path: "student",
                  model: "user",
                  select: "-password",
               })
               .populate({
                  path: "category",
                  model: "category",
               });

            let number = 0;
            if (month !== 0) number = month;
            else number = 3;

            let value = enrollment.category.value;
            let half = value / 2;

            const discount = enrollment.student.discount;
            if (discount && discount !== 0) {
               let disc = (value * discount) / 100;
               value = Math.round((value - disc) / 10) * 10;
               if (number === 3) {
                  if (discount === 50) number = 4;
                  else {
                     disc = (half * discount) / 100;
                     half = Math.round((half - disc) / 10) * 10;
                  }
               }
            }

            const amount = 13 - number;
            for (let x = 0; x < amount; x++) {
               await Installment.findOneAndUpdate(
                  { enrollment: req.params.id, number, value: { $ne: 0 } },
                  { value: x === 0 && number === 3 ? half : value }
               );
               number++;
            }
         } else {
            return res
               .status(400)
               .json({ msg: "La categoría debe ser distinta" });
         }

         res.json(enrollment);
      } catch (err) {
         console.error(err.message);
         return res.status(500).send("Server Error");
      }
   }
);

//@route    DELETE api/enrollment/:id
//@desc     Delete an enrollment
//@access   Private
router.delete("/:id", [auth, adminAuth], async (req, res) => {
   try {
      //Remove Enrollment
      const enrollment = await Enrollment.findOneAndRemove({
         _id: req.params.id,
      });

      const installments = await Installment.find({
         enrollment: enrollment._id,
      });
      for (let x = 0; x < installments.length; x++) {
         await Installment.findOneAndRemove({ _id: installments[x].id });
      }

      await deleteInfoRelated(enrollment.classroom._id, enrollment.student);

      res.json({ msg: "Enrollment deleted" });
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
   }
});

async function deleteInfoRelated(classroom, student) {
   const attendances = await Attendance.find({
      student: student,
      classroom: classroom,
   });
   for (let x = 0; x < attendances.length; x++) {
      await Attendance.findOneAndRemove({ _id: attendances[x]._id });
   }

   const grades = await Grade.find({
      student: student,
      classroom: classroom,
   });
   for (let x = 0; x < grades.length; x++) {
      await Grade.findOneAndRemove({ _id: grades[x]._id });
   }
}

module.exports = router;
