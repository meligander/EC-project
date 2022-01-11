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
import {
   togglePopup,
   updatePageNumber,
} from "../../../../../../actions/mixvalues";

import ListButtons from "../sharedComp/ListButtons";
import DateFilter from "../sharedComp/DateFilter";
import NameFilter from "../../../sharedComp/NameField";
import PopUp from "../../../../../modal/PopUp";

const EnrollmentList = ({
   mixvalues: { page },
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
   updatePageNumber,
}) => {
   const day = new Date();
   const thisYear = getYear(day);

   const [filterData, setFilterData] = useState({
      startDate: "",
      endDate: "",
      name: "",
      lastname: "",
      category: "",
      year: 0,
   });

   const [adminValues, setAdminValues] = useState({
      toDelete: "",
   });

   const { toDelete } = adminValues;
   const { startDate, endDate, category, year, name, lastname } = filterData;

   useEffect(() => {
      if (loading) loadEnrollments({});
      if (loadingCategories) loadCategories();
   }, [loading, loadEnrollments, loadCategories, loadingCategories]);

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
               loadEnrollments(filterData);
            }}
         >
            <DateFilter
               endDate={endDate}
               startDate={startDate}
               onChange={onChange}
            />
            <NameFilter name={name} lastname={lastname} onChange={onChange} />
            {!loadingCategories && (
               <div className="form-group">
                  <select
                     className="form-input"
                     id="category"
                     name="category"
                     onChange={onChange}
                     value={category}
                  >
                     <option value="">* Seleccione Categoría</option>
                     {categories.length > 0 &&
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
            )}

            <div className="form-group">
               <select
                  className="form-input"
                  id="year"
                  name="year"
                  onChange={onChange}
                  value={year}
               >
                  <option value={0}>* Seleccione el Año</option>
                  <option value={thisYear - 1}>{thisYear - 1}</option>
                  <option value={thisYear}>{thisYear}</option>
                  <option value={thisYear + 1}>{thisYear + 1}</option>
               </select>
               <label
                  htmlFor="year"
                  className={`form-label ${year === 0 ? "lbl" : ""}`}
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
                     enrollments.length > 0 &&
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
                                                togglePopup();
                                                setAdminValues((prev) => ({
                                                   ...prev,
                                                   toDelete: enroll._id,
                                                }));
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
               changePage={updatePageNumber}
            />
         )}
      </>
   );
};

const mapStatetoProps = (state) => ({
   mixvalues: state.mixvalues,
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
   updatePageNumber,
   togglePopup,
})(EnrollmentList);
