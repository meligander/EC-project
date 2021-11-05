import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import moment from "moment";
import { FiSave } from "react-icons/fi";
import { IoIosListBox } from "react-icons/io";
import { FaTimes, FaUserEdit } from "react-icons/fa";

import { loadCategories } from "../../../../../actions/category";
import {
   registerEnrollment,
   loadEnrollment,
   clearEnrollments,
} from "../../../../../actions/enrollment";
import { clearSearch, clearProfile } from "../../../../../actions/user";
import { setAlert } from "../../../../../actions/alert";

import StudentSearch from "../../sharedComp/search/StudentSearch";
import PopUp from "../../../../modal/PopUp";

const Enrollment = ({
   match,
   loadCategories,
   registerEnrollment,
   loadEnrollment,
   clearEnrollments,
   clearSearch,
   clearProfile,
   setAlert,
   auth: { userLogged },
   categories: { categories, loading: loadingCategories },
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
      _id: match.params.enrollment_id !== "0" ? match.params.enrollment_id : "",
      student: "",
      category: "",
      year: "",
      month: "",
   });

   const [adminValues, setAdminValues] = useState({
      selectedStudent: {
         _id: "",
         name: "",
      },
      enrollmentValue: 0,
      hideSearch: false,
      toggleModal: false,
   });

   const { toggleModal, enrollmentValue, selectedStudent, hideSearch } =
      adminValues;

   const { year, category, month, _id } = formData;

   useEffect(() => {
      if (loadingCategories) loadCategories();
      else
         setAdminValues((prev) => ({
            ...prev,
            enrollmentValue: categories.categories[0].value,
         }));
   }, [loadingCategories, loadCategories, categories]);

   useEffect(() => {
      if (_id !== "0") {
         if (loading) loadEnrollment();
         else
            setFormData((prev) => ({
               ...prev,
               category: enrollment.category._id,
               currentMonth: true,
               year: Number(enrollment.year),
            }));
      }
   }, [_id, loading, loadEnrollment, enrollment]);

   const addStudent = () => {
      if (selectedStudent._id === "") {
         setAlert("Primero debe seleccionar un alumno.", "danger", "3");
      } else {
         setFormData({
            ...formData,
            student: selectedStudent._id,
         });
         clearSearch();
         setAdminValues({
            ...adminValues,
            hideSearch: true,
            selectedStudent: {
               _id: "",
               name: "",
            },
         });
      }
   };

   const onChange = (e) => {
      setFormData({
         ...formData,
         [e.target.name]: e.target.value,
      });
   };

   const setToggle = () => {
      setAdminValues((prev) => ({ ...prev, toggleModal: !toggleModal }));
   };

   const restore = () => {
      setAdminValues({
         ...adminValues,
         hideSearch: false,
         selectedStudent: {
            _id: "",
            name: "",
         },
      });
   };

   return (
      <>
         {_id === "" ? <h1>Inscripción</h1> : <h2>Editar inscripción</h2>}
         <PopUp
            toggleModal={toggleModal}
            setToggleModal={setToggle}
            confirm={() =>
               registerEnrollment({
                  ...formData,
                  month:
                     thisYear === Number(year) && currentMonthNumber > 2
                        ? month
                        : 0,
               })
            }
            text={`¿Está seguro que ${
               _id !== ""
                  ? "desea modificar la inscripción"
                  : "los datos son correctos"
            }?`}
         />
         {!_id && (
            <div className="btn-right">
               <Link
                  to="/enrollment-list"
                  onClick={() => {
                     window.scroll(0, 0);
                     clearEnrollments();
                  }}
                  className="btn btn-light"
               >
                  <IoIosListBox />
                  <span className="hide-sm">&nbsp; Listado</span>
               </Link>
            </div>
         )}
         <form
            className="form"
            onSubmit={(e) => {
               e.preventDefault();
               setToggle();
            }}
         >
            {_id === "" && !hideSearch && (
               <StudentSearch
                  selectStudent={(user) =>
                     setAdminValues({
                        ...adminValues,
                        selectedStudent: {
                           _id: user._id,
                           name: `${user.lastname} ${user.name}`,
                        },
                     })
                  }
                  selectedStudent={selectedStudent}
                  actionForSelected={addStudent}
                  typeSearch="enrollment"
               />
            )}
            <p className={`heading-tertiary ${_id === "" && "mt-3"}`}>
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
                        onClick={(e) => {
                           e.preventDefault();
                           restore();
                        }}
                     >
                        <FaTimes />
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
                              <option key={category._id} value={category._id}>
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
                  disabled={_id !== ""}
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
                        _id ? "cambiará la inscripción" : "lo va a inscribir"
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
            {_id === "" && (
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
            <div className="btn-center">
               <button type="submit" className="btn btn-primary">
                  {_id !== "" ? (
                     <>
                        <FiSave />
                        &nbsp; Guardar Cambios
                     </>
                  ) : (
                     <>
                        <FaUserEdit />
                        "Inscribir
                     </>
                  )}
               </button>
            </div>
         </form>
      </>
   );
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
})(Enrollment);
