import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import {
   loadStudentAttendance,
   enrollmentsPDF,
} from "../../../../../../../../actions/enrollment";
import { clearProfile } from "../../../../../../../../actions/user";
import { updatePageNumber } from "../../../../../../../../actions/mixvalues";

import ListButtons from "../../../sharedComp/ListButtons";
import Loading from "../../../../../../../modal/Loading";

function AttendanceTab({
   mixvalues: { page },
   enrollments: { enrollments, loadingEnrollments, type },
   categories: { categories, loading },
   loadStudentAttendance,
   updatePageNumber,
   clearProfile,
   enrollmentsPDF,
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

   return (
      <>
         {!loading ? (
            <>
               <form
                  className="form"
                  onSubmit={(e) => {
                     e.preventDefault();
                     loadStudentAttendance(filterData);
                  }}
               >
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
                     <button type="submit" className="btn btn-light">
                        <i className="fas fa-filter"></i>&nbsp; Buscar
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
                                          <Link
                                             className="btn-text"
                                             to={`/dashboard/${enroll.student._id}`}
                                             onClick={() => {
                                                window.scroll(0, 0);
                                                clearProfile();
                                             }}
                                          >
                                             {enroll.student.lastname +
                                                ", " +
                                                enroll.student.name}
                                          </Link>
                                       </td>
                                       <td>{enroll.category.name}</td>
                                       <td>{enroll.classroom.absence}</td>
                                    </tr>
                                 )
                           )}
                     </tbody>
                  </table>
               </div>
               <ListButtons
                  type="asistencias"
                  page={page}
                  items={enrollments}
                  pdfGenerator={() =>
                     enrollmentsPDF(enrollments, "attendances")
                  }
                  changePage={updatePageNumber}
               />
            </>
         ) : (
            <Loading />
         )}
      </>
   );
}

AttendanceTab.propTypes = {
   mixvalues: PropTypes.object.isRequired,
   categories: PropTypes.object.isRequired,
   enrollments: PropTypes.object.isRequired,
   loadStudentAttendance: PropTypes.func.isRequired,
   enrollmentsPDF: PropTypes.func.isRequired,
   clearProfile: PropTypes.func.isRequired,
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
   clearProfile,
})(AttendanceTab);
