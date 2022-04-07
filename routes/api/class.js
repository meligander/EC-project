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
         ...(teacher && { teacher }),
         ...(category && { category }),
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

      classes = classes.sort((a, b) => {
         if (a.teacher.lastname > b.teacher.lastname) return 1;
         if (a.teacher.lastname < b.teacher.lastname) return -1;

         if (a.teacher.name > b.teacher.name) return 1;
         if (a.teacher.name < b.teacher.name) return -1;
      });

      if (classes.length === 0)
         return res
            .status(400)
            .json({ msg: "No se encontraron clases con dichas descripciones" });

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
      const { class_id } = req.params;

      const classinfo = await Class.findOne({ _id: class_id })
         .populate("category", ["name"])
         .populate("teacher", ["name", "lastname"])
         .lean();

      if (!classinfo)
         return res
            .status(400)
            .json({ msg: "No se encontró una clase con dichas descripciones" });

      const enrollments = await Enrollment.find({
         classroom: class_id,
      }).populate({
         path: "student",
         model: "user",
         select: "-password",
      });

      const students = enrollments
         .map((item) => item.student)
         .sort((a, b) => {
            if (a.lastname > b.lastname) return 1;
            if (a.lastname < b.lastname) return -1;

            if (a.name > b.name) return 1;
            if (a.name < b.name) return -1;
         });

      res.json({ ...classinfo, students });
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

      let enrollment = await Enrollment.find({
         student: req.params.id,
         year: date.getFullYear(),
      })
         .sort({ $natural: -1 })
         .limit(1);
      enrollment = enrollment[0];

      if (!enrollment) {
         return res
            .status(400)
            .json({ msg: "No se encontró una clase con dichas descripciones" });
      }

      let classinfo;

      if (enrollment) {
         classinfo = await Class.findOne({
            _id: enrollment.classroom,
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

      const enrollments = await Enrollment.find({
         classroom: enrollment.classroom,
      }).populate({
         path: "student",
         model: "user",
         select: "-password",
      });

      const students = enrollments
         .map((item) => item.student)
         .sort((a, b) => {
            if (a.lastname > b.lastname) return 1;
            if (a.lastname < b.lastname) return -1;

            if (a.name > b.name) return 1;
            if (a.name < b.name) return -1;
         });

      res.json({ ...classinfo.toJSON(), students });
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
      const { hourin1, hourin2, hourout1, hourout2, students, category } =
         req.body;

      const year = new Date().getFullYear();

      let errors = [];
      const errorsResult = validationResult(req);
      if (!errorsResult.isEmpty()) {
         errors = errorsResult.array();
         return res.status(400).json({ errors });
      }

      try {
         let data = {
            ...req.body,
            ...(hourin1 && { hourin1: getTime(hourin1) }),
            ...(hourin2 && { hourin2: getTime(hourin2) }),
            ...(hourout1 && { hourout1: getTime(hourout1) }),
            ...(hourout2 && { hourout2: getTime(hourout2) }),
            year,
         };

         let classinfo = new Class(data);

         await classinfo.save();

         lastClass = await Class.findOne({ _id: classinfo._id })
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

         await students.forEach(
            async (student) =>
               await Enrollment.findOneAndUpdate(
                  {
                     category,
                     student: student._id,
                     year,
                  },
                  {
                     $set: {
                        classroom: lastClass._id,
                     },
                  }
               )
         );

         res.json(lastClass);
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
      let { hourin1, hourin2, hourout1, hourout2, students, category } =
         req.body;

      let errors = [];
      const errorsResult = validationResult(req);
      if (!errorsResult.isEmpty()) {
         errors = errorsResult.array();
         return res.status(400).json({ errors });
      }

      try {
         let data = {
            ...req.body,
            ...(hourin1 && { hourin1: getTime(hourin1) }),
            ...(hourin2 && { hourin2: getTime(hourin2) }),
            ...(hourout1 && { hourout1: getTime(hourout1) }),
            ...(hourout2 && { hourout2: getTime(hourout2) }),
         };

         let toDelete = await Enrollment.find({
            classroom: req.params.id,
         });

         for (let x = 0; x < students.length; x++) {
            await Enrollment.findOneAndUpdate(
               {
                  category,
                  student: students[x]._id,
                  year: new Date().getFullYear(),
               },
               {
                  $set: {
                     classroom: req.params.id,
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
      //Remove class
      await Class.findOneAndRemove({ _id: req.params.id });

      //Delete the property classroom form students enrollments
      await deleteInfoRelated(req.params.id);

      res.json({ msg: "Class deleted" });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@desc Function to delete the info related to a class
const deleteInfoRelated = async (classroom, enrollmentsToDelete) => {
   let attendances = [];
   let grades = [];

   const enrollments = classroom
      ? await Enrollment.find({
           classroom: classroom,
        })
      : enrollmentsToDelete;

   for (let x = 0; x < enrollments.length; x++) {
      await Enrollment.findOneAndUpdate(
         { _id: enrollments[x]._id },
         { classroom: null }
      );

      attendances = [
         ...attendances,
         ...(await Attendance.find({
            student: enrollments[x].student,
            classroom: enrollments[x].classroom,
         })),
      ];

      grades = [
         ...grades,
         ...(await Grade.find({
            student: enrollments[x].student,
            classroom: enrollments[x].classroom,
         })),
      ];
   }

   attendances.forEach(
      async (item) => await Attendance.findOneAndDelete({ _id: item._id })
   );

   grades.forEach(
      async (item) => await Grade.findOneAndDelete({ _id: item._id })
   );
};

//@desc Function to get the date with the correct time and hour in UTC
const getTime = (time) => {
   const hour = time.substring(0, 2);
   const minute = time.substring(3);

   return new Date(Date.UTC(2000, 0, 01, hour, minute, 0, 0));
};

module.exports = router;
