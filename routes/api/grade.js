const router = require("express").Router();

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
         .filter((item) => item.classroom)
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
      const grades = await Grade.find({
         classroom: req.params.class_id,
      })
         .populate({
            path: "gradetype",
            model: "gradetypes",
            select: "name",
         })
         .populate({
            path: "student",
            model: "user",
            select: ["name", "lastname"],
         });

      const tableGrades = await buildClassTable(
         grades,
         req.params.class_id,
         res
      );

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
      if (req.params.class_id === "null") {
         return res.status(400).json({
            msg: "El alumno no está registrado en ninguna clase",
         });
      }

      const grades = await Grade.find({
         classroom: req.params.class_id,
         student: req.params.user_id,
         period: { $in: [1, 2, 3, 4] },
      })
         .populate({
            path: "gradetype",
            model: "gradetypes",
         })
         .sort({ gradetype: 1 });

      if (grades.length === 0) {
         return res.status(400).json({
            msg: "No se encontraron notas con dichas descripciones",
         });
      }

      const studentTable = buildStudentTable(grades);

      res.json(studentTable);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    POST /api/grade/period
//@desc     Add or remove grades from a period
//@access   Private
router.post("/period", auth, async (req, res) => {
   const periodRows = req.body;

   const date = new Date();
   const year = date.getFullYear();

   try {
      const period = periodRows[0][0].period;
      const classroom = periodRows[0][0].classroom;

      for (let x = 0; x < periodRows.length; x++) {
         let average = 0;
         let count = 0;
         const student = periodRows[x][0].student;

         for (let y = 0; y < periodRows[x].length; y++) {
            const filter = {
               student,
               gradetype: periodRows[x][y].gradetype,
               classroom,
               period,
            };

            let value = periodRows[x][y].value;

            if (value !== 0 && value !== "") {
               value = parseFloat(value);

               if (value > 10 || value <= 0) {
                  return res
                     .status(400)
                     .json({ msg: "La nota debe ser entre 0 y 10" });
               }

               average += value;
               count++;

               const grade = await Grade.findOneAndUpdate(filter, {
                  value: value,
               });

               if (!grade) {
                  const data = {
                     ...filter,
                     value: value,
                  };
                  const newGrade = new Grade(data);

                  newGrade.save();
               }
            } else {
               await Grade.findOneAndRemove(filter);
            }
         }

         // if (average !== 0) {
         //    average = average / count;
         //    average = Math.round((average + Number.EPSILON) * 100) / 100;
         // }

         // const filter2 = { year, student };

         // const enrollment = await Enrollment.findOne(filter2);

         // let periodAverage = [];
         // let allAverage = 0;

         // if (enrollment.classroom.periodAverage.length === 0)
         //    periodAverage = new Array(6).fill(0);
         // else periodAverage = [...enrollment.classroom.periodAverage];

         // periodAverage[period - 1] = parseFloat(average);

         // let full = 0;
         // for (let y = 0; y < 5; y++) {
         //    if (periodAverage[y] !== 0) {
         //       allAverage += periodAverage[y];
         //       full++;
         //    }
         // }

         // if (allAverage !== 0) {
         //    allAverage = allAverage / full;
         //    allAverage = Math.round((allAverage + Number.EPSILON) * 100) / 100;
         // }

         // await Enrollment.findOneAndUpdate(
         //    { _id: enrollment._id },
         //    {
         //       classroom: {
         //          ...enrollment.classroom,
         //          periodAverage,
         //          ...(allAverage !== 0 && { average: allAverage }),
         //       },
         //    }
         // );
      }

      res.json({ msg: "Grades Updated" });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    POST /api/grades
//@desc     Add a grade
//@access   Private
router.post("/", auth, async (req, res) => {
   const { period, classroom, gradetype, periods } = req.body;

   if (!gradetype)
      return res.status(400).json({
         msg: "Primero debe elegir un tipo de nota",
      });

   if (period !== 1 && !periods[period - 2])
      return res.status(400).json({
         msg: "Debe agregar por lo menos una nota en los bimestres anteriores",
      });

   const data = { period, classroom, gradetype };
   let grade;

   try {
      grade = new Grade(data);

      await grade.save();

      if (period === 1) {
         for (let x = 0; x < 3; x++) {
            const info = { period: x + 2, classroom, gradetype };
            grade = await Grade.findOne(info);
            if (!grade) {
               grade = new Grade(info);
               await grade.save();
            }
         }
      }

      const grades = await Grade.find({
         classroom,
      })
         .populate({
            path: "student",
            model: "user",
            select: ["name", "lastname"],
            option: { sort: { lastname: -1, name: -1 } },
         })
         .populate({
            path: "gradetype",
            model: "gradetypes",
         });

      const tableGrades = await buildClassTable(grades, classroom, res);

      res.json(tableGrades);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    DELETE /api/grade/:type/:classroom/:period
//@desc     Delete grades of the same type
//@access   Private
router.delete("/:type/:classroom/:period", auth, async (req, res) => {
   try {
      //Remove grades
      const gradesToDelete = await Grade.find({
         gradetype: req.params.type,
         classroom: req.params.classroom,
         period: req.params.period,
      });

      for (let x = 0; x < gradesToDelete.length; x++) {
         await Grade.findByIdAndRemove({ _id: gradesToDelete[x].id });
      }
      const grades = await Grade.find({
         classroom: req.params.classroom,
      })
         .populate({
            path: "student",
            model: "user",
            select: ["name", "lastname"],
            option: { sort: { lastname: -1, name: -1 } },
         })
         .populate({
            path: "gradetype",
            model: "gradetypes",
         });

      const tableGrades = await buildClassTable(
         grades,
         req.params.classroom,
         res
      );

      res.json(tableGrades);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

const buildStudentTable = (grades, reportCard) => {
   let obj = grades.reduce((res, curr) => {
      if (res[curr.gradetype.name]) {
         res[curr.gradetype.name].push(curr);
      } else Object.assign(res, { [curr.gradetype.name]: [curr] });
      return res;
   }, {});

   let rows = [];

   for (const x in obj) {
      if (!reportCard && obj[x][0].value === "") delete obj[x];

      const dividedGrades = obj[x];
      let row = Array.from(Array(4), () => ({
         value: "",
      }));
      for (let x = 0; x < dividedGrades.length; x++) {
         row[dividedGrades[x].period - 1] = dividedGrades[x];
      }
      rows.push(row);
   }

   let headers = Object.getOwnPropertyNames(obj);

   return { headers, rows };
};

const buildClassTable = async (grades, class_id, res) => {
   let users = [];
   let enrollments;

   try {
      enrollments = await Enrollment.find({
         classroom: class_id,
      }).populate({
         model: "user",
         path: "student",
         select: ["name", "lastname", "dni"],
      });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }

   users = enrollments.sort((a, b) => {
      if (a.student.lastname > b.student.lastname) return 1;
      if (a.student.lastname < b.student.lastname) return -1;

      if (a.student.name > b.student.name) return 1;
      if (a.student.name < b.student.name) return -1;
   });

   let header = [];
   let periods = [];

   let students = users.map((user) => {
      return {
         _id: user.student._id,
         name: user.student.lastname + ", " + user.student.name,
         dni: user.student.dni,
      };
   });

   //Add last row for the eliminate button
   students = [...students, { name: "", dni: "" }];

   //Divide all the periods in different objects between '{}'
   let allPeriods = grades.reduce((res, curr) => {
      if (res[curr.period]) res[curr.period].push(curr);
      else Object.assign(res, { [curr.period]: [curr] });

      return res;
   }, {});

   //this for works only for objects
   for (const x in allPeriods) {
      let count = 0;
      let period = [];

      //Get all the grade types for each period
      let gradeType = allPeriods[x].reduce((res, curr) => {
         if (res[curr.gradetype.name]) res[curr.gradetype.name].push(curr);
         else Object.assign(res, { [curr.gradetype.name]: [curr] });

         return res;
      }, {});

      header.push(Object.getOwnPropertyNames(gradeType));

      //Divide all grades per student in this particular period
      let classStudents = allPeriods[x].reduce((res, curr) => {
         if (curr.student !== null && curr.student !== undefined) {
            if (res[curr.student._id]) res[curr.student._id].push(curr);
            else Object.assign(res, { [curr.student._id]: [curr] });
         }
         return res;
      }, {});

      //Amount of grade types for this period
      const gradesNumber = Object.keys(gradeType).length;

      //Generates an array from every object
      let studentsArray = Object.keys(classStudents).map(
         (i) => classStudents[i]
      );

      //Sort them in the same order as users
      studentsArray = studentsArray.sort((a, b) => {
         if (a[0].student.lastname > b[0].student.lastname) return 1;
         if (a[0].student.lastname < b[0].student.lastname) return -1;

         if (a[0].student.name > b[0].student.name) return 1;
         if (a[0].student.name < b[0].student.name) return -1;
      });

      let studentNumber = 0;
      for (let z = 0; z < students.length; z++) {
         let rowNumber = 0;

         //create an array with the amount of grade types for the cells in the row
         //every item in the array goes with that basic info
         let row = Array.from(Array(gradesNumber), () => ({
            _id: "",
            classroom: class_id,
            period: x,
            value: "",
            name: "",
         }));

         //Add or modify the info that is in every item in the array row
         for (const index in gradeType) {
            row[rowNumber].gradetype = gradeType[index][0].gradetype;
            row[rowNumber].name = "input" + count;

            //For the items that are buttons (doesnt have a user related)
            if (!users[z]) {
               count++;
               rowNumber++;
               continue;
            }

            row[rowNumber].student = users[z].student._id;

            let added = false;

            if (
               studentsArray[studentNumber] &&
               studentsArray[studentNumber][0].student._id.toString() ===
                  users[z].student._id.toString()
            ) {
               for (let y = 0; y < studentsArray[studentNumber].length; y++) {
                  if (
                     studentsArray[studentNumber][y].gradetype.name === index
                  ) {
                     row[rowNumber]._id = studentsArray[studentNumber][y]._id;
                     row[rowNumber].value =
                        studentsArray[studentNumber][y].value;

                     count++;
                     added = true;
                     break;
                  }
               }
            }

            if (!added) count++;

            rowNumber++;
         }

         if (
            users[z] &&
            studentsArray[studentNumber] &&
            users[z].student._id.toString() ===
               studentsArray[studentNumber][0].student._id.toString()
         ) {
            studentNumber++;
         }
         period.push(row);
      }
      periods.push(period);
   }

   return { header, students, periods };
};

module.exports = router;
