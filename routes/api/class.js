const express = require("express");
const router = express.Router();
const moment = require("moment");
const auth = require("../../middleware/auth");
const adminAuth = require("../../middleware/adminAuth");
const { check, validationResult } = require("express-validator");
const path = require("path");
const pdf = require("html-pdf");
const pdfTemplate = require("../../templates/list");
const pdfTemplate2 = require("../../templates/classInfo");

const Class = require("../../models/Class");
const User = require("../../models/User");
const Enrollment = require("../../models/Enrollment");
const Attendance = require("../../models/Attendance");
const Grade = require("../../models/Grade");

//@route    GET api/class
//@desc     Get all classes || with filter
//@access   Private
router.get("/", [auth], async (req, res) => {
   try {
      const date = new Date();
      let classes;
      if (Object.entries(req.query).length === 0) {
         classes = await Class.find({ year: date.getFullYear() })
            .populate({
               path: "category",
               model: "category",
               select: "name",
            })
            .populate({
               path: "teacher",
               model: "user",
               select: ["lastname", "name"],
            });
      } else {
         let filter = {
            ...(req.query.teacher && {
               teacher: req.query.teacher,
            }),
            ...(req.query.category && {
               category: req.query.category,
            }),
            year: date.getFullYear(),
         };

         classes = await Class.find(
            (filter.teacher || filter.category) && filter
         )
            .populate({
               path: "category",
               model: "category",
               select: "name",
            })
            .populate({
               path: "teacher",
               model: "user",
               select: ["lastname", "name"],
            });
      }

      if (classes.length === 0) {
         return res
            .status(400)
            .json({ msg: "No se encontraron clases con dichas descripciones" });
      }

      res.json(classes);
   } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
   }
});

//@route    GET api/class/:class_id
//@desc     Get a class
//@access   Private
router.get("/:class_id", auth, async (req, res) => {
   try {
      let classinfo = await Class.findOne({ _id: req.params.class_id })
         .populate("category", ["name"])
         .populate("teacher", ["name", "lastname"]);
      if (!classinfo) {
         return res
            .status(400)
            .json({ msg: "No se encontró una clase con dichas descripciones" });
      }

      res.json(classinfo);
   } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
   }
});

//@route    GET api/class/user/:id
//@desc     Get logged user's class
//@access   Private
router.get("/user/:id", auth, async (req, res) => {
   try {
      const date = new Date();
      let user = await User.findOne({ _id: req.params.id });
      let classinfo = await Class.findOne({
         _id: user.classroom,
         year: date.getFullYear(),
      })
         .populate("category", ["name"])
         .populate("teacher", ["name", "lastname"]);
      if (!classinfo) {
         return res
            .status(400)
            .json({ msg: "No se encontró una clase con dichas descripciones" });
      }

      res.json(classinfo);
   } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
   }
});

//@route    POST api/class/create-list
//@desc     Create a pdf of classes
//@access   Private
router.post("/create-list", (req, res) => {
   const name = "reports/classes.pdf";

   const classes = req.body;

   let htmlstring = "";

   for (let x = 0; x < classes.length; x++) {
      const teacher =
         "<td>" +
         classes[x].teacher.lastname +
         ", " +
         classes[x].teacher.name +
         "</td>";
      const category = "<td>" + classes[x].category.name + "</td>";
      const day1 = "<td>" + (classes[x].day1 ? classes[x].day1 : "") + "</td>";
      const hourin1 =
         "<td>" +
         (classes[x].hourin1
            ? moment(classes[x].hourin1).format("HH:mm")
            : "") +
         "</td>";
      const hourout1 =
         "<td>" +
         (classes[x].hourout1
            ? moment(classes[x].hourout1).format("HH:mm")
            : "") +
         "</td>";
      const day2 = "<td>" + (classes[x].day2 ? classes[x].day2 : "") + "</td>";
      const hourin2 =
         "<td>" +
         (classes[x].hourin2
            ? moment(classes[x].hourin2).format("HH:mm")
            : "") +
         "</td>";
      const hourout2 =
         "<td>" +
         (classes[x].hourout2
            ? moment(classes[x].hourout2).format("HH:mm")
            : "") +
         "</td>";

      htmlstring +=
         "<tr>" +
         teacher +
         category +
         day1 +
         hourin1 +
         hourout1 +
         day2 +
         hourin2 +
         hourout2 +
         "</tr>";
   }

   const table =
      "<th>Profesor</th> <th>Categoría</th> <th>Día 1</th> <th>Comienzo</th> <th>Fin</th> <th>Día 2</th> <th>Comienzo</th> <th>Fin</th>";

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
      pdfTemplate(css, img, "cursos", table, htmlstring),
      options
   ).toFile(name, (err) => {
      if (err) {
         res.send(Promise.reject());
      }

      res.send(Promise.resolve());
   });
});

