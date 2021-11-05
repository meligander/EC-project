import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { ImSearch } from "react-icons/im";
import {
   FaCashRegister,
   FaChalkboardTeacher,
   FaHandHoldingUsd,
   FaUserEdit,
} from "react-icons/fa";

import { getInvoiceNumber } from "../../../../../actions/invoice";
import { clearInstallments } from "../../../../../actions/installment";
import { clearRegisters } from "../../../../../actions/register";
import { clearSearch } from "../../../../../actions/user";
import { clearClasses } from "../../../../../actions/class";

import "./style.scss";

const AdminNavbar = ({
   posts: { allUnseenPosts },
   clearInstallments,
   getInvoiceNumber,
   clearRegisters,
   clearSearch,
   clearClasses,
   toggleMenu,
   setCurrentNav,
   currentNav,
}) => {
   return (
      <>
         <li
            className={`nav-item smaller${toggleMenu ? " show" : ""}${
               currentNav === "search" ? " current" : ""
            }`}
         >
            <Link
               className="nav-link"
               to="/search"
               onClick={() => {
                  window.scroll(0, 0);
                  clearSearch();
                  setCurrentNav("search");
               }}
            >
               <ImSearch />
               <span className="hide-md">&nbsp;Búsqueda</span>
            </Link>
         </li>
         <li
            className={`nav-item smaller${toggleMenu ? " show" : ""}${
               currentNav === "classes" ? " current" : ""
            }`}
         >
            <Link
               className="nav-link"
               to="/classes"
               onClick={() => {
                  clearClasses();
                  setCurrentNav("classes");
                  window.scroll(0, 0);
               }}
            >
               <div className="notification">
                  <FaChalkboardTeacher />
                  {allUnseenPosts > 0 && (
                     <span
                        className={`post-notification teacher ${
                           currentNav === "classes" ? "white" : "light"
                        }`}
                     >
                        {allUnseenPosts}
                     </span>
                  )}
               </div>
               <span className="hide-md">&nbsp;Clases</span>
            </Link>
         </li>
         <li
            className={`nav-item smaller${toggleMenu ? " show" : ""}${
               currentNav === "enrollment" ? " current" : ""
            }`}
         >
            <Link
               className="nav-link"
               to="/enrollment"
               onClick={() => {
                  window.scroll(0, 0);
                  clearSearch();
                  setCurrentNav("enrollment");
               }}
            >
               <FaUserEdit />
               <span className="hide-md">&nbsp;Inscripción</span>
            </Link>
         </li>
         <li
            className={`nav-item smaller${toggleMenu ? " show" : ""}${
               currentNav === "invoice" ? " current" : ""
            }`}
         >
            <Link
               className="nav-link"
               to="/invoice-generation"
               onClick={() => {
                  setCurrentNav("invoice");
                  clearInstallments();
                  getInvoiceNumber();
                  clearSearch();
                  window.scroll(0, 0);
               }}
            >
               <FaHandHoldingUsd />
               <span className="hide-md">&nbsp;Facturación</span>
            </Link>
         </li>
         <li
            className={`nav-item smaller${toggleMenu ? " show" : ""}${
               currentNav === "register" ? " current" : ""
            }`}
         >
            <Link
               className="nav-link"
               to="/cashregister-info"
               onClick={() => {
                  setCurrentNav("register");
                  clearRegisters();
                  clearSearch();
                  window.scroll(0, 0);
               }}
            >
               <FaCashRegister />
               <span className="hide-md">&nbsp;Caja</span>
            </Link>
         </li>
      </>
   );
};

const mapStateToProps = (state) => ({
   auth: state.auth,
   posts: state.posts,
});

export default connect(mapStateToProps, {
   clearInstallments,
   getInvoiceNumber,
   clearRegisters,
   clearSearch,
   clearClasses,
})(AdminNavbar);
