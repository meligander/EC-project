const router = require("express").Router();
const bcrypt = require("bcryptjs");
const cloudinary = require("cloudinary");
const { check, validationResult } = require("express-validator");

//Uploading Img
const cloudinaryUploader = require("../../config/imageUploading");

//Sending Email
const { newUser, changeCredentials } = require("../../config/emailSender");

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

const regex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;

//@route    GET /api/user
//@desc     Get all user || with filter
//@access   Public
router.get("/", async (req, res) => {
   try {
      let users = [];
      let search = true;
      const year = new Date().getFullYear();

      const {
         active,
         type,
         name,
         lastname,
         category,
         classroom,
         studentname,
         studentlastname,
         searchTab,
      } = req.query;

      if (Object.entries(req.query).length === 0) {
         users = await User.find().sort({ lastname: 1, name: 1 });
      } else {
         let filter = {
            ...(active && { active: active }),
            ...(type && { type: type }),
            ...(name && {
               name: { $regex: `.*${name}.*`, $options: "i" },
            }),
            ...(lastname && {
               lastname: { $regex: `.*${lastname}.*`, $options: "i" },
            }),
         };
         if (type) {
            switch (type) {
               case "student":
                  search = false;

                  if (category) {
                     const enrollments = await Enrollment.find({
                        ...(!searchTab && { classroom: null }),
                        category,
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
                        .map((item) => {
                           return {
                              ...item.student.toJSON(),
                              category: item.category.name,
                           };
                        })
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
                           ...(classroom && { classroom }),
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
                  const name = studentname;
                  const lastname = studentlastname;

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
      let user = {};

      let { email, type, dni, studentnumber, discount, children, salary } =
         req.body;

      if (salary && typeof salary === "string")
         salary = Number(salary.replace(/,/g, "."));

      let errors = [];
      const errorsResult = validationResult(req);
      if (!errorsResult.isEmpty()) {
         errors = errorsResult.array();
         return res.status(400).json({ errors });
      }

      if (email && !regex.test(email))
         return res.status(400).json({ msg: "El mail es inválido" });

      if (dni && dni.toString().length < 8)
         return res.status(400).json({ msg: "El DNI es inválido" });

      try {
         //See if users exists
         if (email) {
            user = await User.findOne({ email });

            if (user)
               return res
                  .status(400)
                  .json({ msg: "Ya existe un usuario con ese mail" });
         }

         let data = {
            ...req.body,
            password: "12345678",
            ...(type === "student"
               ? {
                    studentnumber,
                    discount: discount ? discount : 0,
                 }
               : { studentnumber: undefined }),
            ...(type === "guardian" && { children }),
            ...(salary && { salary }),
         };

         user = new User(data);

         await user.save();

         //Send email
         if (email) newUser(type, email);

         user = await User.findOne({ _id: user._id })
            .select("-password")
            .populate({ path: "town", select: "name" })
            .populate({ path: "neighbourhood", select: "name" })
            .populate({ path: "children", select: "-password" });

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
         tel,
         cel,
         relatedCellphones,
         dni,
         town,
         neighbourhood,
         address,
         dob,
         chargeday,
         birthprov,
         birthtown,
         degree,
         school,
         salary,
         type,
         children,
         active,
         img,
         discount,
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

         if (!active && user.active)
            await inactivateUser(user._id, type, false);

         let data = {
            ...req.body,
            ...((tel || user.tel) && { tel }),
            ...((cel || user.cel) && { cel }),
            ...((relatedCellphones || user.relatedCellphones) && {
               relatedCellphones,
            }),
            ...((dni || user.dni) && { dni }),
            ...((town || user.town) && { town }),
            ...((neighbourhood || user.neighbourhood) && { neighbourhood }),
            ...((address || user.address) && { address }),
            ...((dob || user.dob) && { dob }),
            ...((chargeday || user.chargeday) && { chargeday }),
            ...((birthprov || user.birthprov) && { birthprov }),
            ...((birthtown || user.birthtown) && { birthtown }),
            ...((discount || user.discount) && { discount }),
            ...((degree || user.degree) && { degree }),
            ...((school || user.school) && { school }),
            ...((salary || user.salary) && { salary }),
            ...((children || user.children) && { children }),
            ...(imgObject.public_id !== "" && { img: imgObject }),
         };

         if (discount && discount !== user.discount) {
            const date = new Date();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            const installments = await Installment.find({
               value: { $ne: 0 },
               year: { $gte: year },
               updatable: true,
               student: user._id,
            }).populate({
               model: "enrollment",
               path: "enrollment",
               populate: {
                  path: "category",
               },
            });

            await installments.forEach(async (inst) => {
               if (
                  inst.enrollment &&
                  (inst.year > year || inst.number >= month)
               ) {
                  const value = parseFloat(inst.enrollment.category.value);

                  let newValue =
                     discount &&
                     discount !== 0 &&
                     (inst.number !== 3 || discount !== 50)
                        ? value - (value * discount) / 100
                        : value;

                  newValue = inst.number === 3 ? newValue / 2 : newValue;

                  await Installment.findOneAndUpdate(
                     { _id: inst._id },
                     { $set: { value: newValue, expired: false } }
                  );
               }
            });
         }

         user = await User.findOneAndUpdate(
            { _id: user._id },
            { $set: data },
            { new: true }
         )
            .populate({ path: "town", select: "name" })
            .populate({ path: "neighbourhood", select: "name" })
            .populate({ path: "children", model: "user" });

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

   if (email && !regex.test(email))
      return res.status(400).json({
         value: email,
         msg: "El mail es inválido",
         params: "email",
         location: "body",
      });

   try {
      let user = await User.findOne({ _id: req.params.id });

      if (!password && email === user.email)
         return res.status(400).json({
            msg: "Modifique alguno de los datos para poder guardar los cambios",
         });

      if ((password !== "" || password2 !== "") && password !== password2)
         return res
            .status(400)
            .json({ msg: "Las contraseñas deben coincidir" });

      //See if users exists
      if (email) {
         const exists = await User.findOne({
            _id: { $ne: req.params.id },
            email,
         });

         if (exists)
            return res
               .status(400)
               .json({ msg: "Ya existe un usuario con ese mail" });
      } else {
         if (password)
            return res.status(400).json({
               msg: "No puede modificar la constraseña sin la existencia de un email",
            });
      }

      let data = {
         ...((email || user.email) && { email }),
      };

      if (password || (!password && user.email === "")) {
         if (password && password.length < 6) {
            return res
               .status(400)
               .json({ msg: "La contraseña debe contener 6 carácteres o más" });
         }

         //Encrypt password -- agregarlo a cuando se cambia el password
         const salt = await bcrypt.genSalt(10);

         data.password = await bcrypt.hash(
            !password && user.email === "" ? "12345678" : password,
            salt
         );
      }

      //Send email
      if (email && (password || email !== user.email))
         await changeCredentials(email, password, user);

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
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    DELETE /api/user/:id
//@desc     Delete a user
//@access   Private && Admin
router.delete("/:id/:type", [auth, adminAuth], async (req, res) => {
   try {
      const anyInstallment = await Installment.findOne({
         student: req.params.id,
         value: 0,
      });

      if (anyInstallment)
         return res.status(400).json({
            msg: "El alumno tiene cuotas relacionadas y no se puede eliminar. Para eso primero borre dichas cuotas.",
         });

      //Remove user
      await User.findOneAndRemove({ _id: req.params.id });

      await inactivateUser(req.params.id, req.params.type, true);

      res.json({ msg: "User deleted" });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@desc Function to delete an img from the cloud
const deletePictures = (img) => {
   cloudinary.v2.uploader.destroy(img.public_id, function (error, result) {
      if (error) {
         return result.status(400).json(error);
      }
      console.log(result);
   });
};

//@desc Function to eliminate all the info related to a user
const inactivateUser = async (user_id, type, completeDeletion) => {
   let filter;
   let enrollments = [];

   switch (type) {
      case "student":
         const date = new Date();
         const month = date.getMonth() + 1;
         const year = date.getFullYear();

         enrollments = await Enrollment.find({
            student: user_id,
            ...(!completeDeletion && { year: { $gte: year } }),
         });

         for (let x = 0; x < enrollments.length; x++) {
            const installments = await Installment.find({
               enrollment: enrollments[x]._id,
               value: { $ne: 0 },
               updatable: true,
            });

            await installments.forEach(async (item) => {
               if (completeDeletion || item.year > year || item.number >= month)
                  await Installment.findOneAndRemove({ _id: item._id });
            });
         }
         filter = {
            student: user_id,
            ...(!completeDeletion && {
               classroom: enrollments
                  .filter((item) => item.classroom)
                  .map((item) => item.classroom),
            }),
         };

         break;
      case "teacher":
      case "admin&teacher":
         const classes = await Class.find({ teacher: user_id });

         filter = { classroom: { $in: classes.map((item) => item._id) } };

         enrollments = await Enrollment.find(filter);

         await classes.forEach(
            async (item) => await Class.findOneAndRemove({ _id: item._id })
         );
         break;
      default:
         break;
   }

   if (filter) {
      const attendances = await Attendance.find(filter);

      await attendances.forEach(
         async (item) => await Attendance.findOneAndRemove({ _id: item._id })
      );

      const grades = await Grade.find(filter);

      await grades.forEach(
         async (item) => await Grade.findOneAndRemove({ _id: item._id })
      );

      await enrollments.forEach(async (item) => {
         if (type === "student")
            await Enrollment.findOneAndRemove({ _id: item._id });
         else
            await Enrollment.findOneAndUpdate(
               { _id: item._id },
               { $set: { classroom: null } }
            );
      });
   }
};

module.exports = router;
