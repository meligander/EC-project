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
   enrollment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "enrollment",
   },
   value: {
      type: Number,
      required: true,
   },
   status: {
      type: String,
      enum: ["valid", "debt", "warned", "expired"],
      required: true,
   },
   expired: {
      type: Boolean,
      default: false,
   },
   emailSent: {
      type: Boolean,
   },
   debt: {
      type: Boolean,
      default: false,
   },
   updatable: {
      type: Boolean,
      default: true,
   },
});

const Installment = mongoose.model("installment", InstallmentSchema);

module.exports = Installment;
