import React, { useState } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import {
   clearRegisters,
   closeRegister,
   createRegister,
} from "../../../../../../actions/register";
import { clearInvoices } from "../../../../../../actions/invoice";
import { clearExpences } from "../../../../../../actions/expence";

import Confirm from "../../../../../modal/Confirm";
import Loading from "../../../../../modal/Loading";

import "./style.scss";

const RegisterTab = ({
   history,
   registers: { register, addNew, loading },
   closeRegister,
   createRegister,
   clearInvoices,
   clearExpences,
   clearRegisters,
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

   const confirm = () => {
      if (addNew)
         createRegister({ difference, description }, userLogged._id, history);
      else closeRegister(formData, userLogged._id, history);
   };

   return (
      <>
         {!loading ? (
            <div className="register register-tab">
               <Confirm
                  toggleModal={toggleModal}
                  setToggleModal={setToggle}
                  confirm={confirm}
                  text="¿Está seguro que desea cerrar la caja?"
               />
               <form
                  className="form"
                  onSubmit={(e) => {
                     e.preventDefault();
                     if (addNew || (register && register.temporary))
                        setToggle();
                  }}
               >
                  <table>
                     <tbody>
                        {!addNew && (
                           <>
                              <tr>
                                 <td>Ingresos</td>
                                 <td>
                                    $
                                    {register &&
                                    register.temporary &&
                                    register.income
                                       ? register.income
                                       : 0}
                                 </td>
                                 <td>
                                    <Link
                                       className="btn btn-light"
                                       onClick={() => {
                                          window.scroll(0, 0);
                                          clearInvoices();
                                       }}
                                       to="/income-list"
                                    >
                                       <i className="fas fa-list-ul"></i>
                                       <span className="hide-sm">
                                          &nbsp; Listado
                                       </span>
                                    </Link>
                                 </td>
                              </tr>
                              <tr>
                                 <td>Egresos</td>
                                 <td>
                                    $
                                    {register &&
                                    register.temporary &&
                                    register.expence
                                       ? register.expence
                                       : 0}
                                 </td>
                                 <td>
                                    <Link
                                       className="btn btn-light"
                                       onClick={() => {
                                          window.scroll(0, 0);
                                          clearExpences();
                                       }}
                                       to="/transaction-list"
                                    >
                                       <i className="fas fa-list-ul"></i>
                                       <span className="hide-sm">
                                          &nbsp; Listado
                                       </span>
                                    </Link>
                                 </td>
                              </tr>
                              <tr>
                                 <td>Ingreso Especial</td>
                                 <td>
                                    $
                                    {register &&
                                    register.temporary &&
                                    register.cheatincome
                                       ? register.cheatincome
                                       : 0}
                                 </td>
                                 <td>&nbsp;</td>
                              </tr>
                              <tr>
                                 <td>Retiro de Dinero</td>
                                 <td>
                                    $
                                    {register &&
                                    register.temporary &&
                                    register.withdrawal
                                       ? register.withdrawal
                                       : 0}
                                 </td>
                                 <td>&nbsp;</td>
                              </tr>
                              <tr>
                                 <td>Plata Caja</td>
                                 <td>${register && register.registermoney}</td>
                                 <td>
                                    <Link
                                       to="/register-list"
                                       onClick={() => {
                                          window.scroll(0, 0);
                                          clearRegisters();
                                       }}
                                       className="btn btn-light"
                                    >
                                       <i className="fas fa-list-ul"></i>
                                       <span className="hide-sm">
                                          &nbsp; Cierres
                                       </span>
                                    </Link>
                                 </td>
                              </tr>
                           </>
                        )}

                        <tr>
                           <td>{addNew ? "Dinero Inicial" : "Diferencia"}</td>
                           <td>
                              <input
                                 type="number"
                                 name="difference"
                                 disabled={register && !register.temporary}
                                 value={difference}
                                 onChange={onChange}
                                 placeholder={
                                    addNew ? "Dinero Inicial" : "Diferencia"
                                 }
                              />
                           </td>
                           <td>
                              {!addNew && (
                                 <>
                                    <input
                                       className="form-checkbox"
                                       type="checkbox"
                                       checked={negative}
                                       disabled={
                                          register && !register.temporary
                                       }
                                       onChange={onChangeCheckBox}
                                       name="negative"
                                       id="cb1"
                                    />
                                    <label
                                       className="checkbox-lbl"
                                       id="check"
                                       htmlFor="cb1"
                                    >
                                       {negative ? "Negativa" : "Positiva"}
                                    </label>
                                 </>
                              )}
                           </td>
                        </tr>
                        <tr>
                           <td>Detalles</td>
                           <td colSpan="2">
                              <textarea
                                 cols="30"
                                 value={description}
                                 onChange={onChange}
                                 disabled={register && !register.temporary}
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
                        disabled={!register && !addNew}
                        className={`btn ${
                           register && !register.temporary && !addNew
                              ? "btn-black"
                              : "btn-primary"
                        }`}
                     >
                        <i className="far fa-save"></i>
                        <span className="hide-sm">&nbsp; Guardar</span>
                     </button>
                  </div>
               </form>
            </div>
         ) : (
            <Loading />
         )}
      </>
   );
};

RegisterTab.propTypes = {
   registers: PropTypes.object.isRequired,
   auth: PropTypes.object.isRequired,
   closeRegister: PropTypes.func.isRequired,
   createRegister: PropTypes.func.isRequired,
   clearInvoices: PropTypes.func.isRequired,
   clearExpences: PropTypes.func.isRequired,
   clearRegisters: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   registers: state.registers,
   auth: state.auth,
});

export default connect(mapStateToProps, {
   closeRegister,
   createRegister,
   clearInvoices,
   clearExpences,
   clearRegisters,
})(withRouter(RegisterTab));
