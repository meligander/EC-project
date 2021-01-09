import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import { loadClass, deleteClass, classPDF } from "../../../../../actions/class";
import { clearAttendances } from "../../../../../actions/attendance";
import { clearPosts, getUnseenPosts } from "../../../../../actions/post";
import { clearGrades, clearGradeTypes } from "../../../../../actions/grade";
import { clearProfile, clearSearch } from "../../../../../actions/user";
import { updatePreviousPage } from "../../../../../actions/mixvalues";

import Loading from "../../../../modal/Loading";
import ClassInfo from "../../../sharedComp/ClassInfo";
import Confirm from "../../../../modal/Confirm";
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
}) => {
   const userCanSeeButtons =
      userLogged.type !== "student" && userLogged.type !== "guardian";
   const userCanMarkSeen =
      userLogged.type === "student" ||
      userLogged.type === "admin&teacher" ||
      userLogged.type === "teacher";

   const [toggleModal, setToggleModal] = useState(false);

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
      setToggleModal(!toggleModal);
   };

   const confirm = () => {
      deleteClass(classInfo._id, history);
   };

   const pdfGeneratorSave = () => {
      classPDF(classInfo, "class");
   };

   const blankPdfGenerator = () => {
      classPDF(classInfo, "blank");
   };

   return (
      <>
         {!loadingStudents ? (
            <div className="classInfo">
               <Confirm
                  toggleModal={toggleModal}
                  setToggleModal={setToggle}
                  text="¿Está seguro que desea eliminar el curso?"
                  confirm={confirm}
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
                        onClick={pdfGeneratorSave}
                     >
                        <i className="fas fa-file-pdf"></i>
                     </button>
                     <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={blankPdfGenerator}
                     >
                        <i className="fas fa-scroll"></i>
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
                              onClick={setToggle}
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
   clearGrades,
   clearAttendances,
   clearProfile,
   clearSearch,
   clearGradeTypes,
})(withRouter(OneClass));
