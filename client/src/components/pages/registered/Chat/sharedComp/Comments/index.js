import React, { useState } from "react";
import Moment from "react-moment";
import { connect } from "react-redux";
import { FaPaperPlane, FaTimes } from "react-icons/fa";

import { addComment, deleteComment } from "../../../../../../actions/post";

import PopUp from "../../../../../modal/PopUp";

import "./style.scss";

const Comments = ({
   comments,
   post_id,
   userLogged,
   addComment,
   deleteComment,
}) => {
   const isAdmin =
      userLogged.type !== "student" && userLogged.type !== "guardian";

   const commentsArray = comments;

   const [otherValues, setOtherValues] = useState({
      toggleModal: false,
      toDelete: "",
      index: 0,
   });

   const { toggleModal, toDelete, index } = otherValues;

   const [postForm, setPostForm] = useState({
      text: "",
   });

   const { text } = postForm;

   const onChange = (e) => {
      setPostForm({
         text: e.target.value,
      });
   };

   const deletePostComment = () => {
      let screen = 100 + (commentsArray.length - index) * 100;
      deleteComment(post_id, toDelete, -screen);
   };

   const registerComment = () => {
      let screen = 100 + commentsArray.length * 100;
      addComment(post_id, postForm, -screen);
      setPostForm({
         text: "",
      });
   };

   const setToggle = (comment_id, index) => {
      setOtherValues({
         ...otherValues,
         toDelete: comment_id ? comment_id : "",
         toggleModal: !toggleModal,
         index: index ? index : 0,
      });
   };

   return (
      <div className="comments">
         <PopUp
            toggleModal={toggleModal}
            setToggleModal={setToggle}
            confirm={deletePostComment}
            text="¿Está seguro que desea eliminar el comentario?"
         />
         {comments
            .map((comment, index) => (
               <div className="comment bg-lightest-secondary my-1" key={index}>
                  <img
                     src={
                        typeof comment.user.img === "string"
                           ? comment.user.img
                           : comment.user.img.public_id === ""
                           ? "https://pngimage.net/wp-content/uploads/2018/06/no-user-image-png-3-300x200.png"
                           : comment.user.img.url
                     }
                     alt="Imagen Usuario English Center"
                     className="comment-img round-img"
                  />
                  <div className="comment-text">
                     <h4 className="text-dark">
                        {comment.user.name + " " + comment.user.lastname}
                     </h4>
                     <p className="paragraph">{comment.text}</p>
                     <p className="text-right posted-date">
                        <span className="hide-sm">Publicado el </span>
                        <Moment
                           format="DD/MM/YYYY [a las] HH:mm"
                           date={comment.date}
                        />
                     </p>
                  </div>
                  {(comment.user._id === userLogged._id || isAdmin) && (
                     <div className="btn-close">
                        <div className="tooltip">
                           <button
                              type="button"
                              onClick={(e) => {
                                 e.preventDefault();
                                 setToggle(comment._id, index);
                              }}
                              className="btn btn-danger"
                           >
                              <FaTimes />
                           </button>
                           <span className="tooltiptext">Eliminar</span>
                        </div>
                     </div>
                  )}
               </div>
            ))
            .reverse()}
         <form
            className="form paragraph"
            onSubmit={(e) => {
               e.preventDefault();
               registerComment();
            }}
         >
            <textarea
               className="form-input"
               rows="3"
               onChange={onChange}
               value={text}
               placeholder="Comenta..."
            ></textarea>
            <div className="tooltip">
               <button type="submit" className="btn-comment">
                  <FaPaperPlane />
               </button>
               <span className="tooltiptext">Enviar comentario</span>
            </div>
         </form>
      </div>
   );
};

export default connect(null, { addComment, deleteComment })(Comments);
