const express = require("express");
const router = express.Router();
const moment = require("moment");
const auth = require("../../middleware/auth");
const path = require("path");
const pdf = require("html-pdf");
const pdfTemplate = require("../../templates/assistanceGrades");

const Attendance = require("../../models/Attendance");
const Enrollment = require("../../models/Enrollment");

//@route    GET api/attendance/:class_id
//@desc     Get all attendances for a class
//@access   Private
router.get("/:class_id", [auth], async (req, res) => {
   try {
      const date = new Date();
      const start = new Date(date.getFullYear(), 01, 01);
      const end = new Date(date.getFullYear(), 12, 31);

      const attendances = await Attendance.find({
         classroom: req.params.class_id,
         date: {
            $gte: start,
            $lt: end,
         },
      })
         .populate({
            path: "student",
            model: "user",
            select: ["name", "lastname"],
         })
         .sort({ date: 1 });

      const attendancesTable = await buildTable(
         attendances,
         req.params.class_id,
         res
      );
      res.json(attendancesTable);
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
   }
});

//@route    GET api/attendance/student/:id
//@desc     Get a student's attendances
//@access   Private
router.get("/student/:id", [auth], async (req, res) => {
   try {
      const date = new Date();
      const start = new Date(date.getFullYear(), 01, 01);
      const end = new Date(date.getFullYear(), 12, 31);

      const attendances = await Attendance.find({
         student: req.params.id,
         date: {
            $gte: start,
            $lt: end,
         },
      }).sort({ date: 1 });

      if (attendances.length === 0) {
         return res.status(400).json({
            msg: "No se encontraron ausencias con dichas descripciones",
         });
      }

      res.json(attendances);
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
   }
});

//@route    GET api/attendance/fetch-list
//@desc     Get the pdf of the class attendances
//@access   Private
router.get("/list/fetch-list", (req, res) => {
   res.sendFile(path.join(__dirname, "../../reports/attendances.pdf"));
});

//@route    POST api/attendance/period
//@desc     Add or remove attendances from a period when save
//@access   Private
router.post("/period", auth, async (req, res) => {
   const attendances = req.body;

   const classroom = attendances[0][0].classroom;
   const period = attendances[0][0].period;

   const date = new Date();
   const year = date.getFullYear();

   try {
      for (let x = 0; x < attendances.length; x++) {
         let count = 0;
         const student = attendances[x][0].student;

         for (let y = 0; y < attendances[x].length; y++) {
            if (attendances[x][y].inassistance) {
               if (attendances[x][y]._id === "") {
                  const data = {
                     student,
                     date: attendances[x][y].date,
                     period,
                     classroom,
                  };
                  const attendance = new Attendance(data);
                  await attendance.save();
               }
               count++;
            } else {
               if (attendances[x][y]._id !== "") {
                  await Attendance.findOneAndDelete({
                     student,
                     date: attendances[x][y].date,
                     period,
                     classroom,
                  });
               }
            }
         }

         const filter2 = { year, student };

         const enrollment = await Enrollment.findOne(filter2);

         let periodAbsence = [];
         let allAbsence = 0;

         if (enrollment.classroom.periodAbsence.length === 0)
            periodAbsence = new Array(4).fill(0);
         else periodAbsence = [...enrollment.classroom.periodAbsence];
         periodAbsence[period - 1] = parseInt(count);

         for (let y = 0; y < 4; y++) {
            allAbsence += periodAbsence[y];
         }
         await Enrollment.findOneAndUpdate(
            { _id: enrollment._id },
            {
               "classroom.periodAbsence": periodAbsence,
               "classroom.absence": allAbsence,
            }
         );
      }

      res.json({ msg: "Attendances Updated" });
   } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
   }
});

//@route    POST api/attendance
//@desc     Add a date column for the period
//@access   Private
router.post("/", auth, async (req, res) => {
   const { period, date, classroom } = req.body;

   const data = {
      period,
      date: new Date(date),
      classroom,
   };

   try {
      let attendance = await Attendance.findOne(data);

      if (attendance) {
         return res.status(400).json({ msg: "Ya se ha agregado dicha fecha" });
      }

      attendance = new Attendance(data);
      await attendance.save();

      const date = new Date();
      const start = new Date(date.getFullYear(), 01, 01);
      const end = new Date(date.getFullYear(), 12, 31);

      let attendances = await Attendance.find({
         classroom,
         date: {
            $gte: start,
            $lt: end,
         },
      })
         .populate({
            path: "student",
            model: "user",
            select: ["name", "lastname"],
         })
         .sort({ date: 1 });

      let attendancesTable = await buildTable(attendances, classroom, res);

      res.json(attendancesTable);
   } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
   }
});

