import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
   FaAddressCard,
   FaComments,
   FaEdit,
   FaPenFancy,
   FaScroll,
   FaTrashAlt,
} from "react-icons/fa";
import { IoCheckmarkCircleSharp } from "react-icons/io5";
import { ImFilePdf } from "react-icons/im";

import {
   loadClass,
   deleteClass,
   classPDF,
} from "../../../../../../actions/class";
import { clearAttendances } from "../../../../../../actions/attendance";
import { clearPosts, getUnseenPosts } from "../../../../../../actions/post";
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

const OneClass = ({
   match,
   classes: { classInfo, loadingClass },
   posts: { unseenPosts },
   auth: { userLogged },
   loadClass,
   clearPosts,
   deleteClass,
   getUnseenPosts,
   clearAttendances,
   clearGrades,
   clearGradeTypes,
   clearSearch,
   clearProfile,
   classPDF,
   gradesPDF,
}) => {
   const userCanSeeButtons =
      userLogged.type !== "student" && userLogged.type !== "guardian";
   const userCanMarkSeen =
      userLogged.type === "student" ||
      userLogged.type === "admin&teacher" ||
      userLogged.type === "teacher";

   const [adminValues, setAdminValues] = useState({
      toggleModalDelete: false,
      toggleModalReportCards: false,
   });

   const { toggleModalDelete, toggleModalReportCards } = adminValues;

   useEffect(() => {
      if (userLogged.type !== "student" && loadingClass) {
         loadClass(match.params.class_id);
         if (userCanMarkSeen) getUnseenPosts(match.params.class_id);
      }
   }, [
      loadClass,
      match.params.class_id,
      getUnseenPosts,
      userLogged,
      loadingClass,
      userCanMarkSeen,
   ]);

   return (
      <div className="classInfo">
         <PopUp
            toggleModal={toggleModalDelete}
            setToggleModal={() =>
               setAdminValues((prev) => ({
                  ...prev,
                  toggleModalDelete: !toggleModalDelete,
               }))
            }
            text="¿Está seguro que desea eliminar el curso?"
            confirm={() => deleteClass(classInfo._id)}
         />
         <PopUp
            toggleModal={toggleModalReportCards}
            setToggleModal={() =>
               setAdminValues((prev) => ({
                  ...prev,
                  toggleModalReportCards: !toggleModalReportCards,
               }))
            }
            users={classInfo.students}
            type="report-cards"
            confirm={(observations) =>
               gradesPDF(observations, classInfo, "report-cards")
            }
         />
         <h1 className="pt-3 text-center light-font">Clase</h1>

         {!loadingClass && (
            <>
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
                                       ? `/grades/${classInfo._id}`
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
                                       ? `/attendances/${classInfo._id}`
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
                           </>
                        )}
                        <Link
                           to={
                              classInfo.students.length > 0
                                 ? `/chat/${classInfo._id}`
                                 : "!#"
                           }
                           className={
                              classInfo.students.length > 0
                                 ? "btn btn-primary"
                                 : "btn btn-black"
                           }
                           onClick={() => {
                              clearPosts();
                              window.scroll(0, 0);
                           }}
                        >
                           <div className="notification">
                              <FaComments />
                              {unseenPosts > 0 && (
                                 <span className="post-notification light">
                                    {unseenPosts}
                                 </span>
                              )}
                           </div>
                           <span
                              className={`hide-sm ${
                                 unseenPosts > 0 ? "text" : ""
                              }`}
                           >
                              &nbsp; Chat
                           </span>
                        </Link>
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
                           <div className="tooltip">
                              <button
                                 type="button"
                                 className="btn btn-secondary"
                                 onClick={(e) => {
                                    e.preventDefault();
                                    setAdminValues((prev) => ({
                                       ...prev,
                                       toggleModalReportCards:
                                          !toggleModalReportCards,
                                    }));
                                 }}
                              >
                                 <FaAddressCard />
                              </button>
                              <span className="tooltiptext">PDF libretas</span>
                           </div>
                           {userLogged.type !== "teacher" && (
                              <>
                                 <div className="tooltip">
                                    <Link
                                       to={`/edit-class/${classInfo._id}/${classInfo.category._id}`}
                                       className="btn btn-mix-secondary"
                                       onClick={() => {
                                          window.scroll(0, 0);
                                          clearSearch();
                                       }}
                                    >
                                       <FaEdit />
                                    </Link>
                                    <span className="tooltiptext">Editar</span>
                                 </div>
                                 <div className="tooltip">
                                    <button
                                       type="button"
                                       className="btn btn-danger"
                                       onClick={(e) => {
                                          e.preventDefault();
                                          setAdminValues((prev) => ({
                                             ...prev,
                                             toggleModalDelete:
                                                !toggleModalDelete,
                                          }));
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
   posts: state.posts,
});

export default connect(mapStateToProps, {
   loadClass,
   clearPosts,
   deleteClass,
   getUnseenPosts,
   classPDF,
   gradesPDF,
   clearGrades,
   clearAttendances,
   clearProfile,
   clearSearch,
   clearGradeTypes,
})(OneClass);
