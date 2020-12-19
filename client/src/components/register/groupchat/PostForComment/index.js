import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { loadPostById, deleteComment } from "../../../../actions/post";

import Loading from "../../../modal/Loading";
import Post from "../sharedComp/Post";
import PostForm from "../sharedComp/PostForm";
import Confirm from "../../../modal/Confirm";

const PostForComment = ({
   match,
   posts: { post, loading },
   loadPostById,
   deleteComment,
}) => {
   useEffect(() => {
      loadPostById(match.params.id);
   }, [loadPostById, match.params.id]);

   const [otherValues, setOtherValues] = useState({
      toggleModal: false,
      toDelete: "",
   });

   const { toggleModal, toDelete } = otherValues;

   const deletePostC = () => {
      deleteComment(post._id, toDelete);
   };

   const setToggle = (e, post_id) => {
      if (e) e.preventDefault();
      setOtherValues({
         toDelete: post_id ? post_id : "",
         toggleModal: !toggleModal,
      });
   };

   return loading || post === null ? (
      <Loading />
   ) : (
      <>
         <Confirm
            toggleModal={toggleModal}
            setToggleModal={setToggle}
            confirm={deletePostC}
            text="¿Está seguro que desea eliminar la publicación?"
         />

         <Post showActions={false} isComment={false} post={post} />
         <PostForm isPost={false} post_id={post._id} />

         {post.comments.map((comment) => (
            <Post
               key={comment._id}
               isComment={true}
               post={comment}
               showActions={false}
               setToggle={setToggle}
            />
         ))}
      </>
   );
};

PostForComment.propTypes = {
   posts: PropTypes.object.isRequired,
   loadPostById: PropTypes.func.isRequired,
   deleteComment: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   posts: state.posts,
});

export default connect(mapStateToProps, { loadPostById, deleteComment })(
   withRouter(PostForComment)
);
