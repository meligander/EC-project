import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { IoIosListBox } from "react-icons/io";
import { FaTimes } from "react-icons/fa";
import { FiSave } from "react-icons/fi";

import {
   clearRegisters,
   closeRegister,
   createRegister,
   deleteRegister,
} from "../../../../../../../actions/register";
import { clearDailies } from "../../../../../../../actions/daily";
import { clearInvoices } from "../../../../../../../actions/invoice";
import {
   clearExpences,
   clearExpenceTypes,
} from "../../../../../../../actions/expence";
import { formatNumber, togglePopup } from "../../../../../../../actions/global";

import PopUp from "../../../../../../modal/PopUp";

import "./style.scss";

const RegisterTab = ({
   registers: { register },
   auth: { userLogged },
   closeRegister,
   createRegister,
   clearInvoices,
   clearExpences,
   clearRegisters,
   clearExpenceTypes,
   deleteRegister,
   togglePopup,
}) => {
   const isAdmin = userLogged.type !== "secretary";

   const [formData, setFormData] = useState({
      difference: "",
      description: "",
   });

   const [adminValues, setAdminValues] = useState({
      popupType: "",
   });

   const { difference, description } = formData;

   const { popupType } = adminValues;

   const onChange = (e) => {
      e.persist();
      setFormData({
         ...formData,
         [e.target.name]:
            e.target.type !== "checkbox" ? e.target.value : e.target.checked,
      });
   };

   return (
      <div className="register register-tab">
         <PopUp
            confirm={() => {
               if (popupType === "close") {
                  if (!register) createRegister({ difference, description });
                  else closeRegister(formData);
               } else {
                  deleteRegister(register._id);
               }
            }}
            info={`¿Está seguro que desea ${
               popupType === "close" ? "cerrar" : "reabrir"
            } la caja?`}
         />
         <form className="form">
            <table>
               <tbody>
                  <tr>
                     <td>Ingresos</td>
                     <td>
                        $
                        {register && register.temporary && register.income
                           ? formatNumber(register.income)
                           : 0}
                     </td>
                     <td>
                        <Link
                           className="btn btn-light"
                           onClick={() => {
                              window.scroll(0, 0);
                              clearInvoices();
                           }}
                           to="/register/income/list"
                        >
                           <IoIosListBox />
                           <span className="hide-sm">&nbsp;Listado</span>
                        </Link>
                     </td>
                  </tr>
                  <tr>
                     <td>Egresos</td>
                     <td>
                        $
                        {register && register.temporary && register.expence
                           ? formatNumber(register.expence)
                           : 0}
                     </td>
                     <td>
                        <Link
                           className="btn btn-light"
                           onClick={() => {
                              window.scroll(0, 0);
                              clearExpences();
                              clearExpenceTypes();
                           }}
                           to="/register/expence/list"
                        >
                           <IoIosListBox />
                           <span className="hide-sm">&nbsp;Listado</span>
                        </Link>
                     </td>
                  </tr>
                  {isAdmin && (
                     <>
                        <tr>
                           <td>Retiro de Dinero</td>
                           <td>
                              $
                              {register &&
                              register.temporary &&
                              register.withdrawal
                                 ? formatNumber(register.withdrawal)
                                 : 0}
                           </td>
                           <td>
                              <Link
                                 to="/register/withdrawal/list"
                                 onClick={() => {
                                    window.scroll(0, 0);
                                    clearExpences();
                                    clearExpenceTypes();
                                 }}
                                 className="btn btn-light"
                              >
                                 <IoIosListBox />
                                 <span className="hide-sm">&nbsp;Listado</span>
                              </Link>
                           </td>
                        </tr>
                        <tr>
                           <td>Plata Caja</td>
                           <td>
                              $
                              {register && formatNumber(register.registermoney)}
                           </td>
                           <td>
                              <Link
                                 to="/register/daily"
                                 onClick={() => {
                                    window.scroll(0, 0);
                                    clearDailies();
                                 }}
                                 className="btn btn-light"
                              >
                                 <IoIosListBox />
                                 <span className="hide-sm">&nbsp;Cierre</span>
                              </Link>
                           </td>
                        </tr>
                     </>
                  )}
                  <tr>
                     <td>{!register ? "Dinero Inicial" : "Diferencia"}</td>
                     <td>
                        <input
                           type="text"
                           name="difference"
                           disabled={register && !register.temporary}
                           value={difference}
                           onChange={onChange}
                           placeholder={
                              !register ? "Dinero Inicial" : "Diferencia"
                           }
                        />
                     </td>
                     <td></td>
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
            <div className="btn-center">
               {register && !register.temporary ? (
                  <button
                     type="button"
                     onClick={() => {
                        setAdminValues((prev) => ({
                           ...prev,
                           popupType: "reopen",
                        }));
                        togglePopup("default");
                     }}
                     className="btn btn-secondary"
                  >
                     <FaTimes />
                     <span className="hide-sm">&nbsp; Reabrir Caja</span>
                  </button>
               ) : (
                  <button
                     type="button"
                     onClick={() => {
                        setAdminValues((prev) => ({
                           ...prev,
                           popupType: "close",
                        }));
                        togglePopup("default");
                     }}
                     disabled={!register && difference === ""}
                     className="btn btn-primary"
                  >
                     <FiSave />
                     <span className="hide-sm">&nbsp; Cerrar Caja</span>
                  </button>
               )}
               {isAdmin && (
                  <Link
                     to="/register/list"
                     onClick={() => {
                        window.scroll(0, 0);
                        clearRegisters();
                     }}
                     className="btn btn-light"
                  >
                     <IoIosListBox />
                     <span className="hide-sm">&nbsp;Listado</span>
                  </Link>
               )}
            </div>
         </form>
      </div>
   );
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
   clearExpenceTypes,
   clearDailies,
   deleteRegister,
   togglePopup,
})(RegisterTab);
