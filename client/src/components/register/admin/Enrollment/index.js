import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import moment from "moment";
import PropTypes from "prop-types";

import { loadCategories } from "../../../../actions/category";
import {
   registerEnrollment,
   loadEnrollment,
   clearEnrollments,
} from "../../../../actions/enrollment";
import { clearSearch, clearProfile } from "../../../../actions/user";
import { setAlert } from "../../../../actions/alert";

import StudentSearch from "../../sharedComp/search/StudentSearch";
import Loading from "../../../modal/Loading";
import Confirm from "../../../modal/Confirm";

const Enrollment = ({
   history,
   match,
   loadCategories,
   registerEnrollment,
   loadEnrollment,
   clearEnrollments,
   clearSearch,
   clearProfile,
   setAlert,
   auth: { userLogged },
   categories,
   enrollments: { enrollment, loading },
}) => {
   const day = moment();
   const thisYear = day.year();
   const currentMonthName = day
      .format("MMMM")
      .replace(/\b\w/, (c) => c.toUpperCase());
   const nextMonthName = moment()
      .add(1, "M")
      .format("MMMM")
      .replace(/\b\w/, (c) => c.toUpperCase());
   const currentMonthNumber = day.month() + 1;

   const [formData, setFormData] = useState({
      student: "",
      category: "",
      year: "",
      month: "",
   });

   const [otherValues, setOtherValues] = useState({
      selectedStudent: {
         _id: "",
         name: "",
      },
      enrollmentValue: 0,
      hideSearch: false,
      toggleModal: false,
   });

   const {
      toggleModal,
      enrollmentValue,
      selectedStudent,
      hideSearch,
   } = otherValues;

   const { year, category, month } = formData;

   const enroll_id = match.params.enrollment_id;

   useEffect(() => {
      const load = () => {
         setFormData({
            category: enrollment.category._id,
            currentMonth: true,
            year: Number(enrollment.year),
         });
      };

      if (categories.loading) {
         loadCategories();
         if (enroll_id) {
            loadEnrollment(enroll_id);
         }
      } else {
         setOtherValues((prev) => ({
            ...prev,
            enrollmentValue: categories.categories[0].value,
         }));
         if (!loading) load();
      }
   }, [
      enrollment,
      categories,
      loading,
      loadEnrollment,
      loadCategories,
      enroll_id,
   ]);

   const selectStudent = (user) => {
      setOtherValues({
         ...otherValues,
         selectedStudent: {
            _id: user._id,
            name: user.lastname + ", " + user.name,
         },
      });
   };

   const addStudent = (e) => {
      if (selectedStudent._id === "") {
         setAlert("Primero debe seleccionar un alumno.", "danger", "3");
      } else {
         e.preventDefault();
         setFormData({
            ...formData,
            student: selectedStudent._id,
         });
         clearSearch();
         setOtherValues({
            ...otherValues,
            hideSearch: true,
         });
      }
   };

   const onChange = (e) => {
      setFormData({
         ...formData,
         [e.target.name]: e.target.value,
      });
   };

   const onSubmit = () => {
      registerEnrollment(
         {
            ...formData,
            month:
               thisYear === Number(year) && currentMonthNumber > 2 ? month : 0,
         },
         history,
         userLogged._id,
         enroll_id
      );
   };

   const setToggle = (e) => {
      if (e) e.preventDefault();
      setOtherValues({
         ...otherValues,
         toggleModal: !toggleModal,
      });
   };

   const restore = () => {
      setOtherValues({
         ...otherValues,
         hideSearch: false,
         selectedStudent: {
            _id: "",
            name: "",
         },
      });
   };

   return (
      <>
         {(!loading || !enroll_id) && !categories.loading ? (
            <>
               {!enroll_id ? <h1>Inscripción</h1> : <h2>Editar inscripción</h2>}
               <Confirm
                  toggleModal={toggleModal}
                  setToggleModal={setToggle}
                  confirm={onSubmit}
                  text={`¿Está seguro que ${
                     enroll_id
                        ? "desea modificar la inscripción"
                        : "los datos son correctos"
                  }?`}
               />
               {!enroll_id && (
                  <div className="btn-right">
                     <Link
                        to="/enrollment-list"
                        onClick={() => {
                           window.scroll(0, 0);
                           clearEnrollments();
                        }}
                        className="btn btn-light"
                     >
                        <i className="fas fa-list-ul"></i>
                        <span className="hide-sm">&nbsp; Listado</span>
                     </Link>
                  </div>
               )}
               <form className="form" onSubmit={setToggle}>
                  {!enroll_id && !hideSearch && (
                     <StudentSearch
                        selectStudent={selectStudent}
                        selectedStudent={selectedStudent}
                        actionForSelected={addStudent}
                        typeSearch="enrollment"
                     />
                  )}
                  <p className={`heading-tertiary ${!enroll_id && "mt-3"}`}>
                     <span className="text-dark">Alumno: </span> &nbsp;
                     {hideSearch && (
                        <>
                           <Link
                              to={`/dashboard/${selectedStudent._id}`}
                              className="text-secondary"
                              onClick={() => {
                                 clearProfile();
                                 window.scroll(0, 0);
                              }}
                           >
                              {selectedStudent.name}
                           </Link>
                           &nbsp;
                           <button
                              className="btn-cancel"
                              type="button"
                              onClick={restore}
                           >
                              <i className="fas fa-times"></i>
                           </button>
                        </>
                     )}
                  </p>
                  <div className="form-group mt-3">
                     <select
                        className="form-input"
                        id="category"
                        name="category"
                        onChange={onChange}
                        value={category}
                     >
                        <option value="">* Seleccione Categoría</option>
                        {categories.categories.length > 0 &&
                           categories.categories.map(
                              (category) =>
                                 category.name !== "Inscripción" && (
                                    <option
                                       key={category._id}
                                       value={category._id}
                                    >
                                       {category.name}
                                    </option>
                                 )
                           )}
                     </select>
                     <label
                        htmlFor="category"
                        className={`form-label ${category === "" && "lbl"}`}
                     >
                        Categoría
                     </label>
                  </div>
                  <div className="form-group">
                     <select
                        className="form-input"
                        id="year"
                        name="year"
                        onChange={onChange}
                        value={year}
                        disabled={enroll_id}
                     >
                        <option value="">
                           * Seleccione el año al que lo va a inscribir
                        </option>
                        <option value={thisYear}>{thisYear}</option>
                        <option value={thisYear + 1}>{thisYear + 1}</option>
                     </select>
                     <label
                        htmlFor="year"
                        className={`form-label ${year === "" && "lbl"}`}
                     >
                        Año
                     </label>
                  </div>
                  {Number(year) === thisYear && currentMonthNumber > 2 && (
                     <div className="form-group">
                        <select
                           className="form-input"
                           id="month"
                           name="month"
                           onChange={onChange}
                           value={month}
                        >
                           <option value="">{`* Seleccione el mes a partir del cuál ${
                              enroll_id
                                 ? "cambiará la inscripción"
                                 : "lo va a inscribir"
                           }`}</option>
                           <option value={currentMonthNumber}>
                              {currentMonthName}
                           </option>
                           <option value={currentMonthNumber + 1}>
                              {nextMonthName}
                           </option>
                        </select>
                        <label
                           htmlFor="month"
                           className={`form-label ${month === "" && "lbl"}`}
                        >
                           Mes
                        </label>
                     </div>
                  )}
                  {!enroll_id && (
                     <div className="form-group">
                        <input
                           className="form-input"
                           type="text"
                           id="value"
                           value={`$${enrollmentValue}`}
                           disabled
                        />
                        <label htmlFor="value" className="form-label show">
                           Importe
                        </label>
                     </div>
                  )}
                  <div className="show-md mt-4"></div>
                  <div className="btn-ctr">
                     <button type="submit" className="btn btn-primary">
                        <i className="fas fa-user-edit"></i>&nbsp;{" "}
                        {enroll_id ? "Guardar Cambios" : "Inscribir"}
                     </button>
                  </div>
               </form>
            </>
         ) : (
            <Loading />
         )}
      </>
   );
};

Enrollment.propTypes = {
   loadCategories: PropTypes.func.isRequired,
   registerEnrollment: PropTypes.func.isRequired,
   loadEnrollment: PropTypes.func.isRequired,
   clearEnrollments: PropTypes.func.isRequired,
   clearSearch: PropTypes.func.isRequired,
   clearProfile: PropTypes.func.isRequired,
   setAlert: PropTypes.func.isRequired,
   categories: PropTypes.object.isRequired,
   enrollments: PropTypes.object.isRequired,
   auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
   categories: state.categories,
   enrollments: state.enrollments,
   auth: state.auth,
});

export default connect(mapStateToProps, {
   loadCategories,
   registerEnrollment,
   loadEnrollment,
   clearEnrollments,
   clearSearch,
   clearProfile,
   setAlert,
})(withRouter(Enrollment));
