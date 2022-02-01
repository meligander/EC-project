import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { FaEdit, FaPenFancy, FaScroll, FaTrashAlt } from "react-icons/fa";
import { IoCheckmarkCircleSharp } from "react-icons/io5";
import { ImFilePdf } from "react-icons/im";
import { CgNotes } from "react-icons/cg";

import {
   loadClass,
   deleteClass,
   classPDF,
} from "../../../../../../actions/class";
import { clearAttendances } from "../../../../../../actions/attendance";
import { togglePopup } from "../../../../../../actions/mixvalues";
import {
   clearGrades,
   clearGradeTypes,
   gradesPDF,
} from "../../../../../../actions/grade";
import { clearProfile, clearSearch } from "../../../../../../actions/user";

import PopUp from "../../../../../modal/PopUp";
import ClassInfo from "../../../sharedComp/ClassInfo";
import StudentTable from "../../../sharedComp/tables/StudentTable";

import "./style.scss";

const SingleClass = ({
   match,
   classes: { classInfo, loadingClass },
   auth: { userLogged },
   loadClass,
   deleteClass,
   clearAttendances,
   clearGrades,
   clearGradeTypes,
   clearSearch,
   clearProfile,
   togglePopup,
   classPDF,
   gradesPDF,
}) => {
   const _id = match.params.class_id;

   const userCanSeeButtons =
      userLogged.type !== "student" && userLogged.type !== "guardian";

   const [adminValues, setAdminValues] = useState({
      popupType: "",
   });

   const { popupType } = adminValues;

   useEffect(() => {
      if (loadingClass) loadClass(_id, true);
   }, [loadClass, _id, loadingClass]);

   return (
      <div className="classInfo">
         <h1 className="pt-3 text-center light-font">Clase</h1>

         {!loadingClass && (
            <>
               <PopUp
                  text={
                     popupType === "delete"
                        ? "¿Está seguro que desea eliminar el curso?"
                        : null
                  }
                  confirm={(observations) => {
                     if (popupType === "delete") deleteClass(classInfo._id);
                     else gradesPDF(observations, classInfo, "report-cards");
                  }}
               />
               <ClassInfo classInfo={classInfo} />
               {classInfo.students && (
                  <>
                     {classInfo.students.length !== 0 ? (
                        <StudentTable
                           clearProfile={clearProfile}
                           type="class-students"
                           users={classInfo.students}
                        />
                     ) : (
                        <p className="heading-tertiary text-secondary my-5 text-center">
                           No hay ningun alumno anotado en esta clase
                        </p>
                     )}
                     <div className="btn-center">
                        {userCanSeeButtons && (
                           <>
                              <Link
                                 to={
                                    classInfo.students.length > 0
                                       ? `/class/grades/${classInfo._id}`
                                       : "!#"
                                 }
                                 className={
                                    classInfo.students.length > 0
                                       ? "btn btn-primary"
                                       : "btn btn-black"
                                 }
                                 onClick={() => {
                                    clearGrades();
                                    clearGradeTypes();
                                    window.scroll(0, 0);
                                 }}
                              >
                                 <FaPenFancy />
                                 <span className="hide-sm">&nbsp; Notas</span>
                              </Link>
                              <Link
                                 to={
                                    classInfo.students.length > 0
                                       ? `/class/attendances/${classInfo._id}`
                                       : "!#"
                                 }
                                 className={
                                    classInfo.students.length > 0
                                       ? "btn btn-primary"
                                       : "btn btn-black"
                                 }
                                 onClick={() => {
                                    clearAttendances();
                                    window.scroll(0, 0);
                                 }}
                              >
                                 <IoCheckmarkCircleSharp />
                                 <span className="hide-sm">
                                    &nbsp;Inasistencias
                                 </span>
                              </Link>
                              <Link
                                 to={
                                    classInfo.students.length > 0
                                       ? `/class/notes/${classInfo._id}`
                                       : "!#"
                                 }
                                 className={
                                    classInfo.students.length > 0
                                       ? "btn btn-primary"
                                       : "btn btn-black"
                                 }
                                 onClick={() => {
                                    window.scroll(0, 0);
                                 }}
                              >
                                 <CgNotes />
                                 <span className="hide-sm">
                                    &nbsp;Observaciones
                                 </span>
                              </Link>
                           </>
                        )}
                     </div>
                     <br />
                     {userCanSeeButtons && (
                        <div className="btn-right">
                           <div className="tooltip">
                              <button
                                 type="button"
                                 className="btn btn-secondary"
                                 onClick={(e) => {
                                    e.preventDefault();
                                    classPDF(classInfo, "class");
                                 }}
                              >
                                 <ImFilePdf />
                              </button>
                              <span className="tooltiptext">
                                 PDF lista de alumnos de la clase e info
                              </span>
                           </div>
                           <div className="tooltip">
                              <button
                                 type="button"
                                 className="btn btn-secondary"
                                 onClick={(e) => {
                                    e.preventDefault();
                                    classPDF(classInfo, "blank");
                                 }}
                              >
                                 <FaScroll />
                              </button>
                              <span className="tooltiptext">
                                 PDF en blanco para notas y asistencias
                              </span>
                           </div>
                           {/* <div className="tooltip">
                              <button
                                 type="button"
                                 className="btn btn-secondary"
                                 onClick={(e) => {
                                    e.preventDefault();
                                    setAdminValues((prev) => ({
                                       ...prev,
                                       popupType: "report-cards",
                                    }));
                                    togglePopup("report-cards");
                                 }}
                              >
                                 <FaAddressCard />
                              </button>
                              <span className="tooltiptext">PDF libretas</span>
                           </div> */}
                           {userLogged.type !== "teacher" && (
                              <>
                                 {classInfo.year ===
                                    new Date().getFullYear() && (
                                    <div className="tooltip">
                                       <Link
                                          to={`/class/edit/${classInfo._id}`}
                                          className="btn btn-mix-secondary"
                                          onClick={() => {
                                             window.scroll(0, 0);
                                             clearSearch();
                                          }}
                                       >
                                          <FaEdit />
                                       </Link>
                                       <span className="tooltiptext">
                                          Editar
                                       </span>
                                    </div>
                                 )}

                                 <div className="tooltip">
                                    <button
                                       type="button"
                                       className="btn btn-danger"
                                       onClick={(e) => {
                                          e.preventDefault();
                                          setAdminValues((prev) => ({
                                             ...prev,
                                             popupType: "delete",
                                          }));
                                          togglePopup("default");
                                       }}
                                    >
                                       <FaTrashAlt />
                                    </button>
                                    <span className="tooltiptext">
                                       Eliminar
                                    </span>
                                 </div>
                              </>
                           )}
                        </div>
                     )}
                  </>
               )}
            </>
         )}
      </div>
   );
};

const mapStateToProps = (state) => ({
   classes: state.classes,
   auth: state.auth,
});

export default connect(mapStateToProps, {
   loadClass,
   deleteClass,
   togglePopup,
   classPDF,
   gradesPDF,
   clearGrades,
   clearAttendances,
   clearProfile,
   clearSearch,
   clearGradeTypes,
})(SingleClass);
