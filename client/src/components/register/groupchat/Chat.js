import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { loadPosts, deletePost, clearPosts } from "../../../actions/post";
import { loadClass } from "../../../actions/class";
import { withRouter } from "react-router-dom";
import Loading from "../../modal/Loading";
import PropTypes from "prop-types";
import PostForm from "./PostForm";
import Confirm from "../../modal/Confirm";
import Post from "./Post";

const Chat = ({
   match,
   loadClass,
   loadPosts,
   deletePost,
   clearPosts,
   posts: { posts, loading },
   classes,
}) => {
   useEffect(() => {
      clearPosts();
      loadClass(match.params.id);
      loadPosts(match.params.id);
   }, [loadPosts, loadClass, match.params.id, clearPosts]);

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
         {!classes.loading && classes.classInfo !== null ? (
            <>
               <Confirm
                  toggleModal={toggleModal}
                  setToggleModal={setToggle}
                  confirm={deletePostC}
                  text="¿Está seguro que desea eliminar la publicación?"
               />
               <h1 className="py-4">Posteos Grupales</h1>
               <p className="heading-tertiary">
                  <i className="far fa-comments"></i> Bienvenido al chat de{" "}
                  {classes.classInfo.category.name} del profesor{" "}
                  {classes.classInfo.teacher.lastname}
                  {", "}
                  {classes.classInfo.teacher.name}
               </p>
               <PostForm class_id={classes.classInfo._id} isPost={true} />

               {!loading && (
                  <>
                     {posts.length > 0 ? (
                        posts.map((post) => (
                           <Post
                              showActions={true}
                              isComment={true}
                              post={post}
                              key={post._id}
                              setToggle={setToggle}
                           />
                        ))
                     ) : (
                        <p className="lead">
                           No hay ninguna publicación hasta el momento
                        </p>
                     )}
                  </>
               )}
            </>
         ) : !classes.loading && classes.classInfo === null ? (
            <div className="chat p-2 bg-white mt-1">
               <h1 className="large text-primary my-2">Posteos Grupales</h1>
               <p className="lead">
                  El alumno no está asignado a ninguna clase
               </p>
            </div>
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
   clearPosts: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   posts: state.posts,
   classes: state.classes,
});

export default connect(mapStateToProps, {
   loadPosts,
   loadClass,
   deletePost,
   clearPosts,
})(withRouter(Chat));
