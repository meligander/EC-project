import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { ImSearch } from "react-icons/im";
import { FaChalkboardTeacher } from "react-icons/fa";

import { clearSearch } from "../../../../../actions/user";

const TeacherNavbar = ({
   posts: { allUnseenPosts },
   clearSearch,
   toggleMenu,
   setCurrentNav,
   currentNav,
}) => {
   return (
      <>
         <li
            className={`nav-item${toggleMenu ? " show" : ""}${
               currentNav === "search" ? " current" : ""
            }`}
         >
            <Link
               className="nav-link"
               to="/search"
               onClick={() => {
                  window.scroll(0, 0);
                  clearSearch();
                  setCurrentNav("search");
               }}
            >
               <ImSearch />
               <span className="hide-md">&nbsp; Búsqueda</span>
            </Link>
         </li>
         <li
            className={`nav-item${toggleMenu ? " show" : ""}${
               currentNav === "classes" ? " current" : ""
            }`}
         >
            <Link
               className="nav-link"
               to="/classes"
               onClick={() => {
                  window.scroll(0, 0);
                  setCurrentNav("classes");
               }}
            >
               <div className="notification">
                  <FaChalkboardTeacher />
                  {allUnseenPosts > 0 && (
                     <span
                        className={`post-notification teacher ${
                           currentNav === "classes" ? "white" : "light"
                        }`}
                     >
                        {allUnseenPosts}
                     </span>
                  )}
               </div>
               <span className="hide-md">&nbsp; Clases</span>
            </Link>
         </li>
      </>
   );
};

const mapStateToProps = (state) => ({
   posts: state.posts,
});

export default connect(mapStateToProps, {
   clearSearch,
})(TeacherNavbar);
