import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Moment from "react-moment";
import PropTypes from "prop-types";

import { clearProfile } from "../../../../../../actions/user";
import { addRemoveLike, seenPost } from "../../../../../../actions/post";

import Comments from "../Comments";
import Alert from "../../../../sharedComp/Alert";
import PopUp from "../../../../../modal/PopUp";

import "./style.scss";

const Post = ({
   post,
   auth: { userLogged },
   addRemoveLike,
   seenPost,
   clearProfile,
   setToggle,
}) => {
   const [otherValues, setOtherValues] = useState({
      toggleComments: false,
      toggleModalLikes: false,
      isLiked: false,
      oneLoad: true,
      hasNotSeen: false,
   });

   const {
      toggleComments,
      isLiked,
      oneLoad,
      toggleModalLikes,
      hasNotSeen,
   } = otherValues;

   const isAdmin =
      userLogged.type !== "student" && userLogged.type !== "guardian";

   const canMarkSeenUser =
      userLogged.type === "student" ||
      userLogged.type === "teacher" ||
      userLogged.type === "admin&teacher";

   useEffect(() => {
      if (oneLoad) {
         for (let x = 0; x < post.likes.length; x++) {
            if (post.likes[x].user._id === userLogged._id) {
               setOtherValues((prev) => ({
                  ...prev,
                  isLiked: true,
               }));
               break;
            }
         }

         if (canMarkSeenUser) {
            let seen = false;
            let newOne = true;
            for (let x = 0; x < post.seenArray.length; x++) {
               if (post.seenArray[x].user === userLogged._id) {
                  if (post.seenArray[x].seen) seen = true;
                  else newOne = false;
                  break;
               }
            }

            if (!seen) {
               const newSeen = {
                  user: userLogged._id,
                  seen: true,
               };

               seenPost(post._id, { newSeen, newOne });

               setOtherValues((prev) => ({
                  ...prev,
                  hasNotSeen: true,
               }));
            }
         }

         setOtherValues((prev) => ({
            ...prev,
            oneLoad: false,
         }));
      }
   }, [post, userLogged, oneLoad, canMarkSeenUser, seenPost]);

   const setToggleModalLikes = () => {
      setOtherValues({
         ...otherValues,
         toggleModalLikes: !toggleModalLikes,
      });
   };

   return (
      <div className={`post ${hasNotSeen ? "bg-unseen" : "bg-white"} `}>
         <PopUp
            toggleModal={toggleModalLikes}
            setToggleModal={setToggleModalLikes}
            type="post-likes"
            users={post.likes}
         />
         <div className="show-sm btn-close">
            {(post.user._id === userLogged._id || isAdmin) && (
               <button
                  type="button"
                  onClick={(e) => {
                     e.preventDefault();
                     setToggle(post._id);
                  }}
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
               clearProfile(userLogged.type !== "student");
            }}
         >
            <figure className="post-shape">
               <img
                  className="post-img"
                  src={
                     typeof post.user.img === "string"
                        ? post.user.img
                        : post.user.img.public_id === ""
                        ? "https://pngimage.net/wp-content/uploads/2018/06/no-user-image-png-3-300x200.png"
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
                     <div className="tooltip">
                        <button
                           type="button"
                           onClick={(e) => {
                              e.preventDefault();
                              setToggle(post._id);
                           }}
                           className="btn btn-danger"
                        >
                           <i className="fas fa-times"></i>
                        </button>
                        <span className="tooltiptext close">Eliminar</span>
                     </div>
                  )}
               </div>
               <p className="mt-2">{post.text}</p>
            </div>
            <div>
               <p className="posted-date">
                  Publicado el{" "}
                  <Moment format="DD/MM/YYYY [a las] HH:mm" date={post.date} />
               </p>
               <div className="tooltip">
                  <button
                     type="button"
                     onClick={(e) => {
                        e.preventDefault();
                        addRemoveLike(post._id);
                        setOtherValues({ ...otherValues, isLiked: !isLiked });
                     }}
                     className={`btn btn-mix-secondary ${
                        isLiked ? "liked" : ""
                     }`}
                  >
                     <i className="fas fa-heart"></i>
                  </button>
                  <span className="tooltiptext">Me Gusta</span>
               </div>
               <div className="tooltip">
                  <button
                     type="button"
                     className="btn btn-mix-secondary"
                     onClick={setToggleModalLikes}
                  >
                     <span className="heart">
                        <i className="fas fa-heart"></i>
                     </span>
                     <i className="fas fa-users"></i>
                     {post.likes.length > 0 && (
                        <span className="post-notification secondary">
                           {post.likes.length}
                        </span>
                     )}
                  </button>
                  <span className="tooltiptext">Listado de "Me Gusta"</span>
               </div>
               <div className="tooltip">
                  <button
                     type="button"
                     className="btn btn-light"
                     onClick={(e) => {
                        e.preventDefault();
                        setOtherValues({
                           ...otherValues,
                           toggleComments: !toggleComments,
                        });
                     }}
                  >
                     <i className="far fa-comments"></i>
                     {post.comments.length > 0 && (
                        <span className="post-notification primary">
                           {post.comments.length}
                        </span>
                     )}
                  </button>
                  <span className="tooltiptext">Comentarios</span>
               </div>
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
   addRemoveLike: PropTypes.func.isRequired,
   seenPost: PropTypes.func.isRequired,
   clearProfile: PropTypes.func.isRequired,
   setToggle: PropTypes.func,
   post: PropTypes.object.isRequired,
   auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
   auth: state.auth,
});

export default connect(mapStateToProps, {
   addRemoveLike,
   seenPost,
   clearProfile,
})(Post);
