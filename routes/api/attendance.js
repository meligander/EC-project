const router = require("express").Router();
const { check, validationResult } = require("express-validator");

//Middlewares
const auth = require("../../middleware/auth");
const adminAuth = require("../../middleware/adminAuth");

//Models
const Attendance = require("../../models/Attendance");
const Enrollment = require("../../models/Enrollment");

//@route    GET /api/attendance/best
//@desc     get students with less inassistances
//@access   Private && Admin
router.get("/best", [auth, adminAuth], async (req, res) => {
   try {
      let { quantity, year, category } = req.query;

      quantity = quantity ? quantity : 4;

      const thisYear = new Date().getFullYear();
      let totalAtt = [];

      const attendances = await Attendance.find({
         student: { $exists: true },
         date: {
            $gte: new Date(Date.UTC(year ? year : thisYear, 0, 01, 0, 0, 0)),
            $lte: new Date(Date.UTC(year ? year : thisYear, 11, 31, 0, 0, 0)),
         },
      })
         .populate({
            path: "classroom",
            model: "class",
            populate: {
               path: "category",
            },
            ...(category && {
               match: { _id: category },
            }),
         })
         .populate({
            path: "student",
            model: "user",
            select: ["lastname", "name", "studentnumber"],
         });

      let enrollments = await Enrollment.find({
         year: year ? year : thisYear,
         ...(category && { category }),
         classroom: { $exists: true },
      })
         .populate({
            path: "student",
            model: "user",
            select: ["lastname", "name", "studentnumber"],
         })
         .populate({
            path: "category",
            model: "category",
         });

      if (quantity > 0) {
         const students = attendances
            .filter((item) => item.classroom)
            .reduce((res, curr) => {
               if (res[curr.student]) res[curr.student].push(curr);
               else {
                  Object.assign(res, { [curr.student]: [curr] });
                  enrollments = enrollments.filter(
                     (enroll) =>
                        enroll.student._id.toString() !==
                        curr.student._id.toString()
                  );
               }

               return res;
            }, {});

         for (const x in students) {
            if (students[x].length <= quantity)
               totalAtt.push({
                  student: students[x][0].student,
                  category: students[x][0].classroom.category,
                  quantity: students[x].length,
               });
         }
      }

      totalAtt = [
         ...totalAtt,
         ...enrollments.map((item) => {
            return {
               student: item.student,
               category: item.category,
               quantity: 0,
            };
         }),
      ];

      res.json(totalAtt.sort((a, b) => a.quantity - b.quantity));
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    GET /api/attendance/:class_id
//@desc     Get all attendances for a class
//@access   Private
router.get("/:class_id", auth, async (req, res) => {
   try {
      const attendancesTable = await buildTable(req.params.class_id);

      res.json(attendancesTable);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    GET /api/attendance/:class/:id
//@desc     Get a student's attendances
//@access   Private
router.get("/:class_id/:user_id", auth, async (req, res) => {
   try {
      const { class_id, user_id } = req.params;

      const attendances = await Attendance.find({
         student: user_id,
         classroom: class_id,
      }).sort({ date: 1 });

      if (attendances.length === 0) {
         return res.status(400).json({
            msg: "No se encontraron ausencias con dichas descripciones",
         });
      }

      res.json(attendances);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    POST /api/attendance
//@desc     Add a date column for the period
//@access   Private
router.post(
   "/:class_id/:period",
   [auth, check("date", "Primero debe elegir una fecha").not().isEmpty()],
   async (req, res) => {
      let errors = [];

      const errorsResult = validationResult(req);
      if (!errorsResult.isEmpty()) {
         errors = errorsResult.array();
         return res.status(400).json({ errors });
      }

      const { class_id, period } = req.params;

      try {
         const data = {
            period,
            date: req.body.date,
            classroom: class_id,
         };

         let attendance = await Attendance.findOne(data);

         if (attendance)
            return res
               .status(400)
               .json({ msg: "Ya se ha agregado dicha fecha" });

         attendance = new Attendance(data);
         await attendance.save();

         const attendancesTable = await buildTable(class_id);

         res.json(attendancesTable);
      } catch (err) {
         console.error(err.message);
         res.status(500).json({ msg: "Server Error" });
      }
   }
);

//@route    POST /api/attendance
//@desc     Add all dates for a bimester
//@access   Private
router.post(
   "/:class_id/:period/bimester",
   [
      auth,
      check("fromDate", "Debe seleccionar la fecha del comienzo del bimestre")
         .not()
         .isEmpty(),
      check("toDate", "Debe seleccionar la fecha del fin del bimestre")
         .not()
         .isEmpty(),
   ],
   async (req, res) => {
      const { class_id, period } = req.params;
      const { fromDate, toDate, day1, day2 } = req.body;

      const errorsResult = validationResult(req);
      if (!errorsResult.isEmpty()) {
         errors = errorsResult.array();
         return res.status(400).json({ errors });
      }

      if (!day1 || !day2)
         return res.status(400).json({
            msg: "Deben estar cargadas los días en la que los alumno asisten a clases",
         });

      const dates = [
         ...getDaysBetweenDates(fromDate, toDate, day1),
         ...getDaysBetweenDates(fromDate, toDate, day2),
      ];

      try {
         for (let x = 0; x < dates.length; x++) {
            const attendance = new Attendance({
               period,
               date: dates[x],
               classroom: class_id,
            });
            await attendance.save();
         }

         const attendancesTable = await buildTable(class_id);

         console.log(attendancesTable.periods);

         res.json(attendancesTable);
      } catch (err) {
         console.error(err.message);
         res.status(500).json({ msg: "Server Error" });
      }
   }
);

//@route    PUT /api/attendance/period
//@desc     Add or remove attendances from a period when save
//@access   Private
router.put("/:class_id/:period", auth, async (req, res) => {
   let attendances = req.body;

   const { class_id: classroom, period } = req.params;

   try {
      attendances = attendances
         .flat()
         .filter(
            (item) =>
               (item.inassistance && item._id === "") ||
               (!item.inassistance && item._id !== "")
         );

      for (let x = 0; x < attendances.length; x++) {
         const data = {
            student: attendances[x].student,
            date: attendances[x].date,
            classroom,
            period,
         };
         if (attendances[x].inassistance) {
            const attendance = new Attendance(data);
            await attendance.save();
         } else await Attendance.findOneAndRemove(data);
      }

      res.json({ msg: "Attendances Updated" });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    DELETE api/attendance/date/:date
//@desc     Delete attendances with the same date and the entire column
//@access   Private
router.delete("/:class_id/:period/:date", auth, async (req, res) => {
   try {
      const { class_id: classroom, period, date } = req.params;

      //Remove attendace
      const attendancesToDelete = await Attendance.find({
         date,
         classroom,
         period,
      });

      await attendancesToDelete.forEach(
         async (item) => await Attendance.findOneAndRemove({ _id: item._id })
      );

      const attendancesTable = await buildTable(classroom);

      res.json(attendancesTable);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@desc Function to create the table to show on the front-end
const buildTable = async (class_id) => {
   const attendances = await Attendance.find({
      classroom: class_id,
   })
      .populate({
         path: "student",
         model: "user",
         select: ["name", "lastname"],
      })
      .sort({ date: 1 });

   let enrollments = await Enrollment.find({
      classroom: class_id,
   }).populate({
      model: "user",
      path: "student",
      select: ["name", "lastname"],
   });

   enrollments = sortByName(enrollments);

   let header = [];
   let periods = [];

   //Get the student's header
   const students = enrollments.map((user) => user.student);

   //Divide all the periods in different objects
   const allPeriods = attendances.reduce((res, curr) => {
      if (res[curr.period]) res[curr.period].push(curr);
      else Object.assign(res, { [curr.period]: [curr] });

      return res;
   }, {});

   for (const x in allPeriods) {
      let period = [];

      const dates = [
         ...new Set(allPeriods[x].map((item) => item.date.toISOString())),
      ];

      header.push(dates);

      for (let z = 0; z < students.length; z++) {
         const studentInassistance = students[z]._id
            ? allPeriods[x].filter(
                 (item) =>
                    item.student &&
                    item.student._id.toString() === students[z]._id.toString()
              )
            : [];

         //create an array with the amount of dates for the cells in the row
         //every item in the array goes with that info
         const row = Array.from(Array(dates.length), (item, index) => {
            const inassistance = studentInassistance.find(
               (item) => item.date.toISOString() === dates[index]
            );
            return {
               _id: inassistance ? inassistance._id : "",
               classroom: class_id,
               period: x,
               date: dates[index],
               ...(students[z]._id && {
                  student: students[z],
                  inassistance: inassistance ? true : false,
               }),
            };
         });

         period.push(row);
      }
      periods.push(period);
   }
   return { header, students, periods };
};

//@desc Function to get the weekday between a start and an end date
const getDaysBetweenDates = (start, end, dayName) => {
   let result = [];
   let days = {
      Lunes: 1,
      Martes: 2,
      Miércoles: 3,
      Jueves: 4,
      Viernes: 5,
      Sábado: 6,
   };

   let day = days[dayName];

   // Copy start date
   let current = new Date(start);
   let endDate = new Date(end);

   // Shift to next of required days
   current.setUTCDate(current.getDate() + ((day - current.getDay() + 7) % 7));

   // While less than end date, add dates to result array
   while (current < endDate) {
      result.push(new Date(+current));
      current.setDate(current.getDate() + 7);
   }
   return result;
};

//@desc Function to sort and array by name
const sortByName = (array) => {
   return array.sort((a, b) => {
      if (a.student.lastname > b.student.lastname) return 1;
      if (a.student.lastname < b.student.lastname) return -1;

      if (a.student.name > b.student.name) return 1;
      if (a.student.name < b.student.name) return -1;
   });
};

module.exports = router;
