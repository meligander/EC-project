const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

//Models
const User = require("../../models/User");
const Post = require("../../models/Post");

//@route    GET api/posts/class/:class_id
//@desc     Get all posts made in a class
//@access   Private
router.get("/class/:class_id", auth, async (req, res) => {
   try {
      const posts = await Post.find({ classroom: req.params.class_id })
         .sort({
            date: -1,
         })
         .populate({ path: "user", model: "user", select: "-password" });

      return res.json(posts);
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
   }
});

//@route    GET api/posts/:id
//@desc     Get post by ID
//@access   Private
router.get("/:id", auth, async (req, res) => {
   try {
      const post = await Post.findById(req.params.id)
         .populate({
            path: "user",
            select: "-password",
            model: "user",
         })
         .populate({
            path: "comments.user",
            model: "user",
            select: "-password",
         });

      if (!post)
         return res.status(404).json({ msg: "Publicación no encontrada" });

      return res.json(post);
   } catch (err) {
      console.error(err.message);
      if (err.kind === "ObjectId")
         return res.status(404).json({ msg: "Post not found" });
      return res.status(500).send("Server error");
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
         const user = await User.findById(req.user.id).select("-password");

         const newPost = new Post({
            text: req.body.text,
            classroom: req.params.class_id,
            name: user.name,
            lastname: user.lastname,
            user: req.user.id,
         });
         let post = await newPost.save();

         post = await Post.findOne({ _id: post._id }).populate({
            path: "user",
            select: "-password",
            model: "user",
         });
         return res.json(post);
      } catch (err) {
         console.error(err.message);
         res.status(500).send("Server error");
      }
   }
);

//@route    DELETE api/posts
//@desc     Delete a post
//@access   Private
router.delete("/:id", auth, async (req, res) => {
   try {
      const post = await Post.findOne({ _id: req.params.id });

      if (!post)
         return res.status(404).json({ msg: "Publicación no encontrada" });

      //Check user
      if (post.user.toString() !== req.user.id) {
         return res.status(401).json({ msg: "Usuario no autorizado" });
      }

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

//@route    PUT api/posts/like/:id
//@desc     Add like to a post
//@access   Private
router.put("/like/:id", auth, async (req, res) => {
   try {
      const post = await Post.findById(req.params.id);

      if (
         post.likes.filter((like) => like.user.toString() === req.user.id)
            .length > 0
      ) {
         return res
            .status(400)
            .json({ msg: "Ya se ha marcado la publicación como Me Gusta" });
      }

      post.likes.unshift({ user: req.user.id });

      await post.save();

      res.json(post.likes);
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
   }
});

//@route    PUT api/posts/unlike/:id
//@desc     Remove like to a post
//@access   Private
router.put("/unlike/:id", auth, async (req, res) => {
   try {
      const post = await Post.findById(req.params.id);

      if (
         post.likes.filter((like) => like.user.toString() === req.user.id)
            .length === 0
      ) {
         return res.status(400).json({
            msg: "La publicación todavía no se ha marcado como Me Gusta",
         });
      }

      //Get remove index
      const removeIndex = post.likes
         .map((like) => like.user.toString())
         .indexOf(req.user.id);

      post.likes.splice(removeIndex, 1);

      await post.save();

      res.json(post.likes);
   } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
   }
});

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
         const user = await User.findById(req.user.id).select("-password");
         let post = await Post.findById(req.params.id);

         const newComment = {
            text: req.body.text,
            name: user.name,
            lastname: user.lastname,
            user: req.user.id,
         };

         post.comments.unshift(newComment);

         await post.save();

         post = await Post.findById(req.params.id)
            .populate({
               path: "user",
               select: "-password",
               model: "user",
            })
            .populate({
               path: "comments.user",
               model: "user",
               select: "-password",
            });

         return res.json(post.comments);
      } catch (err) {
         console.error(err.message);
         res.status(500).send("Server error");
      }
   }
);

//@route    DELETE api/posts/comment/:id/:comment_id
//@desc     Delete a comment on a post
//@access   Private
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
   try {
      const post = await Post.findById(req.params.id);

      //Pull out comment
      const comment = post.comments.find(
         (comment) => comment.id === req.params.comment_id
      );

      //Make sure comment exists
      if (!comment)
         return res.status(404).json({ msg: "El comentario no existe" });

      //Check user
      if (comment.user.toString() !== req.user.id)
         return res.status(401).json({ msg: "Usuario no autorizado" });

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

module.exports = router;
