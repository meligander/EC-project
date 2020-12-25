import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import PropTypes from "prop-types";

import { clearClass, loadUsersClass } from "../../../../../actions/class";
import { loadUsersGrades } from "../../../../../actions/grade";
import { loadStudentAttendance } from "../../../../../actions/attendance";
import { loadStudentInstallments } from "../../../../../actions/installment";
import { clearProfile } from "../../../../../actions/user";

import RelativeDashboard from "../RelativeDashboard";
import StudentGradesTable from "../../../../tables/StudentGradesTable";
import InstallmentsTable from "../../../../tables/InstallmentsTable";

import "./style.scss";

const StudentDashboard = ({
   loadUsersClass,
   loadUsersGrades,
   loadStudentAttendance,
   loadStudentInstallments,
   clearClass,
   clearProfile,
   auth: { userLogged },
   classes: { classInfo, loading },
   users: { user },
   attendances,
   installments: { usersInstallments, loadingUsersInstallments },
   grades: { usersGrades, loadingUsersGrades },
}) => {
   const [pass, setPass] = useState(false);

   useEffect(() => {
      if (userLogged.type === "Tutor" && user.type === "Alumno") {
         for (let x = 0; x < userLogged.children.length; x++) {
            if (userLogged.children[x].user._id === user._id) {
               setPass(true);
               break;
            }
         }
      }

      if (loading) {
         loadUsersClass(user._id);
         loadUsersGrades(user._id);
         loadStudentAttendance(user._id);
         loadStudentInstallments(user._id, false);
      }
   }, [
      userLogged,
      user,
      loading,
      loadUsersClass,
      loadUsersGrades,
      loadStudentAttendance,
      loadStudentInstallments,
   ]);

   return (
      <>
         <RelativeDashboard />
         {/* Class */}
         <div className="class row bg-lighter">
            {!loading && classInfo !== null ? (
               <>
                  <div className="title ">
                     <p className="heading-secondary text-primary">Curso</p>
                     <p className="heading-tertiary text-dark m-1">
                        Categoría: <small>{classInfo.category.name}</small>
                     </p>
                     <Link
                        className="btn-text"
                        onClick={() => {
                           window.scroll(0, 0);
                           clearClass();
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
                              clearProfile();
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
                              <span className="text-dark">Días:</span>{" "}
                              {classInfo.day1} y {classInfo.day2}{" "}
                           </p>
                           <p>
                              <span className="text-dark">Horario: </span>{" "}
                              <Moment format="HH:mm" date={classInfo.hourin1} />{" "}
                              -{" "}
                              <Moment
                                 format="HH:mm"
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
                              <Moment format="HH:mm" date={classInfo.hourin1} />{" "}
                              -{" "}
                              <Moment
                                 format="HH:mm"
                                 date={classInfo.hourout1}
                              />
                           </p>
                           <p>
                              <span className="text-dark">
                                 {classInfo.day2}:{" "}
                              </span>
                              <Moment format="HH:mm" date={classInfo.hourin2} />{" "}
                              -{" "}
                              <Moment
                                 format="HH:mm"
                                 date={classInfo.hourout2}
                              />
                           </p>
                        </>
                     )}
                  </div>
               </>
            ) : (
               <div>
                  <p className="heading-tertiary pt-1 text-center">
                     El alumno no está registrado en ningua clase
                  </p>
               </div>
            )}
         </div>
         {(userLogged.type === "Secretaria" ||
            userLogged.type === "Admin/Profesor" ||
            userLogged.type === "Administrador" ||
            (userLogged.type === "Alumno" && user._id === userLogged._id) ||
            pass) && (
            <>
               {/* Grades */}
               <div className="bg-lightest-secondary p-3">
                  {!loadingUsersGrades && (
                     <>
                        <h3 className="heading-tertiary p-1 text-primary">
                           Notas
                        </h3>
                        <div className="pb-2">
                           {usersGrades.rows.length === 0 ? (
                              <p className="heading-tertiary text-center">
                                 No hay notas registradas hasta el momento
                              </p>
                           ) : (
                              <StudentGradesTable usersGrades={usersGrades} />
                           )}
                        </div>
                     </>
                  )}
               </div>
               {/* Attendance */}
               <div className="bg-white p-2">
                  {!loading && (
                     <>
                        <h3 className="heading-tertiary text-primary p-1 m-1">
                           Inasistencias{" "}
                           {attendances.attendances.length > 0 && (
                              <span className="badge">
                                 {" "}
                                 {attendances.attendances.length}
                              </span>
                           )}
                        </h3>

                        {attendances.attendances.length > 0 ? (
                           <div className="absence">
                              {" "}
                              {attendances.attendances.map(
                                 (attendance, index) => (
                                    <div key={index} className="paragraph p-1">
                                       <i className="far fa-times-circle"></i>{" "}
                                       <Moment
                                          format="DD/MM"
                                          date={attendance.date}
                                       />
                                    </div>
                                 )
                              )}
                           </div>
                        ) : (
                           <p className="heading-tertiary text-center">
                              No hay inasistencias
                           </p>
                        )}
                     </>
                  )}
               </div>
               {/* Installments */}
               <div className="bg-lightest-secondary p-2">
                  {!loadingUsersInstallments && (
                     <>
                        <h3 className="heading-tertiary text-primary p-1">
                           Cuotas
                        </h3>
                        <div className="pb-2">
                           {usersInstallments.rows.length > 0 ? (
                              <InstallmentsTable
                                 installments={usersInstallments}
                                 forAdmin={false}
                              />
                           ) : (
                              <p className="heading-tertiary text-center">
                                 No hay ninguna cuota registrada
                              </p>
                           )}
                        </div>
                     </>
                  )}
               </div>
            </>
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
   loadUsersClass: PropTypes.func.isRequired,
   loadUsersGrades: PropTypes.func.isRequired,
   loadStudentAttendance: PropTypes.func.isRequired,
   loadStudentInstallments: PropTypes.func.isRequired,
   clearClass: PropTypes.func.isRequired,
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
   loadUsersClass,
   loadUsersGrades,
   loadStudentAttendance,
   loadStudentInstallments,
   clearClass,
   clearProfile,
})(StudentDashboard);
