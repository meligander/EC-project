import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Moment from "react-moment";
import { addLike, removeLike } from "../../../actions/post";
import PropTypes from "prop-types";

const Post = ({
   post,
   addLike,
   removeLike,
   auth: { userLogged },
   showActions,
   isComment,
   setToggle,
}) => {
   return (
      <div className="post person">
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
         <Link to={`/dashboards/${post.user}`}>
            <figure className="person-shape">
               <img
                  className="person-img"
                  src={post.user.img}
                  alt="imagen alumno"
               />
               <figcaption className="person-caption">
                  {post.user.lastname + ", " + post.user.name}
               </figcaption>
            </figure>
         </Link>

         <div className="person-text">
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
                  Publicado el <Moment format="DD/MM/YYYY" date={post.date} />
               </p>
               {showActions && (
                  <>
                     <button
                        onClick={() => {
                           addLike(post._id);
                        }}
                        className="btn btn-secondary-2"
                     >
                        <i className="fas fa-thumbs-up"></i>
                        {post.likes.length > 0 && (
                           <span className="badge badge-secondary">
                              {post.likes.length}
                           </span>
                        )}
                     </button>
                     <button
                        className="btn btn-secondary-2"
                        onClick={() => {
                           removeLike(post._id);
                        }}
                     >
                        <i className="fas fa-thumbs-down"></i>
                     </button>
                     <Link
                        to={`/chat/post/${post._id}`}
                        className="btn btn-light"
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
};

const mapStateToProps = (state) => ({
   auth: state.auth,
});

export default connect(mapStateToProps, { addLike, removeLike })(Post);
