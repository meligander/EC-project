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

import { getInvoiceNumber, clearInvoice } from "../../../../../actions/invoice";
import { clearEnrollments } from "../../../../../actions/enrollment";
import { clearInstallments } from "../../../../../actions/installment";
import { clearRegister } from "../../../../../actions/register";
import { clearSearch, clearUsers } from "../../../../../actions/user";
import { clearClasses } from "../../../../../actions/class";
import { clearGlobals, updateCurrentNav } from "../../../../../actions/global";

import "./style.scss";

const AdminNavbar = ({
   global: { currentNav, menuToggle },
   clearInstallments,
   getInvoiceNumber,
   clearRegister,
   clearSearch,
   clearClasses,
   clearUsers,
   clearGlobals,
   clearInvoice,
   clearEnrollments,
   updateCurrentNav,
}) => {
   return (
      <>
         <li
            className={`nav-item smaller${menuToggle ? " show" : ""}${
               currentNav === "user" ? " current" : ""
            }`}
         >
            <Link
               className="nav-link"
               to="/user/search"
               onClick={() => {
                  window.scroll(0, 0);
                  clearSearch();
                  updateCurrentNav("user", true);
               }}
            >
               <ImSearch />
               <span className="hide-md">&nbsp;Búsqueda</span>
            </Link>
         </li>
         <li
            className={`nav-item smaller${menuToggle ? " show" : ""}${
               currentNav === "class" ? " current" : ""
            }`}
         >
            <Link
               className="nav-link"
               to="/class/all"
               onClick={() => {
                  clearClasses();
                  clearUsers();
                  updateCurrentNav("class", true);
                  window.scroll(0, 0);
               }}
            >
               <FaChalkboardTeacher />
               <span className="hide-md">&nbsp;Clases</span>
            </Link>
         </li>
         <li
            className={`nav-item smaller${menuToggle ? " show" : ""}${
               currentNav === "enrollment" ? " current" : ""
            }`}
         >
            <Link
               className="nav-link"
               to="/enrollment/register"
               onClick={() => {
                  window.scroll(0, 0);
                  clearSearch();
                  clearEnrollments();
                  updateCurrentNav("enrollment", true);
               }}
            >
               <FaUserEdit />
               <span className="hide-md">&nbsp;Inscripción</span>
            </Link>
         </li>
         <li
            className={`nav-item smaller${menuToggle ? " show" : ""}${
               currentNav === "invoice" ? " current" : ""
            }`}
         >
            <Link
               className="nav-link"
               to="/invoice/register"
               onClick={() => {
                  updateCurrentNav("invoice", true);
                  clearInstallments();
                  getInvoiceNumber();
                  clearSearch();
                  clearInvoice();
                  clearGlobals();
                  window.scroll(0, 0);
               }}
            >
               <FaHandHoldingUsd />
               <span className="hide-md">&nbsp;Facturación</span>
            </Link>
         </li>
         <li
            className={`nav-item smaller${menuToggle ? " show" : ""}${
               currentNav === "register" ? " current" : ""
            }`}
         >
            <Link
               className="nav-link"
               to="/register/info"
               onClick={() => {
                  updateCurrentNav("register", true);
                  clearRegister();
                  clearUsers();
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
   global: state.global,
});

export default connect(mapStateToProps, {
   clearInstallments,
   getInvoiceNumber,
   clearRegister,
   clearSearch,
   clearClasses,
   clearInvoice,
   clearUsers,
   clearGlobals,
   clearEnrollments,
   updateCurrentNav,
})(AdminNavbar);
