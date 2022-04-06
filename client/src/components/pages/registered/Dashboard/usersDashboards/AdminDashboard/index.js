import React, { useEffect } from "react";
import { connect } from "react-redux";
import es from "date-fns/locale/es";
import format from "date-fns/format";
import { Link } from "react-router-dom";
import {
   FaUserEdit,
   FaUserCog,
   FaHandHoldingUsd,
   FaRegCalendarAlt,
   FaLayerGroup,
   FaCashRegister,
   FaCalendarDay,
   FaChalkboardTeacher,
   FaGraduationCap,
} from "react-icons/fa";
import { ImSearch } from "react-icons/im";

import {
   loadRegister,
   clearRegister,
} from "../../../../../../actions/register";
import {
   getInvoiceNumber,
   clearInvoice,
} from "../../../../../../actions/invoice";
import {
   clearInstallments,
   getTotalDebt,
} from "../../../../../../actions/installment";
import {
   getYearEnrollments,
   clearEnrollments,
} from "../../../../../../actions/enrollment";
import {
   clearUsers,
   clearSearch,
   getActiveUsers,
} from "../../../../../../actions/user";
import {
   clearClasses,
   getActiveClasses,
} from "../../../../../../actions/class";
import { clearCategories } from "../../../../../../actions/category";
import { clearAttendances } from "../../../../../../actions/attendance";
import { clearGrades } from "../../../../../../actions/grade";
import { formatNumber, togglePopup } from "../../../../../../actions/global";

import "./style.scss";

