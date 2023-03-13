const router = require("express").Router();
const { check, validationResult } = require("express-validator");

//Sending Email
const { sendEmail } = require("../../other/emailSender");

//Middleware
const auth = require("../../middleware/auth");
const adminAuth = require("../../middleware/adminAuth");

//Models
const Installment = require("../../models/Installment");
const Global = require("../../models/Global");
const User = require("../../models/User");

//@route    GET /api/installment
//@desc     Get all installments || with filters
//@access   Private && Admin
router.get("/", [auth, adminAuth], async (req, res) => {
   try {
      let installments = [];

      const { year, number, name, lastname } = req.query;

      if (Object.entries(req.query).length === 0) {
         installments = await Installment.find({
            value: { $ne: 0 },
            status: { $ne: "valid" },
         })
            .populate({
               path: "student",
               model: "user",
               select: ["name", "lastname"],
            })
            .populate({
               path: "enrollment",
               select: ["category"],
               populate: {
                  path: "category",
               },
            });
      } else {
         installments = await Installment.find({
            value: { $ne: 0 },
            status: { $ne: "valid" },
            ...(year && { year }),
            ...(number && { number }),
         })
            .populate({
               path: "student",
               model: "user",
               select: ["name", "lastname"],
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
            })
            .populate({
               path: "enrollment",
               select: ["category"],
               populate: {
                  path: "category",
               },
            });

         installments = installments.filter((item) => item.student);
      }

      installments = sortArray(installments);

      if (installments.length === 0) {
         return res.status(400).json({
            msg: "No se encontraron deudas con dichas descripciones",
         });
      }

      res.json(installments);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    GET /api/installment/:id
//@desc     Get one installment
//@access   Private && Admin
router.get("/:id", [auth, adminAuth], async (req, res) => {
   try {
      const installment = await Installment.findOne({
         _id: req.params.id,
      }).populate({
         path: "student",
         model: "user",
         select: ["name", "lastname", "_id"],
      });

      res.json(installment);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    GET /api/installment/student/:id
//@desc     Get all student's installments
//@access   Private
router.get("/student/:id/:type", auth, async (req, res) => {
   try {
      const { type, id } = req.params;

      const installments = await Installment.find({
         student: id,
         ...(type === "student" && { status: { $ne: "valid" } }),
         ...(type !== "all" && { value: { $ne: 0 } }),
      })
         .sort({ year: -1, number: 1 })
         .populate({
            path: "student",
            model: "user",
            select: ["name", "lastname", "studentnumber"],
         })
         .populate({
            path: "enrollment",
            model: "enrollment",
            populate: {
               path: "category",
            },
         });

      if (installments.length === 0) {
         return res.status(400).json({
            msg: "No se encontraron deudas con dichas descripciones",
         });
      }

      res.json(installments);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    GET /api/installment/month/debts
//@desc     Get the total debt
//@access   Private && Admin
router.get("/month/debts", [auth, adminAuth], async (req, res) => {
   try {
      const installments = await Installment.find({
         value: { $ne: 0 },
         status: { $ne: "valid" },
      });

      res.json(installments.reduce((sum, item) => sum + item.value, 0));
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    GET /api/installment/profit/:month
//@desc     get the profit for a specific month
//@access   Private && Admin
router.get("/profit/:month", [auth, adminAuth], async (req, res) => {
   try {
      const date = new Date();
      const month = date.getMonth() <= 2 ? 3 : Number(req.params.month);

      const installments = await Installment.find({
         year: date.getFullYear(),
         number: month === 12 ? { $lte: 12 } : month + 1,
      });

      const money = installments.reduce((sum, item) => sum + item.value, 0);

      res.json(money);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    POST /api/installment
//@desc     Add an installment
//@access   Private && Admin
router.post(
   "/",
   [
      auth,
      adminAuth,
      check("number", "La cuota es necesaria").not().isEmpty(),
      check("student", "El alumno es necesario").not().isEmpty(),
      check("year", "El año es necesario").not().isEmpty(),
      check("value", "El valor es necesario").not().isEmpty(),
      check("status", "El estado de la cuota es necesario").not().isEmpty(),
   ],
   async (req, res) => {
      const { number, year, enrollment, value } = req.body;

      try {
         let errors = [];
         const errorsResult = validationResult(req);
         if (!errorsResult.isEmpty()) {
            errors = errorsResult.array();
            return res.status(400).json({ errors });
         }

         let installment;

         if (enrollment) {
            installment = await Installment.findOne({
               enrollment,
               year,
               number,
            });

            if (installment) {
               return res.status(400).json({
                  msg: "Ya existe una cuota de ese alumno para dicho año y mes",
               });
            }
         }

         installment = new Installment({
            ...req.body,
            value:
               typeof value === "string"
                  ? Number(value.replace(/,/g, "."))
                  : value,
            ...(enrollment && { enrollment: enrollment.id }),
         });

         await installment.save();

         installment = await Installment.findOne({ _id: installment._id })
            .populate({
               path: "student",
               model: "user",
               select: ["name", "lastname", "studentnumber"],
            })
            .populate({
               path: "enrollment",
               model: "enrollment",
               populate: {
                  path: "category",
               },
            });

         res.json(installment);
      } catch (err) {
         console.error(err.message);
         res.status(500).json({ msg: "Server Error" });
      }
   }
);

//@route    PUT /api/installment/:id
//@desc     Update an installment
//@access   Private && Admin
router.put(
   "/:id",
   [
      auth,
      adminAuth,
      check("value", "El valor es necesario").not().isEmpty(),
      check("status", "El estado de la cuota es necesario").not().isEmpty(),
   ],
   async (req, res) => {
      const { value } = req.body;

      let errors = [];
      const errorsResult = validationResult(req);
      if (!errorsResult.isEmpty()) {
         errors = errorsResult.array();
         return res.status(400).json({ errors });
      }

      try {
         const installment = await Installment.findOneAndUpdate(
            { _id: req.params.id },
            {
               $set: {
                  ...req.body,
                  value:
                     typeof value === "string"
                        ? Number(value.replace(/,/g, "."))
                        : value,
               },
            },
            { new: true }
         )
            .populate({
               path: "student",
               model: "user",
               select: ["name", "lastname", "studentnumber"],
            })
            .populate({
               path: "enrollment",
               model: "enrollment",
               populate: {
                  path: "category",
               },
            });

         res.json(installment);
      } catch (err) {
         console.error(err.message);
         res.status(500).json({ msg: "Server Error" });
      }
   }
);

//@route    PUT /api/installment
//@desc     Update the installment's price when expired (automatically)
//@access   Private
router.put("/", auth, async (req, res) => {
   try {
      const date = new Date();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const day = date.getDate();
      const hours = date.getHours();

      console.log(
         hours,
         hours >= 6 && hours < 12
            ? "¡Buen día!"
            : hours >= 12 && hours < 19
            ? "¡Buenas tardes!"
            : "¡Buenas noches!"
      );

      const lessDay = [4, 6, 9, 11].includes(month);

      let installments = await Installment.find({
         number: { $lte: month, $ne: 0 },
         year,
         status: { $ne: "expired" },
         value: { $gte: 1000 },
      }).populate({
         path: "student",
         model: "user",
         select: "-password",
      });

      installments = [
         ...installments,
         ...(await Installment.find({
            year: { $lt: year },
            value: { $gte: 1000 },
            number: { $gte: 3 },
            status: { $ne: "expired" },
         }).populate({
            path: "student",
            model: "user",
            select: "-password",
         })),
         ...(await Installment.find({
            year: { $lte: year },
            value: { $ne: 0 },
            number: 0,
            status: { $ne: "expired" },
            $expr: {
               $gt: [
                  { $subtract: ["$$NOW", "$date"] },
                  1000 * 60 * 60 * 24 * 90,
               ],
            },
         }).populate({
            path: "student",
            model: "user",
            select: "-password",
         })),
      ];

      const penalty = await Global.findOne({ type: "penalty" });

      if (!penalty)
         return res.status(400).json({
            msg: "Por favor, establezca el recargo a aplicar a las cuotas",
         });

      for (let x = 0; x < installments.length; x++) {
         const student = installments[x].student;
         const chargeDay = student.chargeday
            ? student.chargeday - (lessDay ? 1 : 0)
            : lessDay
            ? 30
            : 31;

         if (
            !(installments[x].number === 3 && month === 3) &&
            chargeDay - 3 <= day &&
            installments[x].status !== "warned" &&
            process.env.NODE_ENV === "production"
         ) {
            const greeting =
               (hours >= 6 && hours < 12
                  ? "¡Buen día!"
                  : hours >= 12 && hours < 19
                  ? "¡Buenas tardes!"
                  : "¡Buenas noches!") + "<br/>";

            let users = await User.find({
               children: student._id,
            }).select("-password");

            users.push(student);

            for (let x = 0; x < users.length; x++) {
               if (users[x].email)
                  await sendEmail(
                     users[x].email,
                     "Cuota por vencer",
                     `${greeting}
                     Le queríamos comunicar que la cuota del corriente mes del alumno
                      ${student.lastname}, ${student.name} está proxima a su vencimiento.
                     <br/>
                     El día ${chargeDay} se le aplicará un recargo del ${penalty.number}%.
                     <br/>
                     Este es un mensaje automático. Si usted ya realizó dicho pago ignore este email.
                     <br/><br/>
                     Muchas gracias y disculpe las molestias.`
                  );
            }

            await Installment.findOneAndUpdate(
               { _id: installments[x].id },
               { status: "warned" }
            );
         }

         if (
            (installments[x].number === 0 ||
               installments[x].year < year ||
               installments[x].number < month ||
               chargeDay < day) &&
            !(installments[x].number === 3 && month === 3)
         ) {
            await Installment.findOneAndUpdate(
               { _id: installments[x].id },
               {
                  value:
                     Math.ceil(
                        ((student.discount === 10 &&
                        installments[x].number !== 0
                           ? installments[x].value * 1.11
                           : (installments[x].value * penalty.number) / 100 +
                             installments[x].value) +
                           Number.EPSILON) /
                           100
                     ) * 100,
                  status: "expired",
               }
            );
         } else {
            if (installments[x].status === "valid") {
               await Installment.findOneAndUpdate(
                  { _id: installments[x].id },
                  { status: "debt" }
               );
            }
         }
      }

      res.json({ msg: "Installments updated" });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    DELETE /api/installment/:id
//@desc     Delete an installment
//@access   Private && Admin
router.delete("/:id", [auth, adminAuth], async (req, res) => {
   try {
      //Remove Installment
      await Installment.findOneAndRemove({ _id: req.params.id });

      res.json({ msg: "Installment deleted" });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@desc Function to sort and array by name
const sortArray = (array) => {
   const sortedArray = array.sort((a, b) => {
      if (a.student.lastname > b.student.lastname) return 1;
      if (a.student.lastname < b.student.lastname) return -1;

      if (a.student.name > b.student.name) return 1;
      if (a.student.name < b.student.name) return -1;

      if (a.student.year > b.student.year) return 1;
      if (a.student.year < b.student.year) return -1;

      if (a.student.number > b.student.number) return 1;
      if (a.student.number < b.student.number) return -1;
   });

   return sortedArray;
};

module.exports = router;
