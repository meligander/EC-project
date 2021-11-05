const jwt = require("jsonwebtoken");
const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "../config/.env") });

module.exports = function (req, res, next) {
   const token = req.header("x-auth-token");

   if (!token) {
      return res
         .status(401)
         .json({ msg: "No hay Token, autorización denegada." });
   }

   try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded.user;
      next();
   } catch (err) {
      return res.status(401).json({ msg: "Su sesión ha expirado" });
   }
};
