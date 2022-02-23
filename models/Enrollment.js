const mongoose = require("mongoose");

const EnrollmentSchema = new mongoose.Schema({
   student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
   },
   year: {
      type: Number,
      required: true,
   },
   category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: true,
   },
   classroom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "class",
      default: null,
   },
   date: {
      type: Date,
      default: Date.now,
   },
});

const Enrollment = mongoose.model("enrollment", EnrollmentSchema);

module.exports = Enrollment;
