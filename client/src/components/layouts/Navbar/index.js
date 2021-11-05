import React, { useEffect, useRef, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { BsClock } from "react-icons/bs";
import { GoHome } from "react-icons/go";
import { RiLogoutCircleRLine } from "react-icons/ri";

import { getUnseenPosts } from "../../../actions/post";
import { setNavbarHeight } from "../../../actions/mixvalues";

import GuestNavbar from "./usersLinks/GuestNavbar";
import AdminNavbar from "./usersLinks/AdminNavbar";
import StudentNavbar from "./usersLinks/StudentNavbar";
import TeacherNavbar from "./usersLinks/TeacherNavbar";
import GuardianNavbar from "./usersLinks/GuardianNavbar";

import onlyLogo from "../../../img/logoSinLetras.png";
import logo from "../../../img/logo.png";
import "./style.scss";
import { logOut } from "../../../actions/auth";

const Navbar = ({
   auth: { userLogged, loading, isAuthenticated },
   location,
   match,
   logOut,
   getUnseenPosts,
   setNavbarHeight,
}) => {
   const ref = useRef();
   const string = location.pathname.substring(1, location.pathname.length);
   const path =
      string.indexOf("/") !== -1
         ? string.substring(0, string.indexOf("/"))
         : string;

   const _id =
      path === "dashboard" && match.params.user_id !== "0"
         ? match.params.user_id
         : "";

   const isAdmin =
      userLogged &&
      (userLogged.type === "admin" || userLogged.type === "admin&teacher");

   const [adminValues, setAdminValues] = useState({
      toggleMenu: false,
      currentNav: "index",
   });

   const { toggleMenu, currentNav } = adminValues;

   useEffect(() => {
      if (userLogged) {
         let currentNav = "";

         switch (path) {
            case "about":
               currentNav = "about";
               break;
            case "contact":
               currentNav = "contact";
               break;
            case "login":
               currentNav = "login";
               break;
            case "chat":
            case "classes":
            case "class":
            case "attendance":
            case "grades":
            case "edit-class":
            case "edit-gradetypes":
            case "register-class":
               currentNav =
                  userLogged.type === "student" ? "classmates" : "classes";
               break;
            case "cashregister-info":
            case "edit-expencetypes":
            case "income-list":
            case "expence-list":
            case "register-list":
               currentNav = "register";
               break;
            case "register":
            case "edit-user":
            case "edit-towns-neighbourhoods":
            case "credentials":
            case "search":
               currentNav = "search";
               break;
            case "enrollment-list":
            case "enrollment":
            case "edit-enrollment":
               currentNav = "enrollment";
               break;
            case "invoice-generation":
            case "invoice":
               currentNav = "invoice";
               break;
            case "dashboard":
               if (_id === "") currentNav = "index";
               else {
                  if (userLogged.type === "guardian")
                     currentNav =
                        "child" +
                        userLogged.children.findIndex(
                           (item) => item._id === _id
                        );
                  else
                     currentNav =
                        userLogged.type === "student" ? "classmates" : "search";
               }
               break;
            default:
               currentNav = "index";
               break;
         }
         setAdminValues((prev) => ({
            ...prev,
            currentNav,
         }));
      }
   }, [_id, path, userLogged]);

   useEffect(() => {
      if (userLogged) {
         if (userLogged.type === "student")
            getUnseenPosts(userLogged.classroom);
         else {
            if (
               userLogged.type === "teacher" ||
               userLogged.type === "admin&teacher"
            )
               getUnseenPosts();
         }
      }
   }, [userLogged, getUnseenPosts]);

   useEffect(() => {
      setTimeout(() => {
         setNavbarHeight(ref.current.offsetHeight);
      }, 60);
   }, [setNavbarHeight]);

   const type = () => {
      switch (userLogged.type) {
         case "student":
            return (
               <StudentNavbar
                  toggleMenu={toggleMenu}
                  currentNav={currentNav}
                  setCurrentNav={(page) =>
                     setAdminValues((prev) => ({
                        ...prev,
                        currentNav: page,
                        toggleMenu: !toggleMenu,
                     }))
                  }
               />
            );
         case "teacher":
            return (
               <TeacherNavbar
                  toggleMenu={toggleMenu}
                  currentNav={currentNav}
                  setCurrentNav={(page) =>
                     setAdminValues((prev) => ({
                        ...prev,
                        currentNav: page,
                        toggleMenu: !toggleMenu,
                     }))
                  }
               />
            );
         case "guardian":
            return (
               <GuardianNavbar
                  toggleMenu={toggleMenu}
                  currentNav={currentNav}
                  setCurrentNav={(page) =>
                     setAdminValues((prev) => ({
                        ...prev,
                        currentNav: page,
                        toggleMenu: !toggleMenu,
                     }))
                  }
               />
            );
         case "admin":
         case "secretary":
         case "admin&teacher":
            return (
               <AdminNavbar
                  toggleMenu={toggleMenu}
                  currentNav={currentNav}
                  setCurrentNav={(page) =>
                     setAdminValues((prev) => ({
                        ...prev,
                        currentNav: page,
                        toggleMenu: !toggleMenu,
                     }))
                  }
               />
            );
         default:
            return <></>;
      }
   };

   return (
      <nav className="navbar bg-primary" ref={ref}>
         <Link
            className="navbar-home-btn"
            to={userLogged ? "/dashboard/0" : "/"}
            onClick={() => window.scroll(0, 0)}
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
            className={!toggleMenu ? "menu-btn" : "menu-btn close"}
            onClick={() =>
               setAdminValues((prev) => ({ ...prev, toggleMenu: !toggleMenu }))
            }
         >
            <div className="btn-line"></div>
            <div className="btn-line"></div>
            <div className="btn-line"></div>
         </div>

         <div className={!toggleMenu ? "menu" : "menu show"}>
            <div
               className={!toggleMenu ? "menu-branding" : "menu-branding show"}
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
                  <ul className={`menu-nav${toggleMenu ? " show" : ""}`}>
                     <li
                        className={
                           !toggleMenu ? "nav-item" : "nav-item show current"
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
                        toggleMenu ? " show" : ""
                     }`}
                  >
                     <li
                        className={`nav-item${isAdmin ? " smaller" : ""}${
                           toggleMenu ? " show" : ""
                        }${currentNav === "index" ? " current" : ""}`}
                     >
                        <Link
                           className="nav-link"
                           to="/dashboard/0"
                           onClick={() => {
                              window.scroll(0, 0);
                              setAdminValues((prev) => ({
                                 ...prev,
                                 currentNav: "index",
                              }));
                           }}
                        >
                           <GoHome />
                           <span className="hide-md">
                              &nbsp; Página Principal
                           </span>
                        </Link>
                     </li>
                     {type()}
                     <li
                        className={`nav-item${isAdmin ? " smaller" : ""}${
                           toggleMenu ? " show" : ""
                        }`}
                     >
                        <Link
                           className="nav-link"
                           to="/login"
                           onClick={() => {
                              window.scroll(0, 0);
                              setAdminValues((prev) => ({
                                 ...prev,
                                 toggleMenu: false,
                                 currentNav: "login",
                              }));
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
               <GuestNavbar
                  toggleMenu={toggleMenu}
                  currentNav={currentNav}
                  setCurrentNav={(page) =>
                     setAdminValues((prev) => ({
                        ...prev,
                        currentNav: page,
                        toggleMenu: !toggleMenu,
                     }))
                  }
               />
            )}
         </div>
      </nav>
   );
};

const mapStateToProps = (state) => ({
   auth: state.auth,
});

export default connect(mapStateToProps, {
   getUnseenPosts,
   setNavbarHeight,
   logOut,
})(withRouter(Navbar));
