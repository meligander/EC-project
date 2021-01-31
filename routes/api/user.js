const express = require("express");
const bcrypt = require("bcryptjs");
const cloudinary = require("cloudinary");
const moment = require("moment");
const path = require("path");
const pdf = require("html-pdf");
const { check, validationResult } = require("express-validator");
const router = express.Router();

//Uploading Img
const cloudinaryUploader = require("../../config/imageUploading");

//Middleware
const auth = require("../../middleware/auth");
const adminAuth = require("../../middleware/adminAuth");

//PDF Templates
const pdfTemplate = require("../../templates/list");

//Models
const User = require("../../models/User");
const Enrollment = require("../../models/Enrollment");
const Installment = require("../../models/Installment");
const Grade = require("../../models/Grade");
const Attendance = require("../../models/Attendance");
const Post = require("../../models/Post");
const Class = require("../../models/Class");

//@route    GET /api/user
//@desc     Get all user || with filter
//@access   Public
router.get("/", async (req, res) => {
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
               case "student":
                  search = false;
                  const classroom = req.query.classroom;
                  if (req.query.category) {
                     const date = new Date();
                     const enrollments = await Enrollment.find({
                        ...(classroom && {
                           "classroom._id":
                              classroom === "null" ? null : classroom,
                        }),
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
                           ...(classroom && { "classroom._id": classroom }),
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

                        if (!classroom) {
                           users.push(user);
                        } else {
                           if (enrollment) {
                              users.push(user);
                           }
                        }
                     }
                  }
                  break;
               case "guardian":
                  const name = req.query.studentname;
                  const lastname = req.query.studentlastname;

                  if (name || lastname) {
                     search = false;

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
                  }
                  break;
               case "admin":
                  filter.type = {
                     $in: ["admin", "secretary", "admin&teacher"],
                  };
                  break;
               case "teacher":
                  filter.type = { $in: ["teacher", "admin&teacher"] };
                  break;
               case "guardian/student":
                  filter.type = { $in: ["student", "guardian"] };
                  break;
               case "team":
                  filter.type = {
                     $in: ["admin&teacher", "teacher", "secretary"],
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

//@route    GET /api/user/:id
//@desc     Get a user
//@access   Private
router.get("/:id", auth, async (req, res) => {
   try {
      const user = await User.findOne({ _id: req.params.id })
         .select("-password")
         .populate({ path: "town", select: "name" })
         .populate({ path: "neighbourhood", select: "name" })
         .populate({ path: "children", model: "user", select: "-password" });

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

//@route    GET /api/user/tutor/:id
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

//@route    GET /api/user/register/number
//@desc     Get last studentnumber
//@access   Private && Admin
router.get("/register/number", [auth, adminAuth], async (req, res) => {
   try {
      let studentnumber = 1;
      const number = await User.find({ type: "student" })
         .sort({ $natural: -1 })
         .limit(1);

      if (number[0]) {
         studentnumber = Number(number[0].studentnumber) + 1;
      }
      res.json(studentnumber);
   } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
   }
});

//@route    GET /api/user/lista/fetch-list
//@desc     Get the pdf of users
//@access   Private
router.get("/lista/fetch-list", auth, (req, res) => {
   res.sendFile(path.join(__dirname, "../../reports/users.pdf"));
});

//@route    POST /api/user
//@desc     Register user
//@access   Private && Admin
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
      if (email && !regex.test(email))
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

         const number = await User.find({ type: "student" })
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

         if (type === "student") {
            data = {
               ...data,
               studentnumber,
            };
         }
         if (type === "guardian") {
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

         user = await User.find()
            .sort({ $natural: -1 })
            .select("-password")
            .populate({ path: "town", select: "name" })
            .populate({ path: "neighbourhood", select: "name" })
            .populate({ path: "children", select: "-password" })
            .limit(1);
         user = user[0];

         res.json(user._id);
      } catch (err) {
         console.error(err.message);
         return res.status(500).send("Server Error");
      }
   }
);

//@route    POST /api/user/create-list
//@desc     Create a pdf of users
//@access   Private
router.post("/create-list", auth, (req, res) => {
   const nameReport = path.join(__dirname, "../../reports/users.pdf");

   const { users, usersType } = req.body;

   if (users.length === 0)
      return res.status(400).json({
         msg: "Primero debe realizar una búsqueda",
      });

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
               (users[x].dob
                  ? moment(users[x].dob).utc().format("DD/MM/YY")
                  : "") +
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

   try {
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
   } catch (err) {
      console.error(err.message);
      return res.status(500).send("PDF Error");
   }
});

//@route    PUT /api/user/:id
//@desc     Update a user
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

         if (!active) await inactivateUser(user._id, type, false);

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

         if (discount && discount !== user.discount) {
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
                  ...(enrollments[x].year === yearl && {
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
                     { value, expired: false }
                  );
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

//@route    PUT /api/user/credentials/:id
//@desc     Update user's credentials
//@access   Private
router.put("/credentials/:id", auth, async (req, res) => {
   const { password, password2, email } = req.body;

   var regex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
   if (email && !regex.test(email))
      return res.status(400).json({
         value: email,
         msg: "El mail es inválido",
         params: "email",
         location: "body",
      });

   try {
      if ((password !== "" || password2 !== "") && password !== password2)
         return res
            .status(400)
            .json({ msg: "Las contraseñas deben coincidir" });

      //See if users exists
      if (email) {
         user = await User.findOne({ email });
         if (user && user.id !== req.user.id && user.email !== email)
            return res
               .status(400)
               .json({ msg: "Ya existe un usuario con ese mail" });
      }

      let data = {
         ...(email && { email }),
      };

      if (password) {
         if (password.length < 6) {
            return res
               .status(400)
               .json({ msg: "La contraseña debe contener 6 carácteres o más" });
         }

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

//@route    DELETE /api/user/:id
//@desc     Delete a user
//@access   Private && Admin
router.delete("/:id/:type", [auth, adminAuth], async (req, res) => {
   try {
      //Remove user
      await User.findOneAndRemove({ _id: req.params.id });

      await inactivateUser(req.params.id, req.params.type, true);

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

async function inactivateUser(user_id, type, completeDeletion) {
   switch (type) {
      case "student":
         const date = new Date();
         const month = date.getMonth() + 1;
         const year = date.getFullYear();

         const enrollment = await Enrollment.findOneAndRemove({
            student: user_id,
            year,
         });
         await Enrollment.findOneAndRemove({
            student: user_id,
            year: year + 1,
         });

         if (enrollment && enrollment.classroom._id) {
            const grades = await Grade.find({
               student: user_id,
               classroom: enrollment.classroom._id,
            });
            for (let x = 0; x < grades.length; x++) {
               await Grade.findOneAndRemove({ _id: grades[x]._id });
            }

            const attendances = await Attendance.find({
               student: user_id,
               classroom: enrollment.classroom._id,
            });
            for (let x = 0; x < attendances.length; x++) {
               await Attendance.findOneAndRemove({ _id: attendances[x]._id });
            }

            if (completeDeletion) {
               let posts = await Post.find({
                  classroom: enrollment.classroom._id,
                  user: user_id,
               });
               for (let x = 0; x < posts.length; x++) {
                  await Post.findOneAndDelete({ _id: posts[x] });
               }
               posts = await Post.find({
                  classroom: enrollment.classroom._id,
                  "comments.user": user_id,
               });
               let position = [];
               for (let x = 0; x < posts.length; x++) {
                  for (let y = 0; y < posts[x].comments.length; y++) {
                     if (posts[x].comments[y].user === user_id) {
                        position.unshift(y);
                     }
                  }
                  for (let y = 0; y < position.length; y++) {
                     posts[x].comments.splice(position, 1);
                  }
               }
               posts = await Post.find({
                  classroom: enrollment.classroom._id,
                  "likes.user": user_id,
               });
               for (let x = 0; x < posts.length; x++) {
                  for (let y = 0; y < posts[x].likes.length; y++) {
                     if (posts[x].likes[y].user === user_id) {
                        posts[x].likes.splice(y, 1);
                        break;
                     }
                  }
               }
            }
         }

         let installments = await Installment.find({
            student: user_id,
            ...(!completeDeletion && {
               year,
               number: { $gt: month },
            }),
         });
         for (let x = 0; x < installments.length; x++) {
            await Installment.findOneAndRemove({ _id: installments[x]._id });
         }
         if (!completeDeletion) {
            installments = await Installment.find({
               student: user_id,
               year: year + 1,
            });
            for (let x = 0; x < installments.length; x++) {
               await Installment.findOneAndRemove({ _id: installments[x]._id });
            }
         }

         break;
      case "teacher":
         const classes = await Class.find({ teacher: user_id });

         for (let x = 0; x < classes.length; x++) {
            const attendances = await Attendance.find({
               classroom: classes[x]._id,
            });
            for (let y = 0; y < attendances.length; y++) {
               await Attendance.findOneAndRemove({ _id: attendances[y]._id });
            }

            const grades = await Grade.find({ classroom: classes[x]._id });
            for (let y = 0; y < grades.length; y++) {
               await Grade.findOneAndRemove({ _id: grades[y]._id });
            }

            const posts = await Post.find({ classroom: classes[x]._id });
            for (let y = 0; y < posts.length; y++) {
               await Post.findOneAndDelete({ _id: posts[y] });
            }

            const enrollments = await Enrollment.find({
               "classroom._id": classes[x]._id,
            });
            for (let y = 0; y < enrollments.length; y++) {
               await User.findOneAndUpdate(
                  { _id: users[y]._id },
                  {
                     classroom: {
                        _id: null,
                        periodAbsence: [],
                        periodAverage: [],
                        average: null,
                        absence: null,
                     },
                  }
               );
            }

            await Class.findOneAndRemove({ _id: classes[x]._id });
         }
         break;
      default:
         break;
   }
}

module.exports = router;
