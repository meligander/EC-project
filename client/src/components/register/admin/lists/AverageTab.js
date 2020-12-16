import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
   loadStudentAverage,
   enrollmentsPDF,
} from "../../../../actions/enrollment";
import ListButtons from "./ListButtons";
import { loadCategories } from "../../../../actions/category";
import { updatePageNumber } from "../../../../actions/mixvalues";
import { setAlert } from "../../../../actions/alert";
import PropTypes from "prop-types";

function AverageTab({
   mixvalues: { page },
   enrollments: { enrollments, loadingEnrollments, type },
   categories: { categories, loading },
   loadStudentAverage,
   loadCategories,
   updatePageNumber,
   enrollmentsPDF,
   setAlert,
}) {
   const [filterData, setFilterData] = useState({
      amount: "",
      category: "",
   });

   const { amount, category } = filterData;

   useEffect(() => {
      if (loading) loadCategories();
   }, [loading, loadCategories]);

   const onChange = (e) => {
      setFilterData({
         ...filterData,
         [e.target.name]: e.target.value,
      });
   };

   const search = (e) => {
      e.preventDefault();
      loadStudentAverage(filterData);
   };

   const pdfGeneratorSave = () => {
      if (enrollments.length === 0) {
         setAlert("Primero debe realizar una búsqueda", "danger", "2");
         window.scrollTo(500, 0);
      } else {
         enrollmentsPDF(enrollments, "averages");
      }
   };

   return (
      <>
         <form className="form">
            <div className="form-group">
               <select
                  className="form-input"
                  id="category"
                  name="category"
                  onChange={onChange}
                  value={category}
               >
                  <option value="">* Seleccione Categoría</option>
                  {!loading &&
                     categories.length > 0 &&
                     categories.map(
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
                  className={`form-label ${category === "" ? "lbl" : ""}`}
               >
                  Categoría
               </label>
            </div>
            <div className="form-group">
               <input
                  className="form-input"
                  type="number"
                  value={amount}
                  onChange={(e) => onChange(e)}
                  name="amount"
                  id="amount"
                  placeholder="Cantidad"
               />
               <label htmlFor="amount" className="form-label">
                  Cantidad
               </label>
            </div>
            <div className="btn-right mb-1">
               <button onClick={search} className="btn btn-light">
                  <i className="fas fa-filter"></i> Buscar
               </button>
            </div>
         </form>
         <div className="wrapper mt-3">
            <table>
               <thead>
                  <tr>
                     <th>Legajo</th>
                     <th>Nombre</th>
                     <th>Categoría</th>
                     <th>Promedio</th>
                  </tr>
               </thead>
               <tbody>
                  {!loadingEnrollments &&
                     enrollments.length > 0 &&
                     type === "average" &&
                     enrollments.map(
                        (enroll, i) =>
                           i >= page * 10 &&
                           i < (page + 1) * 10 && (
                              <tr key={enroll._id}>
                                 <td>{enroll.student.studentnumber}</td>
                                 <td>
                                    {enroll.student.lastname +
                                       ", " +
                                       enroll.student.name}
                                 </td>
                                 <td>{enroll.category.name}</td>
                                 <td>{enroll.average}</td>
                              </tr>
                           )
                     )}
               </tbody>
            </table>
         </div>
         <ListButtons
            page={page}
            items={enrollments}
            pdfGeneratorSave={pdfGeneratorSave}
            changePage={updatePageNumber}
         />
      </>
   );
}

AverageTab.propTypes = {
   mixvalues: PropTypes.object.isRequired,
   categories: PropTypes.object.isRequired,
   enrollments: PropTypes.object.isRequired,
   loadStudentAverage: PropTypes.func.isRequired,
   enrollmentsPDF: PropTypes.func.isRequired,
   setAlert: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   enrollments: state.enrollments,
   mixvalues: state.mixvalues,
   categories: state.categories,
});

export default connect(mapStateToProps, {
   loadStudentAverage,
   loadCategories,
   updatePageNumber,
   enrollmentsPDF,
   setAlert,
})(AverageTab);
