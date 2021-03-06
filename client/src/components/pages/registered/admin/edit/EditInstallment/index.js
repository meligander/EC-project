import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import moment from "moment";
import PropTypes from "prop-types";

import {
   loadInstallment,
   updateIntallment,
   deleteInstallment,
} from "../../../../../../actions/installment";
import { loadUser } from "../../../../../../actions/user";

import Loading from "../../../../../modal/Loading";
import PopUp from "../../../../../modal/PopUp";

const EditInstallment = ({
   match,
   history,
   users,
   loadInstallment,
   loadUser,
   updateIntallment,
   deleteInstallment,
   installments: { installment, loading },
}) => {
   const [formData, setformData] = useState({
      year: 0,
      number: 1,
      value: "",
      expired: false,
      student: "",
      halfPayed: false,
   });

   const [otherValues, setOtherValues] = useState({
      toggleModalDelete: false,
      toggleModalSave: false,
   });

   const { toggleModalDelete, toggleModalSave } = otherValues;

   const { year, number, value, expired, student, halfPayed } = formData;

   const _id = match.params.installment_id;

   const edit = match.params.type === "1";

   const day = moment();
   const thisYear = day.year();

   useEffect(() => {
      const loadEditData = () => {
         setformData({
            year: installment.year,
            number: installment.number,
            value: installment.value,
            expired: installment.expired,
            student: installment.student,
            halfPayed: installment.halfPayed ? installment.halfPayed : false,
         });
      };
      const loadNewData = () => {
         setformData((prev) => ({
            ...prev,
            student: users.user,
         }));
      };
      if (edit) {
         if (loading) loadInstallment(_id);
         else loadEditData();
      } else {
         if (users.loading) loadUser(_id);
         else loadNewData();
      }
   }, [
      loadInstallment,
      loadUser,
      loading,
      match.params,
      installment,
      users,
      _id,
      edit,
   ]);

   const onChange = (e) => {
      setformData({
         ...formData,
         [e.target.name]: e.target.value,
      });
   };

   const onChangeCheckbox = (e) => {
      setformData({
         ...formData,
         [e.target.name]: e.target.checked,
      });
   };

   const confirm = () => {
      updateIntallment(
         {
            ...formData,
            value: value !== "" ? value : 0,
            number: number === 1 ? 0 : number,
         },
         history,
         student._id,
         edit && _id
      );
   };

   const setToggle = () => {
      setOtherValues({
         ...otherValues,
         toggleModalSave: false,
         toggleModalDelete: false,
      });
   };

   return (
      <>
         {(!loading && edit) || (!edit && !users.loading) ? (
            <>
               <PopUp
                  text="¿Está seguro que desea eliminar la cuota?"
                  confirm={() => deleteInstallment(_id, history, student._id)}
                  setToggleModal={setToggle}
                  toggleModal={toggleModalDelete}
               />
               <PopUp
                  text="¿Está seguro que desea guardar los cambios?"
                  confirm={confirm}
                  setToggleModal={setToggle}
                  toggleModal={toggleModalSave}
               />
               <h2>{edit ? "Editar Cuota" : "Crear Cuota"}</h2>
               <form
                  className="form"
                  onSubmit={(e) => {
                     e.preventDefault();
                     setOtherValues({ ...otherValues, toggleModalSave: true });
                  }}
               >
                  <p className="heading-tertiary">
                     <span className="text-dark">Alumno:</span>
                     &nbsp;&nbsp;&nbsp;
                     {student.lastname + ", " + student.name}
                  </p>
                  <div className="form-group">
                     <select
                        className="form-input"
                        name="year"
                        id="year"
                        disabled={edit}
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
                        disabled={edit}
                        onChange={onChange}
                     >
                        <option value={1}>* Seleccione la cuota</option>
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
                        onChange={(e) => onChangeCheckbox(e)}
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
                        onChange={(e) => onChangeCheckbox(e)}
                        name="halfPayed"
                        id="halfPayed"
                     />
                     <label className="checkbox-lbl" htmlFor="halfPayed">
                        {halfPayed ? "No Actualizar" : "Permitir actualizar"}
                     </label>
                  </div>
                  <div className="btn-ctr py-2">
                     <button type="submit" className="btn btn-primary">
                        <i className="far fa-save"></i>&nbsp; Guardar
                     </button>
                     {edit && (
                        <button
                           type="button"
                           onClick={(e) => {
                              e.preventDefault();
                              setOtherValues({
                                 ...otherValues,
                                 toggleModalDelete: true,
                              });
                           }}
                           className="btn btn-danger"
                        >
                           <i className="far fa-trash-alt"></i>&nbsp; Eliminar
                        </button>
                     )}
                  </div>
               </form>
            </>
         ) : (
            <Loading />
         )}
      </>
   );
};

EditInstallment.propTypes = {
   installment_id: PropTypes.string,
   users: PropTypes.object.isRequired,
   installments: PropTypes.object.isRequired,
   loadInstallment: PropTypes.func.isRequired,
   loadUser: PropTypes.func.isRequired,
   deleteInstallment: PropTypes.func.isRequired,
   updateIntallment: PropTypes.func.isRequired,
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
})(withRouter(EditInstallment));
