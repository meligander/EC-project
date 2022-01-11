const router = require("express").Router();
const { check, validationResult } = require("express-validator");

//Middlewares
const adminAuth = require("../../middleware/adminAuth");
const auth = require("../../middleware/auth");

//Models
const Enrollment = require("../../models/Enrollment");
const Installment = require("../../models/Installment");
const Attendance = require("../../models/Attendance");
const Grade = require("../../models/Grade");
const Category = require("../../models/Category");

//@route    GET /api/enrollment
//@desc     get all enrollments || with filter
//@access   Private && Admin
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
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    GET /api/enrollment/average
//@desc     get all student's average
//@access   Private && Admin
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
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    GET /api/enrollment/attendance
//@desc     get all student's attendance
//@access   Private && Admin
router.get("/attendance", [auth, adminAuth], async (req, res) => {
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
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    GET /api/enrollment/one/:id
//@desc     get one enrollment
//@access   Private && Admin
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
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    GET /api/enrollment/year
//@desc     get year's enrollments
//@access   Private && Admin
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
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    POST /api/enrollment
//@desc     Add an enrollment
//@access   Private && Admin
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
            if (Number(number) === 3 && discount === 10) half = value / 2;
         }

         const amount = 13 - number;
         for (let x = 0; x < amount; x++) {
            installment = new Installment({
               number,
               year,
               student,
               value: Number(number) === 3 ? half : value,
               expired: false,
               enrollment: enrollment.id,
            });

            number++;

            await installment.save();
         }

         res.json({ msg: "Enrollment Registered" });
      } catch (err) {
         console.error(err.message);
         res.status(500).json({ msg: "Server Error" });
      }
   }
);

//@route    PUT /api/enrollment/:id
//@desc     Update the category of the enrollment
//@access   Private && Admin
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
               if (Number(number) === 3 && discount === 10) half = value / 2;
            }

            const amount = 13 - number;
            for (let x = 0; x < amount; x++) {
               const installment = await Installment.findOne({
                  enrollment: req.params.id,
                  number,
                  value: { $ne: 0 },
               });
               if (installment.halfPayed || !installment) continue;

               await Installment.findOneAndUpdate(
                  { _id: installment._id },
                  { value: Number(number) === 3 ? half : value }
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
         res.status(500).json({ msg: "Server Error" });
      }
   }
);

//@route    DELETE /api/enrollment/:id
//@desc     Delete an enrollment
//@access   Private && Admin
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
      res.status(500).json({ msg: "Server Error" });
   }
});

const deleteInfoRelated = async (classroom, student) => {
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
};

module.exports = router;
