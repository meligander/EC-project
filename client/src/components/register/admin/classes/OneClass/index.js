import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Moment from "react-moment";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import { loadClass, deleteClass, classPDF } from "../../../../../actions/class";
import { clearAttendances } from "../../../../../actions/attendance";
import { clearPosts } from "../../../../../actions/post";
import { clearGrades, clearGradeTypes } from "../../../../../actions/grade";
import { clearProfile, clearSearch } from "../../../../../actions/user";
import { updatePreviousPage } from "../../../../../actions/mixvalues";

import Loading from "../../../../modal/Loading";
import ClassInfo from "../../../../sharedComp/ClassInfo";
import Confirm from "../../../../modal/Confirm";

const OneClass = ({
   history,
   match,
   classes: { classInfo, loading },
   users: { users, loadingUsers },
   auth: { userLogged },
   loadClass,
   deleteClass,
   updatePreviousPage,
   clearAttendances,
   clearGrades,
   clearGradeTypes,
   clearPosts,
   clearSearch,
   clearProfile,
   classPDF,
}) => {
   const [toggleModal, setToggleModal] = useState(false);

   useEffect(() => {
      if (loading) loadClass(match.params.id);
   }, [loadClass, match.params.id, loading]);

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
         {!loading && !loadingUsers ? (
            <>
               <Confirm
                  toggleModal={toggleModal}
                  setToggleModal={setToggle}
                  text="¿Está seguro que desea eliminar el curso?"
                  confirm={confirm}
               />
               <h1 className="pt-3 text-center light-font">Clase</h1>
               <ClassInfo classInfo={classInfo} />
               {users.length !== 0 ? (
                  <table>
                     <thead>
                        <tr>
                           <th>Legajo</th>
                           <th>Nombre</th>
                           <th>Fec. Nac.</th>
                           <th>Celular</th>
                           <th>&nbsp;</th>
                        </tr>
                     </thead>
                     <tbody>
                        {users.length > 0 &&
                           users.map((user) => (
                              <tr key={user._id}>
                                 <td>{user.studentnumber}</td>
                                 <td>{user.lastname + ", " + user.name}</td>
                                 <td>
                                    {user.dob && (
                                       <Moment
                                          format="DD/MM/YY"
                                          date={user.dob}
                                       />
                                    )}
                                 </td>
                                 <td>{user.cel && user.cel}</td>
                                 <td>
                                    <Link
                                       to={`/dashboard/${user._id}`}
                                       className="btn-text"
                                       onClick={() => {
                                          window.scroll(0, 0);
                                          updatePreviousPage("");
                                          clearProfile();
                                       }}
                                    >
                                       Info &rarr;
                                    </Link>
                                 </td>
                              </tr>
                           ))}
                     </tbody>
                  </table>
               ) : (
                  <p className="heading-tertiary text-secondary my-5 text-center">
                     No hay ningun alumno anotado en esta clase
                  </p>
               )}
               <div className="btn-ctr">
                  {userLogged.type !== "Alumno" && userLogged.type !== "Tutor" && (
                     <>
                        <Link
                           to={
                              users.length > 0
                                 ? `/grades/${classInfo._id}`
                                 : "!#"
                           }
                           className={
                              users.length > 0
                                 ? "btn btn-primary"
                                 : "btn btn-black"
                           }
                           onClick={() => {
                              clearGrades();
                              clearGradeTypes();
                              updatePreviousPage("");
                              window.scroll(0, 0);
                           }}
                        >
                           <i className="fas fa-marker"></i>{" "}
                           <span className="hide-sm">Notas</span>
                        </Link>
                        <Link
                           to={
                              users.length > 0
                                 ? `/attendance/${classInfo._id}`
                                 : "!#"
                           }
                           className={
                              users.length > 0
                                 ? "btn btn-primary"
                                 : "btn btn-black"
                           }
                           onClick={() => {
                              clearAttendances();
                              updatePreviousPage("");
                              window.scroll(0, 0);
                           }}
                        >
                           <i className="fas fa-check-circle"></i>{" "}
                           <span className="hide-sm">Inasistencias</span>
                        </Link>
                     </>
                  )}
                  <Link
                     to={users.length > 0 ? `/chat/${classInfo._id}` : "!#"}
                     className={
                        users.length > 0 ? "btn btn-primary" : "btn btn-black"
                     }
                     onClick={() => {
                        clearPosts();
                        updatePreviousPage("");
                        window.scroll(0, 0);
                     }}
                  >
                     <i className="far fa-comments"></i>{" "}
                     <span className="hide-sm">Chat</span>
                  </Link>
               </div>
               <br />
               {userLogged.type !== "Alumno" && userLogged.type !== "Tutor" && (
                  <div className="btn-right">
                     <button
                        className="btn btn-secondary"
                        onClick={pdfGeneratorSave}
                     >
                        <i className="fas fa-file-pdf"></i>
                     </button>
                     <button
                        className="btn btn-print-blank"
                        onClick={blankPdfGenerator}
                     >
                        <i className="fas fa-scroll"></i>
                     </button>
                     <Link
                        to={`/edit-class/${classInfo._id}`}
                        className="btn btn-light"
                        onClick={() => {
                           window.scroll(0, 0);
                           clearSearch();
                           updatePreviousPage("");
                        }}
                     >
                        <i className="far fa-edit"></i>
                     </Link>
                     <button className="btn btn-danger" onClick={setToggle}>
                        <i className="far fa-trash-alt"></i>
                     </button>
                  </div>
               )}
            </>
         ) : !loading && classInfo === null ? (
            <div className="class p-2 bg-white">
               <h1 className="text-primary x-large text-dark p-1">Curso</h1>
               <p className="lead">
                  El alumno no está asignado a ninguna clase
               </p>
            </div>
         ) : (
            <Loading />
         )}
      </>
   );
};

OneClass.propTypes = {
   classes: PropTypes.object.isRequired,
   users: PropTypes.object.isRequired,
   loadClass: PropTypes.func.isRequired,
   deleteClass: PropTypes.func.isRequired,
   updatePreviousPage: PropTypes.func.isRequired,
   clearAttendances: PropTypes.func.isRequired,
   clearGrades: PropTypes.func.isRequired,
   clearProfile: PropTypes.func.isRequired,
   clearGradeTypes: PropTypes.func.isRequired,
   clearPosts: PropTypes.func.isRequired,
   clearSearch: PropTypes.func.isRequired,
   classPDF: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   classes: state.classes,
   users: state.users,
   auth: state.auth,
});

export default connect(mapStateToProps, {
   loadClass,
   deleteClass,
   updatePreviousPage,
   clearGrades,
   clearAttendances,
   clearPosts,
   clearProfile,
   clearSearch,
   clearGradeTypes,
   classPDF,
})(withRouter(OneClass));
