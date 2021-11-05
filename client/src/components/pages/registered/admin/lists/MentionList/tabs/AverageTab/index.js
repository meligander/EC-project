import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { BiFilterAlt } from "react-icons/bi";

import { updatePageNumber } from "../../../../../../../../actions/mixvalues";
import { clearProfile } from "../../../../../../../../actions/user";
import {
   loadStudentsAvAtt,
   enrollmentsPDF,
} from "../../../../../../../../actions/enrollment";

import ListButtons from "../../../sharedComp/ListButtons";

function AverageTab({
   mixvalues: { page },
   enrollments: { enrollments, loading, type },
   categories: { categories, loading: loadingCategories },
   loadStudentsAvAtt,
   updatePageNumber,
   enrollmentsPDF,
   clearProfile,
}) {
   const [filterData, setFilterData] = useState({
      amount: "",
      category: "",
   });

   const { amount, category } = filterData;

   const onChange = (e) => {
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
               loadStudentsAvAtt(filterData, "average");
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
                     <th>Promedio</th>
                  </tr>
               </thead>
               <tbody>
                  {!loading &&
                     enrollments.length > 0 &&
                     type === "average" &&
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
                                 <td>{enroll.classroom.average}</td>
                              </tr>
                           )
                     )}
               </tbody>
            </table>
         </div>
         {!loading && (
            <ListButtons
               type="mejores promedios"
               page={page}
               items={enrollments}
               pdfGenerator={() => enrollmentsPDF(enrollments, "averages")}
               changePage={updatePageNumber}
            />
         )}
      </>
   );
}

const mapStateToProps = (state) => ({
   enrollments: state.enrollments,
   mixvalues: state.mixvalues,
   categories: state.categories,
});

export default connect(mapStateToProps, {
   loadStudentsAvAtt,
   updatePageNumber,
   enrollmentsPDF,
   clearProfile,
})(AverageTab);
