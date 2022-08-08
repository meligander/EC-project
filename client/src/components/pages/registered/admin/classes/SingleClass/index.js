import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import format from "date-fns/format";
import { FaEdit, FaPenFancy, FaTrashAlt } from "react-icons/fa";
import { IoCheckmarkCircleSharp } from "react-icons/io5";
import { ImFilePdf } from "react-icons/im";
import { CgNotes } from "react-icons/cg";

import {
   loadClass,
   deleteClass,
   classPDF,
} from "../../../../../../actions/class";
import { clearAttendances } from "../../../../../../actions/attendance";
import { togglePopup } from "../../../../../../actions/global";
import { clearGrades, clearGradeTypes } from "../../../../../../actions/grade";
import { clearProfile, clearSearch } from "../../../../../../actions/user";
import { clearObservations } from "../../../../../../actions/observation";

import PopUp from "../../../../../modal/PopUp";
import ClassInfo from "../../../sharedComp/ClassInfo";
import StudentTable from "../../../sharedComp/tables/StudentTable";

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
   clearObservations,
   togglePopup,
   classPDF,
}) => {
   const _id = match.params.class_id;
   const year = new Date().getFullYear();

   const userCanSeeButtons =
      userLogged.type !== "student" && userLogged.type !== "guardian";

   useEffect(() => {
      if (loadingClass) loadClass(_id, true, false);
   }, [loadClass, _id, loadingClass]);

   return (
      <div className="classInfo">
         <h1 className="pt-3 text-center light-font">Clase</h1>

         {!loadingClass && (
            <>
               <PopUp
                  info="¿Está seguro que desea eliminar el curso?"
                  confirm={() => deleteClass(classInfo._id)}
               />
               <ClassInfo classInfo={classInfo} />
               {classInfo.students && (
                  <>
                     {classInfo.students.length !== 0 ? (
                        <StudentTable
                           clearProfile={clearProfile}
                           type="class-students"
                           users={classInfo.students}
                           class_id={classInfo._id}
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
                                    if (classInfo.students.length > 0) {
                                       clearGrades();
                                       clearGradeTypes();
                                       window.scroll(0, 0);
                                    }
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
                                    if (classInfo.students.length > 0) {
                                       clearAttendances();
                                       window.scroll(0, 0);
                                    }
                                 }}
                              >
                                 <IoCheckmarkCircleSharp />
                                 <span className="hide-sm">
                                    &nbsp; Inasistencias
                                 </span>
                              </Link>
                              <Link
                                 to={
                                    classInfo.students.length > 0
                                       ? `/class/observations/${classInfo._id}`
                                       : "!#"
                                 }
                                 className={
                                    classInfo.students.length > 0
                                       ? "btn btn-primary"
                                       : "btn btn-black"
                                 }
                                 onClick={() => {
                                    if (classInfo.students.length > 0)
                                       clearObservations();
                                    window.scroll(0, 0);
                                 }}
                              >
                                 <CgNotes />
                                 <span className="hide-sm">
                                    &nbsp; Observaciones
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
                                    classPDF(
                                       {
                                          ...classInfo,
                                          category: classInfo.category.name,
                                          teacher:
                                             classInfo.teacher.lastname +
                                             ", " +
                                             classInfo.teacher.name,
                                          hourin1: classInfo.hourin1
                                             ? format(
                                                  new Date(
                                                     classInfo.hourin1.slice(
                                                        0,
                                                        -1
                                                     )
                                                  ),
                                                  "HH:mm"
                                               )
                                             : "",
                                          hourout1: classInfo.hourout1
                                             ? format(
                                                  new Date(
                                                     classInfo.hourout1.slice(
                                                        0,
                                                        -1
                                                     )
                                                  ),
                                                  "HH:mm"
                                               )
                                             : "",
                                          hourin2: classInfo.hourin2
                                             ? format(
                                                  new Date(
                                                     classInfo.hourin2.slice(
                                                        0,
                                                        -1
                                                     )
                                                  ),
                                                  "HH:mm"
                                               )
                                             : "",
                                          hourout2: classInfo.hourout2
                                             ? format(
                                                  new Date(
                                                     classInfo.hourout2.slice(
                                                        0,
                                                        -1
                                                     )
                                                  ),
                                                  "HH:mm"
                                               )
                                             : "",
                                       },
                                       "class"
                                    );
                                 }}
                              >
                                 <ImFilePdf />
                              </button>
                              <span className="tooltiptext">
                                 PDF lista de alumnos de la clase e info
                              </span>
                           </div>

                           {userLogged.type !== "teacher" &&
                              userLogged.type !== "classManager" && (
                                 <>
                                    <div className="tooltip">
                                       <Link
                                          to={
                                             classInfo.year === year
                                                ? `/class/edit/${classInfo._id}`
                                                : "#"
                                          }
                                          className={`btn ${
                                             classInfo.year === year
                                                ? "btn-mix-secondary"
                                                : "btn-black"
                                          }`}
                                          onClick={() => {
                                             if (classInfo.year === year) {
                                                window.scroll(0, 0);
                                                clearSearch();
                                             }
                                          }}
                                       >
                                          <FaEdit />
                                       </Link>
                                       <span className="tooltiptext">
                                          Editar
                                       </span>
                                    </div>

                                    <div className="tooltip">
                                       <button
                                          type="button"
                                          className="btn btn-danger"
                                          onClick={(e) => {
                                             e.preventDefault();
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
   clearGrades,
   clearAttendances,
   clearProfile,
   clearSearch,
   clearGradeTypes,
   clearObservations,
})(SingleClass);
