const mongoose = require("mongoose");

const ExpenceTypeSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
   },
   type: {
      type: String,
      enum: ["expence", "withdrawal"],
      required: true,
   },
});

const ExpenceType = mongoose.model("expencetype", ExpenceTypeSchema);

module.exports = ExpenceType;
