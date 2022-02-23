import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import format from "date-fns/format";
import { FaEdit } from "react-icons/fa";
import { FiSave } from "react-icons/fi";

import {
   registerUpdateClass,
   removeStudent,
} from "../../../../../../../../actions/class";
import { clearProfile } from "../../../../../../../../actions/user";
import { togglePopup } from "../../../../../../../../actions/mixvalues";

import PopUp from "../../../../../../../modal/PopUp";
import StudentTable from "../../../../../sharedComp/tables/StudentTable";

const NewClassTab = ({
   match,
   users: { usersBK },
   classes: { classInfo, loadingClass },
   registerUpdateClass,
   removeStudent,
   togglePopup,
   clearProfile,
}) => {
   const _id = match.params.class_id;

   const [adminValues, setAdminValues] = useState({
      sameSchedule: true,
   });

   const [formData, setFormData] = useState({
      _id: "",
      teacher: "",
      classroom: "",
      day1: "",
      day2: "",
      hourin1: "",
      hourin2: "",
      hourout1: "",
      hourout2: "",
   });

   const { sameSchedule } = adminValues;

   const {
      teacher,
      classroom,
      day1,
      day2,
      hourin1,
      hourin2,
      hourout1,
      hourout2,
   } = formData;

   useEffect(() => {
      if (!loadingClass && _id) {
         if (
            classInfo.hourin1 &&
            classInfo.hourin2 &&
            classInfo.hourout1 &&
            classInfo.hourout2 &&
            format(new Date(classInfo.hourin1), "HH:mm") ===
               format(new Date(classInfo.hourin2), "HH:mm") &&
            format(new Date(classInfo.hourout1), "HH:mm") ===
               format(new Date(classInfo.hourout2), "HH:mm")
         )
            setAdminValues((prev) => ({ ...prev, sameSchedule: true }));

         setFormData((prev) => {
            let oldClass = {};
            for (const x in prev) {
               oldClass[x] = !classInfo[x]
                  ? prev[x]
                  : x.substring(0, 4) === "hour"
                  ? format(
                       new Date(classInfo[x] && classInfo[x].slice(0, -1)),
                       "HH:mm"
                    )
                  : x === "teacher"
                  ? classInfo[x]._id
                  : classInfo[x];
            }
            return {
               ...oldClass,
            };
         });
      }
   }, [classInfo, loadingClass, _id]);

   const onChange = (e) => {
      e.persist();
      setFormData({
         ...formData,
         [e.target.name]: e.target.value,
      });
   };

   const onChangeCheckbox = () => {
      setAdminValues((prev) => ({
         ...prev,
         sameSchedule: !sameSchedule,
      }));
   };

   const days = () => {
      return "Lunes,Martes,Miércoles,Jueves,Viernes".split(",").map((item) => (
         <option key={item} value={item}>
            {item}
         </option>
      ));
   };

   return (
      <>
         <PopUp
            confirm={() =>
               registerUpdateClass({
                  ...formData,
                  category: classInfo.category ? classInfo.category._id : "",
                  students: classInfo.students ? classInfo.students : [],
                  ...(sameSchedule && { hourin2: hourin1, hourout2: hourout1 }),
               })
            }
            info="¿Está seguro que los datos son correctos?"
         />
         <form
            className="form"
            onSubmit={(e) => {
               e.preventDefault();
               togglePopup("default");
            }}
         >
            <div className="form-group my-3 heading-tertiary">
               <p>
                  Categoría: &nbsp; {!loadingClass && classInfo.category.name}
               </p>
            </div>
            <div className="form-group">
               <select
                  id="teacher"
                  className="form-input"
                  name="teacher"
                  onChange={onChange}
                  value={teacher}
               >
                  <option value="">* Seleccione Profesor</option>
                  {usersBK.map((teacher) => (
                     <option key={teacher._id} value={teacher._id}>
                        {teacher.lastname + ", " + teacher.name}
                     </option>
                  ))}
               </select>
               <label
                  htmlFor="teacher"
                  className={`form-label ${teacher === "" ? "lbl" : ""}`}
               >
                  Categoría
               </label>
            </div>
            <div className="form-group">
               <input
                  className="form-input"
                  type="number"
                  id="classroom"
                  onChange={onChange}
                  name="classroom"
                  value={classroom}
                  placeholder="Aula"
               />
               <label htmlFor="classroom" className="form-label">
                  Aula
               </label>
            </div>
            <div className="form-group">
               <select
                  id="day1"
                  className="form-input"
                  name="day1"
                  onChange={onChange}
                  value={day1}
               >
                  <option value="">* Seleccione Día 1</option>
                  {days()}
               </select>
               <label
                  htmlFor="day1"
                  className={`form-label ${day1 === "" ? "lbl" : ""}`}
               >
                  Día 1
               </label>
            </div>
            <div className="form-group">
               <div className="two-in-row">
                  <input
                     className="form-input"
                     type="time"
                     name="hourin1"
                     value={hourin1}
                     onChange={onChange}
                     min="08:00"
                     max="22:00"
                  />
                  <input
                     className="form-input"
                     type="time"
                     disabled={hourin1 === ""}
                     name="hourout1"
                     onChange={onChange}
                     value={hourout1}
                     min={hourin1}
                     max="22:00"
                  />
               </div>
               <div className="two-in-row">
                  <label className="form-label show">Entrada</label>
                  <label className="form-label show">Salida</label>
               </div>
            </div>
            <div className="form-group">
               <select
                  id="day2"
                  className="form-input"
                  name="day2"
                  onChange={onChange}
                  value={day2}
               >
                  <option value="0">* Seleccione Día 2</option>
                  {days()}
               </select>
               <label
                  htmlFor="day2"
                  className={`form-label ${day2 === "" ? "lbl" : ""}`}
               >
                  Día 2
               </label>
            </div>
            <div className="form-group mb-2">
               <input
                  className="form-checkbox"
                  onChange={onChangeCheckbox}
                  type="checkbox"
                  checked={sameSchedule}
                  name="sameSchedule"
                  id="sameSchedule"
               />
               <label className="checkbox-lbl" htmlFor="sameSchedule">
                  {sameSchedule ? "Mismo Horario" : "Distinto Horario"}
               </label>
            </div>
            {!sameSchedule && (
               <div className="form-group">
                  <div className="two-in-row">
                     <input
                        className="form-input"
                        type="time"
                        name="hourin2"
                        value={hourin2}
                        onChange={onChange}
                        min="08:00"
                        max="22:00"
                     />
                     <input
                        className="form-input"
                        type="time"
                        name="hourout2"
                        onChange={onChange}
                        value={hourout2}
                        min="08:00"
                        max="22:00"
                     />
                  </div>
                  <div className="two-in-row">
                     <label className="form-label show">Entrada</label>
                     <label className="form-label show">Salida</label>
                  </div>
               </div>
            )}

            <h3 className="text-primary heading-tertiary my-2 pt-2">
               Lista de Alumnos
            </h3>
            {!loadingClass && classInfo.students.length > 0 ? (
               <StudentTable
                  users={classInfo.students}
                  clearProfile={clearProfile}
                  loadingUsers={true}
                  actionWChild={(studentToDelete) =>
                     removeStudent(studentToDelete)
                  }
                  type="chosen-child"
               />
            ) : (
               <p className="text-secondary paragraph">
                  Todavía no hay alumnos añadidos
               </p>
            )}

            <div className="btn-center">
               <button className="btn btn-primary" type="submit">
                  {_id ? <FaEdit /> : <FiSave />}
                  &nbsp; {_id ? "Guardar Cambios" : "Registrar"}
               </button>
            </div>
         </form>
      </>
   );
};

const mapStateToProps = (state) => ({
   users: state.users,
   classes: state.classes,
});

export default connect(mapStateToProps, {
   registerUpdateClass,
   removeStudent,
   togglePopup,
   clearProfile,
})(withRouter(NewClassTab));
