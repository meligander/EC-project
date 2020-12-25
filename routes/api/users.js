const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../../middleware/auth");
const adminAuth = require("../../middleware/adminAuth");
const { check, validationResult } = require("express-validator");
const cloudinary = require("cloudinary");
const cloudinaryUploader = require("../../config/imageUploading");

const path = require("path");
const pdf = require("html-pdf");
const pdfTemplate = require("../../templates/list");
const moment = require("moment");

const User = require("../../models/User");
const Enrollment = require("../../models/Enrollment");
const Installment = require("../../models/Installment");
const Grade = require("../../models/Grade");
const Attendance = require("../../models/Attendance");
const Class = require("../../models/Class");

//@route    GET api/users
//@desc     Get all user || with filter
//@access   Private
router.get("/", auth, async (req, res) => {
   try {
      let users = [];
      let search = true;

      if (Object.entries(req.query).length === 0) {
         users = await User.find().sort({ lastname: 1, name: 1 });
      } else {
         let filter = {
            ...(req.query.active && { active: req.query.active }),
            ...(req.query.type && { type: req.query.type }),
            ...(req.query.name && {
               name: { $regex: `.*${req.query.name}.*`, $options: "i" },
            }),
            ...(req.query.lastname && {
               lastname: { $regex: `.*${req.query.lastname}.*`, $options: "i" },
            }),
         };

         if (req.query.type) {
            switch (req.query.type) {
               case "Alumno":
                  search = false;
                  if (req.query.classroom) {
                     if (req.query.classroom === "null")
                        filter.classroom = null;
                     else filter.classroom = req.query.classroom;
                  }
                  if (req.query.category) {
                     const date = new Date();
                     const enrollments = await Enrollment.find({
                        category: req.query.category,
                        year: date.getFullYear(),
                     })
                        .populate({
                           path: "student",
                           model: "user",
                           select: "-password",
                           match: filter,
                        })
                        .populate({
                           path: "category",
                           select: "name",
                        });

                     for (let x = 0; x < enrollments.length; x++) {
                        let user = {};
                        if (enrollments[x].student) {
                           user = {
                              _id: enrollments[x].student._id,
                              type: req.query.type,
                              dni: enrollments[x].student.dni,
                              name: enrollments[x].student.name,
                              lastname: enrollments[x].student.lastname,
                              studentnumber:
                                 enrollments[x].student.studentnumber,
                              category: enrollments[x].category.name,
                              ...(enrollments[x].student.cel && {
                                 cel: enrollments[x].student.cel,
                              }),
                              ...(enrollments[x].student.dob && {
                                 dob: enrollments[x].student.dob,
                              }),
                           };
                           users.push(user);
                        }
                     }
                  } else {
                     const students = await User.find(filter)
                        .select("-password")
                        .sort({ lastname: 1, name: 1 });

                     for (let x = 0; x < students.length; x++) {
                        let user = {};
                        const date = new Date();

                        const enrollment = await Enrollment.findOne({
                           student: students[x]._id,
                           year: date.getFullYear(),
                        }).populate({ path: "category", select: "name" });

                        user = {
                           _id: students[x]._id,
                           type: req.query.type,
                           dni: students[x].dni,
                           name: students[x].name,
                           lastname: students[x].lastname,
                           studentnumber: students[x].studentnumber,
                           ...(enrollment && {
                              category: enrollment.category.name,
                           }),
                           ...(students[x].cel && { cel: students[x].cel }),
                           ...(students[x].dob && { dob: students[x].dob }),
                        };
                        users.push(user);
                     }
                  }
                  break;
               case "Tutor":
                  const name = req.query.studentname;
                  const lastname = req.query.studentlastname;
                  if (name || lastname) {
                     const filter2 = {
                        ...(name && {
                           name: { $regex: `.*${name}.*`, $options: "i" },
                        }),
                        ...(lastname && {
                           lastname: {
                              $regex: `.*${lastname}.*`,
                              $options: "i",
                           },
                        }),
                     };

                     const allusers = await User.find(filter)
                        .populate({
                           path: "children",
                           model: "user",
                           select: ["name", "lastname"],
                           match: filter2,
                        })
                        .select("-password")
                        .sort({ lastname: 1, name: 1 });

                     for (let x = 0; x < allusers.length; x++) {
                        for (let y = 0; y < allusers[x].children.length; y++) {
                           if (allusers[x].children[y].user !== null)
                              users.push(allusers[x]);
                        }
                     }

                     search = false;
                  }
                  break;
               case "Secretaria":
               case "Administrador":
                  filter.type = {
                     $in: ["Administrador", "Secretaria", "Admin/Profesor"],
                  };
                  break;
               case "Profesor":
                  filter.type = { $in: ["Profesor", "Admin/Profesor"] };
                  break;
               case "Alumno y Tutor":
                  filter.type = { $in: ["Alumno", "Tutor"] };
                  break;
               case "Team":
                  filter.type = {
                     $in: ["Admin/Profesor", "Profesor", "Secretaria"],
                  };
                  break;
               default:
                  break;
            }
         }

         if (search)
            users = await User.find(filter)
               .select("-password")
               .populate({
                  path: "children",
                  model: "user",
                  select: "-password",
               })
               .sort({ lastname: 1, name: 1 });
      }

      if (users.length === 0) {
         return res.status(400).json({
            msg: "No se encontraron usuarios con dichas descripciones",
         });
      }
      res.json(users);
   } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
   }
});

