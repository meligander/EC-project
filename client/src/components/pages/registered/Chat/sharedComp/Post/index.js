import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Moment from "react-moment";
import {
   FaUsers,
   FaHeart,
   FaRegHeart,
   FaComments,
   FaTimes,
} from "react-icons/fa";

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
   const [adminValues, setAdminValues] = useState({
      toggleComments: false,
      toggleModalLikes: false,
      isLiked: false,
      oneLoad: true,
      hasNotSeen: false,
   });

   const { toggleComments, isLiked, oneLoad, toggleModalLikes, hasNotSeen } =
      adminValues;

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
               setAdminValues((prev) => ({
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

               setAdminValues((prev) => ({
                  ...prev,
                  hasNotSeen: true,
               }));
            }
         }

         setAdminValues((prev) => ({
            ...prev,
            oneLoad: false,
         }));
      }
   }, [post, userLogged, oneLoad, canMarkSeenUser, seenPost]);

   const setToggleModalLikes = () => {
      setAdminValues({
         ...adminValues,
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
                  <FaTimes />
               </button>
            )}
         </div>
         <Alert type={post._id} />
         <Link
            to={`/dashboard/${post.user}`}
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
                           <FaTimes />
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
                        setAdminValues({ ...adminValues, isLiked: !isLiked });
                     }}
                     className={`btn btn-mix-secondary ${
                        isLiked ? "liked" : ""
                     }`}
                  >
                     {isLiked ? <FaHeart /> : <FaRegHeart />}
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
                        <FaHeart />
                     </span>
                     <span className="users">
                        <FaUsers />
                     </span>
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
                        setAdminValues({
                           ...adminValues,
                           toggleComments: !toggleComments,
                        });
                     }}
                  >
                     <FaComments />
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

const mapStateToProps = (state) => ({
   auth: state.auth,
});

export default connect(mapStateToProps, {
   addRemoveLike,
   seenPost,
   clearProfile,
})(Post);
