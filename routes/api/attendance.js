const express = require("express");
const router = express.Router();
const moment = require("moment");
const auth = require("../../middleware/auth");
const path = require("path");
const pdf = require("html-pdf");
const pdfTemplate = require("../../templates/assistanceGrades");

const Attendance = require("../../models/Attendance");
const User = require("../../models/User");

//@route    GET api/attendance/:class_id
//@desc     Get all attendances
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
            path: "user",
            select: ["name", "lastname"],
         })
         .sort({ date: 1 });

      if (attendances.length === 0) {
         return res.status(400).json({
            msg: "No se encontraron ausencias con dichas descripciones",
         });
      }
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

//@route    GET api/attendance/user/:id
//@desc     Get a user's attendances
//@access   Private
router.get("/user/:id", [auth], async (req, res) => {
   try {
      const date = new Date();
      const start = new Date(date.getFullYear(), 01, 01);
      const end = new Date(date.getFullYear(), 12, 31);

      const attendances = await Attendance.find({
         user: req.params.id,
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

//@route    POST api/attendance/create-list
//@desc     Create a pdf of the class attendances
//@access   Private
router.post("/create-list", (req, res) => {
   const name = "Reports/attendances.pdf";

   const { headers, attendances, period, classInfo } = req.body;

   const periodName = [
      "1° Bimestre",
      "2° Bimestre",
      "3° Bimestre",
      "4° Bimestre",
   ];

   let tbody = "";

   let thead = "<tr><th>Nombre</th>";

   const title = "Asistencias de " + periodName[period];

   for (let x = 0; x < headers.header1.length; x++) {
      thead += "<th>" + headers.header1[x] + "</th>";
   }

   thead += "</tr>";

   for (let x = 0; x < headers.header2.length; x++) {
      if (headers.header2[x] !== "") {
         tbody += "<tr> <td>" + headers.header2[x] + "</td>";

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
      "../../templates/styles/assistanceGrades.css"
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

//@route    GET api/attendance/fetch-list
//@desc     Get the pdf of the class attendances
//@access   Private
router.get("/list/fetch-list", (req, res) => {
   res.sendFile(path.join(__dirname, "../../Reports/attendances.pdf"));
});

//@route    POST api/attendance
//@desc     Add an attendance
//@access   Private
router.post("/", auth, async (req, res) => {
   const { user, period, date, classroom } = req.body;

   const data = {
      ...(user !== undefined && user),
      period,
      date: new Date(date),
      classroom,
   };

   try {
      let attendance = new Attendance(data);
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
            path: "user",
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

//@route    POST api/attendance/period
//@desc     Add or remove attendances from a period
//@access   Private
router.post("/period", auth, async (req, res) => {
   const attendances = req.body;
   let data;
   const classroom = attendances[0][0].classroom;
   let toDelte = [];
   const period = attendances[0][0].period;
   try {
      const oldAttendances = await Attendance.find({
         classroom,
         period,
      });
      for (let x = 0; x < attendances.length; x++) {
         for (let y = 0; y < attendances[x].length; y++) {
            if (attendances[x][y].inassistance) {
               attendace = await Attendance.findOne({
                  user: attendances[x][y].user,
                  date: attendances[x][y].date,
               });

               if (attendances[x][y]._id === "") {
                  data = {
                     user: attendances[x][y].user,
                     date: attendances[x][y].date,
                     period,
                     classroom,
                  };
                  let attendance = new Attendance(data);
                  await attendance.save();
               } else {
                  for (let x = 0; x < oldAttendances.length; x++) {
                     if (oldAttendances[x].id === attendace.id) {
                        oldAttendances.splice(x, 1);
                        break;
                     }
                  }
               }
            }
         }
      }

      for (let x = 0; x < toDelte.length; x++) {
         if (oldAttendances[x].user !== undefined)
            await Attendance.findOneAndDelete({ _id: oldAttendances[x] });
      }

      res.json({ msg: "Attendances Updated" });
   } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
   }
});

//@route    DELETE api/attendance/:id
//@desc     Delete an attendance
//@access   Private
router.delete("/:id", auth, async (req, res) => {
   try {
      //Remove attendace
      await Attendance.findOneAndRemove({ _id: req.params.id });

      res.json({ msg: "Attendance deleted" });
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
   }
});

//@route    DELETE api/attendance/date/:date
//@desc     Delete attendances with the same date
//@access   Private
router.delete("/date/:date", auth, async (req, res) => {
   try {
      //Remove attendace
      const attendancesToDelete = await Attendance.find({
         date: req.params.date,
      });

      const classroom = attendancesToDelete[0].classroom;

      for (let x = 0; x < attendancesToDelete.length; x++) {
         await Attendance.findOneAndRemove({ _id: attendancesToDelete[x].id });
      }

      const date = new Date();
      const start = new Date(date.getFullYear(), 01, 01);
      const end = new Date(date.getFullYear(), 12, 31);

      const attendances = await Attendance.find({
         classroom,
         date: {
            $gte: start,
            $lt: end,
         },
      })
         .populate({
            path: "user",
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
   try {
      users = await User.find({
         type: "Alumno",
         classroom: class_id,
      }).sort({ lastname: 1, name: 1 });
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
   }

   let header1 = [];
   let header2 = users.map((user) => {
      return user.lastname + " " + user.name;
   });
   header2 = [...header2, ""];

   let rowsP = [];
   let periods = attendances.reduce((res, curr) => {
      if (res[curr.period]) res[curr.period].push(curr);
      else Object.assign(res, { [curr.period]: [curr] });

      return res;
   }, {});

   for (const x in periods) {
      let period = [];
      let count = 0;
      let days = periods[x].reduce((res, curr) => {
         if (res[curr.date]) res[curr.date].push(curr);
         else Object.assign(res, { [curr.date]: [curr] });

         return res;
      }, {});
      let daysHeader = Object.getOwnPropertyNames(days);
      daysHeader = daysHeader.map((day) => {
         const date = new Date(day);
         return moment(date).utc().format("DD/MM");
      });
      header1.push(daysHeader);
      let students = periods[x].reduce((res, curr) => {
         if (curr.user !== undefined) {
            if (res[curr.user._id]) res[curr.user._id].push(curr);
            else Object.assign(res, { [curr.user._id]: [curr] });
         }
         return res;
      }, {});

      const daysNumber = Object.keys(days).length;

      let studentsArray = Object.keys(students).map((i) => students[i]);

      studentsArray = studentsArray.sort((a, b) => {
         if (a[0].user.lastname > b[0].user.lastname) return 1;
         if (
            a[0].user.lastname === b[0].user.lastname &&
            a[0].user.name > b[0].user.name
         )
            return 1;
         if (a[0].user.lastname < b[0].user.lastname) return -1;
         if (
            a[0].user.lastname === b[0].user.lastname &&
            a[0].user.name < b[0].user.name
         )
            return -1;
         return 0;
      });

      let rows = [];
      let studentNumber = 0;
      for (let z = 0; z < users.length + 1; z++) {
         let rowNumber = 0;

         let row = Array.from(Array(daysNumber), () => ({
            _id: "",
            classroom: class_id,
            period: x,
            inassistance: false,
         }));
         for (const index in days) {
            row[rowNumber].date = new Date(index);
            row[rowNumber].name = "input" + count;
            if (users[z] !== undefined) {
               row[rowNumber].user = users[z]._id;
               let added = false;
               if (studentsArray[studentNumber] !== undefined) {
                  if (
                     studentsArray[studentNumber][0].user._id.toString() ===
                     users[z]._id.toString()
                  ) {
                     for (
                        let y = 0;
                        y < studentsArray[studentNumber].length;
                        y++
                     ) {
                        if (
                           studentsArray[studentNumber][y].date.toString() ===
                           new Date(index).toString()
                        ) {
                           row[rowNumber] = {
                              ...row[rowNumber],
                              inassistance: true,
                              _id: studentsArray[studentNumber][y]._id,
                           };
                           period.push(studentsArray[studentNumber][y]);
                           count++;
                           added = true;
                           break;
                        }
                     }
                  }
               }
               if (!added) {
                  period.push(row[rowNumber]);
                  count++;
               }
            }
            rowNumber++;
         }

         if (
            users[z] !== undefined &&
            studentsArray[studentNumber] !== undefined
         ) {
            if (
               users[z]._id.toString() ===
               studentsArray[studentNumber][0].user._id.toString()
            ) {
               studentNumber++;
            }
         }
         rows.push(row);
      }
      rowsP.push({ period: x, rows });
   }
   return { header: { header1, header2 }, periods: rowsP };
}

module.exports = router;
