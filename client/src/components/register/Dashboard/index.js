import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Moment from "react-moment";
import { withRouter, Link } from "react-router-dom";
import PropTypes from "prop-types";

import { loadUser, deleteUser } from "../../../actions/user";
import { clearTowns } from "../../../actions/town";
import { clearStudentNumber } from "../../../actions/mixvalues";
import { updateExpiredIntallments } from "../../../actions/installment";

import Confirm from "../../modal/Confirm";
import GoBack from "../../sharedComp/GoBack";
import Alert from "../../sharedComp/Alert";
import Loading from "../../modal/Loading";
import StudentDashboard from "./usersDashboards/StudentDashboard";
import RelativeDashboard from "./usersDashboards/RelativeDashboard";
import AdminDashboard from "./usersDashboards/AdminDashboard";
import TeacherDashboard from "./usersDashboards/TeacherDashboard";

import "./style.scss";

const Dashboard = ({
   match,
   history,
   auth: { userLogged },
   users: { user, loading },
   mixvalues: { loadingSpinner },
   loadUser,
   clearTowns,
   deleteUser,
   updateExpiredIntallments,
   clearStudentNumber,
}) => {
   const [otherValues, setOtherValues] = useState({
      toggleModal: false,
   });

   const { toggleModal } = otherValues;

   const isOwner =
      userLogged.type === "Administrador" ||
      userLogged.type === "Admin/Profesor";

   const isAdmin = userLogged.type === "Secretaria" || isOwner;

   useEffect(() => {
      if (loading) {
         loadUser(match.params.id);
         updateExpiredIntallments();
      }
   }, [loadUser, match.params.id, loading, user, updateExpiredIntallments]);

   const type = () => {
      switch (user.type) {
         case "Alumno":
            return <StudentDashboard />;
         case "Profesor":
            return (
               <>
                  {userLogged.type !== "Alumno" &&
                     userLogged.type !== "Tutor" && <TeacherDashboard />}
               </>
            );
         case "Tutor":
            return <RelativeDashboard />;
         case "Secretaria":
         case "Administrador":
         case "Admin/Profesor":
            return <>{userLogged._id === user._id && <AdminDashboard />}</>;
         default:
            return <h1>Dashboard</h1>;
      }
   };

   const setToggle = () => {
      setOtherValues({ ...otherValues, toggleModal: !toggleModal });
   };

   const confirm = () => {
      deleteUser(user._id, history, userLogged._id);
   };

   return (
      <>
         {!loading ? (
            <>
               {loadingSpinner && <Loading />}
               <Confirm
                  setToggleModal={setToggle}
                  toggleModal={toggleModal}
                  confirm={confirm}
                  text="¿Está seguro que desea eliminar el usuario?"
               />
               {user._id !== userLogged._id && <GoBack />}
               <Alert type="1" />
               <div className="mt-1">
                  <div className="profile-top bg-primary p-3">
                     <div className="img-about m-1">
                        <img
                           src={user.noImg !== "" ? user.noImg : user.img.url}
                           alt="Perfil Alumno"
                           className="round-img p-1"
                        />
                        <h3 className="heading-secondary text-center text-secondary light-font my-1">
                           {user.name + " " + user.lastname}
                        </h3>
                        {user.studentnumber && (
                           <p className="heading-tertiary">
                              <span className="text-dark">Legajo: </span>
                              {user.studentnumber}
                           </p>
                        )}
                        <p className="heading-tertiary text-dark">
                           Usuario {user.active ? "Activo" : "Inactivo"}
                        </p>
                     </div>

                     <div className="about p-1">
                        <div className="about-info">
                           <h4 className="heading-tertiary">
                              Info {user.type}:
                           </h4>
                           {user.dni && (
                              <p>
                                 <span className="text-dark">DNI: </span>
                                 {user.dni}
                              </p>
                           )}

                           <p>
                              <span className="text-dark">Sexo: </span>
                              {user.sex}
                           </p>
                           <p>
                              <span className="text-dark">Email: </span>
                              {user.email}
                           </p>
                           <p>
                              <span className="text-dark">Celular: </span>
                              {user.cel}
                           </p>
                           <p>
                              <span className="text-dark">Teléfono: </span>
                              {user.tel}
                           </p>
                           <p>
                              <span className="text-dark">Dirección: </span>
                              {user.address ? user.address + ", " : ""}
                              {user.neighbourhood
                                 ? user.neighbourhood.name + ", "
                                 : ""}
                              {user.town && user.town.name}
                           </p>

                           {user.dob && (
                              <p>
                                 <span className="text-dark">
                                    Fecha de Nacimiento:{" "}
                                 </span>
                                 <Moment
                                    format="DD/MM/YYYY"
                                    utc
                                    date={user.dob}
                                 />
                              </p>
                           )}

                           {user.birthtown && user.birthprov && (
                              <p>
                                 <span className="text-dark">
                                    Lugar de Nacimiento:{" "}
                                 </span>
                                 {user.birthtown}, {user.birthprov}
                              </p>
                           )}
                           {user.type === "Profesor" && (
                              <>
                                 <p>
                                    <span className="text-dark">Título: </span>
                                    {user.degree}
                                 </p>
                                 <p>
                                    <span className="text-dark">
                                       Institución:{" "}
                                    </span>
                                    {user.school}
                                 </p>
                              </>
                           )}
                           {isOwner && user.salary && (
                              <p>
                                 <span className="text-dark">Salario: </span>
                                 {user.salary}
                              </p>
                           )}

                           {user.description && (
                              <p>
                                 <span className="text-dark">
                                    Descripción:{" "}
                                 </span>
                                 {user.description}
                              </p>
                           )}

                           {user.type === "Alumno" &&
                              (isAdmin || userLogged.type === "Secretaria") && (
                                 <>
                                    <p>
                                       <span className="text-dark">
                                          Descuento:{" "}
                                       </span>
                                       {user.discount}
                                    </p>
                                    <p>
                                       <span className="text-dark">
                                          Dia recargo:{" "}
                                       </span>
                                       {user.chargeday}
                                    </p>
                                 </>
                              )}
                        </div>
                        <div className="btn-right">
                           {(isAdmin || userLogged._id === user._id) && (
                              <>
                                 <Link
                                    to={`/edit-user/${user._id}`}
                                    className="btn btn-light"
                                    onClick={() => {
                                       window.scroll(0, 0);
                                       clearTowns();
                                       clearStudentNumber();
                                    }}
                                 >
                                    <i className="far fa-edit"></i>{" "}
                                    <span className="hide-md">Editar</span>
                                 </Link>
                                 {isAdmin && (
                                    <button
                                       className="btn btn-danger"
                                       onClick={setToggle}
                                    >
                                       <i className="fas fa-user-minus"></i>{" "}
                                       <span className="hide-md">Eliminar</span>
                                    </button>
                                 )}
                              </>
                           )}
                        </div>
                     </div>
                  </div>
                  {!loading && type()}
               </div>
            </>
         ) : (
            <Loading />
         )}
      </>
   );
};

Dashboard.prototypes = {
   users: PropTypes.object.isRequired,
   auth: PropTypes.object.isRequired,
   mixvalues: PropTypes.object.isRequired,
   loadUser: PropTypes.func.isRequired,
   deleteUser: PropTypes.func.isRequired,
   clearTowns: PropTypes.func.isRequired,
   clearStudentNumber: PropTypes.func.isRequired,
   updateExpiredIntallments: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   auth: state.auth,
   users: state.users,
   mixvalues: state.mixvalues,
});

export default connect(mapStateToProps, {
   loadUser,
   clearTowns,
   deleteUser,
   updateExpiredIntallments,
   clearStudentNumber,
})(withRouter(Dashboard));