//@route    GET api/class/list/fetch-list
//@desc     Get the pdf of classes
//@access   Private
router.get("/list/fetch-list", (req, res) => {
   res.sendFile(path.join(__dirname, "../../reports/classes.pdf"));
});

//@route    POST api/class/oneclass/create-list
//@desc     Create a pdf of a class
//@access   Private
router.post("/oneclass/create-list", (req, res) => {
   const name = "reports/class.pdf";

   const classInfo = req.body;

   let tbody = "";

   for (let x = 0; x < classInfo.students.length; x++) {
      const studentnumber =
         "<td>" + classInfo.students[x].studentnumber + "</td>";
      const studentname =
         "<td>" +
         classInfo.students[x].lastname +
         ", " +
         classInfo.students[x].name +
         "</td>";
      const dob =
         "<td>" +
         (classInfo.students[x].dob
            ? moment(classInfo.students[x].dob).format("DD/MM/YY")
            : "") +
         "</td>";
      const cel =
         "<td>" +
         (classInfo.students[x].cel ? classInfo.students[x].cel : "") +
         "</td>";

      tbody += "<tr>" + studentnumber + studentname + dob + cel + "</tr>";
   }

   const img = path.join(
      "file://",
      __dirname,
      "../../templates/assets/logo.png"
   );
   const css = path.join(
      "file://",
      __dirname,
      "../../templates/classInfo/style.css"
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

   pdf.create(pdfTemplate2(css, img, tbody, classInfo), options).toFile(
      name,
      (err) => {
         if (err) {
            res.send(Promise.reject());
         }

         res.send(Promise.resolve());
      }
   );
});

//@route    GET api/class/oneclass/fetch-list
//@desc     Get the pdf of a class
//@access   Private
router.get("/oneclass/fetch-list", (req, res) => {
   res.sendFile(path.join(__dirname, "../../reports/class.pdf"));
});

//@route    POST api/class/blank/create-list
//@desc     Create a pdf of the class  for attendances and grades
//@access   Private
router.post("/blank/create-list", (req, res) => {
   const name = "reports/blank.pdf";

   const classInfo = req.body;

   let tbody = "";

   const columns = 23;

   let thead = "<tr><th>Nombre</th>";
   for (let y = 0; y < columns; y++) {
      thead += "<th class='blank'></th>";
   }

   thead += "</tr>";

   for (let x = 0; x < classInfo.students.length; x++) {
      tbody +=
         "<tr> <td class='name'>" +
         classInfo.students[x].lastname +
         ", " +
         classInfo.students[x].name +
         "</td>";

      for (let y = 0; y < columns; y++) {
         tbody += "<td></td>";
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
      "../../templates/classInfo/style.css"
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

   pdf.create(pdfTemplate2(css, img, tbody, classInfo, thead), options).toFile(
      name,
      (err) => {
         if (err) {
            res.send(Promise.reject());
         }

         res.send(Promise.resolve());
      }
   );
});

//@route    GET api/attendance/blank/fetch-list
//@desc     Get the pdf of the class  for attendances and grades
//@access   Private
router.get("/blank/fetch-list", (req, res) => {
   res.sendFile(path.join(__dirname, "../../reports/blank.pdf"));
});

//@route    POST api/class
//@desc     Register a class
//@access   Private
router.post(
   "/",
   [
      auth,
      adminAuth,
      check("teacher", "El profesor es necesario").not().isEmpty(),
      check("category", "La categoría es necesaria").not().isEmpty(),
   ],
   async (req, res) => {
      let {
         teacher,
         category,
         classroom,
         day1,
         day2,
         hourin1,
         hourin2,
         hourout1,
         hourout2,
         students,
      } = req.body;

      const date = new Date();
      const year = date.getFullYear();

      let errors = [];
      const errorsResult = validationResult(req);
      if (!errorsResult.isEmpty()) {
         errors = errorsResult.array();
         return res.status(400).json({ errors });
      }

      try {
         let hours = [hourin1, hourin2, hourout1, hourout2];
         for (let x = 0; x < hours.length; x++) {
            if (hours[x]) {
               const date = moment("2000-01-01 " + hours[x]).format(
                  "YYYY-MM-DD HH:mm"
               );
               hours[x] = date;
            }
         }

         let data = {
            teacher,
            category,
            ...(classroom && { classroom: classroom }),
            ...(day1 && { day1: day1 }),
            ...(day2 && { day2: day2 }),
            ...(hours[0] && { hourin1: hours[0] }),
            ...(hours[1] && { hourin2: hours[1] }),
            ...(hours[2] && { hourout1: hours[2] }),
            ...(hours[3] && { hourout2: hours[3] }),
            year,
         };

         const classinfo = new Class(data);

         await classinfo.save();

         let lastClass = await Class.find().sort({ $natural: -1 }).limit(1);
         const newClass = lastClass[0];

         for (let x = 0; x < students.length; x++) {
            await Enrollment.findOneAndUpdate(
               {
                  student: students[x]._id,
               },
               { "classroom._id": newClass._id }
            );
         }

         res.json(newClass);
      } catch (err) {
         console.error(err.message);
         return res.status(500).send("Server Error");
      }
   }
);

//@route    PUT api/class/:id
//@desc     Update a class
//@access   Private
router.put(
   "/:id",
   [
      auth,
      adminAuth,
      check("teacher", "El profesor es necesario").not().isEmpty(),
   ],
   async (req, res) => {
      let {
         teacher,
         classroom,
         day1,
         day2,
         hourin1,
         hourin2,
         hourout1,
         hourout2,
         students,
      } = req.body;

      let errors = [];
      const errorsResult = validationResult(req);
      if (!errorsResult.isEmpty()) {
         errors = errorsResult.array();
         return res.status(400).json({ errors });
      }

      try {
         let hours = [hourin1, hourin2, hourout1, hourout2];
         for (let x = 0; x < hours.length; x++) {
            if (hours[x]) {
               const date = moment("2000-01-01 " + hours[x]).format(
                  "YYYY-MM-DD HH:mm"
               );
               hours[x] = date;
            }
         }

         let data = {
            teacher,
            ...(classroom && { classroom: classroom }),
            ...(day1 && { day1: day1 }),
            ...(day2 && { day2: day2 }),
            ...(hours[0] && { hourin1: hours[0] }),
            ...(hours[1] && { hourin2: hours[1] }),
            ...(hours[2] && { hourout1: hours[2] }),
            ...(hours[3] && { hourout2: hours[3] }),
         };

         let toDelete = await Enrollment.find({
            "classroom._id": req.params.id,
         });

         for (let x = 0; x < students.length; x++) {
            await Enrollment.findOneAndUpdate(
               {
                  student: students[x]._id,
               },
               { "classroom._id": req.params.id }
            );

            toDelete = toDelete.filter(
               (enroll) => enroll.student != students[x]._id
            );
         }

         for (let x = 0; x < toDelete.length; x++) {
            await Enrollment.findOneAndUpdate(
               {
                  student: toDelete[x].student,
               },
               { "classroom._id": null }
            );

            const attendances = await Attendance.find({
               user: toDelete[x].student,
               classroom: req.params.id,
            });
            for (let y = 0; y < attendances.length; y++) {
               await Attendance.findOneAndDelete({ _id: attendances[y] });
            }

            const grades = await Grade.find({
               student: toDelete[x].student,
               classroom: req.params.id,
            });
            for (let y = 0; y < grades.length; y++) {
               await Attendance.findOneAndDelete({ _id: grades[y] });
            }
         }

         const classinfo = await Class.findOneAndUpdate(
            { _id: req.params.id },
            { $set: data },
            { new: true }
         );

         res.json(classinfo);
      } catch (err) {
         console.error(err.message);
         return res.status(500).send("Server Error");
      }
   }
);

//@route    DELETE api/class/:id
//@desc     Delete a class
//@access   Private
router.delete("/:id", [auth, adminAuth], async (req, res) => {
   try {
      //Remove user
      await Class.findOneAndRemove({ _id: req.params.id });

      //Delete the property classroom form students
      const students = await User.find({ classroom: req.params.id });

      for (let x = 0; x < students.length; x++) {
         await Enrollment.findOneAndUpdate(
            {
               student: students[x]._id,
            },
            { "classroom._id": null }
         );

         const attendances = await Attendance.find({
            user: toDelete[x].student,
            classroom: req.params.id,
         });
         for (let y = 0; y < attendances.length; y++) {
            await Attendance.findOneAndDelete({ _id: attendances[y] });
         }

         const grades = await Grade.find({
            student: toDelete[x].student,
            classroom: req.params.id,
         });
         for (let y = 0; y < grades.length; y++) {
            await Attendance.findOneAndDelete({ _id: grades[y] });
         }
      }

      res.json({ msg: "Class deleted" });
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
   }
});

module.exports = router;
