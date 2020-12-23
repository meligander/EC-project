import React, { useEffect, useState } from "react";
import Moment from "react-moment";
import moment from "moment";
import "moment/locale/es";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import { loadRegister, clearRegisters } from "../../../../../actions/register";
import {
   clearInvoiceNumber,
   updatePreviousPage,
} from "../../../../../actions/mixvalues";
import { clearInstallments } from "../../../../../actions/installment";
import { getAdminDash } from "../../../../../actions/mixvalues";
import { clearSearch } from "../../../../../actions/user";
import { clearClasses } from "../../../../../actions/class";
import { clearCategories } from "../../../../../actions/category";

import "./style.scss";

const AdminDashboard = ({
   mixvalues: {
      loadingAdminDash,
      activeStudents,
      activeClasses,
      activeTeachers,
      enrollments,
      totalDebt,
   },
   registers: { register, loading },
   location,
   loadRegister,
   getAdminDash,
   updatePreviousPage,
   clearInvoiceNumber,
   clearInstallments,
   clearRegisters,
   clearSearch,
   clearClasses,
   clearCategories,
}) => {
   const [adminData, setAdminData] = useState({
      dateR: moment(),
      oneLoad: true,
   });

   const { dateR, oneLoad } = adminData;

   useEffect(() => {
      const changeDate = () => {
         if (register.temporary)
            setAdminData((prev) => ({
               ...prev,
               dateR: register.date,
            }));
      };
      if (loadingAdminDash && oneLoad) {
         getAdminDash();
         setAdminData((prev) => ({
            ...prev,
            oneLoad: false,
         }));
      }
      if (loading && oneLoad) loadRegister();
      if (!loading) changeDate();
   }, [
      loadingAdminDash,
      getAdminDash,
      loading,
      register,
      loadRegister,
      oneLoad,
   ]);

   return (
      <>
         {!loading && !loadingAdminDash && (
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
                                 updatePreviousPage(location.pathname);
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
                                 updatePreviousPage(location.pathname);
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
                        <i className="fas fa-calendar-day"></i>{" "}
                        <Moment format="LLLL" locale="es" date={dateR} />
                     </h3>
                     <div className="register-info-money my-5 text-center">
                        <p className=" heading-tertiary">
                           <span className="text-dark">Ingresos: </span>$
                           {register.income && register.temporary
                              ? register.income
                              : 0}
                        </p>
                        <p className=" heading-tertiary">
                           <span className="text-dark">Egresos: </span>$
                           {register.expence && register.temporary
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
                                 updatePreviousPage(location.pathname);
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
                                 updatePreviousPage(location.pathname);
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
                                 updatePreviousPage(location.pathname);
                                 window.scroll(0, 0);
                              }}
                              className="side-nav-link"
                           >
                              <i className="fas fa-chalkboard side-nav-icon"></i>
                              <span className="hide-sm"> Clases</span>
                           </Link>
                        </li>
                        <li className="side-nav-item">
                           <Link
                              to="/enrollment"
                              onClick={() => {
                                 clearSearch();
                                 updatePreviousPage(location.pathname);
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
                                 updatePreviousPage(location.pathname);
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
                                 updatePreviousPage(location.pathname);
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
                        <i className="fas fa-user-cog"></i> Administración de
                        Usuarios
                     </h3>
                     <div className="text-center my-4 py-3">
                        <p className="heading-tertiary">
                           <span className="text-dark">Deuda: </span>$
                           {totalDebt}
                        </p>
                        <p className="heading-tertiary">
                           <span className="text-dark">Alumnos Activos: </span>
                           {activeStudents}
                        </p>
                        <p className="heading-tertiary">
                           <span className="text-dark">
                              Inscripciones{" "}
                              {enrollments.year.toString() !== "" &&
                                 enrollments.year}
                              :{" "}
                           </span>
                           {enrollments.length}
                        </p>
                        <p className="heading-tertiary">
                           <span className="text-dark">Profesores: </span>
                           {activeTeachers}
                        </p>
                        <p className="heading-tertiary">
                           <span className="text-dark">Cursos: </span>
                           {activeClasses}
                        </p>
                     </div>
                  </div>
               </section>
            </>
         )}
      </>
   );
};

AdminDashboard.propTypes = {
   registers: PropTypes.object.isRequired,
   mixvalues: PropTypes.object.isRequired,
   loadRegister: PropTypes.func.isRequired,
   getAdminDash: PropTypes.func.isRequired,
   updatePreviousPage: PropTypes.func.isRequired,
   clearInvoiceNumber: PropTypes.func.isRequired,
   clearInstallments: PropTypes.func.isRequired,
   clearRegisters: PropTypes.func.isRequired,
   clearSearch: PropTypes.func.isRequired,
   clearClasses: PropTypes.func.isRequired,
   clearCategories: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   mixvalues: state.mixvalues,
   registers: state.registers,
});

export default connect(mapStateToProps, {
   getAdminDash,
   loadRegister,
   updatePreviousPage,
   clearInstallments,
   clearInvoiceNumber,
   clearRegisters,
   clearSearch,
   clearClasses,
   clearCategories,
})(withRouter(AdminDashboard));
