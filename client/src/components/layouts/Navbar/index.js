import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { toggleMenu } from "../../../actions/navbar";
import { clearProfile } from "../../../actions/user";
import { loadStudentClass } from "../../../actions/class";
import { getUnseenPosts } from "../../../actions/post";

import GuestNavbar from "./usersLinks/GuestNavbar";
import AdminNavbar from "./usersLinks/AdminNavbar";
import StudentNavbar from "./usersLinks/StudentNavbar";
import TeacherNavbar from "./usersLinks/TeacherNavbar";
import GuardianNavbar from "./usersLinks/GuardianNavbar";

import onlyLogo from "../../../img/logoSinLetras.png";
import logo from "../../../img/logo.png";
import "./style.scss";

const Navbar = ({
   auth: { userLogged, loading, isAuthenticated },
   navbar: { showMenu },
   getUnseenPosts,
   loadStudentClass,
   toggleMenu,
   clearProfile,
}) => {
   useEffect(() => {
      if (userLogged) {
         if (userLogged.type === "student") {
            loadStudentClass(userLogged._id);
            getUnseenPosts(userLogged.classroom);
         } else {
            if (
               userLogged.type === "teacher" ||
               userLogged.type === "admin&teacher"
            )
               getUnseenPosts();
         }
      }
   }, [userLogged, loadStudentClass, getUnseenPosts]);

   const type = () => {
      switch (userLogged.type) {
         case "student":
            return <StudentNavbar />;
         case "teacher":
            return <TeacherNavbar />;
         case "guardian":
            return <GuardianNavbar />;
         case "admin":
         case "secretary":
         case "admin&teacher":
            return <AdminNavbar />;
         default:
            return <GuestNavbar />;
      }
   };

   return (
      <nav className="navbar bg-primary">
         <Link
            className="navbar-home-btn"
            to={isAuthenticated ? `/dashboard/${userLogged._id}` : "/"}
            onClick={() => {
               window.scroll(0, 0);
               if (isAuthenticated) clearProfile(userLogged.type !== "student");
            }}
         >
            <div className="navbar-logo">
               <img src={onlyLogo} alt="Logo English Centre" />
            </div>
            <p className="navbar-heading hide-sm">
               Villa de Merlo English Centre
            </p>
         </Link>
         {userLogged !== null && (
            <h3 className="navbar-name">Welcome {userLogged.name}</h3>
         )}
         <div
            className={!showMenu ? "menu-btn" : "menu-btn close"}
            onClick={toggleMenu}
         >
            <div className="btn-line"></div>
            <div className="btn-line"></div>
            <div className="btn-line"></div>
         </div>

         <div className={!showMenu ? "menu" : "menu show"}>
            <div className={!showMenu ? "menu-branding" : "menu-branding show"}>
               <div className="logo">
                  <img src={logo} alt="English Centre logo" />
               </div>
               <div className="address">
                  <h3 className="heading-tertiary">
                     Villa de Merlo English Centre
                  </h3>
                  <p className="paragraph">
                     Villa De Merlo - San Luis <br /> Argentina
                  </p>
               </div>
            </div>
            {isAuthenticated ? (
               loading ? (
                  <ul className={!showMenu ? "menu-nav" : "menu-nav show"}>
                     <li
                        className={
                           !showMenu ? "nav-item" : "nav-item show current"
                        }
                     >
                        <p className="heading-tertiary">
                           <i className="far fa-clock"></i>
                           <span className="hide-md">&nbsp; Cargando...</span>
                        </p>
                     </li>
                  </ul>
               ) : (
                  type()
               )
            ) : (
               <GuestNavbar />
            )}
         </div>
      </nav>
   );
};

Navbar.prototypes = {
   auth: PropTypes.object.isRequired,
   navbar: PropTypes.object.isRequired,
   toggleMenu: PropTypes.func.isRequired,
   clearProfile: PropTypes.func.isRequired,
   getUnseenPosts: PropTypes.func.isRequired,
   loadStudentClass: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   auth: state.auth,
   navbar: state.navbar,
});

export default connect(mapStateToProps, {
   toggleMenu,
   clearProfile,
   getUnseenPosts,
   loadStudentClass,
})(Navbar);
