import React, { useEffect, useState } from "react";
import Moment from "react-moment";
import moment from "moment";
import "moment/locale/es";
import { connect } from "react-redux";
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
   clearRegisters,
} from "../../../../../../actions/register";
import {
   getInvoiceNumber,
   clearInvoice,
} from "../../../../../../actions/invoice";
import {
   clearInstallments,
   getTotalDebt,
} from "../../../../../../actions/installment";
import { getYearEnrollments } from "../../../../../../actions/enrollment";
import { clearSearch, getActiveUsers } from "../../../../../../actions/user";
import {
   clearClasses,
   getActiveClasses,
} from "../../../../../../actions/class";
import { clearCategories } from "../../../../../../actions/category";
import { formatNumber } from "../../../../../../actions/mixvalues";

import "./style.scss";

const AdminDashboard = ({
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
   clearRegisters,
   clearSearch,
   clearClasses,
   clearCategories,
   clearInvoice,
}) => {
   const date = new Date();

   const [adminValues, setAdminValues] = useState({
      dateR: moment(),
   });

   const { dateR } = adminValues;

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
      if (totalDebt === "") getTotalDebt();
   }, [totalDebt, getTotalDebt]);

   useEffect(() => {
      if (activeClasses === "") getActiveClasses();
   }, [activeClasses, getActiveClasses]);

   useEffect(() => {
      if (loadingRegister) loadRegister();
      else if (register.temporary)
         setAdminValues((prev) => ({
            ...prev,
            dateR: register.date,
         }));
   }, [loadingRegister, register, loadRegister]);

   return (
      <>
         <section className="section-sidebar">
            <div className="sidebar">
               <ul className="side-nav">
                  <li className="side-nav-item">
                     <Link
                        to="/invoice-generation"
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
                        to="/installments/0"
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
                        to="/categories"
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
                        to="/cashregister-info"
                        onClick={() => {
                           clearRegisters();
                           clearSearch();
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
                     <Moment format="LLLL" locale="es" date={dateR} />
                  </h3>

                  <div className="register-info-money my-5 pt-2 text-center">
                     <p className=" heading-tertiary">
                        <span className="text-dark">Ingresos: </span>$
                        {register && register.income && register.temporary
                           ? formatNumber(register.income)
                           : 0}
                     </p>
                     <p className=" heading-tertiary">
                        <span className="text-dark">Egresos: </span>$
                        {register && register.expence && register.temporary
                           ? formatNumber(register.expence)
                           : 0}
                     </p>
                  </div>
               </div>
            )}
         </section>
         <section className="section-sidebar">
            <div className="sidebar">
               <ul className="side-nav">
                  <li className="side-nav-item">
                     <Link
                        to="/search"
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
                        to="/classes"
                        onClick={() => {
                           clearClasses();
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
                        to="/enrollment"
                        onClick={() => {
                           clearSearch();
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
                        to="/mention-list"
                        onClick={() => {
                           clearSearch();
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
                  {totalDebt !== "" && (
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
               </div>
            </div>
         </section>
      </>
   );
};

const mapStateToProps = (state) => ({
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
   clearRegisters,
   clearSearch,
   clearClasses,
   clearCategories,
   clearInvoice,
})(AdminDashboard);
