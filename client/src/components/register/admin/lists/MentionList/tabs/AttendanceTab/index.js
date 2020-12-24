import React, { useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import {
   loadStudentAttendance,
   enrollmentsPDF,
} from "../../../../../../../actions/enrollment";
import { updatePageNumber } from "../../../../../../../actions/mixvalues";
import { setAlert } from "../../../../../../../actions/alert";

import ListButtons from "../../../sharedComp/ListButtons";

function AttendanceTab({
   mixvalues: { page },
   enrollments: { enrollments, loadingEnrollments, type },
   categories: { categories, loading },
   loadStudentAttendance,
   updatePageNumber,
   enrollmentsPDF,
   setAlert,
}) {
   const [filterData, setFilterData] = useState({
      absence: "",
      category: "",
   });

   const { absence, category } = filterData;

   const onChange = (e) => {
      setFilterData({
         ...filterData,
         [e.target.name]: e.target.value,
      });
   };

   const search = (e) => {
      e.preventDefault();
      loadStudentAttendance(filterData);
   };

   const pdfGeneratorSave = () => {
      if (enrollments.length === 0) {
         setAlert("Primero debe realizar una búsqueda", "danger", "2");
         window.scrollTo(500, 0);
      } else {
         enrollmentsPDF(enrollments, "attendances");
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
                  value={absence}
                  onChange={(e) => onChange(e)}
                  name="absence"
                  id="absence"
                  placeholder="N° Faltas"
               />
               <label htmlFor="absence" className="form-label">
                  N° Faltas
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
                     <th>Faltas</th>
                  </tr>
               </thead>
               <tbody>
                  {!loadingEnrollments &&
                     enrollments.length > 0 &&
                     type === "attendance" &&
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
                                 <td>{enroll.absence}</td>
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

AttendanceTab.propTypes = {
   mixvalues: PropTypes.object.isRequired,
   categories: PropTypes.object.isRequired,
   enrollments: PropTypes.object.isRequired,
   loadStudentAttendance: PropTypes.func.isRequired,
   enrollmentsPDF: PropTypes.func.isRequired,
   setAlert: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   enrollments: state.enrollments,
   mixvalues: state.mixvalues,
   categories: state.categories,
});

export default connect(mapStateToProps, {
   loadStudentAttendance,
   updatePageNumber,
   enrollmentsPDF,
   setAlert,
})(AttendanceTab);
