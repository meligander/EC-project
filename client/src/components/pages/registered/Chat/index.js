import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import {
   loadPosts,
   deletePost,
   getUnseenPosts,
} from "../../../../actions/post";
import { loadClass } from "../../../../actions/class";

import PopUp from "../../../modal/PopUp";
import PostForm from "./sharedComp/PostForm";
import Post from "./sharedComp/Post";

const Chat = ({
   match,
   loadClass,
   loadPosts,
   deletePost,
   getUnseenPosts,
   auth: { userLogged },
   posts: { posts, loading },
   classes: { classInfo, loadingClass },
}) => {
   const isAdmin =
      userLogged.type === "teacher" || userLogged.type === "admin&teacher";

   useEffect(() => {
      if (loading) {
         loadPosts(match.params.class_id);
         if (loadingClass) loadClass(match.params.class_id);
      } else {
         if (isAdmin) getUnseenPosts();
      }
   }, [
      loadPosts,
      loadClass,
      match.params.class_id,
      loading,
      loadingClass,
      isAdmin,
      getUnseenPosts,
   ]);

   const [adminValues, setAdminValues] = useState({
      toggleModal: false,
      toDelete: "",
   });

   const { toggleModal, toDelete } = adminValues;

   return (
      <>
         <h1 className="py-4">Posteos Grupales</h1>

         {!loadingClass && (
            <>
               <PopUp
                  toggleModal={toggleModal}
                  setToggleModal={() =>
                     setAdminValues((prev) => ({
                        ...prev,
                        toggleModal: !toggleModal,
                     }))
                  }
                  confirm={() => deletePost(toDelete)}
                  text="¿Está seguro que desea eliminar la publicación?"
               />
               <p className="heading-tertiary">
                  Bienvenido al chat de {classInfo.category.name} del profesor{" "}
                  {classInfo.teacher.lastname}, {classInfo.teacher.name}
               </p>
               <PostForm class_id={classInfo._id} />
            </>
         )}

         {!loading && posts.length > 0 ? (
            posts.map((post) => (
               <Post
                  post={post}
                  key={post._id}
                  setToggle={(toDelete) =>
                     setAdminValues((prev) => ({
                        ...prev,
                        toggleModal: !toggleModal,
                        toDelete,
                     }))
                  }
               />
            ))
         ) : (
            <p className="heading-tertiary text-center my-4">
               No hay ninguna publicación hasta el momento
            </p>
         )}
      </>
   );
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
})(Chat);
