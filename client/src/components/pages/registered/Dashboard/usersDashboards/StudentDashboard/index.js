import React, { useEffect } from "react";
import { connect } from "react-redux";
import format from "date-fns/format";
import { Link, withRouter } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";

import { loadGrades } from "../../../../../../actions/grade";
import { loadAttendances } from "../../../../../../actions/attendance";
import { loadInstallments } from "../../../../../../actions/installment";
import { loadObservations } from "../../../../../../actions/observation";
import { loadEnrollments } from "../../../../../../actions/enrollment";
import { clearProfile, loadRelatives } from "../../../../../../actions/user";
import { togglePopup } from "../../../../../../actions/global";
import { loadClass } from "../../../../../../actions/class";

import RelativeDashboard from "../RelativeDashboard";
import StudentGradesTable from "../../../sharedComp/tables/StudentGradesTable";
import InstallmentsTable from "../../../sharedComp/tables/InstallmentsTable";

import "./style.scss";

const StudentDashboard = ({
   match,
   user,
   auth: { userLogged },
   classes: { classInfo, loadingClass },
   users: { loadingBK },
   attendances: { attendances, loading },
   installments: { installments, loading: loadingInstallments },
   grades: { grades, loading: loadingGrades },
   observations: { observations, loading: loadingObservations },
   enrollments: { enrollments, loading: loadingEnrollments },
   loadGrades,
   loadAttendances,
   loadInstallments,
   loadClass,
   loadRelatives,
   loadObservations,
   loadEnrollments,
   togglePopup,
   clearProfile,
}) => {
   const class_id = match.params.class_id;

   const isAdmin =
      userLogged.type === "secretary" ||
      userLogged.type === "admin&teacher" ||
      userLogged.type === "admin" ||
      userLogged.type === "classManager";

   const allowedUsers =
      isAdmin ||
      (userLogged.type === "student" && user._id === userLogged._id) ||
      (userLogged.type === "guardian" &&
         userLogged.children.some((child) => child._id === user._id));

   useEffect(() => {
      if (loadingBK) loadRelatives(user._id);
   }, [loadingBK, loadRelatives, user]);

   useEffect(() => {
      if (allowedUsers && loadingClass)
         loadClass(!class_id ? user._id : class_id, class_id, !class_id);
   }, [allowedUsers, loadingClass, loadClass, user, class_id]);

   useEffect(() => {
      if (allowedUsers && loadingInstallments)
         loadInstallments(
            { student: { _id: user._id } },
            false,
            true,
            "student"
         );
   }, [allowedUsers, loadingInstallments, loadInstallments, user]);

   useEffect(() => {
      if (!loadingClass && classInfo && loadingGrades)
         loadGrades(classInfo._id, user._id);
   }, [loadingClass, loadingGrades, loadGrades, user, classInfo]);

   useEffect(() => {
      if (loadingEnrollments && allowedUsers)
         loadEnrollments({ classroom: false, student: user._id }, false);
   }, [loadEnrollments, user, loadingEnrollments, userLogged, allowedUsers]);

   useEffect(() => {
      if (!loadingClass && classInfo && loadingObservations)
         loadObservations(classInfo._id, user._id, false);
   }, [user, loadObservations, loadingObservations, loadingClass, classInfo]);

   useEffect(() => {
      if (!loadingClass && classInfo && loading)
         loadAttendances(classInfo._id, user._id);
   }, [loadingClass, loading, loadAttendances, user, classInfo]);

   return (
      <>
         {!loadingBK && <RelativeDashboard user={user} />}
         {!loadingEnrollments && allowedUsers && enrollments.length > 0 && (
            <div className="bg-white p-3">
               <h3 className="heading-tertiary text-primary text-center">
                  Cursos
               </h3>
               <div className="student-classes">
                  {enrollments.map((item) => (
                     <div key={item._id} className="class-item">
                        <p>{item.category.name}</p>
                        <Link
                           className="btn-text"
                           to={`/index/dashboard/${user._id}/${item.classroom}`}
                           onClick={() => clearProfile(true)}
                        >
                           Ver Info
                        </Link>
                     </div>
                  ))}
               </div>
            </div>
         )}
         {!loadingClass && !(!classInfo && !user.active) && (
            <>
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
                           <p className="text-dark m-1">
                              Año: <small>{classInfo.year}</small>
                           </p>
                           <Link
                              className="btn-text"
                              onClick={() => {
                                 window.scroll(0, 0);
                              }}
                              to={`/class/single/${classInfo._id}`}
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

               {!loadingGrades && (
                  <div className="bg-lightest-secondary p-3">
                     <h3 className="heading-tertiary p-1 text-primary">
                        Notas
                     </h3>
                     <div className="pb-2">
                        {grades.length === 0 ? (
                           <p className="heading-tertiary text-center">
                              No hay notas registradas hasta el momento
                           </p>
                        ) : (
                           <StudentGradesTable
                              studentGrades={grades}
                              category={classInfo.category.name}
                           />
                        )}
                     </div>
                  </div>
               )}

               {/* Attendance */}
               {!loading && (
                  <div className="bg-white p-3">
                     <h3 className="heading-tertiary text-primary p-1">
                        Inasistencias{" "}
                        {attendances.length > 0 && (
                           <span className="badge">{attendances.length}</span>
                        )}
                     </h3>

                     {attendances.length > 0 ? (
                        <div className="absence">
                           {attendances.map((attendance, index) => (
                              <div key={index} className="paragraph p-1">
                                 <FaTimesCircle />{" "}
                                 {format(
                                    new Date(attendance.date.slice(0, -1)),
                                    `dd/MM${class_id ? "/yy" : ""}`
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

               {/* Observaciones */}
               {!loading && (
                  <div className="bg-lightest-secondary p-3">
                     <h3 className="heading-tertiary p-1 text-primary">
                        Observaciones
                     </h3>
                     {observations.length === 0 ? (
                        <p className="heading-tertiary text-center ">
                           No hay observaciones registradas
                        </p>
                     ) : (
                        observations.map((item) => (
                           <div className="observation" key={item._id}>
                              <h4>{item.period}° Bimestre</h4>
                              <p>{item.description}</p>
                           </div>
                        ))
                     )}
                  </div>
               )}

               {/* Installments */}
               {userLogged.type !== "classManager" && (
                  <div className="bg-white p-3">
                     <h3 className="heading-tertiary m-0 text-primary p-1">
                        Cuotas Pendientes{" "}
                     </h3>
                     <button
                        className="btn-text liner"
                        onClick={() => togglePopup("invoices")}
                     >
                        Facturas Pagas
                     </button>
                     <div className="pb-2">
                        {!loadingInstallments && installments.length > 0 ? (
                           <InstallmentsTable
                              installments={installments}
                              forAdmin={false}
                              dash
                           />
                        ) : (
                           <p className="heading-tertiary text-center">
                              Al día
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
   observations: state.observations,
   enrollments: state.enrollments,
});

export default connect(mapStateToProps, {
   loadGrades,
   loadAttendances,
   loadInstallments,
   loadClass,
   loadRelatives,
   loadObservations,
   loadEnrollments,
   togglePopup,
   clearProfile,
})(withRouter(StudentDashboard));
