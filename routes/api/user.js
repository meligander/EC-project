const router = require("express").Router();
const bcrypt = require("bcryptjs");
const cloudinary = require("cloudinary");
const { check, validationResult } = require("express-validator");

//Uploading Img
const cloudinaryUploader = require("../../config/imageUploading");

//Sending Email
const emailSender = require("../../config/emailSender");

//Middleware
const auth = require("../../middleware/auth");
const adminAuth = require("../../middleware/adminAuth");

//Models
const User = require("../../models/User");
const Enrollment = require("../../models/Enrollment");
const Installment = require("../../models/Installment");
const Grade = require("../../models/Grade");
const Attendance = require("../../models/Attendance");
const Class = require("../../models/Class");

//@route    GET /api/user
//@desc     Get all user || with filter
//@access   Public
router.get("/", async (req, res) => {
   try {
      let users = [];
      let search = true;
      const year = new Date().getFullYear();

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
                     const enrollments = await Enrollment.find({
                        "classroom._id": null,
                        category: req.query.category,
                        year,
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

                     users = enrollments
                        .filter((item) => item.student)
                        .map((item) => item.student)
                        .sort((a, b) => {
                           if (a.lastname > b.lastname) return 1;
                           if (a.lastname < b.lastname) return -1;

                           if (a.name > b.name) return 1;
                           if (a.name < b.name) return -1;
                        });
                  } else {
                     const students = await User.find(filter)
                        .select("-password")
                        .sort({ lastname: 1, name: 1 });

                     for (let x = 0; x < students.length; x++) {
                        const enrollment = await Enrollment.findOne({
                           student: students[x]._id,
                           year,
                           ...(classroom && { "classroom._id": classroom }),
                        }).populate({ path: "category", select: "name" });

                        users.push({
                           ...students[x].toJSON(),
                           ...(enrollment && {
                              category: enrollment.category.name,
                           }),
                        });
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

                     users = allusers.filter((user) =>
                        user.children.some((child) => child !== null)
                     );
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
      res.status(500).json({ msg: "Server Error" });
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
      res.status(500).json({ msg: "Server Error" });
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
      res.status(500).json({ msg: "Server Error" });
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
      res.status(500).json({ msg: "Server Error" });
   }
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
      let user = {};

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
            studentnumber,
            children,
         };

         user = new User(data);

         //Encrypt password -- agregarlo a cuando se cambia el password
         const salt = await bcrypt.genSalt(10);

         user.password = await bcrypt.hash(user.password, salt);

         await user.save();

         if (email) newUserEmail(type, email);

         user = await User.find()
            .sort({ $natural: -1 })
            .select("-password")
            .populate({ path: "town", select: "name" })
            .populate({ path: "neighbourhood", select: "name" })
            .populate({ path: "children", select: "-password" })
            .limit(1);
         user = user[0];

         res.json(user);
      } catch (err) {
         console.error(err.message);
         res.status(500).json({ msg: "Server Error" });
      }
   }
);

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
            if (user.img.public_id !== "") deletePictures(user.img);
            const uploadResponse = await cloudinaryUploader.uploader.upload(
               img,
               {
                  upload_preset: "english-center",
               }
            );
            imgObject = {
               public_id: uploadResponse.public_id,
               url: uploadResponse.secure_url,
            };
         }

         if (!active) await inactivateUser(user._id, type, false);

         let data = {
            name,
            lastname,
            active,
            sex,
            tel,
            cel,
            type,
            dni,
            town,
            neighbourhood,
            address,
            discount,
            chargeday,
            birthprov,
            birthtown,
            degree,
            school,
            salary,
            dob,
            ...(children
               ? { children }
               : user.children.length > 0 && { children: [] }),
            ...(imgObject.public_id !== "" && { img: imgObject }),
         };

         if (discount && discount !== user.discount) {
            const date = new Date();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            let enrollments = await Enrollment.find({
               student: req.params.id,
               year: { $in: [year, year + 1] },
            }).populate({ path: "category", model: "category" });

            for (let x = 0; x < enrollments.length; x++) {
               const installments = await Installment.find({
                  enrollment: enrollments[x]._id,
                  value: { $ne: 0 },
                  number: { $gte: enrollments[x].year === year ? month : 3 },
               });
               let value = enrollments[x].category.value;

               if (discount !== 0)
                  value =
                     Math.round((value - (value * discount) / 100) / 10) * 10;

               for (let y = 0; y < installments.length; y++)
                  if (!installments[y].halfPayed)
                     await Installment.findOneAndUpdate(
                        { _id: installments[y]._id },
                        {
                           $set: {
                              value:
                                 installments[y].number === 3
                                    ? value / 2
                                    : value,
                              expired: false,
                           },
                        }
                     );
            }
         }

         user = await User.findOneAndUpdate(
            { _id: user._id },
            { $set: data },
            { new: true }
         )
            .populate({ path: "town", select: "name" })
            .populate({ path: "neighbourhood", select: "name" });

         res.json(user);
      } catch (err) {
         console.error(err.message);
         res.status(500).json({ msg: "Server Error" });
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
      const oldCredentials = await User.findOne({ _id: req.params.id });

      if (!password && email === oldCredentials.email)
         return res.status(400).json({
            msg: "Modifique alguno de los datos para poder guardar los cambios",
         });

      if ((password !== "" || password2 !== "") && password !== password2)
         return res
            .status(400)
            .json({ msg: "Las contraseñas deben coincidir" });

      //See if users exists
      if (email) {
         user = await User.findOne({ email });

         if (user && user.id !== req.params.id)
            return res
               .status(400)
               .json({ msg: "Ya existe un usuario con ese mail" });
      }

      let data = {
         ...(email
            ? { email }
            : !email && oldCredentials.email && { email: "" }),
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

      if ((email && password) || email !== oldCredentials.email) {
         if (password && email !== oldCredentials.email)
            emailSender(
               email,
               "Cambio de credenciales",
               `El email y la constraseña se han modificado correctamente. 
               Desde ahora en más utilice este email para poder ingresar a nuestra página web.`
            );
         else {
            if (password)
               emailSender(
                  email,
                  "Cambio de contraseña",
                  "Se ha modificado correctamente la constraseña para poder ingresar a nuestra página web."
               );
            else {
               if (oldCredentials.email === "")
                  newUserEmail(oldCredentials.type, email);
               else
                  emailSender(
                     email,
                     "Cambio de email",
                     `Ahora puede ingresar a nuestra página web utilizando este email.`
                  );
            }
         }
      }

      res.json(user);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
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
      res.status(500).json({ msg: "Server Error" });
   }
});

