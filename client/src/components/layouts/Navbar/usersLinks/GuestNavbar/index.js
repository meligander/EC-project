import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { GoHome } from "react-icons/go";
import { BsInfoCircleFill } from "react-icons/bs";
import { FaAddressBook } from "react-icons/fa";
import { RiLoginCircleLine } from "react-icons/ri";

import { clearSearch } from "../../../../../actions/user";
import { updateCurrentNav, toggleMenu } from "../../../../../actions/global";

const GuestNavbar = ({
   global: { currentNav, menuToggle },
   clearSearch,
   toggleMenu,
   updateCurrentNav,
}) => {
   return (
      <ul className={`menu-nav${menuToggle ? " show" : ""}`}>
         <li
            className={`nav-item${menuToggle ? " show" : ""}${
               currentNav === "index" ? " current" : ""
            }`}
         >
            <Link
               className="nav-link"
               to="/"
               onClick={() => {
                  window.scroll(0, 0);
                  updateCurrentNav("index", true);
               }}
            >
               <GoHome />
               <span className="hide-md">&nbsp;Página Principal</span>
            </Link>
         </li>
         <li
            className={`nav-item${menuToggle ? " show" : ""}${
               currentNav === "about" ? " current" : ""
            }`}
         >
            <Link
               className="nav-link"
               to="/about"
               onClick={() => {
                  window.scroll(0, 0);
                  updateCurrentNav("about", true);
                  clearSearch();
               }}
            >
               <BsInfoCircleFill />
               <span className="hide-md">&nbsp;Acerca de Nosotros</span>
            </Link>
         </li>
         <li
            className={`nav-item${menuToggle ? " show" : ""}${
               currentNav === "contact" ? " current" : ""
            }`}
         >
            <Link
               className="nav-link"
               to="/contact"
               onClick={() => {
                  window.scroll(0, 0);
                  updateCurrentNav("contact", true);
               }}
            >
               <FaAddressBook />
               <span className="hide-md">&nbsp;Contáctanos</span>
            </Link>
         </li>
         <li
            className={`nav-item${menuToggle ? " show" : ""}${
               currentNav === "login" ? " current" : ""
            }`}
         >
            <Link
               className="nav-link"
               to="/login"
               onClick={() => {
                  window.scroll(0, 0);
                  toggleMenu();
               }}
            >
               <RiLoginCircleLine />
               <span className="hide-md">&nbsp;Iniciar Sesión</span>
            </Link>
         </li>
      </ul>
   );
};

const mapStateToProps = (state) => ({
   global: state.global,
});

export default connect(mapStateToProps, {
   clearSearch,
   updateCurrentNav,
   toggleMenu,
})(GuestNavbar);
