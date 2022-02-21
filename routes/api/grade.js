const router = require("express").Router();
const { check, validationResult } = require("express-validator");

//Middlewares
const auth = require("../../middleware/auth");
const adminAuth = require("../../middleware/adminAuth");

//Models
const Grade = require("../../models/Grade");
const Enrollment = require("../../models/Enrollment");

//@route    GET /api/grade/best
//@desc     get students average
//@access   Private && Admin
router.get("/best", [auth, adminAuth], async (req, res) => {
   try {
      let { quantity, year, category } = req.query;

      quantity = quantity ? quantity : 10;

      const thisYear = new Date().getFullYear();
      let totalGrades = [];

      const grades = await Grade.find({
         student: { $exists: true },
         value: { $exists: true },
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

      const students = grades
         .filter(
            (item) =>
               item.classroom && item.classroom.category.name !== "Kinder"
         )
         .reduce((res, curr) => {
            if (res[curr.student]) res[curr.student].push(curr);
            else Object.assign(res, { [curr.student]: [curr] });

            return res;
         }, {});

      for (const x in students) {
         const total = students[x].reduce(
            (sum, detail) => sum + detail.value,
            0
         );

         totalGrades.push({
            student: students[x][0].student,
            category: students[x][0].classroom.category,
            average:
               Math.round((total / students[x].length + Number.EPSILON) * 100) /
               100,
         });
      }

      totalGrades = totalGrades
         .sort((a, b) => b.average - a.average)
         .slice(0, quantity);

      res.json(totalGrades);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    GET /api/grade/:class_id
//@desc     Get all grades for a class
//@access   Private
router.get("/:class_id", auth, async (req, res) => {
   try {
      const tableGrades = await buildClassTable(req.params.class_id);

      res.json(tableGrades);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    GET /api/grade/student/:class_id/:user_id
//@desc     Get all grades for a user
//@access   Private
router.get("/student/:class_id/:user_id", [auth], async (req, res) => {
   try {
      const { class_id, user_id } = req.params;

      if (class_id === "null") {
         return res.status(400).json({
            msg: "El alumno no está registrado en ninguna clase",
         });
      }

      const grades = await Grade.find({
         classroom: class_id,
         student: user_id,
         period: { $in: [1, 2, 3, 4] },
      })
         .populate({
            path: "gradetype",
            model: "gradetype",
         })
         .sort({ gradetype: 1 });

      if (grades.length === 0) {
         return res.status(400).json({
            msg: "No se encontraron notas con dichas descripciones",
         });
      }

      let finalGrades = await Grade.find({
         classroom: class_id,
         student: user_id,
         period: 5,
      })
         .populate({
            path: "gradetype",
            model: "gradetype",
         })
         .sort({ gradetype: 1 });

      finalGrades = buildFinalsTable(finalGrades);

      const studentTable = buildStudentTable(grades);

      res.json({ ...studentTable, ...(finalGrades && { finalGrades }) });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    POST /api/grade/:class_id/:period"
//@desc     Add a grade
//@access   Private
router.post(
   "/:class_id/:period",
   [
      auth,
      check("gradetype", "Primero debe elegir un tipo de nota").not().isEmpty(),
   ],
   async (req, res) => {
      let errors = [];

      const errorsResult = validationResult(req);
      if (!errorsResult.isEmpty()) {
         errors = errorsResult.array();
         return res.status(400).json({ errors });
      }

      const { class_id: classroom, period } = req.params;

      const { gradetype } = req.body;

      let grade;

      try {
         grade = new Grade({
            period,
            classroom,
            gradetype,
         });

         await grade.save();

         if (period === "1") {
            for (let x = 0; x < 3; x++) {
               const info = { period: x + 2, classroom, gradetype };
               grade = await Grade.findOne(info);
               if (!grade) {
                  grade = new Grade(info);
                  await grade.save();
               }
            }
         }

         const tableGrades = await buildClassTable(classroom);

         res.json(tableGrades);
      } catch (err) {
         console.error(err.message);
         res.status(500).json({ msg: "Server Error" });
      }
   }
);

//@route    PUT /api/grade/:class_id/:period"
//@desc     Add or remove grades from a period
//@access   Private
router.put("/:class_id/:period", auth, async (req, res) => {
   let grades = req.body;

   grades = grades
      .flat()
      .filter(
         (item) => item.value !== "" || (item.value === "" && item._id !== "")
      );

   const { class_id: classroom, period } = req.params;

   try {
      for (let x = 0; x < grades.length; x++) {
         const data = {
            student: grades[x].student,
            gradetype: grades[x].gradetype,
            classroom,
            period,
            ...(grades[x].value !== "" && {
               value: grades[x].value,
            }),
         };
         if (grades[x]._id === "") {
            const grade = new Grade(data);
            grade.save();
         } else {
            if (data.value)
               await Grade.findOneAndUpdate({ _id: grades[x]._id }, data);
            else await Grade.findOneAndRemove(data);
         }
      }

      res.json({ msg: "Grades Updated" });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    DELETE /api/grade/:class_id/:period/:type_id
//@desc     Delete grades of the same type
//@access   Private
router.delete("/:class_id/:period/:type_id", auth, async (req, res) => {
   try {
      const { class_id: classroom, period, type_id: gradetype } = req.params;

      //Remove grades
      const gradesToDelete = await Grade.find({
         gradetype,
         classroom,
         period,
      });

      await gradesToDelete.forEach(
         async (item) => await Grade.findByIdAndRemove({ _id: item.id })
      );

      const tableGrades = await buildClassTable(classroom);

      res.json(tableGrades);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@desc Function to create the table for student's grades
const buildStudentTable = (grades) => {
   grades = grades.reduce((res, curr) => {
      if (res[curr.gradetype.name]) {
         res[curr.gradetype.name].push(curr);
      } else Object.assign(res, { [curr.gradetype.name]: [curr] });
      return res;
   }, {});

   let rows = [];

   for (const x in grades) {
      let row = Array.from(Array(4), (item, index) => {
         const grade = grades[x].find((item) => item.period === index + 1);
         return {
            ...(grade ? { ...grade.toJSON() } : { value: "" }),
         };
      });
      rows.push(row);
   }

   let headers = Object.getOwnPropertyNames(grades);

   return { headers, rows };
};

//@desc Function to create the table for student's final grades
const buildFinalsTable = (grades) => {
   if (grades.length === 0) return null;

   const num = grades.length > 4 ? 3 : 2;

   let rows = new Array(grades.length > 2 ? 4 : 2)
      .fill()
      .map(() => new Array(num).fill());

   const average =
      grades.length === 5 &&
      grades.reduce((accum, item) => accum + item.value, 0) / grades.length;

   let y = 0;
   for (let x = 0; x < grades.length; x++) {
      const count = x < num ? 0 : 2;

      rows[count][y] = grades[x].gradetype.name;
      rows[count + 1][y] = {
         value: grades[x].value,
         percentage: grades[x].gradetype.percentage,
      };

      if (y + 1 >= num) y = 0;
      else y++;

      if (x === grades.length - 1 && average) {
         rows[count][y] = "Priomedio";
         rows[count + 1][y] = {
            value: Math.round((average * 10 + Number.EPSILON) * 100) / 100,
            percentage: true,
         };
      }
   }

   return rows;
};

//@desc Function to create the table for saving grades and to show on the front-end
const buildClassTable = async (class_id) => {
   const grades = await Grade.find({
      classroom: class_id,
   })
      .populate({
         path: "gradetype",
         model: "gradetype",
      })
      .populate({
         path: "student",
         model: "user",
      })
      .sort({ gradetype: 1 });

   let enrollments = await Enrollment.find({
      classroom: class_id,
   }).populate({
      model: "user",
      path: "student",
      select: ["name", "lastname", "dni"],
   });
   enrollments = sortByName(enrollments);

   let header = [];
   let periods = [];

   //Get the student's header
   const students =
      enrollments[0].year === new Date().getFullYear()
         ? [...enrollments.map((user) => user.student), {}]
         : enrollments.map((user) => user.student);

   //Divide all the periods in different object
   let allPeriods = grades.reduce((res, curr) => {
      if (res[curr.period]) res[curr.period].push(curr);
      else Object.assign(res, { [curr.period]: [curr] });

      return res;
   }, {});

   for (const x in allPeriods) {
      let period = [];

      const gradeTypes = [
         ...new Set(allPeriods[x].map((item) => item.gradetype)),
      ];

      header.push(gradeTypes);

      for (let z = 0; z < students.length; z++) {
         const studentGrades = students[z]._id
            ? allPeriods[x].filter(
                 (item) =>
                    item.student &&
                    item.student._id.toString() === students[z]._id.toString()
              )
            : [];

         //create an array with the amount of grade types for the cells in the row
         //every item in the array goes with that info
         const row = Array.from(Array(gradeTypes.length), (item, index) => {
            const grade = studentGrades.find(
               (item) => item.gradetype.name === gradeTypes[index].name
            );
            return {
               _id: grade ? grade._id : "",
               classroom: class_id,
               period: x,
               gradetype: gradeTypes[index],
               ...(students[z]._id && {
                  student: students[z],
                  value: grade ? grade.value : "",
               }),
            };
         });

         period.push(row);
      }
      periods.push(period);
   }

   return { header, students, periods };
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
