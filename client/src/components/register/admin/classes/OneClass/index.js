import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import { loadClass, deleteClass, classPDF } from "../../../../../actions/class";
import { clearAttendances } from "../../../../../actions/attendance";
import { clearPosts, getUnseenPosts } from "../../../../../actions/post";
import {
   clearGrades,
   clearGradeTypes,
   gradesPDF,
} from "../../../../../actions/grade";
import { clearProfile, clearSearch } from "../../../../../actions/user";
import { updatePreviousPage } from "../../../../../actions/mixvalues";

import Loading from "../../../../modal/Loading";
import ClassInfo from "../../../sharedComp/ClassInfo";
import PopUp from "../../../../modal/PopUp";
import StudentTable from "../../../sharedComp/tables/StudentTable";

import "./style.scss";

const OneClass = ({
   history,
   match,
   classes: { classInfo, loading, loadingStudents },
   posts: { unseenPosts },
   auth: { userLogged },
   loadClass,
   clearPosts,
   deleteClass,
   updatePreviousPage,
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

   const [otherValues, setOtherValues] = useState({
      toggleModalDelete: false,
      toggleModalReportCards: false,
   });

   const { toggleModalDelete, toggleModalReportCards } = otherValues;

   useEffect(() => {
      if (userLogged.type !== "student" && loading) {
         loadClass(match.params.class_id);
         if (userCanMarkSeen) getUnseenPosts(match.params.class_id);
      }
   }, [
      loadClass,
      match.params.class_id,
      getUnseenPosts,
      userLogged,
      loading,
      userCanMarkSeen,
   ]);

   const setToggle = () => {
      setOtherValues({
         ...otherValues,
         toggleModalDelete: false,
         toggleModalReportCards: false,
      });
   };

   return (
      <>
         {!loadingStudents ? (
            <div className="classInfo">
               <PopUp
                  toggleModal={toggleModalDelete}
                  setToggleModal={setToggle}
                  text="¿Está seguro que desea eliminar el curso?"
                  confirm={() => deleteClass(classInfo._id, history)}
               />
               <PopUp
                  toggleModal={toggleModalReportCards}
                  setToggleModal={setToggle}
                  users={classInfo.students}
                  type="report-cards"
                  confirm={(observations) =>
                     gradesPDF(observations, classInfo, "report-cards")
                  }
               />
               <h1 className="pt-3 text-center light-font">Clase</h1>
               <ClassInfo classInfo={classInfo} />
               {classInfo.students.length !== 0 ? (
                  <StudentTable
                     clearProfile={clearProfile}
                     clearAll={userLogged.type !== "student"}
                     type="class-students"
                     loadingUsers={loadingStudents}
                     users={classInfo.students}
                  />
               ) : (
                  <p className="heading-tertiary text-secondary my-5 text-center">
                     No hay ningun alumno anotado en esta clase
                  </p>
               )}
               <div className="btn-ctr">
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
                              updatePreviousPage("");
                              clearGradeTypes();
                              window.scroll(0, 0);
                           }}
                        >
                           <i className="fas fa-marker"></i>
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
                              updatePreviousPage("");
                              window.scroll(0, 0);
                           }}
                        >
                           <i className="fas fa-check-circle"></i>
                           <span className="hide-sm">&nbsp; Inasistencias</span>
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
                        updatePreviousPage("");
                        clearPosts();
                        window.scroll(0, 0);
                     }}
                  >
                     <div className="notification">
                        <i className="far fa-comments"></i>
                        {unseenPosts > 0 && (
                           <span className="post-notification light">
                              {unseenPosts}
                           </span>
                        )}
                     </div>
                     <span
                        className={`hide-sm ${unseenPosts > 0 ? "text" : ""}`}
                     >
                        &nbsp; Chat
                     </span>
                  </Link>
               </div>
               <br />
               {userCanSeeButtons && (
                  <div className="btn-right">
                     <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={(e) => {
                           e.preventDefault();
                           classPDF(classInfo, "class");
                        }}
                     >
                        <i className="fas fa-file-pdf"></i>
                     </button>
                     <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={(e) => {
                           e.preventDefault();
                           classPDF(classInfo, "blank");
                        }}
                     >
                        <i className="fas fa-scroll"></i>
                     </button>
                     <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={(e) => {
                           e.preventDefault();
                           setOtherValues({
                              ...otherValues,
                              toggleModalReportCards: true,
                           });
                        }}
                     >
                        <i className="fas fa-address-card"></i>
                     </button>
                     {userLogged.type !== "teacher" && (
                        <>
                           <Link
                              to={`/edit-class/${classInfo._id}/${classInfo.category._id}`}
                              className="btn btn-mix-secondary"
                              onClick={() => {
                                 window.scroll(0, 0);
                                 updatePreviousPage("");
                                 clearSearch();
                              }}
                           >
                              <i className="far fa-edit"></i>
                           </Link>
                           <button
                              type="button"
                              className="btn btn-danger"
                              onClick={(e) => {
                                 e.preventDefault();
                                 setOtherValues({
                                    ...otherValues,
                                    toggleModalDelete: true,
                                 });
                              }}
                           >
                              <i className="far fa-trash-alt"></i>
                           </button>
                        </>
                     )}
                  </div>
               )}
            </div>
         ) : (
            <Loading />
         )}
      </>
   );
};

OneClass.propTypes = {
   classes: PropTypes.object.isRequired,
   auth: PropTypes.object.isRequired,
   posts: PropTypes.object.isRequired,
   loadClass: PropTypes.func.isRequired,
   clearPosts: PropTypes.func.isRequired,
   deleteClass: PropTypes.func.isRequired,
   updatePreviousPage: PropTypes.func.isRequired,
   getUnseenPosts: PropTypes.func.isRequired,
   classPDF: PropTypes.func.isRequired,
   gradesPDF: PropTypes.func.isRequired,
   clearAttendances: PropTypes.func.isRequired,
   clearGrades: PropTypes.func.isRequired,
   clearProfile: PropTypes.func.isRequired,
   clearGradeTypes: PropTypes.func.isRequired,
   clearSearch: PropTypes.func.isRequired,
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
   updatePreviousPage,
   getUnseenPosts,
   classPDF,
   gradesPDF,
   clearGrades,
   clearAttendances,
   clearProfile,
   clearSearch,
   clearGradeTypes,
})(withRouter(OneClass));
