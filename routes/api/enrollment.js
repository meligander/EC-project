const router = require("express").Router();
const addHours = require("date-fns/addHours");
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
router.get("/", auth, async (req, res) => {
   try {
      let enrollments;
      const year = new Date().getFullYear();

      if (Object.entries(req.query).length === 0) {
         enrollments = await Enrollment.find({
            year: new Date().getFullYear(),
            date: { $gte: new Date(`${year - 1}-10-01`) },
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
         const {
            startDate,
            endDate,
            category,
            year,
            student,
            name,
            lastname,
            classroom,
         } = req.query;

         const date = {
            ...(startDate && { $gte: addHours(new Date(startDate), 3) }),
            ...(endDate && { $lt: addHours(new Date(endDate), 27) }),
         };

         enrollments = await Enrollment.find({
            date:
               startDate || endDate
                  ? date
                  : { $gte: new Date(`${year - 1}-10-01`) },
            ...(category && { category: category }),
            ...(year && { year }),
            ...(student && { student: student }),
            ...(classroom === false && { classroom: { $ne: null } }),
         })
            .populate({
               path: "student",
               model: "user",
               select: ["name", "lastname", "studentnumber"],
               ...((name || lastname) && {
                  match: {
                     ...(name && {
                        name: { $regex: `.*${name}.*`, $options: "i" },
                     }),
                     ...(lastname && {
                        lastname: {
                           $regex: `.*${lastname}.*`,
                           $options: "i",
                        },
                     }),
                  },
               }),
            })
            .populate({
               path: "category",
               model: "category",
            })
            .sort({ date: !classroom ? -1 : 1 });

         if (name || lastname)
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
      const year = date.getFullYear();

      let enrollments = await Enrollment.find({ year: year + 1 });
      if (enrollments.length === 0)
         enrollments = await Enrollment.find({ year });

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

      const todayMonth = new Date().getMonth();
      const todayYear = new Date().getFullYear();

      try {
         let data = { student, year };

         let enrollment = await Enrollment.findOne(data);

         if (enrollment)
            return res.status(400).json({
               msg: "El alumno ya está inscripto en el año seleccionado",
            });

         data = {
            ...data,
            category,
         };

         enrollment = new Enrollment(data);

         await enrollment.save();

         enrollment = await Enrollment.findOne({ _id: enrollment._id })
            .populate({ path: "category" })
            .populate({
               path: "student",
               model: "user",
               select: "-password",
            });

         let number = 0;
         const enrollmentCategory = await Category.findOne({
            name: "Inscripción",
         });
         let installment = await Installment.findOne({ student, year, number });

         if (!installment) {
            installment = new Installment({
               ...data,
               number,
               value: enrollmentCategory.value,
               enrollment: enrollment._id,
               status: "debt",
            });
            installment.save();
         }

         if (month !== 0) number = Number(month);
         else number = 3;

         const discount = enrollment.student.discount;
         let value = enrollment.category.value;

         if (discount && discount !== 0)
            value = value - (value * discount) / 100;

         const half = discount !== 50 ? value / 2 : value;

         const amount =
            (enrollment.category.name !== "Kinder" ? 13 : 12) - number;
         for (let x = 0; x < amount; x++) {
            installment = await Installment.findOne({ student, year, number });
            if (!installment) {
               installment = new Installment({
                  ...data,
                  number,
                  value:
                     Math.ceil(
                        ((number === 3 ? half : value) + Number.EPSILON) / 100
                     ) * 100,
                  status:
                     todayYear > year ||
                     (todayYear === year && todayMonth >= number)
                        ? "debt"
                        : "valid",
                  enrollment: enrollment.id,
               });
               await installment.save();
            }

            number++;
         }

         res.json(enrollment);
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
      const { category, month, year } = req.body;

      let errors = [];
      const errorsResult = validationResult(req);
      if (!errorsResult.isEmpty()) {
         errors = errorsResult.array();
         return res.status(400).json({ errors });
      }

      const todayMonth = new Date().getMonth();
      const todayYear = new Date().getFullYear();

      let enrollment;

      try {
         enrollment = await Enrollment.findOne({ _id: req.params.id }).populate(
            {
               path: "category",
               model: "category",
            }
         );

         if (enrollment.category._id.toString() !== category) {
            await deleteInfoRelated({
               classroom: enrollment.classroom,
               student: enrollment.student,
            });

            enrollment = await Enrollment.findOneAndUpdate(
               { _id: req.params.id },
               {
                  category: category,
                  classroom: null,
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
            if (month !== 0) number = Number(month);
            else number = 3;

            const discount = enrollment.student.discount;
            let value = enrollment.category.value;

            if (discount && discount !== 0)
               value = value - (value * discount) / 100;

            const half = discount !== 50 ? value / 2 : value;

            const amount = 13 - number;
            for (let x = 0; x < amount; x++) {
               const installment = await Installment.findOne({
                  enrollment: req.params.id,
                  number,
                  value: { $ne: 0 },
                  updatable: true,
                  status:
                     todayYear > year ||
                     (todayYear === year && todayMonth >= number)
                        ? "debt"
                        : "valid",
               });
               if (installment)
                  await Installment.findOneAndUpdate(
                     { _id: installment._id },
                     { value: number === 3 ? half : value }
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

      await installments.forEach(async (inst) => {
         if (inst.value !== 0 && inst.updatable)
            await Installment.findOneAndRemove({ _id: inst._id });
      });

      await deleteInfoRelated({
         classroom: enrollment.classroom,
         student: enrollment.student,
      });

      res.json({ msg: "Enrollment deleted" });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@desc Function to delete all the info related to an enrollment
const deleteInfoRelated = async (data) => {
   const attendances = await Attendance.find(data);
   const grades = await Grade.find(data);

   await attendances.forEach(
      async (item) => await Attendance.findOneAndRemove({ _id: item._id })
   );

   await grades.forEach(
      async (item) => await Grade.findOneAndRemove({ _id: item._id })
   );
};

module.exports = router;
