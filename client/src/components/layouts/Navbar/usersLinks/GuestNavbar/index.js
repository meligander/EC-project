import React, { useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { changePageAndMenu, changePage } from "../../../../../actions/navbar";

const GuestNavbar = ({
   location,
   navbar: { showMenu, currentNav },
   changePage,
   changePageAndMenu,
}) => {
   useEffect(() => {
      const string = location.pathname.substring(1, location.pathname.length);
      switch (string) {
         case "about":
            changePage("about");
            break;
         case "contact":
            changePage("contact");
            break;
         case "login":
            changePage("login");
            break;
         default:
            changePage("index");
            break;
      }
   }, [changePage, location.pathname]);
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
               to="/"
               onClick={() => {
                  window.scroll(0, 0);
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
                  : `nav-item show ${currentNav === "about" ? "current" : ""}`
            }
         >
            <Link
               className="nav-link"
               to="/about"
               onClick={() => {
                  window.scroll(0, 0);
                  changePageAndMenu("about");
               }}
            >
               <i className="fas fa-info-circle"></i>
               <span className="hide-md">&nbsp; Acerca de Nosotros</span>
            </Link>
         </li>
         <li
            className={
               !showMenu
                  ? "nav-item"
                  : `nav-item show ${currentNav === "contact" ? "current" : ""}`
            }
         >
            <Link
               className="nav-link"
               to="/contact"
               onClick={() => {
                  window.scroll(0, 0);
                  changePageAndMenu("contact");
               }}
            >
               <i className="fas fa-address-book"></i>
               <span className="hide-md">&nbsp; Contáctanos</span>
            </Link>
         </li>
         <li
            className={
               !showMenu
                  ? "nav-item"
                  : `nav-item show ${currentNav === "login" ? "current" : ""}`
            }
         >
            <Link
               className="nav-link"
               to="/login"
               onClick={() => {
                  window.scroll(0, 0);
                  changePageAndMenu("login");
               }}
            >
               <i className="fas fa-sign-in-alt"></i>
               <span className="hide-md">&nbsp; Iniciar Sesión</span>
            </Link>
         </li>
      </ul>
   );
};

GuestNavbar.propTypes = {
   navbar: PropTypes.object.isRequired,
   changePage: PropTypes.func.isRequired,
   changePageAndMenu: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   navbar: state.navbar,
});

export default connect(mapStateToProps, { changePage, changePageAndMenu })(
   withRouter(GuestNavbar)
);
