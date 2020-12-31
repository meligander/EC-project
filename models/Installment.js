const mongoose = require("mongoose");

const InstallmentSchema = new mongoose.Schema({
   number: {
      type: Number,
      required: true,
   },
   year: {
      type: Number,
      required: true,
   },
   student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
   },
   value: {
      type: Number,
      required: true,
   },
   expired: {
      type: Boolean,
   },
   enrollment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "enrollment",
   },
   debt: {
      type: Boolean,
      default: false,
   },
});

const Installment = mongoose.model("installment", InstallmentSchema);

module.exports = Installment;
