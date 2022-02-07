const mongoose = require("mongoose");

const GradeTypeSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
   },
   cambridge: {
      type: Boolean,
   },
   categories: [
      {
         category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "category",
         },
      },
   ],
});

const GradeType = mongoose.model("gradetypes", GradeTypeSchema);

module.exports = GradeType;
