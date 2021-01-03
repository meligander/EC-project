import React, { useEffect, useState } from "react";
import Moment from "react-moment";
import moment from "moment";
import "moment/locale/es";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import { loadRegister, clearRegisters } from "../../../../../actions/register";
import { clearInvoiceNumber } from "../../../../../actions/invoice";
import {
   clearInstallments,
   getTotalDebt,
} from "../../../../../actions/installment";
import { getYearEnrollments } from "../../../../../actions/enrollment";
import { clearSearch, getActiveUsers } from "../../../../../actions/user";
import { clearClasses, getActiveClasses } from "../../../../../actions/class";
import { clearCategories } from "../../../../../actions/category";

import Loading from "../../../../modal/Loading";

import "./style.scss";

const AdminDashboard = ({
   registers: { register, loading },
   yearEnrollments,
   totalDebt,
   activeUsers,
   activeClasses,
   loadRegister,
   getTotalDebt,
   getYearEnrollments,
   getActiveUsers,
   getActiveClasses,
   clearInvoiceNumber,
   clearInstallments,
   clearRegisters,
   clearSearch,
   clearClasses,
   clearCategories,
}) => {
   const date = new Date();

   const [otherValues, setOtherValues] = useState({
      dateR: moment(),
      oneLoadDate: true,
      oneLoadInfoAdmin: true,
   });

   const { dateR, oneLoadDate, oneLoadInfoAdmin } = otherValues;

   useEffect(() => {
      const changeDate = () => {
         if (register && register.temporary) {
            setOtherValues((prev) => ({
               ...prev,
               dateR: register.date,
               oneLoadDate: false,
            }));
         }
      };

      if (oneLoadDate && !loading) changeDate();

      if (oneLoadInfoAdmin) {
         if (yearEnrollments.year === "") getYearEnrollments();
         if (activeUsers.activeStudents === "") getActiveUsers("Alumno");
         if (activeUsers.activeTeachers === "") getActiveUsers("Profesor");
         if (totalDebt === "") getTotalDebt();
         if (activeClasses === "") getActiveClasses();
         if (loading || !register) loadRegister();

         setOtherValues((prev) => ({
            ...prev,
            oneLoadInfoAdmin: false,
         }));
      }
   }, [
      loading,
      register,
      oneLoadDate,
      oneLoadInfoAdmin,
      yearEnrollments,
      activeUsers,
      totalDebt,
      activeClasses,
      loadRegister,
      getYearEnrollments,
      getActiveUsers,
      getTotalDebt,
      getActiveClasses,
   ]);

   return (
      <>
         {!loading &&
         yearEnrollments.year !== "" &&
         totalDebt !== "" &&
         activeUsers.activeTeachers !== "" &&
         activeUsers.activeStudents !== "" &&
         activeClasses !== "" ? (
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
                                 clearInvoiceNumber();
                                 clearSearch();
                                 window.scroll(0, 0);
                              }}
                           >
                              <i className="fas fa-hand-holding-usd side-nav-icon"></i>{" "}
                              <span className="hide-sm">Facturación</span>
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
                              <i className="fas fa-cash-register side-nav-icon"></i>{" "}
                              <span className="hide-sm">Caja</span>
                           </Link>
                        </li>
                     </ul>
                  </div>
                  <div className="info p-3">
                     <h3 className="heading-tertiary text-dark">
                        <i className="fas fa-calendar-day"></i> &nbsp;
                        <Moment format="LLLL" locale="es" date={dateR} />
                     </h3>
                     <div className="register-info-money my-5 text-center">
                        <p className=" heading-tertiary">
                           <span className="text-dark">Ingresos: </span>$
                           {register && register.income && register.temporary
                              ? register.income
                              : 0}
                        </p>
                        <p className=" heading-tertiary">
                           <span className="text-dark">Egresos: </span>$
                           {register && register.expence && register.temporary
                              ? register.expence
                              : 0}
                        </p>
                     </div>
                  </div>
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
                              <i className="fas fa-search side-nav-icon"></i>
                              <span className="hide-sm"> Búsqueda</span>
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
                              <i className="far fa-calendar-alt side-nav-icon"></i>
                              <span className="hide-sm"> Cuotas</span>
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
                              <i className="fas fa-chalkboard-teacher side-nav-icon"></i>
                              <span className="hide-sm"> Clases</span>
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
                              <i className="fas fa-user-edit side-nav-icon"></i>
                              <span className="hide-sm"> Inscripción</span>
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
                              <i className="fas fa-layer-group side-nav-icon"></i>
                              <span className="hide-sm"> Categorías</span>
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
                              <i className="fas fa-graduation-cap side-nav-icon"></i>
                              <span className="hide-sm"> Menciones</span>
                           </Link>
                        </li>
                     </ul>
                  </div>
                  <div className="info p-3">
                     <h3 className="heading-tertiary text-dark">
                        <i className="fas fa-user-cog"></i>&nbsp; Administración
                        de Usuarios
                     </h3>
                     <div className="text-center my-4 py-3">
                        <p className="heading-tertiary">
                           <span className="text-dark">Deuda: </span>$
                           {totalDebt}
                        </p>
                        <p className="heading-tertiary">
                           <span className="text-dark">Alumnos Activos: </span>
                           {activeUsers.activeStudents}
                        </p>
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
                        <p className="heading-tertiary">
                           <span className="text-dark">Profesores: </span>
                           {activeUsers.activeTeachers}
                        </p>
                        <p className="heading-tertiary">
                           <span className="text-dark">Clases: </span>
                           {activeClasses}
                        </p>
                     </div>
                  </div>
               </section>
            </>
         ) : (
            <Loading />
         )}
      </>
   );
};

AdminDashboard.propTypes = {
   registers: PropTypes.object.isRequired,
   loadRegister: PropTypes.func.isRequired,
   getTotalDebt: PropTypes.func.isRequired,
   getYearEnrollments: PropTypes.func.isRequired,
   getActiveUsers: PropTypes.func.isRequired,
   getActiveClasses: PropTypes.func.isRequired,
   clearInvoiceNumber: PropTypes.func.isRequired,
   clearInstallments: PropTypes.func.isRequired,
   clearRegisters: PropTypes.func.isRequired,
   clearSearch: PropTypes.func.isRequired,
   clearClasses: PropTypes.func.isRequired,
   clearCategories: PropTypes.func.isRequired,
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
   clearInvoiceNumber,
   clearRegisters,
   clearSearch,
   clearClasses,
   clearCategories,
})(AdminDashboard);
