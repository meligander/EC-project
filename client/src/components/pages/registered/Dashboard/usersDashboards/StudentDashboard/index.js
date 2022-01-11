import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import format from "date-fns/format";
import { Link } from "react-router-dom";

import { loadGrades } from "../../../../../../actions/grade";
import { loadAttendances } from "../../../../../../actions/attendance";
import { loadInstallments } from "../../../../../../actions/installment";
import { clearProfile, loadRelatives } from "../../../../../../actions/user";
import { loadStudentClass } from "../../../../../../actions/class";

import RelativeDashboard from "../RelativeDashboard";
import StudentGradesTable from "../../../sharedComp/tables/StudentGradesTable";
import InstallmentsTable from "../../../sharedComp/tables/InstallmentsTable";

import "./style.scss";
import { FaTimesCircle } from "react-icons/fa";

const StudentDashboard = ({
   loadGrades,
   loadAttendances,
   loadInstallments,
   loadStudentClass,
   loadRelatives,
   clearProfile,
   auth: { userLogged },
   classes: { classInfo, loadingClass },
   users: { user, loadingBK },
   attendances: { studentAttendances, loadingStudentAttendances },
   installments: { usersInstallments, loadingUsersInstallments },
   grades: { studentGrades, loadingStudentGrades },
}) => {
   const date = new Date();
   const year = date.getFullYear();

   const [adminValues, setOtherValues] = useState({
      pass: false,
   });

   const { pass } = adminValues;

   const allowedUsers =
      userLogged.type === "secretary" ||
      userLogged.type === "admin&teacher" ||
      userLogged.type === "admin" ||
      (userLogged.type === "student" && user._id === userLogged._id);

   useEffect(() => {
      if (userLogged.type === "guardian" && user.type === "student") {
         setOtherValues((prev) => ({
            ...prev,
            pass: userLogged.children.some((child) => child._id === user._id),
         }));
      }
   }, [userLogged, user]);

   useEffect(() => {
      if (loadingBK) loadRelatives(user._id);
      if (user.active) {
         if (allowedUsers || pass) {
            loadStudentClass(user._id);
            loadInstallments({ student: user._id }, true, "student");
         }
         if (!loadingClass) {
            loadGrades(classInfo._id, user._id);
            loadAttendances(classInfo._id, user._id);
         }
      }
   }, [
      user,
      classInfo,
      loadingClass,
      loadingBK,
      allowedUsers,
      pass,
      loadGrades,
      loadStudentClass,
      loadRelatives,
      loadAttendances,
      loadInstallments,
   ]);

   return (
      <>
         {!loadingBK && <RelativeDashboard />}
         {!loadingClass && (
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
                                 to={`/index/dashboard/${classInfo.teacher._id}`}
                                 onClick={() => {
                                    window.scroll(0, 0);
                                    clearProfile(userLogged.type !== "student");
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
                                    {format(
                                       new Date(classInfo.hourin1.slice(0, -1)),
                                       "HH:mm"
                                    )}{" "}
                                    -{" "}
                                    {format(
                                       new Date(
                                          classInfo.hourout1.slice(0, -1)
                                       ),
                                       "HH:mm"
                                    )}
                                 </p>
                              </>
                           ) : (
                              <>
                                 <p>
                                    <span className="text-dark">
                                       {classInfo.day1}:{" "}
                                    </span>
                                    {format(
                                       new Date(classInfo.hourin1.slice(0, -1)),
                                       "HH:mm"
                                    )}{" "}
                                    -{" "}
                                    {format(
                                       new Date(
                                          classInfo.hourout1.slice(0, -1)
                                       ),
                                       "HH:mm"
                                    )}
                                 </p>
                                 <p>
                                    <span className="text-dark">
                                       {classInfo.day2}:{" "}
                                    </span>
                                    {format(
                                       new Date(classInfo.hourin2.slice(0, -1)),
                                       "HH:mm"
                                    )}{" "}
                                    -{" "}
                                    {format(
                                       new Date(
                                          classInfo.hourout2.slice(0, -1)
                                       ),
                                       "HH:mm"
                                    )}
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

               {!loadingStudentGrades && (
                  <div className="bg-lightest-secondary p-3">
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
                  </div>
               )}

               {/* Attendance */}
               {!loadingStudentAttendances && (
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
                                 <FaTimesCircle />
                                 {format(
                                    new Date(attendance.date.slice(0, -1)),
                                    "DD/MM"
                                 )}
                              </div>
                           ))}
                        </div>
                     ) : (
                        <p className="heading-tertiary text-center">
                           No hay inasistencias
                        </p>
                     )}
                  </div>
               )}

               {/* Installments */}
               {!loadingUsersInstallments && (
                  <div className="bg-lightest-secondary p-3">
                     <h3 className="heading-tertiary text-primary p-1">
                        Cuotas
                     </h3>
                     <div className="pb-2">
                        {usersInstallments.rows.length > 0 ? (
                           <>
                              {usersInstallments.rows[0][0].year !== year + 1 ||
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
               )}
            </>
         )}
      </>
   );
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
   loadGrades,
   loadAttendances,
   loadInstallments,
   loadStudentClass,
   loadRelatives,
   clearProfile,
})(StudentDashboard);
