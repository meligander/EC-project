const mongoose = require("mongoose");

const RegisterSchema = new mongoose.Schema({
   registermoney: {
      type: Number,
   },
   difference: {
      type: Number,
      default: 0,
   },
   temporary: {
      type: Boolean,
      default: true,
   },
   description: {
      type: String,
   },
   dateclose: {
      type: Date,
   },
   date: {
      type: Date,
      default: Date.now,
   },
});

const Register = mongoose.model("register", RegisterSchema);

module.exports = Register;
