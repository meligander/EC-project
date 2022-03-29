const User = require("../models/User");

module.exports = async (req, res, next) => {
   try {
      let user = await User.findOne({ _id: req.user.id });

      if (
         user.type !== "admin" &&
         user.type !== "secretary" &&
         user.type !== "admin&teacher"
      ) {
         return res.status(401).json({
            msg: "Usuario sin autorización",
         });
      }
      next();
   } catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: "Server Error" });
   }
};
