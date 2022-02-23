import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { format, getYear, getMonth, addMonths } from "date-fns";
import { es } from "date-fns/locale";
import { FiSave } from "react-icons/fi";
import { IoIosListBox } from "react-icons/io";
import { FaUserEdit } from "react-icons/fa";

import { loadCategories } from "../../../../../actions/category";
import {
   registerUpdateEnrollment,
   loadEnrollment,
   clearEnrollments,
} from "../../../../../actions/enrollment";
import { togglePopup } from "../../../../../actions/mixvalues";

import UsersSearch from "../../sharedComp/search/UsersSearch";
import PopUp from "../../../../modal/PopUp";

const Enrollment = ({
   categories: { categories, loading },
   enrollments: { enrollment, loadingEnrollment, enrollments },
   match,
   loadCategories,
   registerUpdateEnrollment,
   loadEnrollment,
   clearEnrollments,
   togglePopup,
}) => {
   const date = new Date();
   const thisYear = getYear(date);
   const currentMonth = getMonth(date) + 1;

   const [formData, setFormData] = useState({
      _id: match.params.enrollment_id ? match.params.enrollment_id : "",
      student: null,
      category: "",
      year: "",
      month: "",
   });

   const { year, category, month, _id, student } = formData;

   useEffect(() => {
      if (loading) loadCategories(false);
   }, [loading, loadCategories]);

   useEffect(() => {
      if (_id !== "") {
         if (loadingEnrollment) loadEnrollment(_id, true);
         else
            setFormData((prev) => ({
               ...prev,
               student: enrollment.student,
               category: enrollment.category._id,
               year: enrollment.year,
            }));
      }
   }, [_id, loadingEnrollment, loadEnrollment, enrollment]);

   const restore = () => {
      setFormData({
         ...formData,
         student: null,
      });
   };

   const selectUser = (user) => {
      setFormData((prev) => ({ ...prev, student: user }));
   };

   const onChange = (e) => {
      e.persist();
      setFormData({
         ...formData,
         [e.target.name]: e.target.value,
      });
   };

   return (
      <>
         {_id === "" ? <h1>Inscripción</h1> : <h2>Editar inscripción</h2>}
         <PopUp
            confirm={() =>
               registerUpdateEnrollment(
                  {
                     ...formData,
                     student: student._id,
                     month:
                        thisYear === Number(year) && currentMonth > 2
                           ? month
                           : 0,
                  },
                  enrollments.length > 0
               )
            }
            info={`¿Está seguro que ${
               _id !== ""
                  ? "desea modificar la inscripción"
                  : "los datos son correctos"
            }?`}
         />
         {!_id && (
            <div className="btn-right">
               <Link
                  to="/enrollment/list"
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
               togglePopup("default");
            }}
         >
            <UsersSearch
               primary={true}
               disabled={_id}
               autoComplete="off"
               selectUser={selectUser}
               selectedUser={student}
               usersType="student"
               restore={restore}
            />
            <div className={`form-group ${!student ? "mt-3" : ""}`}>
               <select
                  className="form-input"
                  id="category"
                  name="category"
                  onChange={onChange}
                  value={category}
               >
                  <option value="">* Seleccione Categoría</option>
                  {categories.map(
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
            {Number(year) === thisYear && currentMonth > 2 && (
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
                     <option value={currentMonth}>
                        {format(date, "MMMM", { locale: es }).replace(
                           /\b\w/,
                           (c) => c.toUpperCase()
                        )}
                     </option>
                     <option value={currentMonth + 1}>
                        {format(addMonths(date, 1), "MMMM", {
                           locale: es,
                        }).replace(/\b\w/, (c) => c.toUpperCase())}
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
                        &nbsp; Inscribir
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
});

export default connect(mapStateToProps, {
   loadCategories,
   registerUpdateEnrollment,
   loadEnrollment,
   clearEnrollments,
   togglePopup,
})(Enrollment);
