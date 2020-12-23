import React from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Moment from "react-moment";
import PropTypes from "prop-types";

import { addLike, clearPost, removeLike } from "../../../../../actions/post";
import { clearProfile } from "../../../../../actions/user";
import { updatePreviousPage } from "../../../../../actions/mixvalues";

import "./style.scss";

const Post = ({
   location,
   post,
   addLike,
   removeLike,
   auth: { userLogged },
   showActions,
   isComment,
   clearPost,
   clearProfile,
   updatePreviousPage,
   setToggle,
}) => {
   return (
      <div className="post">
         <div className="show-sm btn-close">
            {post.user._id === userLogged._id && isComment && (
               <button
                  type="button"
                  onClick={(e) => setToggle(e, post._id)}
                  className="btn btn-danger"
               >
                  <i className="fas fa-times"></i>
               </button>
            )}
         </div>
         <Link
            to={`/dashboards/${post.user}`}
            onClick={() => {
               window.scroll(0, 0);
               clearProfile();
               updatePreviousPage(location.pathname);
            }}
         >
            <figure className="post-shape">
               <img
                  className="post-img"
                  src={post.user.img}
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
                  {post.user._id === userLogged._id && isComment && (
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
               {showActions && (
                  <>
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
                     <Link
                        to={`/chat/post/${post._id}`}
                        className="btn btn-light"
                        onClick={() => {
                           clearPost();
                           window.scroll(0, 0);
                           updatePreviousPage(location.pathname);
                        }}
                     >
                        <i className="far fa-comments"></i>
                        {post.comments.length > 0 && (
                           <span className="badge badge-primary">
                              {post.comments.length}
                           </span>
                        )}
                     </Link>
                  </>
               )}
            </div>
         </div>
      </div>
   );
};

Post.propTypes = {
   addLike: PropTypes.func.isRequired,
   removeLike: PropTypes.func.isRequired,
   setToggle: PropTypes.func,
   auth: PropTypes.object.isRequired,
   showActions: PropTypes.bool,
   isComment: PropTypes.bool,
   clearProfile: PropTypes.func.isRequired,
   clearPost: PropTypes.func.isRequired,
   updatePreviousPage: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   auth: state.auth,
});

export default connect(mapStateToProps, {
   addLike,
   removeLike,
   clearPost,
   clearProfile,
   updatePreviousPage,
})(withRouter(Post));
