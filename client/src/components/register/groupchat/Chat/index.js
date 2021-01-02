import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import { loadPosts, deletePost } from "../../../../actions/post";
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
   posts: { posts, loading },
   classes,
}) => {
   useEffect(() => {
      if (classes.loading) loadClass(match.params.class_id, true);
      if (classes.classInfo && loading) loadPosts(match.params.class_id);
   }, [loadPosts, loadClass, match.params.class_id, classes, loading]);

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

         {!classes.loading && !loading ? (
            <>
               {classes.classInfo ? (
                  <>
                     <Confirm
                        toggleModal={toggleModal}
                        setToggleModal={setToggle}
                        confirm={deletePostC}
                        text="¿Está seguro que desea eliminar la publicación?"
                     />
                     <p className="heading-tertiary">
                        Bienvenido al chat de {classes.classInfo.category.name}{" "}
                        del profesor {classes.classInfo.teacher.lastname},{" "}
                        {classes.classInfo.teacher.name}
                     </p>
                     <PostForm class_id={classes.classInfo._id} />

                     {posts.length > 0 ? (
                        posts.map((post) => (
                           <Post
                              post={post}
                              key={post._id}
                              setToggle={setToggle}
                           />
                        ))
                     ) : (
                        <p className="heading-tertiary text-center my-4">
                           No hay ninguna publicación hasta el momento
                        </p>
                     )}
                  </>
               ) : (
                  <p className="heading-tertiary text-center my-5">
                     El alumno no está asignado a ninguna clase
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
   loadClass: PropTypes.func.isRequired,
   loadPosts: PropTypes.func.isRequired,
   deletePost: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   posts: state.posts,
   classes: state.classes,
});

export default connect(mapStateToProps, {
   loadPosts,
   loadClass,
   deletePost,
})(withRouter(Chat));
