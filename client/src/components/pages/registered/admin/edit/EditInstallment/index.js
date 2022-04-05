import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { FiSave } from "react-icons/fi";

import {
   loadInstallment,
   updateIntallment,
} from "../../../../../../actions/installment";
import { loadEnrollments } from "../../../../../../actions/enrollment";
import { loadUser } from "../../../../../../actions/user";
import { togglePopup } from "../../../../../../actions/global";

import PopUp from "../../../../../modal/PopUp";

const EditInstallment = ({
   match,
   users: { user, loadingUser },
   installments: { installment, loadingInstallment, installments },
   enrollments: { enrollments, loading },
   loadInstallment,
   loadEnrollments,
   loadUser,
   updateIntallment,
   togglePopup,
}) => {
   const _id = match.params.item_id;
   const type = match.params.type;

   const thisYear = new Date().getFullYear();
   const yearArray = new Array(6)
      .fill()
      .map((item, index) => thisYear + 1 - index);

   const [formData, setformData] = useState({
      _id: "",
      year: "",
      number: "",
      value: "",
      expired: false,
      student: null,
      updatable: true,
      enrollment: "",
   });

   const { year, number, value, expired, student, updatable, enrollment } =
      formData;

   useEffect(() => {
      if (type === "new") {
         if (loadingUser) loadUser(_id, false);
         else setformData((prev) => ({ ...prev, student: user }));
      } else {
         if (loadingInstallment) loadInstallment(_id, true);
         else {
            if (installment)
               setformData((prev) => {
                  let oldInstallment = {};
                  for (const x in prev) {
                     oldInstallment[x] = !installment[x]
                        ? prev[x]
                        : installment[x];
                  }
                  return {
                     ...oldInstallment,
                     updatable: installment.updatable,
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

   useEffect(() => {
      if (student && year !== "" && loading) {
         loadEnrollments(
            { student: student._id ? student._id : student, year },
            false
         );
      }
      // eslint-disable-next-line
   }, [loadEnrollments, year, loading]);

   const onChange = (e) => {
      e.persist();
      setformData({
         ...formData,
         [e.target.name]:
            e.target.type === "checkbox"
               ? e.target.checked
               : isNaN(e.target.value)
               ? e.target.value
               : Number(e.target.value),
      });
   };

   const installmentNames = () => {
      return "Inscripción,Clases Particulares,Examen Libre,Marzo,Abril,Mayo,Junio,Julio,Agosto,Septiembre,Octubre,Noviembre,Diciembre"
         .split(",")
         .map((item, index) => (
            <option key={index} value={index}>
               {item}
            </option>
         ));
   };

   return (
      <>
         <PopUp
            info="¿Está seguro que desea guardar los cambios?"
            confirm={() => {
               updateIntallment(
                  {
                     ...formData,
                     ...(type === "new" && { student: student._id }),
                     ...((number === "1" || number === "2") && {
                        expired: true,
                        updatable: false,
                     }),
                  },
                  installments.length > 0
               );
            }}
         />
         <h2>{type === "edit" ? "Editar Cuota" : "Crear Cuota"}</h2>
         <form
            className="form"
            onSubmit={(e) => {
               e.preventDefault();
               togglePopup("default");
            }}
         >
            <p className="heading-tertiary btn-end name">
               <span className="text-dark">Alumno: </span> &nbsp;
               {student && `${student.lastname} ${student.name}`}
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
                  <option value="">* Seleccione el Año</option>
                  {yearArray.map((item) => (
                     <option key={item} value={item}>
                        {item}
                     </option>
                  ))}
               </select>
               <label
                  htmlFor="year"
                  className={`form-label ${year === "" ? "lbl" : ""}`}
               >
                  Año
               </label>
            </div>
            <div className="form-group">
               <select
                  className="form-input"
                  disabled={enrollments.length === 0}
                  name="enrollment"
                  id="enrollment"
                  onChange={onChange}
                  value={enrollment}
               >
                  <option value="">
                     {enrollments.length === 0
                        ? "No hay inscripción vinculada"
                        : "* Seleccione la inscripción vinculada"}
                  </option>
                  {enrollments.map((item) => (
                     <option key={item._id} value={item._id}>
                        {item.category.name}
                     </option>
                  ))}
               </select>
               <label
                  htmlFor="enrollment"
                  className={`form-label ${enrollment === "" ? "lbl" : ""}`}
               >
                  Inscripción vinculada
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
                  {installmentNames()}
               </select>
               <label
                  htmlFor="number"
                  className={`form-label ${number === "" ? "lbl" : ""}`}
               >
                  Cuota
               </label>
            </div>
            <div className="form-group">
               <input
                  className="form-input"
                  type="text"
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
            {number !== 1 && number !== 2 && (
               <>
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
                        checked={updatable}
                        onChange={onChange}
                        name="updatable"
                        id="updatable"
                     />
                     <label className="checkbox-lbl" htmlFor="updatable">
                        {!updatable ? "No Actualizar" : "Permitir actualizar"}
                     </label>
                  </div>
               </>
            )}

            <div className="btn-center py-2">
               <button type="submit" className="btn btn-primary">
                  <FiSave />
                  &nbsp;Guardar
               </button>
               {student && (
                  <Link
                     className="btn btn-danger"
                     to={`/index/installments/${student._id}`}
                  >
                     Cancelar
                  </Link>
               )}
            </div>
         </form>
      </>
   );
};

const mapStateToProps = (state) => ({
   users: state.users,
   installments: state.installments,
   enrollments: state.enrollments,
});

export default connect(mapStateToProps, {
   loadInstallment,
   loadEnrollments,
   loadUser,
   updateIntallment,
   togglePopup,
})(EditInstallment);
