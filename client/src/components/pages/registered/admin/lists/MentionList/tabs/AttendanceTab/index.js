import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { BiFilterAlt } from "react-icons/bi";

import {
   loadAttendancesAv,
   attendancesPDF,
} from "../../../../../../../../actions/attendance";
import { clearProfile } from "../../../../../../../../actions/user";

import ListButtons from "../../../sharedComp/ListButtons";

function AttendanceTab({
   attendances: { attendances: students, loading },
   categories: { categories },
   loadAttendancesAv,
   clearProfile,
   attendancesPDF,
}) {
   const thisYear = new Date().getFullYear();
   const yearArray = new Array(3).fill().map((item, index) => thisYear - index);

   const [filterData, setFilterData] = useState({
      quantity: "",
      category: "",
      year: thisYear,
   });

   const [adminValues, setAdminValues] = useState({
      page: 0,
   });

   const { quantity, category, year } = filterData;

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
               setAdminValues((prev) => ({ ...prev, page: 0 }));
               loadAttendancesAv(filterData);
            }}
         >
            <div className="form-group">
               <div className="two-in-row">
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
                  <select
                     className="form-input"
                     id="year"
                     name="year"
                     onChange={onChange}
                     value={year}
                  >
                     <option value="">* Seleccione el Año</option>
                     {yearArray.map((item) => (
                        <option key={item} value={item}>
                           {item}
                        </option>
                     ))}
                  </select>
               </div>
               <div className="two-in-row">
                  <label
                     htmlFor="category"
                     className={`form-label ${category === "" ? "lbl" : ""}`}
                  >
                     Categoría
                  </label>
                  <label
                     htmlFor="year"
                     className={`form-label ${year === "" ? "lbl" : ""}`}
                  >
                     Año
                  </label>
               </div>
            </div>
            <div className="form-group">
               <input
                  className="form-input"
                  type="number"
                  value={quantity}
                  onChange={onChange}
                  name="quantity"
                  id="quantity"
                  placeholder="N° Faltas"
               />
               <label htmlFor="quantity" className="form-label">
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
                     students.map(
                        (item, i) =>
                           i >= page * 10 &&
                           i < (page + 1) * 10 && (
                              <tr key={i}>
                                 <td>{item.student.studentnumber}</td>
                                 <td>
                                    <Link
                                       className="btn-text"
                                       to={`/index/dashboard/${item.student._id}`}
                                       onClick={() => {
                                          window.scroll(0, 0);
                                          clearProfile();
                                       }}
                                    >
                                       {item.student.lastname +
                                          ", " +
                                          item.student.name}
                                    </Link>
                                 </td>
                                 <td>{item.category.name}</td>
                                 <td>{item.quantity}</td>
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
               items={students}
               pdfGenerator={() => attendancesPDF(null, students, { year })}
               changePage={(page) =>
                  setAdminValues((prev) => ({ ...prev, page }))
               }
            />
         )}
      </>
   );
}

const mapStateToProps = (state) => ({
   attendances: state.attendances,
   categories: state.categories,
});

export default connect(mapStateToProps, {
   loadAttendancesAv,
   attendancesPDF,
   clearProfile,
})(AttendanceTab);
