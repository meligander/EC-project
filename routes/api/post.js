const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

//Models
const Post = require("../../models/Post");
const Class = require("../../models/Class");

//@route    GET api/posts/unseen/teacher
//@desc     Get the unseen posts in all the teacher's classes
//@access   Private
router.get("/unseen/teacher", auth, async (req, res) => {
   try {
      const classes = await Class.find({ teacher: req.user.id });

      const classes_id = classes.map((oneClass) => oneClass._id);

      const posts = await Post.find().populate({
         path: "classroom",
         model: "class",
         match: {
            _id: { $in: classes_id },
         },
      });

      const count = countUnseenPosts(posts, req.user.id);

      return res.json(count);
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
   }
});

//@route    GET api/posts/unseen/class/:class_id
//@desc     Get the unseen posts in a class
//@access   Private
router.get("/unseen/class/:class_id", auth, async (req, res) => {
   try {
      const posts = await Post.find({ classroom: req.params.class_id });

      const count = countUnseenPosts(posts, req.user.id);

      return res.json(count);
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
   }
});

//@route    GET api/posts/class/:class_id
//@desc     Get all posts made in a class
//@access   Private
router.get("/class/:class_id", auth, async (req, res) => {
   try {
      const posts = await Post.find({ classroom: req.params.class_id })
         .sort({
            date: -1,
         })
         .populate({
            path: "user",
            model: "user",
            select: ["name", "lastname", "noImg", "img", "_id"],
         })
         .populate({
            path: "comments.user",
            model: "user",
            select: ["name", "lastname", "noImg", "img", "_id"],
         })
         .populate({
            path: "likes.user",
            model: "user",
            select: ["name", "lastname", "noImg", "img", "_id"],
         });

      return res.json(posts);
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
   }
});

//@route    POST api/posts/:class_id
//@desc     Create a post
//@access   Private
router.post(
   "/:class_id",
   [auth, check("text", "El texto es necesario").not().isEmpty()],
   async (req, res) => {
      let errors = [];
      const errorsResult = validationResult(req);
      if (!errorsResult.isEmpty()) {
         errors = errorsResult.array();
         return res.status(400).json({ errors });
      }

      try {
         const newPost = new Post({
            text: req.body.text,
            classroom: req.params.class_id,
            user: req.user.id,
            seenArray: [
               {
                  user: req.user.id,
                  seen: true,
               },
            ],
         });
         let post = await newPost.save();

         post = await Post.findOne({ _id: post._id })
            .populate({
               path: "user",
               model: "user",
               select: ["name", "lastname", "noImg", "img", "_id"],
            })
            .populate({
               path: "comments.user",
               model: "user",
               select: ["name", "lastname", "noImg", "img", "_id"],
            })
            .populate({
               path: "likes.user",
               model: "user",
               select: ["name", "lastname", "noImg", "img", "_id"],
            });
         return res.json(post);
      } catch (err) {
         console.error(err.message);
         res.status(500).send("Server error");
      }
   }
);

//@route    POST api/posts/comment/:id
//@desc     Comment on a post
//@access   Private
router.post(
   "/comment/:id",
   [auth, [check("text", "El texto es necesario").not().isEmpty()]],
   async (req, res) => {
      let errors = [];
      const errorsResult = validationResult(req);
      if (!errorsResult.isEmpty()) {
         errors = errorsResult.array();
         return res.status(400).json({ errors });
      }

      try {
         let post = await Post.findById(req.params.id);

         const newComment = {
            text: req.body.text,
            user: req.user.id,
         };

         post.comments.unshift(newComment);

         const newSeenArray = post.seenArray.map((userWhoSeen) =>
            userWhoSeen.user.toString() === req.user.id
               ? userWhoSeen
               : { user: userWhoSeen.user, _id: userWhoSeen._id, seen: false }
         );

         post.seenArray = newSeenArray;

         await post.save();

         post = await Post.findById(req.params.id).populate({
            path: "comments.user",
            model: "user",
            select: ["name", "lastname", "noImg", "img", "_id"],
         });

         return res.json(post.comments);
      } catch (err) {
         console.error(err.message);
         res.status(500).send("Server error");
      }
   }
);

//@route    PUT api/posts/like/:id
//@desc     Add or remove like of a post
//@access   Private
router.put("/like/:id", auth, async (req, res) => {
   try {
      let post = await Post.findById(req.params.id);

      if (
         post.likes.filter((like) => like.user.toString() === req.user.id)
            .length > 0
      ) {
         const removeIndex = post.likes
            .map((like) => like.user.toString())
            .indexOf(req.user.id);

         post.likes.splice(removeIndex, 1);
      } else {
         post.likes.unshift({ user: req.user.id });
      }

      await post.save();

      post = await Post.findOne({ _id: req.params.id }).populate({
         path: "likes.user",
         model: "user",
         select: ["name", "lastname", "noImg", "img", "_id"],
      });

      res.json(post.likes);
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
   }
});

//@route    PUT api/posts/seen/:id
//@desc     Mark a post as seen by a user
//@access   Private
router.put("/seen/:id", auth, async (req, res) => {
   try {
      const { newSeen, newOne } = req.body;

      let post = await Post.findOne({ _id: req.params.id });

      let seenArray = [];

      if (newOne) seenArray = [...post.seenArray, newSeen];
      else
         seenArray = post.seenArray.map((userWhoSeen) =>
            userWhoSeen.user.toString() === req.user.id ? newSeen : userWhoSeen
         );

      post = await Post.findOneAndUpdate(
         { _id: post._id },
         { seenArray },
         { new: true }
      );

      res.json(post.seenArray);
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
   }
});

//@route    DELETE api/posts
//@desc     Delete a post
//@access   Private
router.delete("/:id", auth, async (req, res) => {
   try {
      const post = await Post.findOne({ _id: req.params.id });

      if (!post)
         return res.status(404).json({ msg: "Publicación no encontrada" });

      await post.remove();

      return res.json({ msg: "Post deleted" });
   } catch (err) {
      const error = err.message.toString();
      console.error(err.message);
      if (error.includes("ObjectId"))
         return res.status(404).json({ msg: "Publicación no encontrada" });
      res.status(500).send("Server error");
   }
});

//@route    DELETE api/posts/comment/:id/:comment_id
//@desc     Delete a comment on a post
//@access   Private
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
   try {
      const post = await Post.findById(req.params.id).populate({
         path: "comments.user",
         model: "user",
         select: ["name", "lastname", "noImg", "img", "_id"],
      });

      //Pull out comment
      const comment = post.comments.find(
         (comment) => comment.id === req.params.comment_id
      );

      //Make sure comment exists
      if (!comment)
         return res.status(404).json({ msg: "El comentario no existe" });

      //Get remove index
      const removeIndex = post.comments
         .map((comment) => comment.id.toString())
         .indexOf(req.params.comment_id);

      post.comments.splice(removeIndex, 1);

      await post.save();

      res.json(post.comments);
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
   }
});

function countUnseenPosts(posts, user) {
   let count = 0;

   for (let x = 0; x < posts.length; x++) {
      if (posts[x].classroom) {
         let exist = false;
         for (let y = 0; y < posts[x].seenArray.length; y++) {
            if (posts[x].seenArray[y].user.toString() === user) {
               exist = true;
               if (!posts[x].seenArray[y].seen) count++;
               break;
            }
         }
         if (!exist) count++;
      }
   }

   return count;
}

module.exports = router;
