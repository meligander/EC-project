import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { FaChalkboardTeacher, FaComments } from "react-icons/fa";

import { clearPosts } from "../../../../../actions/post";

const StudentNavbar = ({
   auth: {
      userLogged: { classInfo },
   },
   posts: { unseenPosts },
   clearPosts,
   toggleMenu,
   currentNav,
   setCurrentNav,
}) => {
   return (
      <>
         <li
            className={`nav-item${toggleMenu ? " show" : ""}${
               currentNav === "classmates" ? " current" : ""
            }`}
         >
            <Link
               className="nav-link"
               to={`/class/${classInfo._id}`}
               onClick={() => {
                  window.scroll(0, 0);
                  setCurrentNav("classmates");
               }}
            >
               <FaChalkboardTeacher />
               <span className="hide-md">&nbsp; Clase</span>
            </Link>
         </li>
         <li
            className={`nav-item${toggleMenu ? " show" : ""}${
               currentNav === "chat" ? " current" : ""
            }`}
         >
            <Link
               className="nav-link"
               to={`/chat/${classInfo._id}`}
               onClick={() => {
                  window.scroll(0, 0);
                  clearPosts();
                  setCurrentNav("chat");
               }}
            >
               <div className="notification">
                  <FaComments />
                  {unseenPosts > 0 && (
                     <span
                        className={`post-notification ${
                           currentNav === "chat" ? "white" : "light"
                        }`}
                     >
                        {unseenPosts}
                     </span>
                  )}
               </div>
               <span className="hide-md">&nbsp; Posteo Grupal</span>
            </Link>
         </li>
      </>
   );
};

const mapStateToProps = (state) => ({
   posts: state.posts,
   auth: state.auth,
});

export default connect(mapStateToProps, { clearPosts })(StudentNavbar);
