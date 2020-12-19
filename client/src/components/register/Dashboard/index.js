import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Moment from "react-moment";
import { withRouter, Link } from "react-router-dom";
import PropTypes from "prop-types";

import { loadUser, clearProfile, deleteUser } from "../../../actions/user";

import Confirm from "../../modal/Confirm";
import GoBack from "../../sharedComp/GoBack";
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
   clearProfile,
}) => {
   const [otherValues, setOtherValues] = useState({
      toggleModal: false,
      userAdmin: false,
   });

   const { toggleModal, userAdmin } = otherValues;

   const isAdmin =
      userLogged.type === "Administrador" ||
      userLogged.type === "Admin/Profesor";

   useEffect(() => {
      if (loading || user._id !== match.params.id) {
         if (user) {
            clearProfile();
         } else {
            loadUser(match.params.id);
         }
      } else {
         setOtherValues((prev) => ({
            ...prev,
            userAdmin:
               user.type === "Administrador" || user.type === "Admin/Profesor",
         }));
      }
   }, [loadUser, match.params.id, clearProfile, loading, user]);

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
            return <RelativeDashboard tutor={false} />;
         case "Secretaria":
         case "Administrador":
         case "Admin/Profesor":
            return (
               <>
                  {(userLogged.type === "Secretaria" || userAdmin) && (
                     <AdminDashboard />
                  )}
               </>
            );
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
               <div className="my-1">
                  <div className="profile-top bg-primary p-3">
                     <div className="img-about m-1">
                        <img
                           src={user.img}
                           alt="Perfil Alumno"
                           className="round-img p-1"
                        />
                        <h3 className="heading-secondary text-center text-secondary light-font my-1">
                           {user.name + " " + user.lastname}
                        </h3>
                        {user.type === "Alumno" && (
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
                           {user.type !== "Tutor" && !userAdmin && (
                              <p>
                                 <span className="text-dark">DNI: </span>
                                 {user.dni}
                              </p>
                           )}
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
                              {user.address},{" "}
                              {user.neighbourhood !== undefined &&
                              user.neighbourhood !== null
                                 ? user.neighbourhood.name + ", "
                                 : ""}
                              {user.town !== undefined &&
                                 user.town !== null &&
                                 user.town.name}
                           </p>
                           {user.type !== "Tutor" && !userAdmin && (
                              <p>
                                 <span className="text-dark">
                                    Fecha de Nacimiento:{" "}
                                 </span>
                                 <Moment format="DD/MM/YYYY" date={user.dob} />
                              </p>
                           )}
                           {user.type !== "Tutor" && !userAdmin && (
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
                           {isAdmin && user.salary !== undefined && (
                              <p>
                                 <span className="text-dark">Salario: </span>
                                 {user.salary}
                              </p>
                           )}
                           <p>
                              <span className="text-dark">Sexo: </span>
                              {user.sex}
                           </p>

                           {user.type !== "Tutor" && type !== "Alumno" && (
                              <p>
                                 <span className="text-dark">
                                    Descripción:{" "}
                                 </span>
                                 {user.description}
                              </p>
                           )}

                           {/* <!-- Solo para secretaria y admin --> */}
                           {user.type === "Alumno" && (
                              <>
                                 {(isAdmin ||
                                    userLogged.type === "Secretaria") && (
                                    <p>
                                       <span className="text-dark">
                                          Descuento:{" "}
                                       </span>
                                       {user.discount}
                                    </p>
                                 )}
                                 {(isAdmin ||
                                    userLogged.type === "Secretaria") && (
                                    <p>
                                       <span className="text-dark">
                                          Dia recargo:{" "}
                                       </span>
                                       {user.chargeday}
                                    </p>
                                 )}
                              </>
                           )}
                        </div>
                        <div className="about-btn">
                           {(isAdmin || userLogged.type === "Secretaria") && (
                              <button
                                 className="btn btn-danger"
                                 onClick={setToggle}
                              >
                                 <i className="fas fa-user-minus"></i>{" "}
                                 <span className="hide-md">Eliminar</span>
                              </button>
                           )}
                           {(isAdmin ||
                              userLogged.type === "Secretaria" ||
                              userLogged._id === user._id) && (
                              <Link
                                 to={`/edit-user/${user._id}`}
                                 className="btn btn-light"
                              >
                                 <i className="far fa-edit"></i>{" "}
                                 <span className="hide-md">Editar</span>
                              </Link>
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
};

const mapStateToProps = (state) => ({
   auth: state.auth,
   users: state.users,
   mixvalues: state.mixvalues,
});

export default connect(mapStateToProps, {
   loadUser,
   clearProfile,
})(withRouter(Dashboard));
