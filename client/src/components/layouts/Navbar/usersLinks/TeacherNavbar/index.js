import React, { useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import {
   logOutAndToggle,
   changePage,
   changePageAndMenu,
} from "../../../../../actions/navbar";
import { clearClasses } from "../../../../../actions/class";
import { clearProfile, clearSearch } from "../../../../../actions/user";

const TeacherNavbar = ({
   location,
   navbar: { showMenu, currentNav },
   auth: { userLogged },
   posts: { allUnseenPosts },
   logOutAndToggle,
   changePage,
   changePageAndMenu,
   clearClasses,
   clearSearch,
   clearProfile,
}) => {
   const string = location.pathname.substring(1, location.pathname.length);
   const path =
      string.indexOf("/") !== -1
         ? string.substring(0, string.indexOf("/"))
         : string;
   let id;
   if (path === "dashboard") {
      id = string.substring(string.indexOf("/") + 1, string.length);
   }
   useEffect(() => {
      switch (path) {
         case "chat":
         case "classes":
         case "class":
         case "attendance":
         case "grades":
            changePage("classes");
            break;
         case "search":
            changePage("search");
            break;
         case "dashboard":
            if (id === userLogged._id) {
               changePage("index");
            } else {
               changePage("search");
            }
            break;
         default:
            changePage("index");
            break;
      }
   }, [changePage, path, id, userLogged._id]);
   return (
      <ul className={!showMenu ? "menu-nav" : "menu-nav show"}>
         <li
            className={
               !showMenu
                  ? "nav-item"
                  : `nav-item show ${currentNav === "index" ? "current" : ""}`
            }
         >
            <Link
               className="nav-link"
               to={`/dashboard/${userLogged._id}`}
               onClick={() => {
                  window.scroll(0, 0);
                  clearProfile();
                  changePageAndMenu("index");
               }}
            >
               <i className="fas fa-home"></i>
               <span className="hide-md">&nbsp; Página Principal</span>
            </Link>
         </li>
         <li
            className={
               !showMenu
                  ? "nav-item"
                  : `nav-item show ${currentNav === "search" ? "current" : ""}`
            }
         >
            <Link
               className="nav-link"
               to="/search"
               onClick={() => {
                  window.scroll(0, 0);
                  clearSearch();
                  changePageAndMenu("search");
               }}
            >
               <i className="fas fa-search"></i>
               <span className="hide-md">&nbsp; Búsqueda</span>
            </Link>
         </li>
         <li
            className={
               !showMenu
                  ? "nav-item"
                  : `nav-item show ${currentNav === "classes" ? "current" : ""}`
            }
         >
            <Link
               className="nav-link"
               to="/classes"
               onClick={() => {
                  window.scroll(0, 0);
                  changePageAndMenu("classes");
               }}
            >
               <div className="notification">
                  <i className="fas fa-chalkboard-teacher"></i>
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
         <li className={!showMenu ? "nav-item" : "nav-item show"}>
            <Link
               className="nav-link"
               to="/login"
               onClick={() => {
                  window.scroll(0, 0);
                  clearClasses();
                  logOutAndToggle();
               }}
            >
               <i className="fas fa-sign-out-alt"></i>
               <span className="hide-md">&nbsp; Cerrar Sesión</span>
            </Link>
         </li>
      </ul>
   );
};

TeacherNavbar.propTypes = {
   navbar: PropTypes.object.isRequired,
   posts: PropTypes.object.isRequired,
   auth: PropTypes.object.isRequired,
   logOutAndToggle: PropTypes.func.isRequired,
   changePage: PropTypes.func.isRequired,
   changePageAndMenu: PropTypes.func.isRequired,
   clearClasses: PropTypes.func.isRequired,
   clearSearch: PropTypes.func.isRequired,
   clearProfile: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   navbar: state.navbar,
   auth: state.auth,
   posts: state.posts,
});

export default connect(mapStateToProps, {
   logOutAndToggle,
   changePage,
   changePageAndMenu,
   clearClasses,
   clearSearch,
   clearProfile,
})(withRouter(TeacherNavbar));
