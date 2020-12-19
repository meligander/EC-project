import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import PropTypes from "prop-types";

import { loadUsersClass } from "../../../../../actions/class";
import { loadUsersGrades } from "../../../../../actions/grade";
import { loadStudentAttendance } from "../../../../../actions/attendance";
import { loadStudentDebts } from "../../../../../actions/debts";

import RelativeDashboard from "../RelativeDashboard";
import StudentGradesTable from "../../../../tables/StudentGradesTable";
import DebtsTable from "../../../../tables/DebtsTable";

import "./style.scss";

const StudentDashboard = ({
   loadUsersClass,
   loadUsersGrades,
   loadStudentAttendance,
   loadStudentDebts,
   auth: { userLogged },
   classes: { classInfo, loading },
   users: { user },
   attendance,
   debt: { usersDebts, loadingUsersDebts },
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
      if (loading) loadUsersClass(user._id);
      if (loadingUsersGrades) loadUsersGrades(user._id);
      if (attendance.loading) loadStudentAttendance(user._id);
      if (loadingUsersDebts) loadStudentDebts(user._id, false);
   }, [
      userLogged,
      user,
      loading,
      loadingUsersGrades,
      loadingUsersDebts,
      attendance.loading,
      loadUsersClass,
      loadUsersGrades,
      loadStudentAttendance,
      loadStudentDebts,
   ]);

   return (
      <>
         <RelativeDashboard tutor={true} />
         {/* Class */}
         <div className="class row bg-lighter">
            {!loading && classInfo !== null ? (
               <>
                  <div className="title ">
                     <p className="heading-secondary text-primary">Curso</p>
                     <p className="heading-tertiary text-dark m-1">
                        Categoría: <small>{classInfo.category.name}</small>
                     </p>
                     <Link className="btn-text" to={`/class/${classInfo._id}`}>
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
                           {attendance.attendances.length > 0 && (
                              <span className="badge">
                                 {" "}
                                 {attendance.attendances.length}
                              </span>
                           )}
                        </h3>

                        {attendance.attendances.length > 0 ? (
                           <div className="absence">
                              {" "}
                              {attendance.attendances.map(
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
                  {!loadingUsersDebts && (
                     <>
                        <h3 className="heading-tertiary text-primary p-1">
                           Cuotas
                        </h3>
                        <div className="pb-2">
                           {usersDebts.rows.length > 0 ? (
                              <DebtsTable forAdmin={false} />
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
   attendance: PropTypes.object.isRequired,
   debt: PropTypes.object.isRequired,
   auth: PropTypes.object.isRequired,
   loadUsersClass: PropTypes.func.isRequired,
   loadUsersGrades: PropTypes.func.isRequired,
   loadStudentAttendance: PropTypes.func.isRequired,
   loadStudentDebts: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   classes: state.classes,
   users: state.users,
   attendance: state.attendance,
   grades: state.grades,
   auth: state.auth,
   debt: state.debt,
});

export default connect(mapStateToProps, {
   loadUsersClass,
   loadUsersGrades,
   loadStudentAttendance,
   loadStudentDebts,
})(StudentDashboard);
