import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import getYear from "date-fns/getYear";
import { FaTrashAlt } from "react-icons/fa";
import { FiSave } from "react-icons/fi";

import {
   loadInstallment,
   updateIntallment,
   deleteInstallment,
} from "../../../../../../actions/installment";
import { loadUser } from "../../../../../../actions/user";
import { togglePopup } from "../../../../../../actions/mixvalues";

import PopUp from "../../../../../modal/PopUp";

const EditInstallment = ({
   match,
   users: { user, loadingUser },
   loadInstallment,
   loadUser,
   updateIntallment,
   togglePopup,
   deleteInstallment,
   installments: { installment, loadingInstallment },
}) => {
   const [formData, setformData] = useState({
      _id: "",
      year: 0,
      number: "",
      value: "",
      expired: false,
      student: "",
      halfPayed: false,
   });
   const _id = match.params.item_id;
   const type = match.params.type;

   const day = new Date();
   const thisYear = getYear(day);
   const yearArray = new Array(6)
      .fill()
      .map((item, index) => thisYear + 1 - index);

   const [adminValues, setAdminValues] = useState({
      popupType: "",
   });

   const { popupType } = adminValues;

   const { year, number, value, expired, student, halfPayed } = formData;

   useEffect(() => {
      if (type === "new") {
         if (loadingUser) loadUser(_id, false);
         else setformData((prev) => ({ ...prev, student: user }));
      } else {
         if (loadingInstallment) loadInstallment(_id, false, true);
         else {
            setformData((prev) => {
               let oldInstallment = {};
               for (const x in prev) {
                  oldInstallment[x] = !installment[x]
                     ? prev[x]
                     : installment[x];
               }
               return {
                  ...oldInstallment,
               };
            });
         }
      }
   }, [
      loadInstallment,
      loadUser,
      loadingInstallment,
      loadingUser,
      installment,
      user,
      _id,
      type,
   ]);

   const onChange = (e) => {
      e.persist();
      setformData({
         ...formData,
         [e.target.name]:
            e.target.type !== "checkbox" ? e.target.value : e.target.checked,
      });
   };

   const installmentNames = () => {
      return "Inscripción,,,Marzo,Abril,Mayo,Junio,Julio,Agosto,Septiembre,Octubre,Noviembre,Diciembre"
         .split(",")
         .map((item, index) => (
            <React.Fragment key={index}>
               {item !== "" && <option value={index}>{item}</option>}
            </React.Fragment>
         ));
   };

   return (
      <>
         <PopUp
            text={`¿Está seguro que desea ${
               popupType === "save"
                  ? "guardar los cambios"
                  : "eliminar la cuota"
            }?`}
            confirm={() => {
               if (popupType === "save")
                  updateIntallment({
                     ...formData,
                     ...(type === "new" && { student: student._id }),
                  });
               else deleteInstallment(_id, student._id);
            }}
         />
         <h2>{type === "edit" ? "Editar Cuota" : "Crear Cuota"}</h2>
         <form
            className="form"
            onSubmit={(e) => {
               e.preventDefault();
               setAdminValues({ ...adminValues, popupType: "save" });
               togglePopup("default");
            }}
         >
            <p className="heading-tertiary">
               <span className="text-dark">Alumno:</span>
               &nbsp;&nbsp;&nbsp;
               {student !== "" && `${student.lastname} ${student.name}`}
            </p>
            <div className="form-group">
               <select
                  className="form-input"
                  name="year"
                  id="year"
                  disabled={type === "edit"}
                  onChange={onChange}
                  value={year}
               >
                  <option value={0}>* Seleccione el Año</option>
                  {yearArray.map((item) => (
                     <option key={item} value={item}>
                        {item}
                     </option>
                  ))}
               </select>
               <label
                  htmlFor="year"
                  className={`form-label ${year === 0 ? "lbl" : ""}`}
               >
                  Año
               </label>
            </div>
            <div className="form-group">
               <select
                  className="form-input"
                  value={number}
                  name="number"
                  id="number"
                  disabled={type === "edit"}
                  onChange={onChange}
               >
                  <option value="">* Seleccione la cuota</option>
                  <option value={0}>Inscripción</option>
                  {installmentNames()}
               </select>
               <label
                  htmlFor="number"
                  className={`form-label ${number === 1 ? "lbl" : ""}`}
               >
                  Cuota
               </label>
            </div>
            <div className="form-group">
               <input
                  className="form-input"
                  type="number"
                  id="value"
                  onChange={onChange}
                  name="value"
                  placeholder="Valor"
                  value={value}
               />
               <label htmlFor="value" className="form-label">
                  Valor
               </label>
            </div>
            <div className="form-group">
               <input
                  className="form-checkbox"
                  type="checkbox"
                  checked={expired}
                  onChange={onChange}
                  name="expired"
                  id="expired"
               />
               <label className="checkbox-lbl" htmlFor="expired">
                  {expired ? "Vencida" : "Vigente"}
               </label>
            </div>
            <div className="form-group">
               <input
                  className="form-checkbox"
                  type="checkbox"
                  checked={halfPayed}
                  onChange={onChange}
                  name="halfPayed"
                  id="halfPayed"
               />
               <label className="checkbox-lbl" htmlFor="halfPayed">
                  {halfPayed ? "No Actualizar" : "Permitir actualizar"}
               </label>
            </div>
            <div className="btn-center py-2">
               <button type="submit" className="btn btn-primary">
                  <FiSave />
                  &nbsp;Guardar
               </button>
               {_id !== "0" && (
                  <button
                     type="button"
                     onClick={(e) => {
                        e.preventDefault();
                        setAdminValues({
                           ...adminValues,
                           popupType: "delete",
                        });
                        togglePopup("default");
                     }}
                     className="btn btn-danger"
                  >
                     <FaTrashAlt />
                     &nbsp;Eliminar
                  </button>
               )}
            </div>
         </form>
      </>
   );
};

const mapStateToProps = (state) => ({
   users: state.users,
   installments: state.installments,
});

export default connect(mapStateToProps, {
   loadInstallment,
   loadUser,
   deleteInstallment,
   updateIntallment,
   togglePopup,
})(EditInstallment);
