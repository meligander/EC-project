import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import {
   loadPosts,
   deletePost,
   changeUnseenPosts,
   getUnseenPosts,
} from "../../../../actions/post";
import { loadClass } from "../../../../actions/class";

import Loading from "../../../modal/Loading";
import Confirm from "../../../modal/Confirm";
import PostForm from "../sharedComp/PostForm";
import Post from "../sharedComp/Post";

const Chat = ({
   match,
   loadClass,
   loadPosts,
   deletePost,
   changeUnseenPosts,
   getUnseenPosts,
   auth: { userLogged },
   posts: { posts, loading },
   classes: { classInfo, loading: loadingClass },
}) => {
   useEffect(() => {
      if (loading) {
         loadPosts(match.params.class_id);
         if (loadingClass) loadClass(match.params.class_id);
      } else {
         changeUnseenPosts(0);
         if (
            userLogged.type === "teacher" ||
            userLogged.type === "admin&teacher"
         )
            getUnseenPosts();
      }
   }, [
      loadPosts,
      loadClass,
      match.params.class_id,
      loading,
      loadingClass,
      changeUnseenPosts,
      userLogged,
      getUnseenPosts,
   ]);

   const [otherValues, setOtherValues] = useState({
      toggleModal: false,
      toDelete: "",
   });

   const { toggleModal, toDelete } = otherValues;

   const deletePostC = () => {
      deletePost(toDelete);
   };

   const setToggle = (e, post_id) => {
      if (e) e.preventDefault();
      setOtherValues({
         toDelete: post_id ? post_id : "",
         toggleModal: !toggleModal,
      });
   };

   return (
      <>
         <h1 className="py-4">Posteos Grupales</h1>

         {!loadingClass && !loading ? (
            <>
               <Confirm
                  toggleModal={toggleModal}
                  setToggleModal={setToggle}
                  confirm={deletePostC}
                  text="¿Está seguro que desea eliminar la publicación?"
               />
               <p className="heading-tertiary">
                  Bienvenido al chat de {classInfo.category.name} del profesor{" "}
                  {classInfo.teacher.lastname}, {classInfo.teacher.name}
               </p>
               <PostForm class_id={classInfo._id} />

               {posts.length > 0 ? (
                  posts.map((post) => (
                     <Post post={post} key={post._id} setToggle={setToggle} />
                  ))
               ) : (
                  <p className="heading-tertiary text-center my-4">
                     No hay ninguna publicación hasta el momento
                  </p>
               )}
            </>
         ) : (
            <Loading />
         )}
      </>
   );
};

Chat.propTypes = {
   posts: PropTypes.object.isRequired,
   classes: PropTypes.object.isRequired,
   auth: PropTypes.object.isRequired,
   loadClass: PropTypes.func.isRequired,
   loadPosts: PropTypes.func.isRequired,
   deletePost: PropTypes.func.isRequired,
   getUnseenPosts: PropTypes.func.isRequired,
   changeUnseenPosts: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   posts: state.posts,
   classes: state.classes,
   auth: state.auth,
});

export default connect(mapStateToProps, {
   loadPosts,
   loadClass,
   deletePost,
   getUnseenPosts,
   changeUnseenPosts,
})(withRouter(Chat));
