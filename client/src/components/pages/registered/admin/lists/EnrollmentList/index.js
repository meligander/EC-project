import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { format, getYear } from "date-fns";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { BiFilterAlt } from "react-icons/bi";

import {
   loadEnrollments,
   deleteEnrollment,
   enrollmentsPDF,
   clearEnrollment,
} from "../../../../../../actions/enrollment";
import {
   loadCategories,
   clearCategories,
} from "../../../../../../actions/category";
import { clearProfile } from "../../../../../../actions/user";
import { togglePopup } from "../../../../../../actions/mixvalues";

import ListButtons from "../sharedComp/ListButtons";
import DateFilter from "../sharedComp/DateFilter";
import NameFilter from "../../../sharedComp/NameField";
import PopUp from "../../../../../modal/PopUp";

const EnrollmentList = ({
   enrollments: { enrollments, loading },
   categories: { categories, loading: loadingCategories },
   loadEnrollments,
   clearEnrollment,
   clearCategories,
   clearProfile,
   deleteEnrollment,
   togglePopup,
   loadCategories,
   enrollmentsPDF,
}) => {
   const day = new Date();
   const thisYear = getYear(day);
   const yearArray = new Array(3)
      .fill()
      .map((item, index) => thisYear - 1 + index);

   const [filterData, setFilterData] = useState({
      startDate: "",
      endDate: "",
      name: "",
      lastname: "",
      category: "",
      year: "",
   });

   const [adminValues, setAdminValues] = useState({
      toDelete: "",
      page: 0,
   });

   const { toDelete, page } = adminValues;
   const { startDate, endDate, category, year, name, lastname } = filterData;

   useEffect(() => {
      if (loading) loadEnrollments({}, true);
   }, [loading, loadEnrollments]);

   useEffect(() => {
      if (loadingCategories) loadCategories(false);
   }, [loadCategories, loadingCategories]);

   const onChange = (e) => {
      e.persist();
      setFilterData({
         ...filterData,
         [e.target.name]: e.target.value,
      });
   };

   return (
      <>
         <h2>Listado Inscripciones</h2>
         <PopUp
            confirm={() => deleteEnrollment(toDelete)}
            text="¿Está seguro que desea eliminar la inscripción?"
         />
         <form
            className="form"
            onSubmit={(e) => {
               e.preventDefault();
               loadEnrollments(filterData, true);
            }}
         >
            <DateFilter
               endDate={endDate}
               startDate={startDate}
               onChange={onChange}
            />
            <NameFilter name={name} lastname={lastname} onChange={onChange} />
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
               <label
                  htmlFor="year"
                  className={`form-label ${year === "" ? "lbl" : ""}`}
               >
                  Año
               </label>
            </div>
            <div className="btn-right mb-1">
               <button type="submit" className="btn btn-light">
                  <BiFilterAlt />
                  &nbsp;Buscar
               </button>
            </div>
         </form>
         <div className="wrapper">
            <table>
               <thead>
                  <tr>
                     <th>Fecha</th>
                     <th>Legajo</th>
                     <th>Nombre</th>
                     <th>Categoría</th>
                     <th>Año</th>
                     <th>&nbsp;</th>
                     <th>&nbsp;</th>
                  </tr>
               </thead>
               <tbody>
                  {!loading &&
                     enrollments.map(
                        (enroll, i) =>
                           i >= page * 10 &&
                           i < (page + 1) * 10 && (
                              <tr key={enroll._id}>
                                 <td>
                                    {format(new Date(enroll.date), "dd/MM/yy")}
                                 </td>
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
                                 <td>{enroll.year}</td>
                                 {Number(enroll.year) >= thisYear ? (
                                    <>
                                       <td>
                                          <Link
                                             to={`/enrollment/edit/${enroll._id}`}
                                             className="btn-text"
                                             onClick={() => {
                                                window.scroll(0, 0);
                                                clearEnrollment();
                                                clearCategories();
                                             }}
                                          >
                                             <FaEdit />
                                          </Link>
                                       </td>
                                       <td>
                                          <button
                                             className="btn btn-danger"
                                             onClick={(e) => {
                                                e.preventDefault();
                                                setAdminValues((prev) => ({
                                                   ...prev,
                                                   toDelete: enroll._id,
                                                }));
                                                togglePopup("default");
                                             }}
                                          >
                                             <FaTrashAlt />
                                          </button>
                                       </td>
                                    </>
                                 ) : (
                                    <>
                                       <td></td>
                                       <td></td>
                                    </>
                                 )}
                              </tr>
                           )
                     )}
               </tbody>
            </table>
         </div>
         {!loading && (
            <ListButtons
               page={page}
               items={enrollments}
               type="inscripciones"
               pdfGenerator={() => enrollmentsPDF(enrollments, "enrollments")}
               changePage={(page) =>
                  setAdminValues((prev) => ({ ...prev, page }))
               }
            />
         )}
      </>
   );
};

const mapStatetoProps = (state) => ({
   enrollments: state.enrollments,
   categories: state.categories,
});

export default connect(mapStatetoProps, {
   loadEnrollments,
   loadCategories,
   deleteEnrollment,
   clearEnrollment,
   clearCategories,
   clearProfile,
   enrollmentsPDF,
   togglePopup,
})(EnrollmentList);
