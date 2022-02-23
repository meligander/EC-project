import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { IoIosListBox } from "react-icons/io";
import { FiSave } from "react-icons/fi";

import {
   clearRegisters,
   closeRegister,
   createRegister,
} from "../../../../../../../actions/register";
import { clearInvoices } from "../../../../../../../actions/invoice";
import {
   clearTransactions,
   clearExpenceTypes,
} from "../../../../../../../actions/expence";
import {
   formatNumber,
   togglePopup,
} from "../../../../../../../actions/mixvalues";

import PopUp from "../../../../../../modal/PopUp";

import "./style.scss";

const RegisterTab = ({
   registers: { register },
   closeRegister,
   createRegister,
   clearInvoices,
   clearTransactions,
   clearRegisters,
   clearExpenceTypes,
   togglePopup,
}) => {
   const [formData, setFormData] = useState({
      difference: "",
      description: "",
   });

   const { difference, description } = formData;

   const onChange = (e) => {
      e.persist();
      setFormData({
         ...formData,
         [e.target.name]:
            e.target.type !== "checkbox" ? e.target.value : e.target.checked,
      });
   };

   const confirm = () => {
      if (!register) createRegister({ difference, description });
      else closeRegister(formData);
   };

   return (
      <div className="register register-tab">
         <PopUp
            confirm={confirm}
            info="¿Está seguro que desea cerrar la caja?"
         />
         <form
            className="form"
            onSubmit={(e) => {
               e.preventDefault();
               if (!register || (register && register.temporary))
                  togglePopup("default");
            }}
         >
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
                              clearTransactions();
                              clearExpenceTypes();
                           }}
                           to="/register/transaction/list"
                        >
                           <IoIosListBox />
                           <span className="hide-sm">&nbsp;Listado</span>
                        </Link>
                     </td>
                  </tr>
                  <tr>
                     <td>Retiro de Dinero</td>
                     <td>
                        $
                        {register && register.temporary && register.withdrawal
                           ? formatNumber(register.withdrawal)
                           : 0}
                     </td>
                     <td>
                        <Link
                           to="/register/withdrawal/list"
                           onClick={() => {
                              window.scroll(0, 0);
                              clearTransactions();
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
                        ${register && formatNumber(register.registermoney)}
                     </td>
                     <td>
                        <Link
                           to="/register/list"
                           onClick={() => {
                              window.scroll(0, 0);
                              clearRegisters();
                           }}
                           className="btn btn-light"
                        >
                           <IoIosListBox />
                           <span className="hide-sm">&nbsp;Cierres</span>
                        </Link>
                     </td>
                  </tr>

                  <tr>
                     <td>{!register ? "Dinero Inicial" : "Diferencia"}</td>
                     <td>
                        <input
                           type="number"
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
            <div className="btn-center pt-3">
               <button
                  type="submit"
                  disabled={!register || (register && !register.temporary)}
                  className={`btn ${
                     (register && !register.temporary) || !register
                        ? "btn-black"
                        : "btn-primary"
                  }`}
               >
                  <FiSave />
                  <span className="hide-sm">&nbsp; Cerrar Caja</span>
               </button>
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
   clearTransactions,
   clearRegisters,
   clearExpenceTypes,
   togglePopup,
})(RegisterTab);
