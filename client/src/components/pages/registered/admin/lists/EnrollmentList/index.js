import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";
import Moment from "react-moment";
import PropTypes from "prop-types";

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
import { updatePageNumber } from "../../../../../../actions/mixvalues";
import { clearProfile } from "../../../../../../actions/user";

import ListButtons from "../sharedComp/ListButtons";
import DateFilter from "../sharedComp/DateFilter";
import NameFilter from "../../../sharedComp/NameField";
import Loading from "../../../../../modal/Loading";
import PopUp from "../../../../../modal/PopUp";

const EnrollmentList = ({
   mixvalues: { page },
   enrollments: { enrollments, loadingEnrollments },
   categories: { categories, loading },
   loadEnrollments,
   clearEnrollment,
   clearCategories,
   clearProfile,
   deleteEnrollment,
   loadCategories,
   updatePageNumber,
   enrollmentsPDF,
}) => {
   const day = moment();
   const thisYear = day.year();

   const [filterData, setFilterData] = useState({
      startDate: "",
      endDate: "",
      name: "",
      lastname: "",
      category: "",
      year: 0,
   });

   const [otherValues, setOtherValues] = useState({
      toggleModal: false,
      toDelete: "",
   });

   const { toggleModal, toDelete } = otherValues;
   const { startDate, endDate, category, year, name, lastname } = filterData;

   useEffect(() => {
      if (loadingEnrollments) {
         updatePageNumber(0);
         loadEnrollments({
            startDate: "",
            endDate: "",
            category: "",
            year: "",
         });
         loadCategories();
      }
   }, [loadingEnrollments, loadEnrollments, loadCategories, updatePageNumber]);

   const onChange = (e) => {
      setFilterData({
         ...filterData,
         [e.target.name]: e.target.value,
      });
   };

   const setToggle = (enroll_id) => {
      setOtherValues({
         toDelete: enroll_id ? enroll_id : "",
         toggleModal: !toggleModal,
      });
   };

   return (
      <>
         {!loadingEnrollments && !loading ? (
            <>
               <h2>Listado Inscripciones</h2>
               <PopUp
                  setToggleModal={setToggle}
                  toggleModal={toggleModal}
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
                  <NameFilter
                     name={name}
                     lastname={lastname}
                     onChange={onChange}
                  />
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
                        <i className="fas fa-filter"></i>&nbsp; Buscar
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
                        {enrollments.length > 0 &&
                           enrollments.map(
                              (enroll, i) =>
                                 i >= page * 10 &&
                                 i < (page + 1) * 10 && (
                                    <tr key={enroll._id}>
                                       <td>
                                          <Moment
                                             date={enroll.date}
                                             format="DD/MM/YY"
                                          />
                                       </td>
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
                                       <td>{enroll.year}</td>
                                       {Number(enroll.year) >= thisYear ? (
                                          <>
                                             <td>
                                                <Link
                                                   to={`/edit-enrollment/${enroll._id}`}
                                                   className="btn-text"
                                                   onClick={() => {
                                                      window.scroll(0, 0);
                                                      clearEnrollment();
                                                      clearCategories();
                                                   }}
                                                >
                                                   <i className="far fa-edit"></i>
                                                </Link>
                                             </td>
                                             <td>
                                                <button
                                                   className="btn btn-danger"
                                                   onClick={(e) => {
                                                      e.preventDefault();
                                                      setToggle(enroll._id);
                                                   }}
                                                >
                                                   <i className="far fa-trash-alt"></i>
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
               <ListButtons
                  page={page}
                  items={enrollments}
                  type="inscripciones"
                  pdfGenerator={() =>
                     enrollmentsPDF(enrollments, "enrollments")
                  }
                  changePage={updatePageNumber}
               />
            </>
         ) : (
            <Loading />
         )}
      </>
   );
};

EnrollmentList.propTypes = {
   mixvalues: PropTypes.object.isRequired,
   enrollments: PropTypes.object.isRequired,
   categories: PropTypes.object.isRequired,
   loadEnrollments: PropTypes.func.isRequired,
   loadCategories: PropTypes.func.isRequired,
   updatePageNumber: PropTypes.func.isRequired,
   deleteEnrollment: PropTypes.func.isRequired,
   clearEnrollment: PropTypes.func.isRequired,
   clearCategories: PropTypes.func.isRequired,
   clearProfile: PropTypes.func.isRequired,
   enrollmentsPDF: PropTypes.func.isRequired,
};

const mapStatetoProps = (state) => ({
   mixvalues: state.mixvalues,
   enrollments: state.enrollments,
   categories: state.categories,
});

export default connect(mapStatetoProps, {
   loadEnrollments,
   loadCategories,
   updatePageNumber,
   deleteEnrollment,
   clearEnrollment,
   clearCategories,
   clearProfile,
   enrollmentsPDF,
})(EnrollmentList);