//@route    GET api/users/:id
//@desc     Get a user
//@access   Private
router.get("/:id", auth, async (req, res) => {
   try {
      const user = await User.findOne({ _id: req.params.id })
         .select("-password")
         .populate({ path: "town", select: "name" })
         .populate({ path: "neighbourhood", select: "name" })
         .populate({ path: "children", select: "-password" });

      if (!user) {
         return res
            .status(400)
            .json({ msg: "No se pudo encontrar el usuario" });
      }

      res.json(user);
   } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
   }
});

//@route    GET api/users/tutor/:id
//@desc     Get a user's tutors
//@access   Private
router.get("/tutor/:id", auth, async (req, res) => {
   try {
      const users = await User.find({ children: req.params.id }).select(
         "-password"
      );

      if (users.length === 0) {
         return res.status(400).json({
            msg: "No se pudieron encontrar usuarios con esas descripciones",
         });
      }
      res.json(users);
   } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
   }
});

//@route    GET api/users/register/number
//@desc     Get last studentnumber
//@access   Private
router.get("/register/number", [auth, adminAuth], async (req, res) => {
   try {
      let studentnumber = 1;
      const number = await User.find({ type: "Alumno" })
         .sort({ $natural: -1 })
         .limit(1);

      if (number[0] !== undefined) {
         studentnumber = Number(number[0].studentnumber) + 1;
      }
      res.json(studentnumber);
   } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
   }
});

//@route    GET api/users/active/:type
//@desc     Get active users
//@access   Private
router.get("/active/:type", [auth, adminAuth], async (req, res) => {
   try {
      const users = await User.find({
         type:
            req.params.type === "Profesor"
               ? { $in: ["Profesor", "Admin/Profesor"] }
               : req.params.type,
         active: true,
      });

      res.json(users.length);
   } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
   }
});