const AdminDashboard = ({
   auth: { userLogged },
   registers: { register, loadingRegister },
   yearEnrollments,
   totalDebt,
   activeUsers,
   activeClasses,
   loadRegister,
   getTotalDebt,
   getYearEnrollments,
   getActiveUsers,
   getActiveClasses,
   getInvoiceNumber,
   clearInstallments,
   clearRegister,
   clearUsers,
   clearSearch,
   clearClasses,
   clearCategories,
   clearInvoice,
   clearAttendances,
   clearEnrollments,
   clearGrades,
   togglePopup,
}) => {
   const date = new Date();
   const isAdmin = userLogged.type !== "secretary";

   useEffect(() => {
      if (yearEnrollments.year === "") getYearEnrollments();
   }, [yearEnrollments.year, getYearEnrollments]);

   useEffect(() => {
      if (activeUsers.activeTeachers === "") getActiveUsers("teacher");
   }, [activeUsers.activeTeachers, getActiveUsers]);

   useEffect(() => {
      if (activeUsers.activeStudents === "") getActiveUsers("student");
   }, [activeUsers.activeStudents, getActiveUsers]);

   useEffect(() => {
      if (totalDebt === "" && isAdmin) getTotalDebt();
   }, [totalDebt, getTotalDebt, isAdmin]);

   useEffect(() => {
      if (activeClasses === "") getActiveClasses();
   }, [activeClasses, getActiveClasses]);

   useEffect(() => {
      if (loadingRegister) loadRegister(true);
   }, [loadingRegister, loadRegister]);

   const capitalize = (string) => {
      return string && string[0].toUpperCase() + string.slice(1);
   };

   return (
      <>
         <section className="section-sidebar">
            <div className="sidebar">
               <ul className="side-nav">
                  <li className="side-nav-item">
                     <Link
                        to="/invoice/register"
                        className="side-nav-link"
                        onClick={() => {
                           clearInstallments();
                           getInvoiceNumber();
                           clearSearch();
                           clearInvoice();
                           window.scroll(0, 0);
                        }}
                     >
                        <span className="side-nav-icon">
                           <FaHandHoldingUsd />
                        </span>
                        <span className="hide-sm">Facturación</span>
                     </Link>
                  </li>
                  <li className="side-nav-item">
                     <Link
                        to="/index/installments/0"
                        onClick={() => {
                           clearSearch();
                           clearInstallments();
                           window.scroll(0, 0);
                        }}
                        className="side-nav-link"
                     >
                        <span className="side-nav-icon">
                           <FaRegCalendarAlt />
                        </span>
                        <span className="hide-sm">Cuotas</span>
                     </Link>
                  </li>
                  <li className="side-nav-item">
                     <Link
                        to="/index/categories"
                        onClick={() => {
                           clearCategories();
                           window.scroll(0, 0);
                        }}
                        className="side-nav-link"
                     >
                        <span className="side-nav-icon">
                           <FaLayerGroup />
                        </span>
                        <span className="hide-sm">Categorías</span>
                     </Link>
                  </li>
                  <li className="side-nav-item">
                     <Link
                        className="side-nav-link"
                        to="/register/info"
                        onClick={() => {
                           clearRegister();
                           clearUsers();
                           window.scroll(0, 0);
                        }}
                     >
                        <span className="side-nav-icon">
                           <FaCashRegister />
                        </span>
                        <span className="hide-sm">Caja</span>
                     </Link>
                  </li>
               </ul>
            </div>
            {!loadingRegister && (
               <div className="info p-3">
                  <h3 className="heading-tertiary text-dark">
                     <FaCalendarDay />
                     &nbsp;&nbsp;
                     {capitalize(
                        format(
                           register && register.temporary
                              ? new Date(register.date)
                              : new Date(),
                           "EEEE, d 'de' LLLL 'de' yyyy",
                           {
                              locale: es,
                           }
                        )
                     )}
                  </h3>
                  {register && (
                     <div className="register-info-money my-5 pt-2 text-center">
                        <p className=" heading-tertiary">
                           <span className="text-dark">Ingresos: </span>$
                           {register.income && register.temporary
                              ? formatNumber(register.income)
                              : 0}
                        </p>
                        <p className=" heading-tertiary">
                           <span className="text-dark">Egresos: </span>$
                           {register.expence && register.temporary
                              ? formatNumber(register.expence)
                              : 0}
                        </p>
                     </div>
                  )}
               </div>
            )}
         </section>
         <section className="section-sidebar">
            <div className="sidebar">
               <ul className="side-nav">
                  <li className="side-nav-item">
                     <Link
                        to="/user/search"
                        onClick={() => {
                           clearSearch();
                           window.scroll(0, 0);
                        }}
                        className="side-nav-link"
                     >
                        <span className="side-nav-icon">
                           <ImSearch />
                        </span>
                        <span className="hide-sm">Búsqueda</span>
                     </Link>
                  </li>
                  <li className="side-nav-item">
                     <Link
                        to="/class/all"
                        onClick={() => {
                           clearClasses();
                           clearUsers();
                           window.scroll(0, 0);
                        }}
                        className="side-nav-link"
                     >
                        <span className="side-nav-icon">
                           <FaChalkboardTeacher />
                        </span>
                        <span className="hide-sm">Clases</span>
                     </Link>
                  </li>
                  <li className="side-nav-item">
                     <Link
                        to="/enrollment/register"
                        onClick={() => {
                           clearSearch();
                           clearEnrollments();
                           window.scroll(0, 0);
                        }}
                        className="side-nav-link"
                     >
                        <span className="side-nav-icon">
                           <FaUserEdit />
                        </span>
                        <span className="hide-sm">Inscripción</span>
                     </Link>
                  </li>

                  <li className="side-nav-item">
                     <Link
                        to="/index/mentions-list"
                        onClick={() => {
                           clearSearch();
                           clearAttendances();
                           clearGrades();
                           window.scroll(0, 0);
                        }}
                        className="side-nav-link"
                     >
                        <span className="side-nav-icon">
                           <FaGraduationCap />
                        </span>
                        <span className="hide-sm">Menciones</span>
                     </Link>
                  </li>
               </ul>
            </div>
            <div className="info p-3">
               <h3 className="heading-tertiary text-dark">
                  <FaUserCog />
                  &nbsp; Administración de Usuarios
               </h3>
               <div className="text-center mt-4">
                  {totalDebt !== "" && isAdmin && (
                     <p className="heading-tertiary">
                        <span className="text-dark">Deuda: </span>$
                        {formatNumber(totalDebt)}
                     </p>
                  )}
                  {activeUsers.activeStudents !== "" && (
                     <p className="heading-tertiary">
                        <span className="text-dark">Alumnos Activos: </span>
                        {activeUsers.activeStudents}
                     </p>
                  )}
                  {yearEnrollments.year !== "" && (
                     <p className="heading-tertiary">
                        <span className="text-dark">
                           Inscripciones{" "}
                           {yearEnrollments.year !== 0
                              ? yearEnrollments.year
                              : date.getFullYear()}
                           :{" "}
                        </span>
                        {yearEnrollments.length}
                     </p>
                  )}
                  {activeUsers.activeTeachers !== "" && (
                     <p className="heading-tertiary">
                        <span className="text-dark">Profesores: </span>
                        {activeUsers.activeTeachers}
                     </p>
                  )}
                  {activeClasses !== "" && (
                     <p className="heading-tertiary">
                        <span className="text-dark">Clases: </span>
                        {activeClasses}
                     </p>
                  )}
                  {isAdmin && (
                     <div className="btn-right">
                        <button
                           className="btn btn-secondary"
                           onClick={() => {
                              togglePopup("backup");
                           }}
                           type="button"
                        >
                           Restaurar BD
                        </button>
                     </div>
                  )}
               </div>
            </div>
         </section>
      </>
   );
};

const mapStateToProps = (state) => ({
   auth: state.auth,
   registers: state.registers,
   yearEnrollments: state.enrollments.otherValues.yearEnrollments,
   totalDebt: state.installments.otherValues.totalDebt,
   activeUsers: state.users.otherValues,
   activeClasses: state.classes.otherValues.activeClasses,
});

export default connect(mapStateToProps, {
   loadRegister,
   getTotalDebt,
   getYearEnrollments,
   getActiveUsers,
   getActiveClasses,
   clearInstallments,
   getInvoiceNumber,
   clearRegister,
   clearSearch,
   clearClasses,
   clearCategories,
   clearInvoice,
   clearUsers,
   clearAttendances,
   clearGrades,
   clearEnrollments,
   togglePopup,
})(AdminDashboard);
