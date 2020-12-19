import React, { useState } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { closeRegister } from "../../../../../../actions/register";
import PropTypes from "prop-types";

import Confirm from "../../../../../modal/Confirm";

import "./style.scss";

const RegisterTab = ({
   history,
   register,
   closeRegister,
   auth: { userLogged },
}) => {
   const [formData, setFormData] = useState({
      difference: "",
      negative: true,
      description: "",
   });

   const [toggleModal, setToggleModal] = useState(false);

   const { difference, negative, description } = formData;

   const onChange = (e) => {
      setFormData({
         ...formData,
         [e.target.name]: e.target.value,
      });
   };

   const setToggle = () => {
      setToggleModal(!toggleModal);
   };

   const onChangeCheckBox = (e) => {
      setFormData({
         ...formData,
         negative: e.target.checked,
      });
   };

   const onClick = () => {
      closeRegister(formData, userLogged._id, history);
   };

   return (
      <div className="register register-tab">
         <Confirm
            toggleModal={toggleModal}
            setToggleModal={setToggle}
            confirm={onClick}
            text="¿Está seguro que desea cerrar la caja?"
         />
         <table className="form">
            <tbody>
               <tr>
                  <td>Ingresos</td>
                  <td>
                     $
                     {register.temporary && register.income
                        ? register.income
                        : 0}
                  </td>
                  <td>
                     <Link className="btn btn-light" to="/income-list">
                        <span className="hide-sm">Ver </span>Listado
                     </Link>
                  </td>
               </tr>
               <tr>
                  <td>Egresos</td>
                  <td>
                     $
                     {register.temporary && register.expence
                        ? register.expence
                        : 0}
                  </td>
                  <td>
                     <Link className="btn btn-light" to="/expence-list">
                        <span className="hide-sm">Ver </span>Listado
                     </Link>
                  </td>
               </tr>
               <tr>
                  <td>Ingreso Especial</td>
                  <td>
                     $
                     {register.temporary && register.cheatincome
                        ? register.cheatincome
                        : 0}
                  </td>
                  <td>&nbsp;</td>
               </tr>
               <tr>
                  <td>Retiro de Dinero</td>
                  <td>
                     $
                     {register.temporary && register.withdrawal
                        ? register.withdrawal
                        : 0}
                  </td>
                  <td>&nbsp;</td>
               </tr>
               <tr>
                  <td>Plata Caja</td>
                  <td>${register.registermoney}</td>
                  <td>
                     <Link to="/register-list" className="btn btn-light">
                        <span className="hide-sm">Ver </span>Cierres
                     </Link>
                  </td>
               </tr>
               <tr>
                  <td>Diferencia</td>
                  <td>
                     <input
                        type="number"
                        name="difference"
                        disabled={!register.temporary}
                        value={difference}
                        onChange={onChange}
                        placeholder="Diferencia"
                     />
                  </td>
                  <td>
                     <input
                        className="form-checkbox"
                        type="checkbox"
                        checked={negative}
                        disabled={!register.temporary}
                        onChange={onChangeCheckBox}
                        name="negative"
                        id="cb1"
                     />
                     <label className="checkbox-lbl" id="check" htmlFor="cb1">
                        {negative ? "Negativa" : "Positiva"}
                     </label>
                  </td>
               </tr>
               <tr>
                  <td>Detalles</td>
                  <td colSpan="2">
                     <textarea
                        cols="30"
                        value={description}
                        onChange={onChange}
                        disabled={!register.temporary}
                        name="description"
                        rows="4"
                     ></textarea>
                  </td>
               </tr>
            </tbody>
         </table>

         <div className="btn-ctr pt-3">
            <button
               type="submit"
               disabled={register === null}
               onClick={() => {
                  if (register.temporary) setToggleModal(!toggleModal);
               }}
               className={`btn ${
                  !register.temporary ? "btn-black" : "btn-primary"
               }`}
            >
               <i className="far fa-save"></i>
               <span className="hide-sm"> Guardar</span>
            </button>
         </div>
      </div>
   );
};

RegisterTab.propTypes = {
   register: PropTypes.object.isRequired,
   auth: PropTypes.object.isRequired,
   closeRegister: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   register: state.registers.register,
   auth: state.auth,
});

export default connect(mapStateToProps, { closeRegister })(
   withRouter(RegisterTab)
);
