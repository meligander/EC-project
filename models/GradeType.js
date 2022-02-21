const mongoose = require("mongoose");

const GradeTypeSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
   },
   percentage: {
      type: Boolean,
      default: false,
   },
   categories: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "category",
      },
   ],
});

const GradeType = mongoose.model("gradetype", GradeTypeSchema);

module.exports = GradeType;
