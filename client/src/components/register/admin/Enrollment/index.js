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

import StudentSearch from "../../../sharedComp/search/StudentSearch";
import Loading from "../../../modal/Loading";
import Confirm from "../../../modal/Confirm";

const Enrollment = ({
   history,
   match,
   location,
   loadCategories,
   registerEnrollment,
   loadEnrollment,
   clearEnrollments,
   categories,
   auth: { userLogged },
   enrollments: { enrollment, loading },
}) => {
   const day = moment();
   const thisYear = day.year();

   const [formData, setFormData] = useState({
      student: "",
      studentName: "",
      year: thisYear,
      category: "",
      currentMonth: true,
   });

   const [otherValues, setOtherValues] = useState({
      enrollmentValue: 0,
      toggleModal: false,
      isEdit: location.pathname !== "/enrollment",
      oneLoad: true,
   });

   const { toggleModal, enrollmentValue, isEdit, oneLoad } = otherValues;
   const { student, year, category, currentMonth, studentName } = formData;

   useEffect(() => {
      const load = () => {
         setFormData({
            category: enrollment.category._id,
            currentMonth: true,
            year: Number(enrollment.year),
         });
      };

      if (oneLoad) {
         loadCategories();
         if (isEdit) {
            loadEnrollment(match.params.id);
         }
         setOtherValues((prev) => ({
            ...prev,
            oneLoad: false,
         }));
      } else {
         if (!categories.loading) {
            setOtherValues((prev) => ({
               ...prev,
               enrollmentValue: categories.categories[0].value,
            }));
         }
         if (isEdit && !loading) load();
      }
   }, [
      oneLoad,
      categories.loading,
      enrollment,
      isEdit,
      loading,
      loadCategories,
      categories.categories,
      loadEnrollment,
      match.params.id,
   ]);

   const selectStudent = (user) => {
      setFormData({
         ...formData,
         student: user._id,
         studentName: user.lastname + ", " + user.name,
      });
   };

   const onChange = (e) => {
      setFormData({
         ...formData,
         [e.target.name]: e.target.value,
      });
   };

   const onChangeCheckbox = (e) => {
      setFormData({
         ...formData,
         [e.target.name]:
            e.target.name === "year"
               ? e.target.checked
                  ? thisYear
                  : thisYear + 1
               : e.target.checked,
      });
   };

   const onSubmit = () => {
      registerEnrollment(
         formData,
         history,
         userLogged._id,
         isEdit && enrollment._id
      );
   };

   const setToggle = (e) => {
      if (e) e.preventDefault();
      setOtherValues({
         ...otherValues,
         toggleModal: !toggleModal,
      });
   };
   return (
      <>
         {!loading || !isEdit ? (
            <>
               {!isEdit ? <h1>Inscripción</h1> : <h2>Editar inscripción</h2>}
               <Confirm
                  toggleModal={toggleModal}
                  setToggleModal={setToggle}
                  confirm={onSubmit}
                  text={`¿Está seguro que ${
                     isEdit
                        ? "desea modificar la inscripción"
                        : "los datos son correctos"
                  }?`}
               />
               {!isEdit && (
                  <div className="btn-right">
                     <Link
                        to="/enrollment-list"
                        onClick={() => {
                           window.scroll(0, 0);
                           clearEnrollments();
                        }}
                        className="btn btn-light"
                     >
                        Ver Listado
                     </Link>
                  </div>
               )}
               <form className="form" onSubmit={(e) => setToggle(e)}>
                  {!isEdit && (
                     <StudentSearch
                        selectedStudent={student}
                        selectStudent={selectStudent}
                        enrollment={true}
                     />
                  )}
                  <p className={`heading-tertiary ${!isEdit && "mt-3"}`}>
                     Alumno:{" "}
                     <span className="text-secondary">
                        {!isEdit
                           ? studentName
                           : enrollment.student.lastname +
                             ", " +
                             enrollment.student.name}
                     </span>
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
                        {!categories.loading &&
                           categories.categories.length > 0 &&
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
                  {!isEdit && (
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
                  {isEdit && (
                     <div className="form-group">
                        <input
                           className="form-input"
                           id="year"
                           type="text"
                           value={enrollment.year}
                           disabled
                        />
                        <label htmlFor="value" className="form-label show">
                           Año
                        </label>
                     </div>
                  )}
                  {!isEdit && (
                     <div className="form-group text-right py-1">
                        <input
                           className="form-checkbox"
                           type="checkbox"
                           onChange={onChangeCheckbox}
                           checked={!(year !== thisYear)}
                           name="year"
                           id="cb1"
                        />
                        <label
                           className="checkbox-lbl"
                           id="check"
                           htmlFor="cb1"
                        >
                           {year !== thisYear
                              ? "Siguiente Año"
                              : "Año en Curso"}
                        </label>
                     </div>
                  )}
                  {(year === thisYear ||
                     (isEdit && Number(enrollment.year) === thisYear)) && (
                     <div className="form-group text-right">
                        <input
                           className="form-checkbox"
                           type="checkbox"
                           onChange={onChangeCheckbox}
                           checked={currentMonth}
                           name="currentMonth"
                           id="cb2"
                        />
                        <label
                           className="checkbox-lbl"
                           id="check"
                           htmlFor="cb2"
                        >
                           {!currentMonth ? "Mes Siguiente" : "Mes en Curso"}
                        </label>
                     </div>
                  )}
                  <div className="show-md mt-4"></div>
                  <div className="btn-ctr">
                     <button type="submit" className="btn btn-primary">
                        <i className="fas fa-user-edit"></i>{" "}
                        {isEdit ? "Guardar Cambios" : "Inscribir"}
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
})(withRouter(Enrollment));
