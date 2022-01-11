import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import format from "date-fns/format";
import {
   FaCloudUploadAlt,
   FaEdit,
   FaUnlock,
   FaUserEdit,
   FaUserPlus,
} from "react-icons/fa";

//Actions
import {
   registerUpdateUser,
   loadUser,
   getStudentNumber,
} from "../../../../../../actions/user";
import { loadTowns, clearTowns } from "../../../../../../actions/town";
import {
   loadNeighbourhoods,
   clearNeighbourhoods,
} from "../../../../../../actions/neighbourhood";
import { togglePopup } from "../../../../../../actions/mixvalues";

import PopUp from "../../../../../modal/PopUp";
import TutorInfo from "./usersInfo/TutorInfo";
import EmployeeInfo from "./usersInfo/EmployeeInfo";
import StudentInfo from "./usersInfo/StudentInfo";

import "./style.scss";

const RegisterUser = ({
   match,
   auth: { userLogged },
   users: {
      user: otherUser,
      loadingUser,
      otherValues: { studentNumber },
   },
   towns: { loading: loadingTowns, towns },
   neighbourhoods: { neighbourhoods, loading },
   registerUpdateUser,
   togglePopup,
   loadUser,
   loadTowns,
   loadNeighbourhoods,
   getStudentNumber,
   clearNeighbourhoods,
   clearTowns,
}) => {
   const isOwner =
      userLogged.type === "admin" || userLogged.type === "admin&teacher";

   const isAdmin = userLogged.type === "secretary" || isOwner;

   const [adminValues, setAdminValues] = useState({
      popupType: "",
      previewSource: "",
      fileInputState: "",
      selectedFile: "",
   });

   const { popupType, previewSource, fileInputState, selectedFile } =
      adminValues;

   const [formData, setFormData] = useState({
      _id: match.params.user_id,
      studentnumber: "",
      name: "",
      lastname: "",
      email: "",
      tel: "",
      cel: "",
      type: "",
      dni: "",
      town: "",
      neighbourhood: "",
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
      chargeday: "",
      img: {
         public_id: "",
         url: "",
      },
      active: true,
   });

   const {
      _id,
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
      img,
      description,
      discount,
      chargeday,
      active,
   } = formData;

   useEffect(() => {
      if (loadingTowns) loadTowns();
   }, [loadTowns, loadingTowns, studentNumber]);

   useEffect(() => {
      if (studentNumber !== "")
         setFormData((prev) => ({ ...prev, studentnumber: studentNumber }));
      else if (_id === "0") getStudentNumber();
   }, [_id, getStudentNumber, studentNumber]);

   useEffect(() => {
      if (_id !== "0" && name === "") {
         if (loadingUser && userLogged._id !== _id) loadUser(_id, true);
         else {
            const user = userLogged._id !== _id ? otherUser : userLogged;

            if (user.town) loadNeighbourhoods(user.town._id);

            setFormData((prev) => {
               let oldUser = {};
               for (const x in prev) {
                  oldUser[x] = !user[x]
                     ? prev[x]
                     : x === "dob"
                     ? format(new Date(user.dob.slice(0, -1)), "yyyy-MM-dd")
                     : user[x];
               }
               return {
                  ...oldUser,
               };
            });
         }
      }
   }, [
      _id,
      loadUser,
      loadingUser,
      otherUser,
      loadNeighbourhoods,
      userLogged,
      name,
   ]);

   const onChange = (e) => {
      e.persist();
      setFormData({
         ...formData,
         [e.target.name]:
            e.target.type === "checkbox" ? e.target.checked : e.target.value,
      });
      if (e.target.name === "town") loadNeighbourhoods(e.target.value);
   };

   const onChangeImg = (e) => {
      e.persist();
      if (e.target.value) {
         const file = e.target.files[0];
         previewFile(file, e.target.value);
      }
   };

   const previewFile = (file, state) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
         setAdminValues({
            ...adminValues,
            previewSource: reader.result,
            selectedFile: file,
            fileInputState: state,
         });
      };
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

   const changeType = () => {
      switch (type) {
         case "student":
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
         case "teacher":
         case "secretary":
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
                  onChange={onChange}
               />
            );
         case "guardian":
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
         <PopUp
            confirm={() => {
               if (popupType === "save")
                  registerUpdateUser({
                     ...formData,
                     ...(selectedFile && { img: previewSource }),
                  });
               else setFormData((prev) => ({ ...prev, active: !active }));
            }}
            text={
               popupType === "save"
                  ? `¿Está seguro que desea ${
                       _id !== ""
                          ? "aplicar los cambios"
                          : "registrar al nuevo usuario"
                    }?`
                  : popupType === "active"
                  ? {
                       question: "¿Está seguro que desea inactivar al usuario?",
                       info: `No se le permitirá el ingreso a la página${
                          type === "student"
                             ? ", se borrarán notas, asistencias, cuotas, inscripción y se lo quitará de la clase."
                             : type === "teacher"
                             ? " y se borrarán todas las clases en las que está asignado como profesor."
                             : "."
                       }`,
                    }
                  : ""
            }
         />
         <div>
            <h2 className="mb-2">
               {_id === "" ? <FaUserPlus /> : <FaUserEdit />}
               &nbsp;
               {isAdmin
                  ? _id !== ""
                     ? "Editar Usuario"
                     : "Registrar Usuario Nuevo"
                  : "Editar Imágen"}
            </h2>

            {_id !== "" && !loadingUser && (
               <div className="btn-right mb-3">
                  <Link
                     to={`/user/credentials/${_id}`}
                     className="btn btn-primary"
                     onClick={() => {
                        window.scroll(0, 0);
                     }}
                  >
                     <FaUnlock />
                     &nbsp;Modificar credenciales
                  </Link>
               </div>
            )}
            <form
               onSubmit={(e) => {
                  e.preventDefault();
                  togglePopup();
                  setAdminValues((prev) => ({
                     ...prev,
                     popupType: "save",
                  }));
               }}
               className="form"
            >
               <h3 className="heading-tertiary text-lighter-primary">Datos:</h3>
               {isAdmin && (
                  <>
                     <div className="form-group">
                        <select
                           className="form-input"
                           name="type"
                           id="type"
                           disabled={!isAdmin}
                           value={type}
                           onChange={onChange}
                        >
                           <option value="">
                              * Seleccione el tipo de usuario
                           </option>
                           <option value="student">Alumno</option>
                           <option value="guardian">Tutor</option>
                           <option value="teacher">Profesor</option>
                           <option value="secretary">Secretaria</option>
                           {isOwner && (
                              <>
                                 <option value="admin">Administrador</option>
                                 <option value="admin&teacher">
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

                     {type === "student" && (
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

                     {isAdmin &&
                        (type === "student" ||
                           type === "secretary" ||
                           type === "teacher") && (
                           <div className="form-group">
                              <input
                                 className="form-input"
                                 type="number"
                                 value={dni}
                                 disabled={!isAdmin}
                                 onChange={onChange}
                                 name="dni"
                                 id="dni"
                                 placeholder="DNI"
                              />
                              <label htmlFor="dni" className="form-label">
                                 DNI
                              </label>
                           </div>
                        )}
                  </>
               )}

               <div className="form-group">
                  <input
                     type="text"
                     name="name"
                     id="name"
                     className="form-input"
                     disabled={!isAdmin}
                     value={name}
                     onChange={onChange}
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
                     onChange={onChange}
                     placeholder="Apellido"
                  />
                  <label htmlFor="lastname" className="form-label">
                     Apellido
                  </label>
               </div>
               {_id === "" && (
                  <div className="form-group">
                     <input
                        className="form-input"
                        type="text"
                        value={email}
                        name="email"
                        id="email"
                        onChange={onChange}
                        placeholder="Dirección de correo electrónico"
                     />
                     <label htmlFor="email" className="form-label">
                        Dirección de correo electrónico
                     </label>
                  </div>
               )}
               {isAdmin && (
                  <>
                     <div className="form-group">
                        <input
                           className="form-input"
                           type="tel"
                           name="tel"
                           id="tel"
                           value={tel}
                           onChange={onChange}
                           placeholder="Teléfono"
                        />
                        <label htmlFor="tel" className="form-label">
                           Teléfono
                        </label>
                     </div>
                     <div className="form-group">
                        <input
                           className="form-input"
                           type="tel"
                           name="cel"
                           id="cel"
                           value={cel}
                           onChange={onChange}
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
                              onChange={onChange}
                              checked={sex === "Femenino"}
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
                              onChange={onChange}
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
                     {type !== "guardian" && (
                        <div className="form-group">
                           <input
                              className="form-input"
                              type="date"
                              value={dob}
                              onChange={onChange}
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
                           onChange={onChange}
                           name="address"
                           id="address"
                           placeholder="Dirección"
                        />
                        <label htmlFor="address" className="form-label">
                           Dirección
                        </label>
                     </div>
                     <div className="border mb-4">
                        <div className="form-group">
                           <select
                              className="form-input"
                              name="town"
                              id="town"
                              value={town}
                              onChange={onChange}
                           >
                              <option value="">
                                 * Seleccione localidad donde vive
                              </option>
                              {towns.map((town) => (
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
                              onChange={onChange}
                           >
                              {!loading ? (
                                 <>
                                    {neighbourhoods.length === 0 ? (
                                       <option value="">
                                          Dicha localidad no tiene barrios
                                          adheridos
                                       </option>
                                    ) : (
                                       <>
                                          <option value="">
                                             * Seleccione barrio donde vive
                                          </option>
                                          {neighbourhoods.map(
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
                        {isOwner && (
                           <div className="btn-right townNeigh">
                              <div className="tooltip">
                                 <Link
                                    to="/user/towns-neighbourhoods/edit"
                                    className="btn btn-mix-secondary"
                                    onClick={() => {
                                       window.scroll(0, 0);
                                       clearNeighbourhoods();
                                       clearTowns();
                                    }}
                                 >
                                    <FaEdit />
                                 </Link>
                                 <span className="tooltiptext">
                                    Editar localidades y/o barrios
                                 </span>
                              </div>
                           </div>
                        )}
                     </div>
                     {changeType()}
                  </>
               )}

               {type !== "student" && type !== "guardian" && (
                  <div className="tooltip form">
                     <div className="form-group">
                        <textarea
                           className="form-input"
                           name="description"
                           id="description"
                           rows="4"
                           onChange={onChange}
                           value={description}
                           placeholder="Descripción"
                        ></textarea>
                        <label htmlFor="description" className="form-label">
                           Descripción
                        </label>
                     </div>
                     <span className="tooltiptext">
                        Descripción que aparecerá en la página "Acerca de
                        Nosotros"
                     </span>
                  </div>
               )}

               {_id !== "" && isAdmin && (
                  <div className="form-group my-3">
                     <input
                        className="form-checkbox"
                        onChange={(e) => {
                           if (!e.target.checked) togglePopup("active");
                           else
                              setFormData((prev) => ({
                                 ...prev,
                                 active: !active,
                              }));
                        }}
                        type="checkbox"
                        checked={active}
                        name="active"
                        id="active"
                     />
                     <label className="checkbox-lbl" htmlFor="active">
                        {active ? "Activo" : "Inactivo"}
                     </label>
                  </div>
               )}

               {_id !== "" && (
                  <>
                     <div className="text-center mt-3">
                        <img
                           className="round-img"
                           src={
                              previewSource
                                 ? previewSource
                                 : img.url !== ""
                                 ? img.url
                                 : "https://pngimage.net/wp-content/uploads/2018/06/no-user-image-png-3-300x200.png"
                           }
                           alt="chosen img"
                        />
                     </div>
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
                              <FaCloudUploadAlt />
                              &nbsp;Subir imágen
                           </span>
                        </div>
                     </div>
                  </>
               )}

               <div className="btn-center">
                  <button className="btn btn-primary" type="submit">
                     {_id !== "" ? <FaUserEdit /> : <FaUserPlus />}
                     &nbsp;{_id !== "" ? "Guardar Cambios" : "Registrar"}
                  </button>
               </div>
            </form>
         </div>
      </>
   );
};

const mapStateToProps = (state) => ({
   users: state.users,
   auth: state.auth,
   towns: state.towns,
   neighbourhoods: state.neighbourhoods,
   mixvalues: state.mixvalues,
});

export default connect(mapStateToProps, {
   registerUpdateUser,
   loadUser,
   loadTowns,
   loadNeighbourhoods,
   getStudentNumber,
   clearNeighbourhoods,
   clearTowns,
   togglePopup,
})(RegisterUser);
