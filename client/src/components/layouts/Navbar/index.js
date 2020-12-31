import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { toggleMenu } from "../../../actions/navbar";
import { clearProfile } from "../../../actions/user";

import GuestNavbar from "./usersLinks/GuestNavbar";
import AdminNavbar from "./usersLinks/AdminNavbar";
import StudentNavbar from "./usersLinks/StudentNavbar";
import TeacherNavbar from "./usersLinks/TeacherNavbar";
import TutorNavbar from "./usersLinks/TutorNavbar";

import onlyLogo from "../../../img/logoSinLetras.png";
import logo from "../../../img/logo.png";
import "./style.scss";

const Navbar = ({
   auth: { userLogged, loading, isAuthenticated, visitor },
   navbar: { showMenu },
   toggleMenu,
   clearProfile,
}) => {
   const type = () => {
      if (isAuthenticated) {
         switch (userLogged.type) {
            case "Alumno":
               return <StudentNavbar />;
            case "Profesor":
               return <TeacherNavbar />;
            case "Tutor":
               return <TutorNavbar />;
            case "Administrador":
            case "Secretaria":
            case "Admin/Profesor":
               return <AdminNavbar />;
            default:
               return <GuestNavbar />;
         }
      } else {
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
               clearProfile();
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
            {!visitor ? (
               <>
                  {!loading ? (
                     type()
                  ) : (
                     <ul className={!showMenu ? "menu-nav" : "menu-nav show"}>
                        <li
                           className={
                              !showMenu ? "nav-item" : "nav-item show current"
                           }
                        >
                           <p className="lead">
                              <i className="far fa-clock"></i> &nbsp;
                              <span className="hide-md">Cargando...</span>
                           </p>
                        </li>
                     </ul>
                  )}
               </>
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
};

const mapStateToProps = (state) => ({
   auth: state.auth,
   navbar: state.navbar,
});

export default connect(mapStateToProps, { toggleMenu, clearProfile })(Navbar);
