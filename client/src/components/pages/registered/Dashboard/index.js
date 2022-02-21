import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { FaUserMinus, FaUserEdit } from "react-icons/fa";
import format from "date-fns/format";

import {
   loadUser,
   deleteUser,
   clearUser,
   clearSearch,
} from "../../../../actions/user";
import { clearTowns } from "../../../../actions/town";
import { clearNeighbourhoods } from "../../../../actions/neighbourhood";
import { togglePopup } from "../../../../actions/mixvalues";

import PopUp from "../../../modal/PopUp";
import Alert from "../../sharedComp/Alert";
import Loading from "../../../modal/Loading";
import StudentDashboard from "./usersDashboards/StudentDashboard";
import RelativeDashboard from "./usersDashboards/RelativeDashboard";
import AdminDashboard from "./usersDashboards/AdminDashboard";
import TeacherDashboard from "./usersDashboards/TeacherDashboard";

import "./style.scss";

const Dashboard = ({
   match,
   auth: { userLogged },
   users: { user: otherUser, loadingUser },
   loadUser,
   clearTowns,
   clearSearch,
   clearNeighbourhoods,
   clearUser,
   deleteUser,
   togglePopup,
}) => {
   const [adminValues, setAdminValues] = useState({
      user: null,
   });

   const { user } = adminValues;

   const isOwner =
      userLogged &&
      (userLogged.type === "admin" || userLogged.type === "admin&teacher");

   const isAdmin = (userLogged && userLogged.type === "secretary") || isOwner;

   const userTypeName = {
      student: "Alumno",
      teacher: "Profesor",
      guardian: "Tutor",
      secretary: "Secretaria",
      admin: "Administrador",
      "admin&teacher": "Administrador y Profesor",
   };
   const _id = match.params.user_id !== "0" ? match.params.user_id : null;

   useEffect(() => {
      if (!user) {
         if (_id && loadingUser) loadUser(_id, true);
         else {
            setAdminValues((prev) => ({
               ...prev,
               user: _id ? otherUser : userLogged,
            }));
         }
      } else {
         if ((_id && user._id !== _id) || (!_id && user._id !== userLogged._id))
            setAdminValues((prev) => ({ ...prev, user: null }));
      }
   }, [loadUser, _id, loadingUser, otherUser, user, userLogged]);

   const dashboardType = () => {
      switch (user.type) {
         case "student":
            return <StudentDashboard user={user} />;
         case "teacher":
            return (
               <>
                  {(isAdmin || userLogged._id === _id) && (
                     <TeacherDashboard user={user} />
                  )}
               </>
            );
         case "guardian":
            return <RelativeDashboard user={user} />;
         case "secretary":
         case "admin":
         case "admin&teacher":
            return <>{userLogged._id === user._id && <AdminDashboard />}</>;
         default:
            return <></>;
      }
   };

   return (
      <div className="dashboard">
         <Loading />
         {user !== null && (
            <>
               <PopUp
                  confirm={() => deleteUser(user)}
                  info="¿Está seguro que desea eliminar el usuario?"
               />
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
                        {isAdmin && (
                           <p className="heading-tertiary text-dark">
                              Usuario {user.active ? "Activo" : "Inactivo"}
                           </p>
                        )}
                     </div>

                     <div className="about p-2">
                        <div className="about-info">
                           <h4 className="heading-tertiary">
                              Info {userTypeName[user.type]}:
                           </h4>
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
                                 {format(
                                    new Date(user.dob.slice(0, -1)),
                                    isOwner || userLogged._id === user._id
                                       ? "dd/MM/yyyy"
                                       : "dd/MM"
                                 )}
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
                                    to={`/user/edit/${user._id}`}
                                    className="btn btn-mix-secondary"
                                    onClick={() => {
                                       window.scroll(0, 0);
                                       clearTowns();
                                       clearUser();
                                       clearNeighbourhoods();
                                       clearSearch();
                                    }}
                                 >
                                    <FaUserEdit />
                                    <span className="hide-md">
                                       &nbsp;Editar
                                    </span>
                                 </Link>
                                 {isAdmin && (
                                    <button
                                       type="button"
                                       className="btn btn-danger"
                                       onClick={(e) => {
                                          e.preventDefault();
                                          togglePopup("default");
                                       }}
                                    >
                                       <FaUserMinus />
                                       <span className="hide-md">
                                          &nbsp;Eliminar
                                       </span>
                                    </button>
                                 )}
                              </>
                           )}
                        </div>
                     </div>
                  </div>
               </div>
               {dashboardType()}
            </>
         )}
      </div>
   );
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
   clearUser,
   clearNeighbourhoods,
   togglePopup,
})(Dashboard);
