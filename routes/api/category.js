const router = require("express").Router();
const { check, validationResult } = require("express-validator");

//Middlewares
const adminAuth = require("../../middleware/adminAuth");
const auth = require("../../middleware/auth");

//Models
const Category = require("../../models/Category");
const Installment = require("../../models/Installment");

//@route    GET /api/category
//@desc     get all categories
//@access   Private && Admin
router.get("/", auth, async (req, res) => {
   try {
      let categories = await Category.find();

      if (categories.length === 0) {
         return res.status(400).json({
            msg: "No se encontraron categorías con dichas descripciones",
         });
      }

      res.json(categories);
   } catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: "Server Error" });
   }
});

//@route    POST /api/category
//@desc     Add a category
//@access   Private && Admin
router.post(
   "/",
   [auth, adminAuth, check("name", "El nombre es necesario").not().isEmpty()],
   async (req, res) => {
      let { name, value } = req.body;

      if (typeof value === "string") value = Number(value.replace(/,/g, "."));

      let errors = [];
      const errorsResult = validationResult(req);
      if (!errorsResult.isEmpty()) {
         errors = errorsResult.array();
         return res.status(400).json({ errors });
      }

      try {
         const category = new Category({ name, value });

         await category.save();

         res.json(category);
      } catch (err) {
         console.error(err.message);
         res.status(500).json({ msg: "Server Error" });
      }
   }
);

//@route    PUT /api/category
//@desc     Update all categories
//@access   Private && Admin
router.put(
   "/",
   [
      auth,
      adminAuth,
      check("date", "El mes de actualización es necesario").not().isEmpty(),
   ],
   async (req, res) => {
      //An array of categories
      const { categories, date } = req.body;

      const month = new Date(date).getMonth() + 1;
      const year = new Date(date).getFullYear();

      let errors = [];
      const errorsResult = validationResult(req);
      if (!errorsResult.isEmpty()) {
         errors = errorsResult.array();
         return res.status(400).json({ errors });
      }

      if (
         categories.some(
            (category) => category.value === 0 || category.value === ""
         )
      )
         return res
            .status(400)
            .json({ msg: "El valor debe estar definido y ser mayor a 0" });

      try {
         for (let x = 0; x < categories.length; x++) {
            const category = categories[x];

            const value =
               typeof category.value === "string"
                  ? Number(category.value.replace(/,/g, "."))
                  : category.value;

            await Category.findOneAndUpdate({ _id: category._id }, { value });

            let installments = [];

            if (category.name === "Inscripción") {
               installments = await Installment.find({
                  number: 0,
                  year: { $gte: year },
                  value: { $ne: 0 },
                  updatable: true,
               });

               await installments.forEach(
                  async (inst) =>
                     await Installment.findOneAndUpdate(
                        { _id: inst._id },
                        { $set: { value, status: "debt" } }
                     )
               );
            } else {
               installments = await Installment.find({
                  number: { $ne: 0 },
                  year: { $gte: year },
                  value: { $ne: 0 },
                  updatable: true,
               })
                  .populate({
                     model: "user",
                     path: "student",
                     select: "-password",
                  })
                  .populate({
                     model: "enrollment",
                     path: "enrollment",
                     match: {
                        category: category._id,
                     },
                  });

               await installments.forEach(async (inst) => {
                  if (
                     inst.enrollment &&
                     (inst.year > year || inst.number >= month)
                  ) {
                     const discount = inst.student.discount;
                     let newValue =
                        discount &&
                        discount !== 0 &&
                        (inst.number !== 3 || discount !== 50)
                           ? value - (value * discount) / 100
                           : value;

                     newValue =
                        Math.ceil(
                           ((inst.number === 3 ? newValue / 2 : newValue) +
                              Number.EPSILON) /
                              10
                        ) * 10;

                     await Installment.findOneAndUpdate(
                        { _id: inst._id },
                        {
                           $set: {
                              value: newValue,
                              status:
                                 year > inst.year ||
                                 (year === inst.year && month >= inst.number)
                                    ? "debt"
                                    : "valid",
                           },
                        }
                     );
                  }
               });
            }
         }

         res.json({ msg: "Categories Prices Updated" });
      } catch (err) {
         console.error(err.message);
         res.status(500).json({ msg: "Server Error" });
      }
   }
);

module.exports = router;
