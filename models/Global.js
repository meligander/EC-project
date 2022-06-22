const mongoose = require("mongoose");

const GlobalSchema = new mongoose.Schema({
   number: {
      type: Number,
      required: true,
   },
   type: {
      type: String,
      enum: ["penalty", "lowerSalary", "higherSalary", "adminSalary"],
      required: true,
   },
   date: {
      type: Date,
      default: Date.now,
   },
});

const Global = mongoose.model("global", GlobalSchema);

module.exports = Global;
