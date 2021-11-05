const express = require("express");
const moment = require("moment");
const { check, validationResult } = require("express-validator");
const path = require("path");
const pdf = require("html-pdf");
const router = express.Router();

//PDF Templates
const pdfTemplate = require("../../templates/list");
const pdfTemplate2 = require("../../templates/classInfo");

//Middlewares
const adminAuth = require("../../middleware/adminAuth");
const auth = require("../../middleware/auth");

//Models
const Class = require("../../models/Class");
const Enrollment = require("../../models/Enrollment");
const Attendance = require("../../models/Attendance");
const Grade = require("../../models/Grade");
const Post = require("../../models/Post");
const classInfo = require("../../templates/classInfo");

//@route    GET /api/class
//@desc     Get all classes || with filter
//@access   Private
router.get("/", auth, async (req, res) => {
   try {
      const date = new Date();
      let classes;

      let filter = {
         ...(req.query.teacher && {
            teacher: req.query.teacher,
         }),
         ...(req.query.category && {
            category: req.query.category,
         }),
         year: date.getFullYear(),
      };

      classes = await Class.find(filter)
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

      if (classes.length === 0) {
         return res
            .status(400)
            .json({ msg: "No se encontraron clases con dichas descripciones" });
      }

      classes = sortArray(classes);

      res.json(classes);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    GET /api/class/:class_id
//@desc     Get a class
//@access   Private
router.get("/:class_id", auth, async (req, res) => {
   try {
      let classinfo = await Class.findOne({ _id: req.params.class_id })
         .populate("category", ["name"])
         .populate("teacher", ["name", "lastname"]);

      if (!classinfo)
         return res
            .status(400)
            .json({ msg: "No se encontró una clase con dichas descripciones" });

      const enrollments = await Enrollment.find({
         "classroom._id": req.params.class_id,
      }).populate({
         path: "student",
         model: "user",
         select: "-password",
      });

      classinfo.students = enrollments
         .map((item) => item.student)
         .sort((a, b) => {
            if (a.lastname > b.lastname) return 1;
            if (a.lastname < b.lastname) return -1;

            if (a.name > b.name) return 1;
            if (a.name < b.name) return -1;
         });

      res.json(classinfo);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    GET /api/class/student/:id
//@desc     Get a student's class
//@access   Private
router.get("/student/:id", auth, async (req, res) => {
   try {
      const date = new Date();

      let enroll = await Enrollment.findOne({
         student: req.params.id,
         year: date.getFullYear(),
      });

      let classinfo;
      if (enroll) {
         classinfo = await Class.findOne({
            _id: enroll.classroom._id,
            year: date.getFullYear(),
         })
            .populate("category", ["name"])
            .populate("teacher", ["name", "lastname"]);
      }

      if (!classinfo) {
         return res
            .status(400)
            .json({ msg: "No se encontró una clase con dichas descripciones" });
      }

      res.json(classinfo);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    GET /api/class/list/fetch-list
//@desc     Get the pdf of classes
//@access   Private
router.get("/list/fetch-list", auth, (req, res) => {
   res.sendFile(path.join(__dirname, "../../reports/classes.pdf"));
});

//@route    GET /api/class/oneclass/fetch-list
//@desc     Get the pdf of a class
//@access   Private
router.get("/oneclass/fetch-list", auth, (req, res) => {
   res.sendFile(path.join(__dirname, "../../reports/class.pdf"));
});

//@route    GET /api/attendance/blank/fetch-list
//@desc     Get the pdf of the class  for attendances and grades
//@access   Private
router.get("/blank/fetch-list", auth, (req, res) => {
   res.sendFile(path.join(__dirname, "../../reports/blank.pdf"));
});

//@route    POST /api/class
//@desc     Register a class
//@access   Private && Admin
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
               const hour = hours[x].substring(0, 2);
               const minutes = hours[x].substring(3);

               const date = new Date();

               date.setUTCHours(hour, minutes, 0);

               hours[x] = date;
               hours[x] = date;
            }
         }

         let data = {
            teacher,
            category,
            ...(classroom && { classroom }),
            ...(day1 && { day1 }),
            ...(day2 && { day2 }),
            ...(hours[0] && { hourin1: hours[0] }),
            ...(hours[1] && { hourin2: hours[1] }),
            ...(hours[2] && { hourout1: hours[2] }),
            ...(hours[3] && { hourout2: hours[3] }),
            year,
         };

         const classinfo = new Class(data);

         await classinfo.save();

         let lastClass = await Class.find()
            .sort({ $natural: -1 })
            .limit(1)
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
         const newClass = lastClass[0];
         for (let x = 0; x < students.length; x++) {
            await Enrollment.findOneAndUpdate(
               {
                  student: students[x]._id,
                  year,
               },
               {
                  classroom: {
                     _id: newClass._id,
                     periodAverage: [],
                     periodAbsence: [],
                  },
               }
            );
         }

         res.json(newClass);
      } catch (err) {
         console.error(err.message);
         res.status(500).json({ msg: "Server Error" });
      }
   }
);

//@route    POST /api/class/create-list
//@desc     Create a pdf of classes
//@access   Private
router.post("/create-list", auth, (req, res) => {
   const name = path.join(__dirname, "../../reports/classes.pdf");

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
            ? moment(classes[x].hourin1).utc().format("HH:mm")
            : "") +
         "</td>";
      const hourout1 =
         "<td>" +
         (classes[x].hourout1
            ? moment(classes[x].hourout1).utc().format("HH:mm")
            : "") +
         "</td>";
      const day2 = "<td>" + (classes[x].day2 ? classes[x].day2 : "") + "</td>";
      const hourin2 =
         "<td>" +
         (classes[x].hourin2
            ? moment(classes[x].hourin2).utc().format("HH:mm")
            : "") +
         "</td>";
      const hourout2 =
         "<td>" +
         (classes[x].hourout2
            ? moment(classes[x].hourout2).utc().format("HH:mm")
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

   try {
      pdf.create(
         pdfTemplate(css, img, "cursos", table, htmlstring),
         options
      ).toFile(name, (err) => {
         if (err) res.send(Promise.reject());
         else res.send(Promise.resolve());
      });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "PDF Error" });
   }
});

//@route    POST /api/class/oneclass/create-list
//@desc     Create a pdf of a class
//@access   Private
router.post("/oneclass/create-list", auth, (req, res) => {
   const name = path.join(__dirname, "../../reports/class.pdf");

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
            ? moment(classInfo.students[x].dob).utc().format("DD/MM/YY")
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

   try {
      pdf.create(pdfTemplate2(css, img, tbody, classInfo), options).toFile(
         name,
         (err) => {
            if (err) res.send(Promise.reject());
            else res.send(Promise.resolve());
         }
      );
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "PDF Error" });
   }
});

