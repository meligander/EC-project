import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { FiSave } from "react-icons/fi";
import { FaEdit } from "react-icons/fa";

import {
   clearExpenceTypes,
   registerExpence,
} from "../../../../../../../actions/expence";
import {
   formatNumber,
   togglePopup,
   updateSalaries,
} from "../../../../../../../actions/global";
import { getTeacherHours } from "../../../../../../../actions/class";

import PopUp from "../../../../../../modal/PopUp";

import "./style.scss";

const ExpenceTab = ({
   auth: { userLogged },
   registers: { register },
   expences: { expencetypes },
   users: { users },
   global: { salaries },
   classes: {
      otherValues: { teacherHours },
   },
   clearExpenceTypes,
   registerExpence,
   updateSalaries,
   getTeacherHours,
   togglePopup,
}) => {
   const employeePaymentID = "5fe813b999e13c3f807a0d79";
   const isAdmin = userLogged.type !== "secretary";

   const [formData, setFormData] = useState({
      expencetype: "",
      value: "",
      description: "",
   });

   const [adminValues, setAdminValues] = useState({
      highHours: "",
      lowHours: "",
      teacher: {},
      type: "",
      isTeacher: "",
      popupType: "",
   });

   const { expencetype, value, description } = formData;

   const { highHours, lowHours, teacher, type, popupType, isTeacher } =
      adminValues;

   useEffect(() => {
      setFormData({
         expencetype: "",
         value: "",
         description: "",
      });
      setAdminValues({
         highHours: "",
         lowHours: "",
         teacher: {},
         type: "",
      });
   }, [register]);

   useEffect(() => {
      if (teacher._id && isTeacher) getTeacherHours(teacher._id);
      else {
         setAdminValues((prev) => ({
            ...prev,
            highHours: "",
            lowHours: "",
         }));
         setFormData((prev) => ({ ...prev, value: "" }));
      }
   }, [teacher, getTeacherHours, isTeacher]);

   useEffect(() => {
      if (teacherHours.lowHours !== undefined) {
         setAdminValues((prev) => {
            for (const x in teacherHours) prev[x] = teacherHours[x];
            return prev;
         });
         setFormData((prev) => ({
            ...prev,
            value:
               teacherHours.lowHours * salaries.lowerSalary +
               teacherHours.highHours * salaries.higherSalary,
         }));
      }
   }, [teacherHours, salaries]);

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

      let newTeacher = users.find((user) => user._id === e.target.value);

      setAdminValues((prev) => ({
         ...prev,
         [e.target.name]:
            e.target.name !== "teacher"
               ? e.target.value
               : e.target.value !== ""
               ? newTeacher
               : {},
         ...(newTeacher && {
            isTeacher:
               newTeacher.type !== "secretary" &&
               newTeacher.type !== "classManager",
         }),
      }));

      if (e.target.name === "highHours" || e.target.name === "lowHours") {
         let value = 0;
         switch (teacher.type) {
            case "secretary":
               value = e.target.value * salaries.adminSalary;
               break;
            case "classManager":
               value = e.target.value * salaries.classManagerSalary;
               break;
            case "highHours":
               value =
                  e.target.value * salaries.higherSalary +
                  (lowHours !== "" ? lowHours * salaries.lowerSalary : 0);
               break;
            case "lowHours":
               value =
                  e.target.value * salaries.lowerSalary +
                  (highHours !== "" ? highHours * salaries.higherSalary : 0);
               break;
            default:
               break;
         }
         setFormData((prev) => ({
            ...prev,
            value,
         }));
      }
   };

   const confirm = async () => {
      await registerExpence(
         {
            expencetype,
            value,
            teacher,
            description,
         },
         register,
         type
      );
   };

   return (
      <>
         <PopUp
            confirm={
               popupType === "save"
                  ? confirm
                  : (allSalaries) => updateSalaries(allSalaries)
            }
            info={
               popupType === "save"
                  ? "¿Está seguro que desea registrar un nuevo movimiento?"
                  : { salaries }
            }
            error={popupType === "salary"}
         />
         {!register && (
            <p className="bg-secondary paragraph mb-3 p-2">
               Debe ingresar dinero en la caja para registrar un nuevo
               Movimiento
            </p>
         )}

         {isAdmin && employeePaymentID === expencetype && (
            <div className="btn-right">
               <button
                  onClick={() => {
                     setAdminValues((prev) => ({
                        ...prev,
                        popupType: "salary",
                     }));
                     togglePopup("salary");
                  }}
                  className="btn btn-mix-secondary"
                  type="button"
               >
                  <FaEdit /> &nbsp; Salarios
               </button>
            </div>
         )}

         <form
            className="register income-tab"
            onSubmit={(e) => {
               e.preventDefault();

               if (register) {
                  setAdminValues((prev) => ({
                     ...prev,
                     popupType: "save",
                  }));
                  togglePopup("default");
               }
            }}
         >
            <table>
               <tbody>
                  {(isAdmin ||
                     (register && register.registermoney <= 50000)) && (
                     <tr>
                        <td>Dinero en Caja</td>
                        <td>
                           $
                           {register ? formatNumber(register.registermoney) : 0}
                        </td>
                     </tr>
                  )}

                  <tr>
                     <td>Tipo de {isAdmin ? "Movimiento" : "Egreso"}</td>
                     <td>
                        <select
                           name="expencetype"
                           value={expencetype}
                           onChange={onChange}
                        >
                           <option value="" name="">
                              * Tipo de {isAdmin ? "Movimiento" : "Egreso"}
                           </option>
                           {expencetypes.map(
                              (expty) =>
                                 ((!isAdmin && expty.type === "expence") ||
                                    isAdmin) && (
                                    <option
                                       key={expty._id}
                                       name={expty.type}
                                       value={expty._id}
                                    >
                                       {expty.name}
                                    </option>
                                 )
                           )}
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
                                 value={teacher._id ? teacher._id : ""}
                                 onChange={onChangeAdmin}
                              >
                                 <option value="">* Empleado</option>
                                 {users.map((user) => (
                                    <React.Fragment key={user._id}>
                                       <option value={user._id}>
                                          {user.lastname}, {user.name}
                                       </option>
                                    </React.Fragment>
                                 ))}
                              </select>
                           </td>
                        </tr>
                        <tr>
                           <td>
                              Horas
                              {isTeacher ? " Cursos Bajos" : ""}
                           </td>
                           <td>
                              <input
                                 type="number"
                                 onChange={onChangeAdmin}
                                 placeholder={`Horas${
                                    isTeacher ? " Cursos Bajos" : ""
                                 }`}
                                 value={lowHours}
                                 name="lowHours"
                              />
                           </td>
                        </tr>
                        {isTeacher && (
                           <tr>
                              <td>Horas Cursos Altos</td>
                              <td>
                                 <input
                                    type="number"
                                    onChange={onChangeAdmin}
                                    placeholder="Horas Cursos Altos"
                                    value={highHours}
                                    name="highHours"
                                 />
                              </td>
                           </tr>
                        )}
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
   classes: state.classes,
   global: state.global,
});

export default connect(mapStateToProps, {
   registerExpence,
   clearExpenceTypes,
   togglePopup,
   updateSalaries,
   getTeacherHours,
})(ExpenceTab);
