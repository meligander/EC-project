import React, { useEffect, useRef } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { BsClock } from "react-icons/bs";
import { GoHome } from "react-icons/go";
import { RiLogoutCircleRLine } from "react-icons/ri";

import {
   setNavbarHeight,
   updateCurrentNav,
   toggleMenu,
} from "../../../actions/mixvalues";
import { logOut } from "../../../actions/auth";
import { clearProfile } from "../../../actions/user";

import GuestNavbar from "./usersLinks/GuestNavbar";
import AdminNavbar from "./usersLinks/AdminNavbar";
import StudentNavbar from "./usersLinks/StudentNavbar";
import TeacherNavbar from "./usersLinks/TeacherNavbar";
import GuardianNavbar from "./usersLinks/GuardianNavbar";

import onlyLogo from "../../../img/logoSinLetras.png";
import logo from "../../../img/logo.png";
import "./style.scss";

const Navbar = ({
   location,
   auth: { userLogged, loading, isAuthenticated },
   enrollments: { enrollments },
   mixvalues: { currentNav, menuToggle },
   logOut,
   setNavbarHeight,
   updateCurrentNav,
   clearProfile,
   toggleMenu,
}) => {
   const ref = useRef();
   const isAdmin =
      userLogged &&
      (userLogged.type === "admin" ||
         userLogged.type === "admin&teacher" ||
         userLogged.type === "secretary");

   useEffect(() => {
      if (userLogged) {
         const path = location.pathname.split("/");

         let currentNav = path[1];

         if (path[2] === "dashboard") {
            switch (userLogged.type) {
               case "guardian":
                  if (path[3] !== "0")
                     currentNav =
                        "child" +
                        userLogged.children.findIndex(
                           (item) => item._id === path[3]
                        );
                  break;
               case "student":
                  if (enrollments.length > 0) {
                     if (path[3] === "0") currentNav = "class-" + 0;
                     else {
                        const index = enrollments.findIndex(
                           (item) => path[4] === item.classroom
                        );
                        currentNav = "class-" + index;
                     }
                  } else currentNav = "index";
                  break;
               default:
                  currentNav = "user";
                  break;
            }
         }

         updateCurrentNav(currentNav, false);
      }
   }, [userLogged, updateCurrentNav, location.pathname, enrollments]);

   useEffect(() => {
      setTimeout(() => {
         setNavbarHeight(ref.current.offsetHeight);
      }, 60);
   }, [setNavbarHeight]);

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
            return <></>;
      }
   };

   return (
      <nav className="navbar bg-primary" ref={ref}>
         <Link
            className="navbar-home-btn"
            to={userLogged ? "/index/dashboard/0" : "/"}
            onClick={() => {
               updateCurrentNav("index", false);
               if (userLogged && userLogged.type === "student") clearProfile();
               window.scroll(0, 0);
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
            className={!menuToggle ? "menu-btn" : "menu-btn close"}
            onClick={toggleMenu}
         >
            <div className="btn-line"></div>
            <div className="btn-line"></div>
            <div className="btn-line"></div>
         </div>

         <div className={!menuToggle ? "menu" : "menu show"}>
            <div
               className={!menuToggle ? "menu-branding" : "menu-branding show"}
            >
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
                  <ul className={`menu-nav${menuToggle ? " show" : ""}`}>
                     <li
                        className={
                           !menuToggle ? "nav-item" : "nav-item show current"
                        }
                     >
                        <p className="heading-tertiary">
                           <BsClock />
                           <span className="hide-md">&nbsp;Cargando...</span>
                        </p>
                     </li>
                  </ul>
               ) : (
                  <ul
                     className={`${isAdmin ? "admin " : ""}menu-nav${
                        menuToggle ? " show" : ""
                     }`}
                  >
                     {userLogged.type !== "student" && (
                        <li
                           className={`nav-item${isAdmin ? " smaller" : ""}${
                              menuToggle ? " show" : ""
                           }${currentNav === "index" ? " current" : ""}`}
                        >
                           <Link
                              className="nav-link"
                              to="/index/dashboard/0"
                              onClick={() => {
                                 window.scroll(0, 0);
                                 if (
                                    userLogged &&
                                    userLogged.type === "student"
                                 )
                                    clearProfile();
                                 updateCurrentNav("index", true);
                              }}
                           >
                              <GoHome />
                              <span className="hide-md">
                                 &nbsp; Página Principal
                              </span>
                           </Link>
                        </li>
                     )}

                     {type()}
                     <li
                        className={`nav-item${isAdmin ? " smaller" : ""}${
                           menuToggle ? " show" : ""
                        }`}
                     >
                        <Link
                           className="nav-link"
                           to="/login"
                           onClick={() => {
                              window.scroll(0, 0);
                              updateCurrentNav("login", true);
                              logOut();
                           }}
                        >
                           <RiLogoutCircleRLine />
                           <span className="hide-md">&nbsp;Cerrar Sesión</span>
                        </Link>
                     </li>
                  </ul>
               )
            ) : (
               <GuestNavbar />
            )}
         </div>
      </nav>
   );
};

const mapStateToProps = (state) => ({
   auth: state.auth,
   mixvalues: state.mixvalues,
   enrollments: state.enrollments,
});

export default connect(mapStateToProps, {
   setNavbarHeight,
   logOut,
   updateCurrentNav,
   clearProfile,
   toggleMenu,
})(withRouter(Navbar));
