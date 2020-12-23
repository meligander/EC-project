import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import moment from "moment";
import PropTypes from "prop-types";

//Actions
import { registerUser, loadUser } from "../../../../../actions/user";
import { getStudentNumber } from "../../../../../actions/mixvalues";
import { loadTowns, clearTowns } from "../../../../../actions/town";
import {
   loadTownNeighbourhoods,
   clearNeighbourhoods,
} from "../../../../../actions/neighbourhood";

import Loading from "../../../../modal/Loading";
import Confirm from "../../../../modal/Confirm";
import TutorInfo from "./usersInfo/TutorInfo";
import EmployeeInfo from "./usersInfo/EmployeeInfo";
import StudentInfo from "./usersInfo/StudentInfo";

import "./style.scss";

const RegisterUser = ({
   match,
   registerUser,
   history,
   auth,
   users: { user, loading },
   towns,
   neighbourhoods,
   location,
   loadUser,
   loadTowns,
   loadTownNeighbourhoods,
   getStudentNumber,
   mixvalues: { studentNumber },
   clearNeighbourhoods,
   clearTowns,
}) => {
   const isAdmin =
      auth.userLogged.type === "Administrador" ||
      auth.userLogged.type === "Secretaria" ||
      auth.userLogged.type === "Admin/Profesor";

   const isOwner =
      auth.userLogged.type === "Administrador" ||
      auth.userLogged.type === "Admin/Profesor";

   const [otherValues, setOtherValues] = useState({
      isEditing: false,
      toggleModal: false,
      previewSource: "",
      fileInputState: "",
      selectedFile: "",
   });

   const {
      isEditing,
      toggleModal,
      previewSource,
      fileInputState,
      selectedFile,
   } = otherValues;

   const [formData, setFormData] = useState({
      studentnumber: "",
      name: "",
      lastname: "",
      email: "",
      tel: "",
      cel: "",
      type: "",
      dni: "",
      town: 0,
      neighbourhood: 0,
      address: "",
      dob: "",
      birthprov: "",
      birthtown: "",
      sex: "Femenino",
      salary: "",
      degree: "",
      school: "",
      children: [],
      description: "",
      discount: "",
      chargeday: 0,
      img: "",
      active: true,
   });

   const {
      studentnumber,
      name,
      lastname,
      email,
      tel,
      cel,
      type,
      dni,
      town,
      neighbourhood,
      address,
      dob,
      birthprov,
      birthtown,
      sex,
      degree,
      school,
      salary,
      children,
      description,
      discount,
      chargeday,
      active,
   } = formData;

   useEffect(() => {
      const load = () => {
         setOtherValues((prev) => ({
            ...prev,
            isEditing: true,
         }));
         if (user.town) loadTownNeighbourhoods(user.town._id);
         if (user.dob) user.dob = moment(user.dob).utc().format("YYYY-MM-DD");
         setFormData((prev) => ({
            ...prev,
            studentnumber: !user.studentnumber ? "" : user.studentnumber,
            name: user.name,
            lastname: user.lastname,
            type: user.type,
            active: user.active,
            tel: !user.tel ? "" : user.tel,
            cel: !user.cel ? "" : user.cel,
            dni: !user.dni ? "" : user.dni,
            town: !user.town ? "" : user.town._id,
            neighbourhood: !user.neighbourhood ? "" : user.neighbourhood._id,
            address: !user.address ? "" : user.address,
            dob: !user.dob ? "" : user.dob,
            birthprov: !user.birthprov ? "" : user.birthprov,
            birthtown: !user.birthtown ? "" : user.birthtown,
            sex: !user.sex ? "" : user.sex,
            degree: !user.degree ? "" : user.degree,
            school: !user.school ? "" : user.school,
            salary: !user.salary ? "" : user.salary,
            description: !user.description ? "" : user.description,
            discount: user.discount === undefined ? "" : user.discount,
            chargeday: !user.chargeday ? "" : user.chargeday,
         }));
      };

      if (towns.loading) {
         loadTowns();
      }

      if (location.pathname !== "/register") {
         if (!loading && !isEditing) {
            load();
         } else {
            if (towns.loading) {
               loadUser(match.params.id, true);
            }
         }
      } else {
         if (towns.loading) {
            getStudentNumber();
         } else
            setFormData((prev) => ({
               ...prev,
               studentnumber: studentNumber,
            }));
      }
   }, [
      loading,
      location.pathname,
      match.params.id,
      towns.loading,
      getStudentNumber,
      studentNumber,
      user,
      loadTownNeighbourhoods,
      loadTowns,
      isEditing,
      loadUser,
   ]);

   const onChange = (e) => {
      setFormData({
         ...formData,
         [e.target.name]: e.target.value,
      });
      if (e.target.name === "town") {
         loadTownNeighbourhoods(e.target.value);
      }
   };

   const onChangeImg = (e) => {
      if (e.target.value) {
         const file = e.target.files[0];
         previewFile(file, e.target.value);
      }
   };

   const previewFile = (file, state) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
         setOtherValues({
            ...otherValues,
            previewSource: reader.result,
            selectedFile: file,
            fileInputState: state,
         });
      };
   };

   const onChangeCheckbox = (e) => {
      setFormData({
         ...formData,
         active: e.target.checked,
      });
   };

   const setChildren = (student, add = true) => {
      if (add) {
         children.push(student);
      } else {
         setFormData({
            ...formData,
            children: children.filter((child) => child._id !== student._id),
         });
      }
   };

   const setToggle = () => {
      setOtherValues({ ...otherValues, toggleModal: !toggleModal });
   };

   const onSubmit = () => {
      registerUser(
         {
            ...formData,
            ...(selectedFile && { img: previewSource }),
         },
         history,
         user && user._id
      );
   };

   const changeType = () => {
      switch (type) {
         case "Alumno":
            return (
               <StudentInfo
                  isAdmin={isAdmin}
                  discount={discount}
                  chargeday={chargeday}
                  birthprov={birthprov}
                  birthtown={birthtown}
                  onChange={onChange}
               />
            );
         case "Profesor":
         case "Secretaria":
            return (
               <EmployeeInfo
                  isAdmin={isAdmin}
                  isOwner={isOwner}
                  type={type}
                  birthprov={birthprov}
                  birthtown={birthtown}
                  degree={degree}
                  salary={salary}
                  school={school}
                  description={description}
                  onChange={onChange}
               />
            );
         case "Tutor":
            return (
               <TutorInfo
                  setChildren={setChildren}
                  children={children}
                  isAdmin={isAdmin}
               />
            );
         default:
            break;
      }
   };

   return (
      <>
         {!loading || (!isEditing && !auth.loading) ? (
            <>
               <Confirm
                  toggleModal={toggleModal}
                  setToggleModal={setToggle}
                  confirm={onSubmit}
                  text={`¿Está seguro que desea ${
                     isEditing
                        ? "aplicar los cambios"
                        : "registrar al nuevo usuario"
                  }?`}
               />
               <div>
                  <h2 className="mb-2">
                     <i
                        className={`fas fa-user-${isEditing ? "edit" : "plus"}`}
                     ></i>{" "}
                     {isEditing ? "Editar" : "Registrar nuevo"} usuario
                  </h2>

                  {isEditing && (
                     <div className="btn-right mb-3">
                        <Link
                           to={`/credentials/${user._id}`}
                           className="btn btn-primary"
                           onClick={() => {
                              window.scroll(0, 0);
                           }}
                        >
                           <i className="fas fa-unlock"></i> &nbsp; Modificar
                           credenciales
                        </Link>
                     </div>
                  )}
                  <form
                     onSubmit={(e) => {
                        e.preventDefault();
                        setOtherValues({
                           ...otherValues,
                           toggleModal: true,
                        });
                     }}
                     className="form"
                  >
                     <h3 className="heading-tertiary text-lighter-primary">
                        Datos:
                     </h3>
                     <div className="form-group">
                        <select
                           className="form-input"
                           name="type"
                           id="type"
                           disabled={!isAdmin}
                           value={type}
                           onChange={(e) => onChange(e)}
                        >
                           <option value="">
                              * Seleccione el tipo de usuario
                           </option>
                           <option value="Alumno">Alumno</option>
                           <option value="Tutor">Tutor</option>
                           <option value="Profesor">Profesor</option>
                           <option value="Secretaria">Secretaria</option>
                           {(auth.userLogged.type === "Administrador" ||
                              auth.userLogged.type === "Admin/Profesor") && (
                              <>
                                 <option value="Administrador">
                                    Administrador
                                 </option>
                                 <option value="Admin/Profesor">
                                    Admin/Profesor
                                 </option>
                              </>
                           )}
                        </select>
                        <label
                           htmlFor="type"
                           className={`form-label ${type === "" ? "lbl" : ""}`}
                        >
                           Tipo de usuario
                        </label>
                     </div>

                     {type === "Alumno" && (
                        <div className="form-group">
                           <input
                              className="form-input"
                              type="number"
                              value={studentnumber}
                              name="registerNumber"
                              id="registerNumber"
                              disabled
                           />
                           <label
                              htmlFor="registerNumber"
                              className="form-label"
                           >
                              Legajo
                           </label>
                        </div>
                     )}

                     {type !== "Administrador" &&
                        type !== "Admin/Profesor" &&
                        type !== "Tutor" && (
                           <div className="form-group">
                              <input
                                 className="form-input"
                                 type="number"
                                 value={dni}
                                 disabled={!isAdmin}
                                 onChange={(e) => onChange(e)}
                                 name="dni"
                                 id="dni"
                                 placeholder="DNI"
                              />
                              <label htmlFor="dni" className="form-label">
                                 DNI
                              </label>
                           </div>
                        )}
                     <div className="form-group">
                        <input
                           type="text"
                           name="name"
                           id="name"
                           className="form-input"
                           disabled={!isAdmin}
                           value={name}
                           onChange={(e) => onChange(e)}
                           placeholder="Nombre"
                        />
                        <label htmlFor="name" className="form-label">
                           Nombre
                        </label>
                     </div>
                     <div className="form-group">
                        <input
                           className="form-input"
                           type="text"
                           name="lastname"
                           id="lastname"
                           value={lastname}
                           disabled={!isAdmin}
                           onChange={(e) => onChange(e)}
                           placeholder="Apellido"
                        />
                        <label htmlFor="lastname" className="form-label">
                           Apellido
                        </label>
                     </div>
                     {!isEditing && (
                        <div className="form-group">
                           <input
                              className="form-input"
                              type="text"
                              value={email}
                              name="email"
                              id="email"
                              onChange={(e) => onChange(e)}
                              placeholder="Dirección de correo electrónico"
                           />
                           <label htmlFor="email" className="form-label">
                              Dirección de correo electrónico
                           </label>
                        </div>
                     )}
                     <div className="form-group">
                        <input
                           className="form-input"
                           type="text"
                           name="tel"
                           id="tel"
                           disabled={!isAdmin}
                           value={tel}
                           onChange={(e) => onChange(e)}
                           placeholder="Teléfono"
                        />
                        <label htmlFor="tel" className="form-label">
                           Teléfono
                        </label>
                     </div>
                     <div className="form-group">
                        <input
                           className="form-input"
                           type="text"
                           name="cel"
                           id="cel"
                           disabled={!isAdmin}
                           value={cel}
                           onChange={(e) => onChange(e)}
                           placeholder="Celular"
                        />
                        <label htmlFor="cel" className="form-label">
                           Celular
                        </label>
                     </div>
                     <div className="form-group my-3">
                        <div className="radio-group" id="radio-group">
                           <input
                              className="form-radio"
                              type="radio"
                              value="Femenino"
                              onChange={(e) => onChange(e)}
                              checked={sex === "Femenino"}
                              disabled={!isAdmin}
                              name="sex"
                              id="rbf"
                           />
                           <label className="radio-lbl" htmlFor="rbf">
                              Femenino
                           </label>
                           <input
                              className="form-radio"
                              type="radio"
                              value="Masculino"
                              onChange={(e) => onChange(e)}
                              disabled={!isAdmin}
                              name="sex"
                              checked={sex === "Masculino"}
                              id="rbm"
                           />
                           <label className="radio-lbl" htmlFor="rbm">
                              Masculino
                           </label>
                        </div>
                        <label
                           htmlFor="radio-group"
                           className="form-label-show"
                        >
                           Seleccione el sexo
                        </label>
                     </div>
                     {type !== "Tutor" && type !== "" && (
                        <div className="form-group">
                           <input
                              className="form-input"
                              type="date"
                              value={dob}
                              disabled={!isAdmin}
                              onChange={(e) => onChange(e)}
                              name="dob"
                              id="dob"
                           />
                           <label htmlFor="dob" className="form-label-show">
                              Fecha de nacimiento
                           </label>
                        </div>
                     )}
                     <div className="form-group">
                        <input
                           className="form-input"
                           type="text"
                           value={address}
                           disabled={!isAdmin}
                           onChange={(e) => onChange(e)}
                           name="address"
                           id="address"
                           placeholder="Dirección"
                        />
                        <label htmlFor="address" className="form-label">
                           Dirección
                        </label>
                     </div>
                     <div className={`${isAdmin && "border"}`}>
                        <div className="form-group">
                           <select
                              className="form-input"
                              name="town"
                              id="town"
                              disabled={!isAdmin}
                              value={town}
                              onChange={(e) => onChange(e)}
                           >
                              <option value="0">
                                 * Seleccione localidad donde vive
                              </option>
                              {!towns.loading &&
                                 towns.towns.map((town) => (
                                    <option key={town._id} value={town._id}>
                                       {town.name}
                                    </option>
                                 ))}
                           </select>
                           <label
                              htmlFor="town"
                              className={`form-label ${
                                 town === "" || town === 0 ? "lbl" : ""
                              }`}
                           >
                              Localidad donde vive
                           </label>
                        </div>
                        <div className="form-group">
                           <select
                              className="form-input"
                              name="neighbourhood"
                              id="neighbourhood"
                              value={neighbourhood}
                              disabled={!isAdmin}
                              onChange={(e) => onChange(e)}
                           >
                              {!neighbourhoods.loading ? (
                                 <>
                                    {neighbourhoods.neighbourhoods.length ===
                                    0 ? (
                                       <option value="0">
                                          Dicha localidad no tiene barrios
                                          adheridos
                                       </option>
                                    ) : (
                                       <>
                                          <option value="0">
                                             * Seleccione barrio donde vive
                                          </option>
                                          {neighbourhoods.neighbourhoods.map(
                                             (neighbourhood) => (
                                                <option
                                                   key={neighbourhood._id}
                                                   value={neighbourhood._id}
                                                >
                                                   {neighbourhood.name}
                                                </option>
                                             )
                                          )}
                                       </>
                                    )}
                                 </>
                              ) : (
                                 <option value="0">
                                    Seleccione primero una localidad
                                 </option>
                              )}
                           </select>
                           <label
                              htmlFor="neighbourhood"
                              className={`form-label ${
                                 neighbourhood === "" || neighbourhood === 0
                                    ? "lbl"
                                    : ""
                              }`}
                           >
                              Barrio donde vive
                           </label>
                        </div>
                        {(auth.userLogged.type === "Administrador" ||
                           auth.userLogged.type === "Admin/Profesor") && (
                           <div className="btn-right">
                              <Link
                                 to="/edit-towns-neighbourhoods"
                                 className="btn btn-mix-secondary"
                                 onClick={() => {
                                    window.scroll(0, 0);
                                    clearNeighbourhoods();
                                    clearTowns();
                                 }}
                              >
                                 <i className="far fa-edit"></i> Editar
                              </Link>
                           </div>
                        )}
                     </div>

                     {type === "Admin/Profesor" && (
                        <div className="form-group">
                           <textarea
                              className="form-input"
                              name="description"
                              id="description"
                              rows="4"
                              onChange={(e) => onChange(e)}
                              value={description}
                              placeholder="Descripción"
                           ></textarea>
                           <label htmlFor="description" className="form-label">
                              Descripción
                           </label>
                        </div>
                     )}
                     {changeType()}
                     <div className="form-group my-3">
                        <input
                           className="form-checkbox"
                           onChange={(e) => onChangeCheckbox(e)}
                           type="checkbox"
                           disabled={!isAdmin}
                           checked={active}
                           name="active"
                           id="active"
                        />
                        <label className="checkbox-lbl" htmlFor="active">
                           {active ? "Activo" : "Inactivo"}
                        </label>
                     </div>

                     {previewSource && (
                        <div className="text-center mt-3">
                           <img
                              className="round-img"
                              src={previewSource}
                              alt="chosen img"
                           />
                        </div>
                     )}
                     {isEditing && (
                        <div className="upl-img my-5">
                           <div
                              className={`fileUpload ${
                                 fileInputState ? "success" : ""
                              }`}
                           >
                              <input
                                 id="fileInput"
                                 type="file"
                                 name="image"
                                 onChange={(e) => onChangeImg(e)}
                                 className="upload"
                              />
                              <span>
                                 <i className="fa fa-cloud-upload"></i> Subir
                                 imágen
                              </span>
                           </div>
                        </div>
                     )}

                     <div className="btn-ctr">
                        <button className="btn btn-primary">
                           {isEditing ? (
                              <i className="fas fa-user-edit"></i>
                           ) : (
                              <i className="fas fa-user-plus"></i>
                           )}{" "}
                           {isEditing ? "Guardar Cambios" : "Registrar"}
                        </button>
                     </div>
                  </form>
               </div>
            </>
         ) : (
            <Loading />
         )}
      </>
   );
};

RegisterUser.prototypes = {
   registerUser: PropTypes.func.isRequired,
   loadTowns: PropTypes.func.isRequired,
   loadTownNeighbourhoods: PropTypes.func.isRequired,
   loadUser: PropTypes.func.isRequired,
   getStudentNumber: PropTypes.func.isRequired,
   clearNeighbourhoods: PropTypes.func.isRequired,
   clearTowns: PropTypes.func.isRequired,
   mixvalues: PropTypes.object.isRequired,
   users: PropTypes.object.isRequired,
   auth: PropTypes.object.isRequired,
   towns: PropTypes.object.isRequired,
   neighbourhoods: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
   users: state.users,
   auth: state.auth,
   towns: state.towns,
   neighbourhoods: state.neighbourhoods,
   mixvalues: state.mixvalues,
});

export default connect(mapStateToProps, {
   registerUser,
   loadUser,
   loadTowns,
   loadTownNeighbourhoods,
   getStudentNumber,
   clearNeighbourhoods,
   clearTowns,
})(RegisterUser);
