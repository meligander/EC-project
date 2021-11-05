import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { GoHome } from "react-icons/go";
import { BsInfoCircleFill } from "react-icons/bs";
import { FaAddressBook } from "react-icons/fa";
import { RiLoginCircleLine } from "react-icons/ri";

import { clearSearch } from "../../../../../actions/user";

const GuestNavbar = ({
   clearSearch,
   toggleMenu,
   currentNav,
   setCurrentNav,
}) => {
   return (
      <ul className={`menu-nav${toggleMenu ? " show" : ""}`}>
         <li
            className={`nav-item${toggleMenu ? " show" : ""}${
               currentNav === "index" ? " current" : ""
            }`}
         >
            <Link
               className="nav-link"
               to="/"
               onClick={() => {
                  window.scroll(0, 0);
                  setCurrentNav("index");
               }}
            >
               <GoHome />
               <span className="hide-md">&nbsp;Página Principal</span>
            </Link>
         </li>
         <li
            className={`nav-item${toggleMenu ? " show" : ""}${
               currentNav === "about" ? " current" : ""
            }`}
         >
            <Link
               className="nav-link"
               to="/about"
               onClick={() => {
                  window.scroll(0, 0);
                  setCurrentNav("about");
                  clearSearch();
               }}
            >
               <BsInfoCircleFill />
               <span className="hide-md">&nbsp;Acerca de Nosotros</span>
            </Link>
         </li>
         <li
            className={`nav-item${toggleMenu ? " show" : ""}${
               currentNav === "contact" ? " current" : ""
            }`}
         >
            <Link
               className="nav-link"
               to="/contact"
               onClick={() => {
                  window.scroll(0, 0);
                  setCurrentNav("contact");
               }}
            >
               <FaAddressBook />
               <span className="hide-md">&nbsp;Contáctanos</span>
            </Link>
         </li>
         <li
            className={`nav-item${toggleMenu ? " show" : ""}${
               currentNav === "login" ? " current" : ""
            }`}
         >
            <Link
               className="nav-link"
               to="/login"
               onClick={() => {
                  window.scroll(0, 0);
                  setCurrentNav("login");
               }}
            >
               <RiLoginCircleLine />
               <span className="hide-md">&nbsp;Iniciar Sesión</span>
            </Link>
         </li>
      </ul>
   );
};

export default connect(null, {
   clearSearch,
})(GuestNavbar);
