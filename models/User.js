const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
   },
   tel: {
      type: String,
   },
   cel: {
      type: String,
   },
   relatedCellphones: [
      {
         relation: {
            type: String,
            enum: [
               "mother",
               "father",
               "grandmother",
               "grandfather",
               "aunt",
               "uncle",
               "sibling",
               "other",
            ],
         },
         name: {
            type: String,
         },
         cel: {
            type: String,
         },
      },
   ],
   type: {
      type: String,
      enum: [
         "admin",
         "admin&teacher",
         "student",
         "teacher",
         "guardian",
         "secretary",
         "classManager",
      ],
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
   cbvu: {
      type: String,
   },
   alias: {
      type: String,
   },
   children: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "user",
      },
   ],
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

UserSchema.pre("save", async function (next) {
   if (!this.isModified("password")) return next();
   else {
      try {
         const salt = await bcrypt.genSalt(10);

         this.password = await bcrypt.hash(this.password, salt);
         next();
      } catch (err) {
         console.error(err);
         return next(err);
      }
   }
});

UserSchema.methods.comparePassword = async function (password) {
   try {
      const isMatch = await bcrypt.compare(password, this.password);
      if (!isMatch) return null;
      else return this;
   } catch (err) {
      console.error(err);
      return null;
   }
};

const User = mongoose.model("user", UserSchema);

module.exports = User;
