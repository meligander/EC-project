const router = require("express").Router();
const { check, validationResult } = require("express-validator");

//Middleware
const auth = require("../../middleware/auth");
const adminAuth = require("../../middleware/adminAuth");

//Models
const Penalty = require("../../models/Penalty");

//@route    GET /api/penalty/last
//@desc     get last penalty
//@access   Private && Admin
router.get("/last", [auth, adminAuth], async (req, res) => {
   try {
      let penalty = await Penalty.find().sort({ $natural: -1 }).limit(1);
      penalty = penalty[0];

      if (!penalty) {
         return res.status(400).json({
            msg: "No se encontraron recargos con dichas descripciones",
         });
      }

      res.json(penalty);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    POST /api/penalty
//@desc     Add a penalty
//@access   Private && Admin
router.post(
   "/",
   [
      auth,
      adminAuth,
      check("percentage", "Debe agregar el nuevo porcentaje de recargo")
         .not()
         .isEmpty(),
   ],
   async (req, res) => {
      let errors = [];
      const errorsResult = validationResult(req);
      if (!errorsResult.isEmpty()) {
         errors = errorsResult.array();
         return res.status(400).json({ errors });
      }

      try {
         let penalty = new Penalty(req.body);

         await penalty.save();

         let penaltyToRemove = await Penalty.find()
            .sort({ $natural: -1 })
            .limit(2);

         penalty = penaltyToRemove[0];
         penaltyToRemove = penaltyToRemove[1];

         if (penaltyToRemove)
            await Penalty.findOneAndRemove({ _id: penaltyToRemove._id });

         res.json(penalty);
      } catch (err) {
         console.error(err.message);
         res.status(500).json({ msg: "Server Error" });
      }
   }
);

module.exports = router;
