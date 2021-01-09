const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
   user: {
      type: Schema.Types.ObjectId,
      ref: "users",
   },
   text: {
      type: String,
      required: true,
   },
   classroom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "class",
   },
   likes: [
      {
         user: {
            type: Schema.Types.ObjectId,
            ref: "users",
         },
      },
   ],
   comments: [
      {
         user: {
            type: Schema.Types.ObjectId,
            ref: "users",
         },
         text: {
            type: String,
            required: true,
         },
         date: {
            type: Date,
            default: Date.now,
         },
      },
   ],
   seenArray: [
      {
         user: {
            type: Schema.Types.ObjectId,
            ref: "users",
         },
         seen: {
            type: Boolean,
            default: true,
         },
      },
   ],
   date: {
      type: Date,
      default: Date.now,
   },
});

const Post = mongoose.model("post", PostSchema);

module.exports = Post;
