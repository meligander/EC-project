const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

//Middleware
const auth = require("../../middleware/auth");

//Models
const User = require("../../models/User");

//@route    GET /api/auth
//@desc     Get user
//@access   Private
router.get("/", auth, async (req, res) => {
   try {
      let user = await User.findById(req.user.id)
         .select("-password")
         .populate({ path: "town", select: "name" })
         .populate({ path: "neighbourhood", select: "name" })
         .populate({
            path: "children",
            model: "user",
            select: ["name", "lastname", "studentnumber"],
         });

      res.json(user);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
   }
});

//@route    POST /api/auth
//@desc     Authenticate user when login & get token
//@access   Public
router.post(
   "/",
   [
      check("email", "Ingrese un email válido").isEmail(),
      check("password", "La contraseña es necesaria").exists(),
   ],
   async (req, res) => {
      let errors = [];
      const errorsResult = validationResult(req);
      if (!errorsResult.isEmpty()) {
         errors = errorsResult.array();
         return res.status(400).json({ errors });
      }

      const { email, password } = req.body;

      try {
         //See if users exists
         const user = await User.findOne({ email });

         if (!user) return res.status(400).json({ msg: "Email No Registrado" });

         const OKPassword = await user.comparePassword(password);

         if (!OKPassword)
            return res.status(400).json({ msg: "Contraseña Inválida" });

         if (!user.active)
            return res
               .status(400)
               .json({ msg: "Lo siento, ya no puede ingresar a la página." });

         const payload = {
            user: { id: user.id, type: user.type },
         };

         jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 60 * 60 * 3.5 },
            (err, token) => {
               if (err) throw err;
               res.json({ token });
            }
         );
      } catch (err) {
         console.error(err.message);
         res.status(500).json({ msg: "Server Error" });
      }
   }
);

module.exports = router;