//@route    POST api/attendance/create-list
//@desc     Create a pdf of the class attendances
//@access   Private
router.post("/create-list", (req, res) => {
   const name = "reports/attendances.pdf";

   const { header, students, attendances, period, classInfo } = req.body;

   const periodName = [
      "1° Bimestre",
      "2° Bimestre",
      "3° Bimestre",
      "4° Bimestre",
   ];

   let tbody = "";

   let thead = "<tr><th>Nombre</th>";

   const title = "Asistencias de " + periodName[period];

   for (let x = 0; x < header.length; x++) {
      thead += "<th>" + header[x] + "</th>";
   }

   thead += "</tr>";

   for (let x = 0; x < students.length; x++) {
      if (students[x] !== "") {
         tbody += "<tr> <td>" + students[x] + "</td>";

         for (let y = 0; y < attendances[x].length; y++) {
            tbody +=
               "<td>" +
               (!attendances[x][y].inassistance ? "<div>✓</div>" : "") +
               "</td>";
         }

         tbody += "</tr>";
      }
   }

   const img = path.join(
      "file://",
      __dirname,
      "../../templates/assets/logo.png"
   );
   const css = path.join(
      "file://",
      __dirname,
      "../../templates/assistanceGrades/style.css"
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
      pdfTemplate(css, img, title, thead, tbody, classInfo, true),
      options
   ).toFile(name, (err) => {
      if (err) {
         res.send(Promise.reject());
      }

      res.send(Promise.resolve());
   });
});

//@route    DELETE api/attendance/date/:date
//@desc     Delete attendances with the same date and the entire column
//@access   Private
router.delete("/date/:date/:classroom", auth, async (req, res) => {
   try {
      //Remove attendace
      const classroom = req.params.classroom;
      const attendancesToDelete = await Attendance.find({
         date: req.params.date,
         classroom: classroom,
      });

      for (let x = 0; x < attendancesToDelete.length; x++) {
         await Attendance.findOneAndRemove({ _id: attendancesToDelete[x].id });
      }

      const date = new Date();
      const start = new Date(date.getFullYear(), 01, 01);
      const end = new Date(date.getFullYear(), 12, 31);

      const attendances = await Attendance.find({
         classroom: classroom,
         date: {
            $gte: start,
            $lte: end,
         },
      })
         .populate({
            path: "student",
            model: "user",
            select: ["name", "lastname"],
         })
         .sort({ date: 1 });

      let attendancesTable = await buildTable(attendances, classroom, res);

      res.json(attendancesTable);
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
   }
});

async function buildTable(attendances, class_id, res) {
   let users = [];
   let enrollments = [];
   try {
      enrollments = await Enrollment.find({
         "classroom._id": class_id,
      }).populate({
         model: "user",
         path: "student",
         select: ["name", "lastname"],
      });
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
   }

   users = enrollments.sort((a, b) => {
      if (a.student.lastname > b.student.lastname) return 1;
      if (a.student.lastname < b.student.lastname) return -1;

      if (a.student.name > b.student.name) return 1;
      if (a.student.name < b.student.name) return -1;
   });

   let header = [];
   let periods = [];

   //Get the student's header
   let students = users.map((user) => {
      return user.student.lastname + ", " + user.student.name;
   });

   //Add last row for the eliminate button
   students = [...students, ""];

   //Divide all the periods in different objects between '{}'
   let allPeriods = attendances.reduce((res, curr) => {
      if (res[curr.period]) res[curr.period].push(curr);
      else Object.assign(res, { [curr.period]: [curr] });

      return res;
   }, {});

   //this for works only for objects
   for (const x in allPeriods) {
      let period = [];
      let count = 0;

      //Get all the days for each period
      let days = allPeriods[x].reduce((res, curr) => {
         if (res[curr.date]) res[curr.date].push(curr);
         else Object.assign(res, { [curr.date]: [curr] });

         return res;
      }, {});

      let daysHeader = Object.getOwnPropertyNames(days);

      //Change the format of the date
      daysHeader = daysHeader.map((day) => {
         const date = new Date(day);
         return moment(date).utc().format("DD/MM");
      });

      header.push(daysHeader);

      //Divide all grades per student in this particular period
      let classStudents = allPeriods[x].reduce((res, curr) => {
         if (curr.student) {
            if (res[curr.student._id]) res[curr.student._id].push(curr);
            else Object.assign(res, { [curr.student._id]: [curr] });
         }
         return res;
      }, {});

      //Amount of dates for this period
      const daysNumber = Object.keys(days).length;

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

         //create an array with the amount of dates for the cells in the row
         //every item in the array goes with that basic info
         let row = Array.from(Array(daysNumber), () => ({
            _id: "",
            classroom: class_id,
            period: x,
            inassistance: false,
         }));

         //Add or modify the info that is in every item in the array row
         for (const index in days) {
            row[rowNumber].date = new Date(index);
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
                     studentsArray[studentNumber][y].date.toString() ===
                     new Date(index).toString()
                  ) {
                     row[rowNumber].inassistance = true;
                     row[rowNumber]._id = studentsArray[studentNumber][y]._id;

                     count++;
                     added = true;
                     break;
                  }
               }
            }
            if (!added) {
               count++;
            }
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
}

module.exports = router;
