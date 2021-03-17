import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Moment from "react-moment";
import { withRouter, Link } from "react-router-dom";
import PropTypes from "prop-types";

import {
   loadUser,
   deleteUser,
   clearOtherValues,
   clearSearch,
} from "../../../../actions/user";
import { clearTowns } from "../../../../actions/town";
import { clearUser } from "../../../../actions/user";
import { clearNeighbourhoods } from "../../../../actions/neighbourhood";
import { updateExpiredIntallments } from "../../../../actions/installment";

import PopUp from "../../../modal/PopUp";
import Loading from "../../../modal/Loading";
import GoBack from "../../sharedComp/GoBack";
import Alert from "../../sharedComp/Alert";
import StudentDashboard from "./usersDashboards/StudentDashboard";
import RelativeDashboard from "./usersDashboards/RelativeDashboard";
import AdminDashboard from "./usersDashboards/AdminDashboard";
import TeacherDashboard from "./usersDashboards/TeacherDashboard";

import "./style.scss";
import ExpireAuthToken from "../../../../utils/ExpireAuthToken";

const Dashboard = ({
   match,
   history,
   auth: { userLogged },
   users: { user, loading },
   loadUser,
   clearTowns,
   clearSearch,
   clearNeighbourhoods,
   clearUser,
   deleteUser,
   clearOtherValues,
   updateExpiredIntallments,
}) => {
   const [otherValues, setOtherValues] = useState({
      toggleModal: false,
      type: "",
   });

   const { toggleModal, type } = otherValues;

   const isOwner =
      userLogged.type === "admin" || userLogged.type === "admin&teacher";

   const isAdmin = userLogged.type === "secretary" || isOwner;

   const userTypeName = {
      student: "Alumno",
      teacher: "Profesor",
      guardian: "Tutor",
      secretary: "Secretaria",
      admin: "Administrador",
      "admin&teacher": "Administrador y Profesor",
   };

   useEffect(() => {
      if (loading) {
         loadUser(match.params.user_id);
         updateExpiredIntallments();
      } else {
         if (type === "")
            setOtherValues((prev) => ({
               ...prev,
               type: userTypeName[user.type],
            }));
      }
   }, [
      loadUser,
      match.params.user_id,
      loading,
      user,
      userTypeName,
      type,
      updateExpiredIntallments,
   ]);

   const dashboardType = () => {
      switch (user.type) {
         case "student":
            return <StudentDashboard />;
         case "teacher":
            return (
               <>
                  {userLogged.type !== "student" &&
                     userLogged.type !== "guardian" && <TeacherDashboard />}
               </>
            );
         case "guardian":
            return <RelativeDashboard />;
         case "secretary":
         case "admin":
         case "admin&teacher":
            return <>{userLogged._id === user._id && <AdminDashboard />}</>;
         default:
            return <h1>Dashboard</h1>;
      }
   };

   const setToggle = () => {
      setOtherValues({ ...otherValues, toggleModal: !toggleModal });
   };

   return (
      <>
         {!loading ? (
            <>
               <ExpireAuthToken />
               <PopUp
                  setToggleModal={setToggle}
                  toggleModal={toggleModal}
                  confirm={() => deleteUser(user, history, userLogged._id)}
                  text="¿Está seguro que desea eliminar el usuario?"
               />
               {user._id !== userLogged._id && <GoBack />}
               <Alert type="1" />
               <div className="mt-1">
                  <div className="profile-top bg-primary">
                     <div className="img-about m-1">
                        <img
                           src={
                              user.img.public_id === ""
                                 ? "https://pngimage.net/wp-content/uploads/2018/06/no-user-image-png-3-300x200.png"
                                 : user.img.url
                           }
                           alt="Perfil Usuario"
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

                     <div className="about p-2">
                        <div className="about-info">
                           <h4 className="heading-tertiary">Info {type}:</h4>
                           {user.dni && (
                              <p>
                                 <span className="text-dark">DNI: </span>
                                 {user.dni
                                    .toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
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
                           {(user._id === userLogged._id || isAdmin) && (
                              <p>
                                 <span className="text-dark">Dirección: </span>
                                 {user.address ? user.address + ", " : ""}
                                 {user.neighbourhood
                                    ? user.neighbourhood.name + ", "
                                    : ""}
                                 {user.town && user.town.name}
                              </p>
                           )}

                           {user.dob && (
                              <p>
                                 <span className="text-dark">
                                    Fecha de Nacimiento:{" "}
                                 </span>
                                 <Moment
                                    format={
                                       isOwner ||
                                       userLogged._id === user._id ||
                                       user.type !== "admin" ||
                                       user.type !== "admin&teacher"
                                          ? "DD/MM/YYYY"
                                          : "DD/MM"
                                    }
                                    utc
                                    date={user.dob}
                                 />
                              </p>
                           )}

                           {(user.birthtown || user.birthprov) && (
                              <p>
                                 <span className="text-dark">
                                    Lugar de Nacimiento:{" "}
                                 </span>
                                 {`${user.birthtown}${
                                    user.birthprov === "."
                                       ? user.birthprov
                                       : ", " + user.birthprov
                                 }`}
                              </p>
                           )}
                           {user.type === "teacher" && (
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

                           {user.type === "student" && isAdmin && (
                              <>
                                 <p>
                                    <span className="text-dark">
                                       Descuento:{" "}
                                    </span>
                                    {user.discount}%
                                 </p>
                                 <p>
                                    <span className="text-dark">
                                       Día recargo:{" "}
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
                                    className="btn btn-mix-secondary"
                                    onClick={() => {
                                       window.scroll(0, 0);
                                       clearTowns();
                                       clearUser();
                                       clearNeighbourhoods();
                                       clearSearch();
                                       clearOtherValues("studentNumber");
                                    }}
                                 >
                                    <i className="far fa-edit"></i>
                                    <span className="hide-md">
                                       &nbsp; Editar
                                    </span>
                                 </Link>
                                 {isAdmin && (
                                    <button
                                       type="button"
                                       className="btn btn-danger"
                                       onClick={(e) => {
                                          e.preventDefault();
                                          setToggle();
                                       }}
                                    >
                                       <i className="fas fa-user-minus"></i>
                                       <span className="hide-md">
                                          &nbsp; Eliminar
                                       </span>
                                    </button>
                                 )}
                              </>
                           )}
                        </div>
                     </div>
                  </div>
                  {!loading && dashboardType()}
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
   loadUser: PropTypes.func.isRequired,
   deleteUser: PropTypes.func.isRequired,
   clearTowns: PropTypes.func.isRequired,
   clearSearch: PropTypes.func.isRequired,
   clearOtherValues: PropTypes.func.isRequired,
   clearUser: PropTypes.func.isRequired,
   clearNeighbourhoods: PropTypes.func.isRequired,
   updateExpiredIntallments: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   auth: state.auth,
   users: state.users,
});

export default connect(mapStateToProps, {
   loadUser,
   deleteUser,
   clearTowns,
   clearSearch,
   clearOtherValues,
   clearNeighbourhoods,
   clearUser,
   updateExpiredIntallments,
})(withRouter(Dashboard));
