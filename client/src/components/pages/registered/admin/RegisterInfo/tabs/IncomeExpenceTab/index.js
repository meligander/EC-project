import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { FiSave } from "react-icons/fi";
import { FaEdit } from "react-icons/fa";

import {
   clearExpenceTypes,
   registerExpence,
} from "../../../../../../../actions/expence";
import { setAlert } from "../../../../../../../actions/alert";
import {
   formatNumber,
   togglePopup,
} from "../../../../../../../actions/mixvalues";

import PopUp from "../../../../../../modal/PopUp";
import Alert from "../../../../../sharedComp/Alert";

import "./style.scss";

const IncomeExpenceTab = ({
   auth: { userLogged },
   registers: { register },
   expences: { expencetypes },
   users: { users },
   clearExpenceTypes,
   registerExpence,
   togglePopup,
   setAlert,
}) => {
   const employeePaymentID = expencetypes.find(
      (item) => item.name === "Pago a Empleados"
   )._id;
   const isAdmin =
      userLogged.type === "admin" || userLogged.type === "admin&teacher";

   const [formData, setFormData] = useState({
      expencetype: "",
      value: "",
      description: "",
   });

   const [adminValues, setAdminValues] = useState({
      hours: "",
      teacher: {},
      type: "",
   });

   const { expencetype, value, description } = formData;

   const { hours, teacher, type } = adminValues;

   useEffect(() => {
      setFormData({
         expencetype: "",
         value: "",
         description: "",
      });
      setAdminValues({
         hours: "",
         teacher: {},
         type: "",
      });
   }, [register]);

   const onChange = (e) => {
      e.persist();
      setFormData({
         ...formData,
         [e.target.name]: e.target.value,
      });

      if (e.target.name === "expencetype")
         setAdminValues((prev) => ({
            ...prev,
            type: e.target.options[e.target.selectedIndex].getAttribute("name"),
         }));
   };

   const onChangeAdmin = (e) => {
      e.persist();

      setAdminValues((prev) => ({
         ...prev,
         [e.target.name]:
            e.target.name === "teacher"
               ? users.find((user) => user._id === e.target.value)
               : e.target.value,
      }));

      if (e.target.name === "hours") {
         if (teacher.salary && teacher.salary !== "") {
            setFormData((prev) => ({
               ...prev,
               value: e.target.value * teacher.salary,
            }));
         } else {
            window.scroll(0, 0);
            setAlert(
               "No está definido el salario del empleado seleccionado",
               "danger",
               "3"
            );
         }
      }
   };

   const confirm = async () => {
      await registerExpence(
         {
            expencetype,
            value,
            description: `${
               expencetype === employeePaymentID && teacher._id
                  ? `Pago a ${teacher.lastname}, ${teacher.name}. `
                  : ""
            }${description}`,
         },
         register,
         type
      );
   };

   return (
      <>
         <Alert type="3" />
         <PopUp
            confirm={confirm}
            info="¿Está seguro que desea registrar un nuevo movimiento?"
         />
         {!register && (
            <p className="bg-secondary paragraph mb-3 p-2">
               Debe ingresar dinero en la caja para registrar un nuevo
               Movimiento
            </p>
         )}
         <form
            className="register income-tab"
            onSubmit={(e) => {
               e.preventDefault();
               if (register) togglePopup("default");
            }}
         >
            <table>
               <tbody>
                  <tr>
                     <td>Dinero en Caja</td>
                     <td>
                        ${register ? formatNumber(register.registermoney) : 0}
                     </td>
                  </tr>
                  <tr>
                     <td>Tipo de Movimiento</td>
                     <td>
                        <select
                           name="expencetype"
                           value={expencetype}
                           onChange={onChange}
                        >
                           <option value="" name="">
                              * Tipo de Movimiento
                           </option>
                           {expencetypes.map((expty) => (
                              <option
                                 key={expty._id}
                                 name={expty.type}
                                 value={expty._id}
                              >
                                 {expty.name}
                              </option>
                           ))}
                        </select>
                     </td>
                  </tr>
                  {expencetype === employeePaymentID && (
                     <>
                        <tr>
                           <td>Empleado</td>
                           <td>
                              <select
                                 name="teacher"
                                 value={teacher._id}
                                 onChange={onChangeAdmin}
                              >
                                 <option value={0}>* Empleado</option>
                                 {users.map((user) => (
                                    <React.Fragment key={user._id}>
                                       {user.type !== "admin&teacher" && (
                                          <option value={user._id}>
                                             {user.lastname}, {user.name}
                                          </option>
                                       )}
                                    </React.Fragment>
                                 ))}
                              </select>
                           </td>
                        </tr>
                        <tr>
                           <td>Horas</td>
                           <td>
                              <input
                                 type="number"
                                 onChange={onChangeAdmin}
                                 placeholder="Horas"
                                 value={hours}
                                 name="hours"
                              />
                           </td>
                        </tr>
                     </>
                  )}
                  <tr>
                     <td>Importe</td>
                     <td>
                        <input
                           type="text"
                           placeholder="Importe"
                           name="value"
                           onChange={onChange}
                           value={value}
                        />
                     </td>
                  </tr>
                  <tr>
                     <td>Descripción</td>
                     <td>
                        <textarea
                           placeholder="Descripción"
                           name="description"
                           value={description}
                           onChange={onChange}
                        ></textarea>
                     </td>
                  </tr>
               </tbody>
            </table>

            <div className="btn-center pt-3">
               <button
                  type="submit"
                  className={`btn ${register ? "btn-primary" : "btn-black"}`}
                  disabled={!register}
               >
                  <FiSave />
                  <span className="hide-sm">&nbsp; Guardar</span>
               </button>

               {isAdmin && (
                  <div className="tooltip">
                     <Link
                        to="/register/expencetypes/edit"
                        onClick={() => {
                           window.scroll(0, 0);
                           clearExpenceTypes();
                        }}
                        className="btn btn-mix-secondary"
                     >
                        <FaEdit />
                        <span className="hide-sm">&nbsp; Tipo Movimiento</span>
                     </Link>
                     <span className="tooltiptext">Editar</span>
                  </div>
               )}
            </div>
         </form>
      </>
   );
};

const mapStateToProps = (state) => ({
   auth: state.auth,
   registers: state.registers,
   expences: state.expences,
   users: state.users,
});

export default connect(mapStateToProps, {
   registerExpence,
   clearExpenceTypes,
   setAlert,
   togglePopup,
})(IncomeExpenceTab);
