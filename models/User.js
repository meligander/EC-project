const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
   },
   lastname: {
      type: String,
      required: true,
   },
   email: {
      type: String,
   },
   password: {
      type: String,
      default: "12345678",
   },
   tel: {
      type: String,
   },
   cel: {
      type: String,
   },
   type: {
      type: String,
      required: true,
   },
   studentnumber: {
      type: Number,
   },
   dni: {
      type: Number,
   },
   town: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "town",
   },
   neighbourhood: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "neighbourhood",
   },
   address: {
      type: String,
   },
   dob: {
      type: Date,
   },
   discount: {
      type: Number,
   },
   chargeday: {
      type: Number,
   },
   birthprov: {
      type: String,
   },
   birthtown: {
      type: String,
   },
   sex: {
      type: String,
   },
   degree: {
      type: String,
   },
   school: {
      type: String,
   },
   salary: {
      type: Number,
   },
   children: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "user",
      },
   ],
   description: {
      type: String,
   },
   active: {
      type: Boolean,
      default: true,
   },
   img: {
      type: Object,
      default: {
         public_id: "",
         url: "",
      },
   },
   date: {
      type: Date,
      default: Date.now,
   },
});

const User = mongoose.model("user", UserSchema);

module.exports = User;
