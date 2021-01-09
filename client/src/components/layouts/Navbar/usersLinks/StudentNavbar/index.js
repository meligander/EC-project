import React, { useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import {
   logOutAndToggle,
   changePage,
   changePageAndMenu,
} from "../../../../../actions/navbar";
import { clearProfile } from "../../../../../actions/user";
import { clearPosts } from "../../../../../actions/post";

const StudentNavbar = ({
   location,
   navbar: { showMenu, currentNav },
   auth: { userLogged },
   classes: { classInfo, loading },
   posts: { unseenPosts },
   clearPosts,
   clearProfile,
   changePage,
   changePageAndMenu,
   logOutAndToggle,
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
            changePage("chat");
            break;
         case "class":
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
   }, [changePage, userLogged._id, id, path]);

   return (
      <>
         {!loading && (
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
                        clearProfile(false);
                        changePageAndMenu("index");
                     }}
                  >
                     <i className="fas fa-home"></i>
                     <span className="hide-md">&nbsp; Página Principal</span>
                  </Link>
               </li>
               {classInfo && (
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
                           to={`/class/${classInfo._id}`}
                           onClick={() => {
                              window.scroll(0, 0);
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
                           to={`/chat/${classInfo._id}`}
                           onClick={() => {
                              window.scroll(0, 0);
                              clearPosts();
                              changePageAndMenu("chat");
                           }}
                        >
                           <div className="notification">
                              <i className="far fa-comments"></i>
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
   classes: PropTypes.object.isRequired,
   posts: PropTypes.object.isRequired,
   logOutAndToggle: PropTypes.func.isRequired,
   changePage: PropTypes.func.isRequired,
   changePageAndMenu: PropTypes.func.isRequired,
   clearProfile: PropTypes.func.isRequired,
   clearPosts: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   navbar: state.navbar,
   classes: state.classes,
   posts: state.posts,
   auth: state.auth,
});

export default connect(mapStateToProps, {
   logOutAndToggle,
   changePage,
   changePageAndMenu,
   clearPosts,
   clearProfile,
})(withRouter(StudentNavbar));
