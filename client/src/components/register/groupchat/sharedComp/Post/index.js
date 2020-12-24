import React, { useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Moment from "react-moment";
import PropTypes from "prop-types";

import { clearProfile } from "../../../../../actions/user";
import { addLike, removeLike } from "../../../../../actions/post";

import Comments from "../Comments";
import Alert from "../../../../sharedComp/Alert";

import "./style.scss";

const Post = ({
   post,
   addLike,
   removeLike,
   auth: { userLogged },
   clearProfile,
   setToggle,
}) => {
   const [toggleComments, setToggleComments] = useState(false);

   const isAdmin = userLogged.type !== "Alumno" && userLogged.type !== "Tutor";

   return (
      <div className="post">
         <div className="show-sm btn-close">
            {(post.user._id === userLogged._id || isAdmin) && (
               <button
                  type="button"
                  onClick={(e) => setToggle(e, post._id)}
                  className="btn btn-danger"
               >
                  <i className="fas fa-times"></i>
               </button>
            )}
         </div>
         <Alert type={post._id} />
         <Link
            to={`/dashboards/${post.user}`}
            onClick={() => {
               window.scroll(0, 0);
               clearProfile();
            }}
         >
            <figure className="post-shape">
               <img
                  className="post-img"
                  src={
                     typeof post.user.img === "string"
                        ? post.user.img
                        : post.user.img.url
                  }
                  alt="imagen alumno"
               />
               <figcaption className="post-caption">
                  {post.user.lastname + ", " + post.user.name}
               </figcaption>
            </figure>
         </Link>

         <div className="post-text">
            <div>
               <div className="hide-sm btn-close">
                  {(post.user._id === userLogged._id || isAdmin) && (
                     <button
                        type="button"
                        onClick={(e) => setToggle(e, post._id)}
                        className="btn btn-danger"
                     >
                        <i className="fas fa-times"></i>
                     </button>
                  )}
               </div>
               <p className="mt-2">{post.text}</p>
            </div>
            <div>
               <p className="posted-date">
                  Publicado el{" "}
                  <Moment format="DD/MM/YYYY [a las] HH:mm" date={post.date} />
               </p>
               <button
                  onClick={() => {
                     addLike(post._id);
                  }}
                  className="btn btn-mix-secondary"
               >
                  <i className="fas fa-thumbs-up"></i>
                  {post.likes.length > 0 && (
                     <span className="badge badge-secondary">
                        {post.likes.length}
                     </span>
                  )}
               </button>
               <button
                  className="btn btn-mix-secondary"
                  onClick={() => {
                     removeLike(post._id);
                  }}
               >
                  <i className="fas fa-thumbs-down"></i>
               </button>

               <button
                  className="btn btn-light"
                  onClick={() => {
                     setToggleComments(!toggleComments);
                  }}
               >
                  <i className="far fa-comments"></i>
                  {post.comments.length > 0 && (
                     <span className="badge badge-primary">
                        {post.comments.length}
                     </span>
                  )}
               </button>
            </div>
         </div>
         {toggleComments && (
            <Comments
               comments={post.comments}
               post_id={post._id}
               userLogged={userLogged}
            />
         )}
      </div>
   );
};

Post.propTypes = {
   addLike: PropTypes.func.isRequired,
   removeLike: PropTypes.func.isRequired,
   clearProfile: PropTypes.func.isRequired,
   setToggle: PropTypes.func,
   auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
   auth: state.auth,
});

export default connect(mapStateToProps, {
   addLike,
   removeLike,
   clearProfile,
})(Post);
