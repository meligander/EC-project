const mongoose = require("mongoose");

const EnrollmentSchema = new mongoose.Schema({
   student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
   },
   date: {
      type: Date,
      default: Date.now,
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
      _id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "class",
      },
      periodAverage: {
         type: Array,
      },
      average: {
         type: Number,
      },
      periodAbsence: {
         type: Array,
      },
      absence: {
         type: Number,
      },
   },
});

const Enrollment = mongoose.model("enrollment", EnrollmentSchema);

module.exports = Enrollment;
