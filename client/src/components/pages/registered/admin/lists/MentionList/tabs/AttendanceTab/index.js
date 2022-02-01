import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { BiFilterAlt } from "react-icons/bi";

import {
   loadStudentsAvAtt,
   enrollmentsPDF,
} from "../../../../../../../../actions/enrollment";
import { clearProfile } from "../../../../../../../../actions/user";

import ListButtons from "../../../sharedComp/ListButtons";

function AttendanceTab({
   enrollments: { enrollments, loading, type },
   categories: { categories, loading: loadingCategories },
   loadStudentsAvAtt,
   clearProfile,
   enrollmentsPDF,
}) {
   const [filterData, setFilterData] = useState({
      absence: "",
      category: "",
   });

   const [adminValues, setAdminValues] = useState({
      page: 0,
   });

   const { absence, category } = filterData;

   const { page } = adminValues;

   const onChange = (e) => {
      e.persist();
      setFilterData({
         ...filterData,
         [e.target.name]: e.target.value,
      });
   };

   return (
      <>
         <form
            className="form"
            onSubmit={(e) => {
               e.preventDefault();
               loadStudentsAvAtt(filterData, "attendance");
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
                  {!loadingCategories &&
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
                  onChange={onChange}
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
                  <BiFilterAlt />
                  &nbsp;Buscar
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
                  {!loading &&
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
                                       to={`/index/dashboard/${enroll.student._id}`}
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
         {!loading && (
            <ListButtons
               type="asistencias"
               page={page}
               items={enrollments}
               pdfGenerator={() => enrollmentsPDF(enrollments, "attendances")}
               changePage={(page) =>
                  setAdminValues((prev) => ({ ...prev, page }))
               }
            />
         )}
      </>
   );
}

const mapStateToProps = (state) => ({
   enrollments: state.enrollments,
   categories: state.categories,
});

export default connect(mapStateToProps, {
   loadStudentsAvAtt,
   enrollmentsPDF,
   clearProfile,
})(AttendanceTab);
