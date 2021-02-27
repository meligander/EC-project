import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import PropTypes from "prop-types";

import { loadUsersGrades } from "../../../../../../actions/grade";
import { loadStudentAttendance } from "../../../../../../actions/attendance";
import { loadStudentInstallments } from "../../../../../../actions/installment";
import { clearProfile, loadRelatives } from "../../../../../../actions/user";
import { loadStudentClass } from "../../../../../../actions/class";

import RelativeDashboard from "../RelativeDashboard";
import StudentGradesTable from "../../../sharedComp/tables/StudentGradesTable";
import InstallmentsTable from "../../../sharedComp/tables/InstallmentsTable";
import Loading from "../../../../../modal/Loading";

import "./style.scss";

const StudentDashboard = ({
   loadUsersGrades,
   loadStudentAttendance,
   loadStudentInstallments,
   loadStudentClass,
   loadRelatives,
   clearProfile,
   auth: { userLogged },
   classes: { classInfo, loading },
   users: { user, loadingUsersBK },
   attendances: { studentAttendances, loadingStudentAttendances },
   installments: { usersInstallments, loadingUsersInstallments },
   grades: { studentGrades, loadingStudentGrades },
}) => {
   const [otherValues, setOtherValues] = useState({
      pass: false,
      firstLoad: true,
      secondLoad: true,
   });

   const { pass, firstLoad, secondLoad } = otherValues;

   const date = new Date();
   const year = date.getFullYear();

   const allowedUsers =
      userLogged.type === "secretary" ||
      userLogged.type === "admin&teacher" ||
      userLogged.type === "admin" ||
      (userLogged.type === "student" && user._id === userLogged._id);

   useEffect(() => {
      if (firstLoad) {
         let pass = false;
         if (userLogged.type === "guardian" && user.type === "student") {
            for (let x = 0; x < userLogged.children.length; x++) {
               if (userLogged.children[x]._id === user._id) {
                  pass = true;
                  setOtherValues((prev) => ({
                     ...prev,
                     pass: true,
                  }));
                  break;
               }
            }
         }
         loadRelatives(user._id);
         if ((allowedUsers || pass) && userLogged.type !== "student") {
            loadStudentClass(user._id);
         }
         setOtherValues((prev) => ({
            ...prev,
            firstLoad: false,
         }));
      } else {
         if ((allowedUsers || pass) && !loading && secondLoad) {
            loadUsersGrades(user._id, classInfo && classInfo._id);
            loadStudentAttendance(user._id, classInfo && classInfo._id);
            loadStudentInstallments(user._id, false);
            setOtherValues((prev) => ({
               ...prev,
               secondLoad: false,
            }));
         }
      }
   }, [
      userLogged,
      user,
      classInfo,
      loading,
      firstLoad,
      secondLoad,
      year,
      allowedUsers,
      pass,
      loadUsersGrades,
      loadStudentClass,
      loadRelatives,
      loadStudentAttendance,
      loadStudentInstallments,
   ]);

   return (
      <>
         {(!allowedUsers && !loadingUsersBK) ||
         ((allowedUsers || pass) &&
            !loadingUsersBK &&
            !loading &&
            !loadingStudentAttendances &&
            !loadingStudentGrades &&
            !loadingUsersInstallments) ? (
            <>
               <RelativeDashboard />
               {(allowedUsers || pass) && user.active && (
                  <>
                     {/* Class */}
                     <div
                        className={`class row ${
                           classInfo ? "bg-lighter" : "bg-white"
                        }`}
                     >
                        {classInfo ? (
                           <>
                              <div className="title ">
                                 <p className="heading-secondary text-primary">
                                    Clase
                                 </p>
                                 <p className="heading-tertiary text-dark m-1">
                                    Categoría:{" "}
                                    <small>{classInfo.category.name}</small>
                                 </p>
                                 <Link
                                    className="btn-text"
                                    onClick={() => {
                                       window.scroll(0, 0);
                                    }}
                                    to={`/class/${classInfo._id}`}
                                 >
                                    Ver Info
                                 </Link>
                              </div>
                              <div className="description bg-white">
                                 <div className="heading-tertiary">
                                    <p className="text-dark">
                                       Profesor:{" "}
                                       <small>
                                          {classInfo.teacher.name}{" "}
                                          {classInfo.teacher.lastname}
                                       </small>
                                    </p>
                                    <Link
                                       className="btn-text"
                                       to={`/dashboard/${classInfo.teacher._id}`}
                                       onClick={() => {
                                          window.scroll(0, 0);
                                          clearProfile(
                                             userLogged.type !== "student"
                                          );
                                       }}
                                    >
                                       Ver Info
                                    </Link>
                                 </div>

                                 <p>
                                    <span className="text-dark">Aula: </span>
                                    {classInfo.classroom}
                                 </p>

                                 {classInfo.hourin1 === classInfo.hourin2 &&
                                 classInfo.hourout2 === classInfo.hourout1 ? (
                                    <>
                                       <p>
                                          <span className="text-dark">
                                             Días:
                                          </span>{" "}
                                          {classInfo.day1} y {classInfo.day2}{" "}
                                       </p>
                                       <p>
                                          <span className="text-dark">
                                             Horario:{" "}
                                          </span>{" "}
                                          <Moment
                                             format="HH:mm"
                                             utc
                                             date={classInfo.hourin1}
                                          />{" "}
                                          -{" "}
                                          <Moment
                                             format="HH:mm"
                                             utc
                                             date={classInfo.hourout1}
                                          />
                                       </p>
                                    </>
                                 ) : (
                                    <>
                                       <p>
                                          <span className="text-dark">
                                             {classInfo.day1}:{" "}
                                          </span>
                                          <Moment
                                             format="HH:mm"
                                             utc
                                             date={classInfo.hourin1}
                                          />{" "}
                                          -{" "}
                                          <Moment
                                             format="HH:mm"
                                             utc
                                             date={classInfo.hourout1}
                                          />
                                       </p>
                                       <p>
                                          <span className="text-dark">
                                             {classInfo.day2}:{" "}
                                          </span>
                                          <Moment
                                             format="HH:mm"
                                             utc
                                             date={classInfo.hourin2}
                                          />{" "}
                                          -{" "}
                                          <Moment
                                             format="HH:mm"
                                             utc
                                             date={classInfo.hourout2}
                                          />
                                       </p>
                                    </>
                                 )}
                              </div>
                           </>
                        ) : (
                           <div className="no-class">
                              <h3 className="heading-tertiary p-1 text-primary">
                                 Clase
                              </h3>
                              <p className="heading-tertiary pt-1 text-center">
                                 El alumno no está registrado en ningua clase
                              </p>
                           </div>
                        )}
                     </div>
                     {/* Grades */}
                     <div className="bg-lightest-secondary p-3">
                        {!loadingStudentGrades && (
                           <>
                              <h3 className="heading-tertiary p-1 text-primary">
                                 Notas
                              </h3>
                              <div className="pb-2">
                                 {studentGrades.rows.length === 0 ? (
                                    <p className="heading-tertiary text-center">
                                       No hay notas registradas hasta el momento
                                    </p>
                                 ) : (
                                    <StudentGradesTable
                                       studentGrades={studentGrades}
                                       category={classInfo.category.name}
                                    />
                                 )}
                              </div>
                           </>
                        )}
                     </div>
                     {/* Attendance */}
                     <div className="bg-white p-3">
                        <h3 className="heading-tertiary text-primary p-1">
                           Inasistencias{" "}
                           {studentAttendances.length > 0 && (
                              <span className="badge">
                                 {studentAttendances.length}
                              </span>
                           )}
                        </h3>

                        {studentAttendances.length > 0 ? (
                           <div className="absence">
                              {" "}
                              {studentAttendances.map((attendance, index) => (
                                 <div key={index} className="paragraph p-1">
                                    <i className="far fa-times-circle"></i>{" "}
                                    <Moment
                                       format="DD/MM"
                                       utc
                                       date={attendance.date}
                                    />
                                 </div>
                              ))}
                           </div>
                        ) : (
                           <p className="heading-tertiary text-center">
                              No hay inasistencias
                           </p>
                        )}
                     </div>
                     {/* Installments */}
                     <div className="bg-lightest-secondary p-3">
                        <h3 className="heading-tertiary text-primary p-1">
                           Cuotas
                        </h3>
                        <div className="pb-2">
                           {usersInstallments.rows.length > 0 ? (
                              <>
                                 {usersInstallments.rows[0][0].year !==
                                    year + 1 ||
                                 (usersInstallments.rows[1] &&
                                    usersInstallments.rows[1][0].year !==
                                       year + 1) ? (
                                    <InstallmentsTable
                                       installments={usersInstallments}
                                       forAdmin={false}
                                    />
                                 ) : (
                                    <p className="heading-tertiary text-center">
                                       No hay ninguna cuota registrada del
                                       corriente año
                                    </p>
                                 )}
                              </>
                           ) : (
                              <p className="heading-tertiary text-center">
                                 No hay ninguna cuota registrada
                              </p>
                           )}
                        </div>
                     </div>
                  </>
               )}
            </>
         ) : (
            <Loading />
         )}
      </>
   );
};

StudentDashboard.prototypes = {
   users: PropTypes.object.isRequired,
   classes: PropTypes.object.isRequired,
   grades: PropTypes.object.isRequired,
   attendances: PropTypes.object.isRequired,
   installments: PropTypes.object.isRequired,
   auth: PropTypes.object.isRequired,
   loadUsersGrades: PropTypes.func.isRequired,
   loadStudentAttendance: PropTypes.func.isRequired,
   loadStudentInstallments: PropTypes.func.isRequired,
   loadStudentClass: PropTypes.func.isRequired,
   loadRelatives: PropTypes.func.isRequired,
   clearProfile: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   classes: state.classes,
   users: state.users,
   attendances: state.attendances,
   grades: state.grades,
   auth: state.auth,
   installments: state.installments,
});

export default connect(mapStateToProps, {
   loadUsersGrades,
   loadStudentAttendance,
   loadStudentInstallments,
   loadStudentClass,
   loadRelatives,
   clearProfile,
})(StudentDashboard);
