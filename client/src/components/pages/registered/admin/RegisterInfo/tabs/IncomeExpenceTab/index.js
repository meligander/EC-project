import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { FiSave } from "react-icons/fi";
import { FaEdit } from "react-icons/fa";

import {
   clearExpenceTypes,
   registerExpence,
} from "../../../../../../../actions/expence";
import { loadUsers } from "../../../../../../../actions/user";
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
   registers: { register, loading },
   expences,
   users,
   clearExpenceTypes,
   loadUsers,
   registerExpence,
   togglePopup,
   setAlert,
}) => {
   const [adminValues, setAdminValues] = useState({
      show: false,
      employeePaymentID: "",
   });

   const [formData, setFormData] = useState({
      expencetype: "",
      value: "",
      description: "",
      hours: "",
      teacher: {
         _id: "",
         name: "",
         salary: "",
      },
   });

   const { expencetype, value, description, hours, teacher } = formData;

   const { show, employeePaymentID } = adminValues;

   useEffect(() => {
      if (!expences.loadingET) {
         for (let x = 0; x < expences.expencetypes.length; x++) {
            if (expences.expencetypes[x].name === "Pago a Empleados") {
               setAdminValues((prev) => ({
                  ...prev,
                  employeePaymentID: expences.expencetypes[x]._id,
               }));
            }
         }
      }
   }, [expences.loadingET, expences.expencetypes]);

   const onChange = (e) => {
      e.persist();
      setFormData({
         ...formData,
         [e.target.name]: e.target.value,
      });
      if (
         e.target.name === "expencetype" &&
         e.target.value === employeePaymentID
      ) {
         setAdminValues((prev) => ({
            ...prev,
            show: true,
         }));
         loadUsers({ active: true, type: "team" }, true, true, false);
      } else {
         if (
            e.target.value !== employeePaymentID &&
            e.target.name === "expencetype"
         )
            setAdminValues((prev) => ({
               ...prev,
               show: false,
            }));
      }
   };

   const onChangeTeacher = (e) => {
      e.persist();
      let sal = 0;

      for (let x = 0; x < users.users.length; x++) {
         if (users.users[x]._id === e.target.value) {
            sal = users.users[x].salary;
         }
      }
      setFormData({
         ...formData,
         teacher: {
            _id: e.target.value,
            name: e.target.options[e.target.selectedIndex].text,
            salary: sal,
         },
      });
   };

   const confirm = () => {
      let des = description;
      if (teacher._id !== "") des = "Pago a " + teacher.name + ". " + des;
      registerExpence({ expencetype, value, description: des });
      if (
         expencetype !== "" &&
         value !== "" &&
         register &&
         register.registermoney >= value
      )
         setFormData({
            expencetype: "",
            value: "",
            description: "",
            hours: "",
            teacher: {
               _id: "",
               name: "",
               salary: "",
            },
         });
   };

   const setValueAfterHours = (e) => {
      e.persist();
      if (teacher.salary && teacher.salary !== "") {
         setFormData({
            ...formData,
            hours: e.target.value,
            value: e.target.value * teacher.salary,
         });
      } else {
         window.scroll(0, 0);
         setAlert(
            "No está definido el salario del empleado seleccionado",
            "danger",
            "3"
         );
      }
   };

   return (
      <>
         <Alert type="3" />
         <PopUp
            confirm={confirm}
            text="¿Está seguro que desea registrar un nuevo movimiento?"
         />
         {!loading && !register && (
            <p className="bg-secondary paragraph mb-3 p-2">
               Debe ingresar dinero en la caja para registrar un nuevo
               Movimiento
            </p>
         )}
         <form
            className="register income-tab"
            onSubmit={(e) => {
               e.preventDefault();
               if (register) togglePopup();
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
                           id="select"
                        >
                           <option value="">* Tipo de Movimiento</option>
                           {!expences.loadingET &&
                              expences.expencetypes.map((expty) => (
                                 <option key={expty._id} value={expty._id}>
                                    {expty.name}
                                 </option>
                              ))}
                        </select>
                     </td>
                  </tr>
                  {show && (
                     <>
                        <tr>
                           <td>Empleado</td>
                           <td>
                              <select
                                 name="teacher"
                                 value={teacher._id}
                                 onChange={onChangeTeacher}
                                 id="select"
                              >
                                 <option value={0}>* Empleado</option>
                                 {!users.loadingUsers &&
                                    users.users.map((user) => (
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
                                 onChange={setValueAfterHours}
                                 placeholder="Horas"
                                 value={hours}
                                 name="hours"
                                 id=""
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

            <div className="btn-center mt-5">
               <button
                  type="submit"
                  className={`btn ${register ? "btn-primary" : "btn-black"}`}
                  disabled={!register}
               >
                  <FiSave />
                  <span className="hide-sm">&nbsp; Guardar</span>
               </button>

               {(userLogged.type === "admin" ||
                  userLogged.type === "admin&teacher") && (
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
   loadUsers,
   clearExpenceTypes,
   setAlert,
   togglePopup,
})(IncomeExpenceTab);