//@route    POST api/users/create-list
//@desc     Create a pdf of users
//@access   Private
router.post("/create-list", (req, res) => {
   const nameReport = "reports/users.pdf";

   const { users, usersType } = req.body;

   let tbody = "";
   let thead = "";

   if (usersType === "Alumno") {
      thead =
         "<th>Legajo</th><th>Nombre</th><th>Edad</th><th>Celular</th><th>Categoría</th>";
   } else {
      thead = "<th>Nombre</th><th>Email</th><th>Celular</th>";
      switch (usersType) {
         case "Tutor":
            thead += "<th>Nombre Alumno</th>";
            break;
         case "Profesor":
         case "Administrador":
            thead += "<th>Fecha Nacimiento</th>";
            if (usersType === "Administrador") thead += "<th>Rol</th>";
            break;
         default:
            break;
      }
   }

   let name = "";
   let cel = "";

   for (let x = 0; x < users.length; x++) {
      name = "<td>" + users[x].lastname + ", " + users[x].name + "</td>";
      cel = "<td>" + (users[x].cel ? users[x].cel : "") + "</td>";

      if (usersType === "Alumno") {
         const years =
            "<td>" +
            (users[x].dob ? moment().diff(users[x].dob, "years", false) : "") +
            "</td>";
         const studentnumber = "<td>" + users[x].studentnumber + "</td>";
         category =
            "<td>" + (users[x].category ? users[x].category : "") + "</td>";

         tbody +=
            "<tr>" + studentnumber + name + years + cel + category + "</tr>";
      } else {
         const email =
            "<td>" + (users[x].email ? users[x].email : "") + "</td>";

         if (usersType === "Tutor") {
            const studentname =
               "<td>" +
               (users[x].children.length > 0
                  ? users[x].children[0].user.lastname +
                    ", " +
                    users[x].children[0].user.name
                  : "") +
               "</td>";
            tbody += "<tr>" + name + email + cel + studentname + "</tr>";
         } else {
            const dob =
               "<td>" +
               (users[x].dob ? moment(users[x].dob).format("DD/MM/YY") : "") +
               "</td>";
            if (usersType === "Profesor")
               tbody += "<tr>" + name + email + cel + dob + "</tr>";
            else {
               const type = "<td>" + users[x].type + "</td>";
               tbody += "<tr>" + name + email + cel + dob + type + "</tr>";
            }
         }
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
      "../../templates/list/style.css"
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

   pdf.create(
      pdfTemplate(
         css,
         img,
         usersType === "Alumno" ? "Alumnos" : usersType + "es",
         thead,
         tbody
      ),
      options
   ).toFile(nameReport, (err) => {
      if (err) {
         res.send(Promise.reject());
      }

      res.send(Promise.resolve());
   });
});

//@route    GET api/users/lista/fetch-list
//@desc     Get the pdf of users
//@access   Private
router.get("/lista/fetch-list", (req, res) => {
   res.sendFile(path.join(__dirname, "../../reports/users.pdf"));
});

//@route    POST api/users
//@desc     Register user
//@access   Private
router.post(
   "/",
   [
      auth,
      adminAuth,
      check("name", "El nombre es necesario").not().isEmpty(),
      check("lastname", "El apellido es necesario").not().isEmpty(),
      check("type", "Debe seleccionar un tipo de usuario").not().isEmpty(),
   ],
   async (req, res) => {
      let studentnumber = 1;
      const {
         name,
         lastname,
         email,
         tel,
         cel,
         type,
         dni,
         town,
         neighbourhood,
         address,
         dob,
         discount,
         chargeday,
         birthprov,
         birthtown,
         sex,
         degree,
         school,
         salary,
         children,
         description,
      } = req.body;

      let errors = [];
      const errorsResult = validationResult(req);
      if (!errorsResult.isEmpty()) {
         errors = errorsResult.array();
         return res.status(400).json({ errors });
      }

      var regex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
      if (email !== undefined && !regex.test(email))
         return res.status(400).json({
            value: email,
            msg: "El mail es inválido",
            params: "email",
            location: "body",
         });

      try {
         //See if users exists
         if (email) {
            user = await User.findOne({ email });

            if (user)
               return res
                  .status(400)
                  .json({ msg: "Ya existe un usuario con ese mail" });
         }

         const number = await User.find({ type: "Alumno" })
            .sort({ $natural: -1 })
            .limit(1);

         if (number[0]) {
            studentnumber = Number(number[0].studentnumber) + 1;
         }

         let data = {
            name,
            lastname,
            password: "12345678",
            email,
            tel,
            cel,
            type,
            dni,
            town,
            neighbourhood,
            address,
            dob,
            discount,
            chargeday,
            birthprov,
            birthtown,
            sex,
            degree,
            school,
            salary,
            description,
         };

         if (type === "Alumno") {
            data = {
               ...data,
               studentnumber,
               classroom: null,
            };
         }
         if (type === "Tutor") {
            let childrenList = [];
            for (let x = 0; x < children.length; x++) {
               childrenList.push(children[x]._id);
            }
            data = {
               ...data,
               children: childrenList,
            };
         }

         user = new User(data);

         //Encrypt password -- agregarlo a cuando se cambia el password
         const salt = await bcrypt.genSalt(10);

         user.password = await bcrypt.hash(user.password, salt);

         await user.save();

         user = await User.find().sort({ $natural: -1 }).limit(1);
         user = user[0];

         res.json(user._id);
      } catch (err) {
         console.error(err.message);
         return res.status(500).send("Server Error");
      }
   }
);

//@route    PUT api/users/:id
//@desc     Update another user
//@access   Private
router.put(
   "/:id",
   [
      auth,
      check("name", "El nombre es necesario").not().isEmpty(),
      check("lastname", "El apellido es necesario").not().isEmpty(),
   ],
   async (req, res) => {
      const {
         name,
         lastname,
         tel,
         cel,
         type,
         dni,
         town,
         neighbourhood,
         address,
         dob,
         discount,
         chargeday,
         birthprov,
         birthtown,
         sex,
         degree,
         school,
         salary,
         children,
         description,
         active,
         img,
      } = req.body;

      let errors = [];
      const errorsResult = validationResult(req);
      if (!errorsResult.isEmpty()) {
         errors = errorsResult.array();
         return res.status(400).json({ errors });
      }

      try {
         let imgObject = {
            public_id: "",
            url: "",
         };

         let user = await User.findOne({ _id: req.params.id });

         if (img.public_id !== "") {
            if (img.public_id !== user.img.public_id) {
               if (user.noImg === "") deletePictures(user.img);
               const uploadResponse = await cloudinaryUploader.uploader.upload(
                  img,
                  {
                     upload_preset: "english-center",
                  }
               );
               imgObject = {
                  public_id: uploadResponse.public_id,
                  url: uploadResponse.url,
               };
            }
         }

         if (!active) await inactivate(user._id, type);

         let data = {
            name,
            lastname,
            active,
            ...(tel && { tel }),
            ...(cel && { cel }),
            ...(type && { type }),
            ...(dni && { dni }),
            ...(town && { town }),
            ...(neighbourhood && { neighbourhood }),
            ...(address && { address }),
            ...(dob && { dob }),
            ...(discount && { discount }),
            ...(chargeday && { chargeday }),
            ...(birthprov && { birthprov }),
            ...(birthtown && { birthtown }),
            ...(sex && { sex }),
            ...(degree && { degree }),
            ...(school && { school }),
            ...(salary && { salary }),
            ...(children && { children }),
            ...(description && { description }),
            ...(imgObject.public_id !== "" && { img: imgObject, noImg: "" }),
         };

         if (discount) {
            if (discount.toString() !== user.discount.toString()) {
               const date = new Date();
               const month = date.getMonth() + 1;
               const yearl = date.getFullYear();
               let enrollments = await Enrollment.find({
                  student: req.params.id,
                  year: { $in: [yearl, yearl + 1] },
               }).populate({ path: "category", model: "category" });

               for (let x = 0; x < enrollments.length; x++) {
                  let installments = await Installment.find({
                     enrollment: enrollments[x]._id,
                     value: { $ne: 0 },
                     ...(enrollments[x].year === yearl.toString() && {
                        number: { $gte: month },
                     }),
                  });
                  let value = enrollments[x].category.value;
                  const disc = (value * discount) / 100;
                  value = Math.round((value - disc) / 10) * 10;
                  for (let y = 0; y < installments.length; y++) {
                     if (installments[y].number === 0) continue;
                     await Installment.findOneAndUpdate(
                        { _id: installments[y]._id },
                        { value }
                     );
                  }
               }
            }
         }

         await User.findOneAndUpdate({ _id: user._id }, { $set: data });

         res.json({ msg: "User Updated" });
      } catch (err) {
         console.error(err.message);
         return res.status(500).send("Server Error");
      }
   }
);

//@route    PUT api/users/credentials/:id
//@desc     Update another user's credentials
//@access   Private
router.put("/credentials/:id", [auth], async (req, res) => {
   const { password, email } = req.body;

   var regex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
   if (email !== undefined && !regex.test(email))
      return res.status(400).json({
         value: email,
         msg: "El mail es inválido",
         params: "email",
         location: "body",
      });

   try {
      //See if users exists
      if (email !== undefined) {
         user = await User.findOne({ email });
         if (user && user.id !== req.user.id && user.email !== email)
            return res
               .status(400)
               .json({ msg: "Ya existe un usuario con ese mail" });
      }

      let data = {
         ...(password !== undefined && { password }),
         ...(email !== undefined && { email }),
      };

      if (password !== undefined) {
         //Encrypt password -- agregarlo a cuando se cambia el password
         const salt = await bcrypt.genSalt(10);

         data.password = await bcrypt.hash(password, salt);
      }

      user = await User.findOneAndUpdate(
         { _id: req.params.id },
         { $set: data },
         { new: true }
      )
         .select("-password")
         .populate({ path: "town", select: "name" })
         .populate({ path: "neighbourhood", select: "name" })
         .populate({ path: "children", select: "-password" });

      res.json(user);
   } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
   }
});

//@route    DELETE api/users
//@desc     Delete user
//@access   Private
router.delete("/", auth, async (req, res) => {
   try {
      let user = await User.findOne({ _id: req.user.id });

      if (user.type !== "Administrador") {
         return res
            .status(400)
            .json({ errors: [{ msg: "Usuario sin autorización" }] });
      }
      //Remove user
      await User.findOneAndRemove({ _id: req.user.id });

      res.json({ msg: "User deleted" });
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
   }
});

//@route    DELETE api/users/:id
//@desc     Delete another user
//@access   Private
router.delete("/:id", [auth, adminAuth], async (req, res) => {
   try {
      //Remove user
      await User.findOneAndRemove({ _id: req.params.id });

      res.json({ msg: "User deleted" });
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
   }
});

function deletePictures(img) {
   cloudinary.v2.uploader.destroy(img.public_id, function (error, result) {
      if (error) {
         return result.status(400).json(error);
      }
      console.log(result);
   });
}

async function inactivate(user_id, type) {
   switch (type) {
      case "Alumno":
         const date = new Date();
         const month = date.getMonth() + 1;
         const year = date.getFullYear();

         await User.findOneAndUpdate({ _id: user_id }, { classroom: null });

         const grades = await Grade.find({ student: user_id });
         for (let x = 0; x < grades.length; x++) {
            await Grade.findOneAndRemove({ _id: grades[x]._id });
         }

         const attendances = await Attendance.find({ user: user_id });
         for (let x = 0; x < attendances.length; x++) {
            await Attendance.findOneAndRemove({ _id: attendances[x]._id });
         }

         const installments = await Installment.find({
            student: user_id,
            year,
            number: { $gt: month },
         });
         for (let x = 0; x < installments.length; x++) {
            await Installment.findOneAndRemove({ _id: installments[x]._id });
         }

         break;
      case "Profesor":
         const classes = await Class.find({ teacher: user_id });

         for (let x = 0; x < classes.length; x++) {
            await Class.findOneAndRemove({ _id: classes[x]._id });
         }
         break;
      default:
         break;
   }
}

module.exports = router;
