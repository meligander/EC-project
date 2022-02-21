const mongoose = require("mongoose");

const ObservationSchema = new mongoose.Schema({
   description: {
      type: String,
      required: true,
   },
   period: {
      type: Number,
      required: true,
   },
   classroom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "class",
      required: true,
   },
   student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
   },
});

const Observation = mongoose.model("observation", ObservationSchema);

module.exports = Observation;
