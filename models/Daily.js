const mongoose = require("mongoose");

const DailySchema = new mongoose.Schema({
   register: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "register",
      required: true,
   },
   box: {
      type: Number,
      required: true,
   },
   envelope: {
      type: Number,
   },
   home: {
      type: Number,
   },
   bank: {
      type: Number,
   },
   change: {
      type: Number,
   },
   difference: {
      type: Number,
      required: true,
   },
   date: {
      type: Date,
      default: Date.now,
   },
});

const Daily = mongoose.model("daily", DailySchema);

module.exports = Daily;
