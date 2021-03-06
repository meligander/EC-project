import React, { useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import {
   logOutAndToggle,
   changePageAndMenu,
   changePage,
} from "../../../../../actions/navbar";
import { clearProfile } from "../../../../../actions/user";

const GuardianNavbar = ({
   location,
   navbar: { showMenu, currentNav },
   auth: { userLogged },
   posts: { post },
   logOutAndToggle,
   changePage,
   changePageAndMenu,
   clearProfile,
}) => {
   const string = location.pathname.substring(1, location.pathname.length);

   useEffect(() => {
      let id = string.substring(
         string.indexOf("/") + 1,
         location.pathname.length
      );

      if (id.length > 25) {
         if (post !== null) id = post.classroom;
      }
      let pass = false;
      for (let x = 0; x < userLogged.children.length; x++) {
         if (
            userLogged.children[x]._id === id ||
            userLogged.children[x].classroom === id
         ) {
            changePage(`dashboard${x}`);
            pass = true;
         }
      }
      if (!pass) changePage("index");
   }, [
      changePage,
      string,
      userLogged.children,
      post,
      location.pathname.length,
   ]);

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
                  changePageAndMenu("index");
               }}
            >
               <i className="fas fa-home"></i>
               <span className="hide-md">&nbsp; Página Principal</span>
            </Link>
         </li>
         {userLogged.children.length > 0 &&
            userLogged.children.map((child, index) => (
               <li
                  key={child._id}
                  className={
                     !showMenu
                        ? "nav-item"
                        : `nav-item show ${
                             currentNav === "dashboard" + index ? "current" : ""
                          }`
                  }
               >
                  <Link
                     className="nav-link"
                     to={`/dashboard/${child._id}`}
                     onClick={() => {
                        window.scroll(0, 0);
                        clearProfile();
                        changePageAndMenu(`dashboard${index}`);
                     }}
                  >
                     <i
                        className={`${
                           index % 2 === 0 ? "fas" : "far"
                        } fa-user-circle`}
                     ></i>
                     <span className="hide-md">
                        &nbsp; {child.lastname + ", " + child.name}
                     </span>
                  </Link>
               </li>
            ))}
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
   );
};

GuardianNavbar.propTypes = {
   navbar: PropTypes.object.isRequired,
   auth: PropTypes.object.isRequired,
   posts: PropTypes.object.isRequired,
   logOutAndToggle: PropTypes.func.isRequired,
   changePageAndMenu: PropTypes.func.isRequired,
   changePage: PropTypes.func.isRequired,
   clearProfile: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   navbar: state.navbar,
   auth: state.auth,
   posts: state.posts,
});

export default connect(mapStateToProps, {
   logOutAndToggle,
   changePageAndMenu,
   changePage,
   clearProfile,
})(withRouter(GuardianNavbar));
