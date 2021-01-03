import React, { useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import {
   logOutAndToggle,
   changePage,
   changePageAndMenu,
} from "../../../../../actions/navbar";
import { loadEnrollments } from "../../../../../actions/enrollment";
import { clearProfile } from "../../../../../actions/user";
import { clearClass } from "../../../../../actions/class";
import { clearPosts } from "../../../../../actions/post";

const StudentNavbar = ({
   navbar: { showMenu, currentNav },
   logOutAndToggle,
   auth: { userLogged },
   enrollments: { enrollments, loadingEnrollments },
   changePage,
   changePageAndMenu,
   clearPosts,
   clearClass,
   clearProfile,
   loadEnrollments,
   location,
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
      if (loadingEnrollments) {
         const date = new Date();
         loadEnrollments({ student: userLogged._id, year: date.getFullYear() });
      }

      switch (path) {
         case "chat":
            changePage("chat");
            break;
         case "classinfo":
            changePage("classmates");
            break;
         case "dashboard":
            if (id === userLogged._id) {
               changePage("index");
            } else {
               changePage("classmates");
            }
            break;
         default:
            changePage("index");
            break;
      }
   }, [
      changePage,
      userLogged._id,
      id,
      path,
      loadEnrollments,
      loadingEnrollments,
   ]);

   return (
      <>
         {!loadingEnrollments && (
            <ul className={!showMenu ? "menu-nav" : "menu-nav show"}>
               <li
                  className={
                     !showMenu
                        ? "nav-item"
                        : `nav-item show ${
                             currentNav === "index" ? "current" : ""
                          }`
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
               {enrollments[0] && enrollments[0].classroom._id && (
                  <>
                     <li
                        className={
                           !showMenu
                              ? "nav-item"
                              : `nav-item show ${
                                   currentNav === "classmates" ? "current" : ""
                                }`
                        }
                     >
                        <Link
                           className="nav-link"
                           to={`/class/${enrollments[0].classroom._id}`}
                           onClick={() => {
                              window.scroll(0, 0);
                              clearClass();
                              changePageAndMenu("classmates");
                           }}
                        >
                           <i className="fas fa-chalkboard-teacher"></i>
                           <span className="hide-md">&nbsp; Clase</span>
                        </Link>
                     </li>
                     <li
                        className={
                           !showMenu
                              ? "nav-item"
                              : `nav-item show ${
                                   currentNav === "chat" ? "current" : ""
                                }`
                        }
                     >
                        <Link
                           className="nav-link"
                           to={`/chat/${enrollments[0].classroom._id}`}
                           onClick={() => {
                              window.scroll(0, 0);
                              clearPosts();
                              clearClass();
                              changePageAndMenu("chat");
                           }}
                        >
                           <i className="far fa-comments"></i>
                           <span className="hide-md">&nbsp; Posteo Grupal</span>
                        </Link>
                     </li>
                  </>
               )}

               <li className={!showMenu ? "nav-item" : "nav-item show"}>
                  <Link
                     className="nav-link"
                     to="/login"
                     onClick={() => {
                        window.scroll(0, 0);
                        logOutAndToggle();
                     }}
                  >
                     <i className="fas fa-sign-out-alt"></i>
                     <span className="hide-md">&nbsp; Cerrar Sesión</span>
                  </Link>
               </li>
            </ul>
         )}
      </>
   );
};

StudentNavbar.propTypes = {
   navbar: PropTypes.object.isRequired,
   auth: PropTypes.object.isRequired,
   enrollments: PropTypes.object.isRequired,
   logOutAndToggle: PropTypes.func.isRequired,
   changePage: PropTypes.func.isRequired,
   changePageAndMenu: PropTypes.func.isRequired,
   clearClass: PropTypes.func.isRequired,
   clearProfile: PropTypes.func.isRequired,
   loadEnrollments: PropTypes.func.isRequired,
   clearPosts: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   navbar: state.navbar,
   enrollments: state.enrollments,
   auth: state.auth,
});

export default connect(mapStateToProps, {
   logOutAndToggle,
   changePage,
   changePageAndMenu,
   clearProfile,
   loadEnrollments,
   clearPosts,
   clearClass,
})(withRouter(StudentNavbar));