const deletePictures = (img) => {
   cloudinary.v2.uploader.destroy(img.public_id, function (error, result) {
      if (error) {
         return result.status(400).json(error);
      }
      console.log(result);
   });
};

const inactivateUser = async (user_id, type, completeDeletion) => {
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
};

const newUserEmail = (type, email) => {
   let text = "";

   switch (type) {
      case "teacher":
         text = `revisar los cursos que tiene asignado, agregar notas e inasistencias como 
         también ver la información tanto de sus alumnos como de todas las personas involucradas 
         en la academia.`;
         break;
      case "student":
         text = `revisar sus notas, inasistencias y cuotas a pagar y ver información para contactar a 
      compañeros y profesor.`;
         break;
      case "guardian":
         text = `revisar las notas, inasistencias, cuotas a pagar y ver información 
         para contactar a los profesores.`;
         break;
      default:
         text = `realizar todo lo relacionado a la administración de la acamedia.`;
         break;
   }

   emailSender(
      email,
      "¡Bienvenido!",
      `¡Bienvenido a Villa de Merlo English Centre! <br/>Ahora podrá ingresar a nuestra página web
      utilizando este mail y la contraseña '12345678'. Le recomendamos que cambie la contraseña
       para que sea más seguro. <br/>En la página podrá ${text}`
   );
};

module.exports = router;
