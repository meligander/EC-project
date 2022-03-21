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
   FaPlus,
   FaTimes,
} from "react-icons/fa";

//Actions
import {
   registerUpdateUser,
   loadUser,
   getStudentNumber,
   clearSearch,
   clearProfile,
} from "../../../../../../actions/user";
import { loadTowns, clearTowns } from "../../../../../../actions/town";
import {
   loadNeighbourhoods,
   clearNeighbourhoods,
} from "../../../../../../actions/neighbourhood";
import { setAlert } from "../../../../../../actions/alert";
import { togglePopup } from "../../../../../../actions/global";

import PopUp from "../../../../../modal/PopUp";
import TutorInfo from "./usersInfo/TutorInfo";
import EmployeeInfo from "./usersInfo/EmployeeInfo";
import StudentInfo from "./usersInfo/StudentInfo";

import "./style.scss";
import StateInfo from "./usersInfo/StateInfo";

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
   setAlert,
   clearNeighbourhoods,
   clearTowns,
   clearSearch,
   clearProfile,
}) => {
   const isOwner =
      userLogged.type === "admin" || userLogged.type === "admin&teacher";

   const isAdmin = userLogged.type === "secretary" || isOwner;

   const _id = match.params.user_id;

   const [adminValues, setAdminValues] = useState({
      popupType: "",
      previewSource: "",
      fileInputState: "",
      selectedFile: "",
   });

   const { popupType, previewSource, fileInputState, selectedFile } =
      adminValues;

   const [formData, setFormData] = useState({
      _id: "",
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
      relatedCellphones: [],
      discount: "",
      chargeday: "",
      img: {
         public_id: "",
         url: "",
      },
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
      relatedCellphones,
      img,
      discount,
      chargeday,
      active,
   } = formData;

   useEffect(() => {
      if (loadingTowns) loadTowns(false);
   }, [loadTowns, loadingTowns]);

   useEffect(() => {
      if (_id !== "0" && (userLogged._id === _id || !loadingUser)) {
         const user = userLogged._id !== _id ? otherUser : userLogged;
         if (user.town && loading) loadNeighbourhoods(user.town._id, false);
      }
   }, [userLogged, otherUser, loading, loadNeighbourhoods, _id, loadingUser]);

   useEffect(() => {
      if (_id === "0") {
         if (studentNumber === "") getStudentNumber();
         else
            setFormData((prev) => ({ ...prev, studentnumber: studentNumber }));
      }
   }, [_id, getStudentNumber, studentNumber]);

   useEffect(() => {
      if (_id !== "0" && formData._id === "") {
         if (loadingUser && userLogged._id !== _id) loadUser(_id, true);
         else {
            const user = userLogged._id !== _id ? otherUser : userLogged;
            setFormData((prev) => {
               let oldUser = {};
               for (const x in prev) {
                  oldUser[x] = !user[x]
                     ? prev[x]
                     : x === "dob"
                     ? format(new Date(user.dob.slice(0, -1)), "yyyy-MM-dd")
                     : x === "town" || x === "neighbourhood"
                     ? user[x]._id
                     : user[x];
               }
               return {
                  ...oldUser,
                  discount: user.discount,
                  active: user.active,
               };
            });
         }
      }
   }, [_id, loadUser, loadingUser, otherUser, userLogged, formData._id]);

   const onChange = (e, index) => {
      e.persist();
      if (e.target.id !== "relatedCellphones") {
         if (e.target.name !== "dni" || !isNaN(e.target.value)) {
            setFormData({
               ...formData,
               [e.target.name]:
                  e.target.type === "checkbox"
                     ? e.target.checked
                     : e.target.value,
               ...(e.target.name === "town" && { neighbourhood: "" }),
            });
            if (e.target.name === "town")
               loadNeighbourhoods(e.target.value, true);
         }
      } else {
         let newArray = [...relatedCellphones];
         newArray[index][e.target.name] = e.target.value;

         setFormData((prev) => ({ ...prev, relatedCellphones: newArray }));
      }
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
      if (!student) {
         setAlert("Busque un alumno para agregar", "danger", "3");
      } else {
         if (add) {
            if (!children.some((item) => item._id === student._id)) {
               children.push(student);
               clearSearch();
            } else setAlert("El alumno ya ha sido agregado", "danger", "3");
         } else {
            setFormData({
               ...formData,
               children: children.filter((child) => child._id !== student._id),
            });
         }
      }
   };

   const newCellphone = () => {
      setFormData((prev) => ({
         ...prev,
         relatedCellphones: [
            ...relatedCellphones,
            {
               relation: "",
               name: "",
               cel: "",
            },
         ],
      }));
   };

   const changeType = () => {
      switch (type) {
         case "student":
            return (
               <>
                  <StateInfo
                     isAdmin={isAdmin}
                     birthprov={birthprov}
                     birthtown={birthtown}
                     onChange={onChange}
                  />
                  <StudentInfo
                     isAdmin={isAdmin}
                     discount={discount}
                     chargeday={chargeday}
                     onChange={onChange}
                  />
               </>
            );
         case "teacher":
         case "secretary":
            return (
               <>
                  <StateInfo
                     isAdmin={isAdmin}
                     birthprov={birthprov}
                     birthtown={birthtown}
                     onChange={onChange}
                  />
                  <EmployeeInfo
                     type={type}
                     userType={userLogged.type}
                     degree={degree}
                     salary={salary}
                     school={school}
                     onChange={onChange}
                  />
               </>
            );
         case "guardian":
            return (
               <TutorInfo
                  isAdmin={isAdmin}
                  setChildren={setChildren}
                  children={children}
                  clearProfile={clearProfile}
                  clearSearch={clearSearch}
                  setAlert={setAlert}
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
                  registerUpdateUser(
                     {
                        ...formData,
                        ...(type === "guardian" && {
                           children: children.map((child) => child._id),
                        }),
                        ...(selectedFile && { img: previewSource }),
                        ...(relatedCellphones.length > 0 && {
                           relatedCellphones,
                        }),
                     },
                     userLogged._id
                  );
               else setFormData((prev) => ({ ...prev, active: !active }));
            }}
            info={
               popupType === "save"
                  ? `¿Está seguro que desea ${
                       _id !== "0"
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
               {_id === "0" ? <FaUserPlus /> : <FaUserEdit />}
               &nbsp;
               {isAdmin
                  ? _id !== "0"
                     ? "Editar Usuario"
                     : "Registrar Usuario Nuevo"
                  : "Editar Imágen"}
            </h2>
            {_id !== "0" && (
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
                  setAdminValues((prev) => ({
                     ...prev,
                     popupType: "save",
                  }));
                  togglePopup("default");
               }}
               className="form register-user"
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
                                 type="text"
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
               {_id === "0" && (
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
                     <div
                        className={`form-group${
                           type === "student" ? "mb-0" : ""
                        }`}
                     >
                        <input
                           className="form-input"
                           type="tel"
                           name="cel"
                           id="cel"
                           value={cel}
                           onChange={onChange}
                           placeholder={`Celular${
                              type === "student" ? " Propio" : ""
                           }`}
                        />
                        <label htmlFor="cel" className="form-label">
                           Celular{type === "student" ? " Propio" : ""}
                        </label>
                     </div>
                     {type === "student" && (
                        <div className="btn-right">
                           <button
                              className="btn btn-tertiary"
                              type="button"
                              onClick={newCellphone}
                           >
                              <FaPlus />
                              <span className="hide-sm">&nbsp;Celular</span>
                           </button>
                        </div>
                     )}
                     {relatedCellphones.length > 0 &&
                        relatedCellphones.map((item, index) => (
                           <div className="border mt-1" key={index}>
                              <div className="btn-right">
                                 <button
                                    className="btn btn-cancel"
                                    type="button"
                                    onClick={() => {
                                       const newArray = [...relatedCellphones];
                                       newArray.splice(index, 1);

                                       setFormData((prev) => ({
                                          ...prev,
                                          relatedCellphones: newArray,
                                       }));
                                    }}
                                 >
                                    <FaTimes />
                                 </button>
                              </div>
                              <div className="form-group">
                                 <div className="two-in-row">
                                    <select
                                       className="form-input"
                                       name="relation"
                                       id="relatedCellphones"
                                       value={item.relation}
                                       onChange={(e) => onChange(e, index)}
                                    >
                                       <option value="">
                                          * Seleccione la relación con el alumno
                                       </option>
                                       <option value="mother">Mamá</option>
                                       <option value="father">Papá</option>
                                       <option value="grandmother">
                                          Abuela
                                       </option>
                                       <option value="grandfather">
                                          Abuelo
                                       </option>
                                       <option value="aunt">Tía</option>
                                       <option value="uncle">Tío</option>
                                       <option value="sibling">
                                          Hermano/a
                                       </option>
                                       <option value="other">Otro</option>
                                    </select>
                                    <input
                                       className="form-input"
                                       type="text"
                                       name="name"
                                       id="relatedCellphones"
                                       value={item.name}
                                       placeholder="Nombre"
                                       onChange={(e) => onChange(e, index)}
                                    />
                                 </div>
                                 <div className="two-in-row">
                                    <label
                                       className={`form-label ${
                                          item.relation === "" ? "lbl" : ""
                                       }`}
                                    >
                                       Relación
                                    </label>
                                    <label
                                       className={`form-label ${
                                          item.name === "" ? "lbl" : ""
                                       }`}
                                    >
                                       Nombre
                                    </label>
                                 </div>
                              </div>
                              <div className="form-group mb-0">
                                 <input
                                    className="form-input"
                                    type="text"
                                    name="cel"
                                    id="relatedCellphones"
                                    onChange={(e) => onChange(e, index)}
                                    value={item.cel}
                                    placeholder="Celular"
                                 />
                                 <label
                                    htmlFor="address"
                                    className="form-label"
                                 >
                                    Celular
                                 </label>
                              </div>
                           </div>
                        ))}
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
                              max={`${new Date().getFullYear()}-01-01`}
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
                     <div className={isOwner ? "border mb-4" : ""}>
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
                              {!loadingTowns &&
                                 towns.map((town) => (
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
                                 <option value="">
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
                           <div className="btn-right">
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

               {_id !== "0" && isAdmin && (
                  <div className="form-group my-3">
                     <input
                        className="form-checkbox"
                        onChange={(e) => {
                           if (!e.target.checked) {
                              setAdminValues((prev) => ({
                                 ...prev,
                                 popupType: "active",
                              }));
                              togglePopup("active");
                           } else
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

               {_id !== "0" && (
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
                     {_id !== "0" ? <FaUserEdit /> : <FaUserPlus />}
                     &nbsp;{_id !== "0" ? "Guardar Cambios" : "Registrar"}
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
   global: state.global,
});

export default connect(mapStateToProps, {
   registerUpdateUser,
   loadUser,
   loadTowns,
   loadNeighbourhoods,
   getStudentNumber,
   setAlert,
   clearNeighbourhoods,
   clearTowns,
   clearProfile,
   clearSearch,
   togglePopup,
})(RegisterUser);
