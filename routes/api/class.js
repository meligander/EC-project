const router = require("express").Router();
const { check, validationResult } = require("express-validator");

//Middlewares
const adminAuth = require("../../middleware/adminAuth");
const auth = require("../../middleware/auth");

//Models
const Class = require("../../models/Class");
const Enrollment = require("../../models/Enrollment");
const Attendance = require("../../models/Attendance");
const Grade = require("../../models/Grade");

//@route    GET /api/class
//@desc     Get all classes || with filter
//@access   Private
router.get("/", auth, async (req, res) => {
   try {
      const { teacher, category, year } = req.query;
      let classes;

      let filter = {
         ...(teacher && {
            teacher,
         }),
         ...(category && {
            category,
         }),
         year: year ? year : new Date().getFullYear(),
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
         .populate("teacher", ["name", "lastname"])
         .lean();

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
