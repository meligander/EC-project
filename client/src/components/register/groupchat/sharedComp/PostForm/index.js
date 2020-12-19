import React, { useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { addPost, addComment } from "../../../../../actions/post";

const PostForm = ({ addPost, class_id, post_id, isPost, addComment }) => {
   const [postForm, setPostForm] = useState({
      text: "",
   });

   const onChange = (e) => {
      setPostForm({
         text: e.target.value,
      });
   };

   const onSubmit = (e) => {
      setPostForm({
         text: "",
      });
      e.preventDefault();
      if (isPost) addPost(postForm, class_id);
      else addComment(post_id, postForm);
   };

   return (
      <div>
         <div className="paragraph bg-primary my-1">
            <h3 className="p-1">
               {isPost
                  ? "Realiza un comentario para que lo vea la clase"
                  : "Comenta la publicación"}
            </h3>
         </div>
         <form className="paragraph">
            <textarea
               className="form-input"
               cols="30"
               rows="6"
               onChange={onChange}
               value={postForm.text}
               placeholder="Di algo..."
            ></textarea>
            <div className="btn-right my-2 p-1">
               <button
                  type="submit"
                  onClick={onSubmit}
                  className="btn btn-primary"
               >
                  <i className="far fa-paper-plane"></i> Enviar
               </button>
            </div>
         </form>
      </div>
   );
};

PostForm.propTypes = {
   addPost: PropTypes.func.isRequired,
   addComment: PropTypes.func.isRequired,
   class_id: PropTypes.string,
   post_id: PropTypes.string,
   isPost: PropTypes.bool.isRequired,
};

export default connect(null, { addPost, addComment })(PostForm);
