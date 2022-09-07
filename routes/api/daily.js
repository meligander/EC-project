const router = require("express").Router();
const addHours = require("date-fns/addHours");
const { check, validationResult } = require("express-validator");

//Middleware
const auth = require("../../middleware/auth");
const adminAuth = require("../../middleware/adminAuth");

//Models
const Daily = require("../../models/Daily");
const Register = require("../../models/Register");

//@route    GET /api/daily
//@desc     get all daily revenue || with filter
//@access   Private && Admin
router.get("/", [auth, adminAuth], async (req, res) => {
   try {
      let dailies;
      const year = new Date().getFullYear();

      if (Object.entries(req.query).length === 0) {
         dailies = await Daily.find({
            date: { $gte: new Date(`${year}-01-01`) },
         })
            .sort({ date: -1 })
            .populate({
               path: "register",
               model: "register",
               select: ["registermoney"],
            })
            .limit(10);
      } else {
         const { startDate, endDate } = req.query;

         const date = {
            ...(startDate && { $gte: addHours(new Date(startDate), 3) }),
            ...(endDate && { $lt: addHours(new Date(endDate), 27) }),
         };

         dailies = await Daily.find({
            date:
               startDate || endDate
                  ? date
                  : { $gte: new Date(`${year}-01-01`) },
         })
            .sort({ date: -1 })
            .populate({
               path: "register",
               model: "register",
               select: ["registermoney", "temporary"],
            });
      }

      if (dailies.length === 0) {
         return res.status(400).json({
            msg: "No se encontró información de las cajas diarias con dichas descripciones",
         });
      }

      res.json(dailies);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    POST /api/daily
//@desc     Add a daily revenue
//@access   Private && Admin
router.post(
   "/",
   [
      auth,
      adminAuth,
      check("box", "Debe ingresar el valor que hay en la caja negra")
         .not()
         .isEmpty(),
   ],
   async (req, res) => {
      const { register: registerid } = req.body;

      let errors = [];
      const errorsResult = validationResult(req);
      if (!errorsResult.isEmpty()) {
         errors = errorsResult.array();
         return res.status(400).json({ errors });
      }

      try {
         const register = await Register.findOne({ _id: registerid });

         if (!register || register.registermoney === 0)
            return res.status(400).json({
               msg: "Primero debe ingresar dinero antes de realizar el conteo de dinero",
            });

         if (register.temporary)
            return res.status(400).json({
               msg: "Primero debe cerrar la caja antes de realizar el conteo de dinero",
            });

         for (const x in req.body) {
            if (typeof req.body[x] === "string" && x !== "register") {
               req.body[x] = Number(req.body[x].replace(/,/g, "."));
               if (isNaN(req.body[x]))
                  return res.status(400).json({
                     msg: "Ingrese un número válido",
                  });
               if (req.body[x] < 0 && x !== "difference")
                  return res.status(400).json({
                     msg: "Ingrese un número positivo",
                  });
            }
         }

         let daily = new Daily(req.body);

         await daily.save();

         daily = await Daily.findOne({ _id: daily._id }).populate({
            path: "register",
            model: "register",
            select: ["registermoney", "temporary"],
         });

         res.json(daily);
      } catch (err) {
         console.error(err.message);
         res.status(500).json({ msg: "Server Error" });
      }
   }
);

//@route    DELETE /api/daily/:id
//@desc     Delete a daily revenue
//@access   Private && Admin
router.delete("/:id", [auth, adminAuth], async (req, res) => {
   try {
      await Daily.findOneAndRemove({
         _id: req.params.id,
      });

      res.json({ msg: "Daily deleted" });
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

module.exports = router;
