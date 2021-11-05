import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { FaTrashAlt } from "react-icons/fa";
import { FiSave } from "react-icons/fi";

import {
   loadInstallment,
   updateIntallment,
   deleteInstallment,
} from "../../../../../../actions/installment";
import { loadUser } from "../../../../../../actions/user";

import PopUp from "../../../../../modal/PopUp";

const EditInstallment = ({
   match,
   users: { user, loadingUser },
   loadInstallment,
   loadUser,
   updateIntallment,
   deleteInstallment,
   installments: { installment, loading },
}) => {
   const [formData, setformData] = useState({
      year: 0,
      number: "",
      value: "",
      expired: false,
      student: "",
      halfPayed: false,
   });

   const [adminValues, setAdminValues] = useState({
      toggleModalDelete: false,
      toggleModalSave: false,
   });

   const { toggleModalDelete, toggleModalSave } = adminValues;

   const { year, number, value, expired, student, halfPayed } = formData;

   const _id = match.params.installment_id;

   const day = moment();
   const thisYear = day.year();

   useEffect(() => {
      if (_id === "0")
         if (loadingUser) loadUser(_id);
         else if (loading) loadInstallment(_id);

      if (!loading || !loadingUser)
         setformData((prev) => ({
            ...prev,
            ...(_id === "0"
               ? {
                    student: user,
                 }
               : {
                    year: installment.year,
                    number: installment.number,
                    value: installment.value,
                    expired: installment.expired,
                    student: installment.student,
                    halfPayed: installment.halfPayed
                       ? installment.halfPayed
                       : false,
                 }),
         }));
   }, [
      loadInstallment,
      loadUser,
      loading,
      loadingUser,
      installment,
      user,
      _id,
   ]);

   const onChange = (e) => {
      setformData({
         ...formData,
         [e.target.name]:
            e.target.type !== "checkbox" ? e.target.value : e.target.checked,
      });
   };

   return (
      <>
         <PopUp
            text="¿Está seguro que desea eliminar la cuota?"
            confirm={() => deleteInstallment(_id, student._id)}
            setToggleModal={() =>
               setAdminValues((prev) => ({
                  ...prev,
                  toggleModalDelete: !toggleModalDelete,
               }))
            }
            toggleModal={toggleModalDelete}
         />
         <PopUp
            text="¿Está seguro que desea guardar los cambios?"
            confirm={() =>
               updateIntallment(formData, student._id, _id !== "0" && _id)
            }
            setToggleModal={() =>
               setAdminValues((prev) => ({
                  ...prev,
                  toggleModalSave: !toggleModalSave,
               }))
            }
            toggleModal={toggleModalSave}
         />
         <h2>{_id === "0" ? "Editar Cuota" : "Crear Cuota"}</h2>
         <form
            className="form"
            onSubmit={(e) => {
               e.preventDefault();
               setAdminValues({ ...adminValues, toggleModalSave: true });
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
                  disabled={_id !== "0"}
                  onChange={onChange}
                  value={year}
               >
                  <option value={0}>* Seleccione el Año</option>
                  <option value={thisYear + 1}>{thisYear + 1}</option>
                  <option value={thisYear}>{thisYear}</option>
                  <option value={thisYear - 1}>{thisYear - 1}</option>
                  <option value={thisYear - 2}>{thisYear - 2}</option>
                  <option value={thisYear - 3}>{thisYear - 3}</option>
                  <option value={thisYear - 4}>{thisYear - 4}</option>
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
                  disabled={_id !== "0"}
                  onChange={onChange}
               >
                  <option value="">* Seleccione la cuota</option>
                  <option value={0}>Inscripción</option>
                  <option value={3}>Marzo</option>
                  <option value={4}>Abril</option>
                  <option value={5}>Mayo</option>
                  <option value={6}>Junio</option>
                  <option value={7}>Julio</option>
                  <option value={8}>Agosto</option>
                  <option value={9}>Septiembre</option>
                  <option value={10}>Octubre</option>
                  <option value={11}>Noviembre</option>
                  <option value={12}>Diciembre</option>
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
                           toggleModalDelete: !toggleModalDelete,
                        });
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
})(EditInstallment);
