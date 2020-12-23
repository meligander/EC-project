import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import moment from "moment";
import PropTypes from "prop-types";

import {
   loadInstallment,
   updateIntallment,
   deleteInstallment,
} from "../../../../../actions/installment";
import { loadUser } from "../../../../../actions/user";

import Loading from "../../../../modal/Loading";
import Confirm from "../../../../modal/Confirm";

const EditInstallment = ({
   match,
   history,
   users,
   loadInstallment,
   loadUser,
   updateIntallment,
   deleteInstallment,
   installment: { installment, loading },
}) => {
   const [formData, setformData] = useState({
      year: 0,
      number: 1,
      value: "",
      expired: false,
      student: "",
   });

   const [otherValues, setOtherValues] = useState({
      toggleModalDelete: false,
      toggleModalSave: false,
   });

   const { toggleModalDelete, toggleModalSave } = otherValues;

   const { year, number, value, expired, student } = formData;

   const _id = match.params.id;
   const yearParams = match.params.year;

   const edit = yearParams !== "0";

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
         });
      };
      const loadNewData = () => {
         setformData({
            value: "",
            expired: false,
            student: users.user,
            number: match.params.number,
            year: yearParams,
         });
      };
      if (!yearParams) {
         if (loading) loadInstallment(_id);
         else loadEditData();
      } else {
         if (users.loading) loadUser(_id);
         else if (yearParams !== "0") loadNewData();
      }
   }, [
      loadInstallment,
      loadUser,
      loading,
      match.params,
      installment,
      users,
      _id,
      yearParams,
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
         expired: e.target.checked,
      });
   };

   const onSubmit = () => {
      if (yearParams) updateIntallment(formData, history, student._id);
      else updateIntallment(formData, history, student._id, _id);
   };

   const setToggleDelete = (e) => {
      if (e) e.preventDefault();
      setOtherValues({
         ...otherValues,
         toggleModalDelete: !toggleModalDelete,
      });
   };

   const setToggleSave = (e) => {
      if (e) e.preventDefault();
      setOtherValues({
         ...otherValues,
         toggleModalSave: !toggleModalSave,
      });
   };

   const onDelete = () => {
      deleteInstallment(_id, history, student._id);
   };

   return (
      <>
         {!loading || (yearParams && !users.loading) ? (
            <>
               <Confirm
                  text="¿Está seguro que desea eliminar la cuota?"
                  confirm={onDelete}
                  setToggleModal={setToggleDelete}
                  toggleModal={toggleModalDelete}
               />
               <Confirm
                  text="¿Está seguro que desea guardar los cambios?"
                  confirm={onSubmit}
                  setToggleModal={setToggleSave}
                  toggleModal={toggleModalSave}
               />
               <h2>{edit ? "Editar Cuota" : "Crear Cuota"}</h2>
               <form className="form">
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
                        <option value={thisYear - 1}>{thisYear - 1}</option>
                        <option value={thisYear}>{thisYear}</option>
                        <option value={thisYear + 1}>{thisYear + 1}</option>
                     </select>
                     <label
                        htmlFor="year"
                        className={`form-label ${
                           year === "" || year === "0" ? "lbl" : ""
                        }`}
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
                        <option value="1">* Seleccione la cuota</option>
                        <option value="0">Inscripción</option>
                        <option value="3">Marzo</option>
                        <option value="4">Abril</option>
                        <option value="5">Mayo</option>
                        <option value="6">Junio</option>
                        <option value="7">Julio</option>
                        <option value="8">Agosto</option>
                        <option value="9">Septiembre</option>
                        <option value="10">Octubre</option>
                        <option value="11">Noviembre</option>
                        <option value="12">Diciembre</option>
                     </select>
                     <label
                        htmlFor="number"
                        className={`form-label ${
                           number === "" || number === "1" ? "lbl" : ""
                        }`}
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
                        onChange={onChangeCheckbox}
                        name="expired"
                        id="cb1"
                     />
                     <label className="checkbox-lbl" htmlFor="cb1">
                        {expired ? "Vencida" : "Vigente"}
                     </label>
                  </div>
                  <div className="btn-ctr py-2">
                     <button
                        type="submit"
                        onClick={setToggleSave}
                        className="btn btn-primary"
                     >
                        <i className="far fa-save"></i>&nbsp; Guardar
                     </button>
                     {!yearParams && (
                        <button
                           type="submit"
                           onClick={setToggleDelete}
                           className="btn btn-danger"
                        >
                           <i className="fas fa-trash"></i>&nbsp; Eliminar
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
   installment: PropTypes.object.isRequired,
   loadInstallment: PropTypes.func.isRequired,
   loadUser: PropTypes.func.isRequired,
   deleteInstallment: PropTypes.func.isRequired,
   updateIntallment: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   users: state.users,
   installment: state.installment,
});

export default connect(mapStateToProps, {
   loadInstallment,
   loadUser,
   deleteInstallment,
   updateIntallment,
})(withRouter(EditInstallment));