//@route    POST /api/class/blank/create-list
//@desc     Create a pdf of the class  for attendances and grades
//@access   Private
router.post("/blank/create-list", auth, (req, res) => {
   const name = path.join(__dirname, "../../reports/blank.pdf");

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

   try {
      pdf.create(
         pdfTemplate2(css, img, tbody, classInfo, thead),
         options
      ).toFile(name, (err) => {
         if (err) res.send(Promise.reject());
         else res.send(Promise.resolve());
      });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "PDF Error" });
   }
});

//@route    PUT /api/class/:id
//@desc     Update a class
//@access   Private && Admin
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

      const date = new Date();
      const year = date.getFullYear();

      try {
         let hours = [hourin1, hourin2, hourout1, hourout2];
         for (let x = 0; x < hours.length; x++) {
            if (hours[x]) {
               const hour = hours[x].substring(0, 2);
               const minutes = hours[x].substring(3);

               const date = new Date();

               date.setUTCHours(hour, minutes, 0);

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
                  year,
               },
               {
                  classroom: {
                     _id: req.params.id,
                     periodAverage: [],
                     periodAbsence: [],
                  },
               }
            );

            toDelete = toDelete.filter(
               (enroll) => enroll.student != students[x]._id
            );
         }

         await deleteInfoRelated(null, toDelete);

         const classinfo = await Class.findOneAndUpdate(
            { _id: req.params.id },
            { $set: data },
            { new: true }
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

         res.json(classinfo);
      } catch (err) {
         console.error(err.message);
         res.status(500).json({ msg: "Server Error" });
      }
   }
);

//@route    DELETE /api/class/:id
//@desc     Delete a class
//@access   Private && Admin
router.delete("/:id", [auth, adminAuth], async (req, res) => {
   try {
      //Remove user
      await Class.findOneAndRemove({ _id: req.params.id });

      //Delete the property classroom form students enrollments
      await deleteInfoRelated(req.params.id);

      res.json({ msg: "Class deleted" });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

const deleteInfoRelated = async (classroom, enrollmentsToDelete) => {
   let enrollments = [];
   if (classroom) {
      enrollments = await Enrollment.find({
         "classroom._id": classroom,
      });
      const attendances = await Attendance.find({ classroom });
      for (let x = 0; x < attendances.length; x++) {
         await Attendance.findOneAndDelete({ _id: attendances[x] });
      }

      const grades = await Grade.find({ classroom });
      for (let x = 0; x < grades.length; x++) {
         await Grade.findOneAndDelete({ _id: grades[x] });
      }

      const posts = await Post.find({ classroom });
      for (let x = 0; x < posts.length; x++) {
         await Post.findOneAndDelete({ _id: posts[x] });
      }
   } else {
      enrollments = enrollmentsToDelete;
   }

   for (let x = 0; x < enrollments.length; x++) {
      await Enrollment.findOneAndUpdate(
         { _id: enrollments[x]._id },
         { "classroom._id": null }
      );

      if (enrollmentsToDelete) {
         const attendances = await Attendance.find({
            student: enrollments[x].student,
         });
         for (let y = 0; y < attendances.length; y++) {
            await Attendance.findOneAndDelete({ _id: attendances[y] });
         }

         const grades = await Grade.find({ student: enrollments[x].student });
         for (let y = 0; y < grades.length; y++) {
            await Grade.findOneAndDelete({ _id: grades[y] });
         }
      }
   }
};

const sortArray = (array) => {
   const sortedArray = array.sort((a, b) => {
      if (a.teacher.lastname > b.teacher.lastname) return 1;
      if (a.teacher.lastname < b.teacher.lastname) return -1;

      if (a.teacher.name > b.teacher.name) return 1;
      if (a.teacher.name < b.teacher.name) return -1;

      if (a.category.name > b.category.name) return 1;
      if (a.category.name < b.category.name) return -1;
   });

   return sortedArray;
};

module.exports = router;
