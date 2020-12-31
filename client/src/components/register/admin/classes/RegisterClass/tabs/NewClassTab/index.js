import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import {
   registerUpdateClass,
   removeStudent,
} from "../../../../../../../actions/class";
import { clearProfile } from "../../../../../../../actions/user";

import ChosenChildrenTable from "../../../../../../tables/ChosenChildrenTable";
import Confirm from "../../../../../../modal/Confirm";

const NewClassTab = ({
   history,
   location,
   registerUpdateClass,
   removeStudent,
   clearProfile,
   users: { usersBK, loadingUsersBK },
   classes: { classInfo, loading },
}) => {
   const registerClass = location.pathname === "/register-class";

   const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

   const [otherValues, setOtherValues] = useState({
      toggleModal: false,
   });

   const [formData, setFormData] = useState({
      teacher: "",
      classroom: "",
      day1: "",
      day2: "",
      hourin1: "",
      hourin2: "",
      hourout1: "",
      hourout2: "",
   });

   const { toggleModal } = otherValues;

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
      if (!registerClass && !loading) {
         setFormData((prev) => ({
            ...prev,
            teacher: classInfo.teacher._id,
            ...(classInfo.classroom && { classroom: classInfo.classroom }),
            ...(classInfo.day1 && { day1: classInfo.day1 }),
            ...(classInfo.day2 && { day2: classInfo.day2 }),
            ...(classInfo.hourin1 && {
               hourin1: moment(classInfo.hourin1).format("HH:mm"),
            }),
            ...(classInfo.hourin2 && {
               hourin2: moment(classInfo.hourin2).format("HH:mm"),
            }),
            ...(classInfo.hourout1 && {
               hourout1: moment(classInfo.hourout1).format("HH:mm"),
            }),
            ...(classInfo.hourout2 && {
               hourout2: moment(classInfo.hourout2).format("HH:mm"),
            }),
         }));
      }
   }, [usersBK, loadingUsersBK, classInfo, loading, registerClass]);

   const onChange = (e) => {
      setFormData({
         ...formData,
         [e.target.name]: e.target.value,
      });
   };

   const deleteChild = (e, studentToDelete) => {
      e.preventDefault();
      removeStudent(studentToDelete);
   };

   const setToggle = (e) => {
      if (e) e.preventDefault();
      setOtherValues({ ...otherValues, toggleModal: !toggleModal });
   };

   const onSubmit = () => {
      registerUpdateClass(
         {
            ...formData,
            category: classInfo.category._id,
            students: classInfo.students,
         },
         history,
         !registerClass && classInfo._id
      );
   };

   return (
      <>
         <Confirm
            toggleModal={toggleModal}
            setToggleModal={setToggle}
            confirm={onSubmit}
            text="¿Está seguro que los datos son correctos?"
         />
         <form className="form" onSubmit={setToggle}>
            <div className="form-group my-3 heading-tertiary">
               <p>Categoría: &nbsp; {!loading && classInfo.category.name}</p>
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
                  {!loadingUsersBK &&
                     usersBK.length > 0 &&
                     usersBK.map((teacher) => (
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
                  {days.map((day, index) => (
                     <option key={index} value={day}>
                        {day}
                     </option>
                  ))}
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
                     name="hourout1"
                     onChange={onChange}
                     value={hourout1}
                     min="08:00"
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
                  {days.map((day, index) => (
                     <option key={index} value={day}>
                        {day}
                     </option>
                  ))}
               </select>
               <label
                  htmlFor="day2"
                  className={`form-label ${day2 === "" ? "lbl" : ""}`}
               >
                  Día 2
               </label>
            </div>
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
            <h3 className="text-primary heading-tertiary my-3">
               Lista de Alumnos
            </h3>
            {!loading && classInfo.students ? (
               <>
                  {classInfo.students.length > 0 ? (
                     <ChosenChildrenTable
                        children={classInfo.students}
                        deleteChild={deleteChild}
                        clearProfile={clearProfile}
                     />
                  ) : (
                     <p className="text-secondary paragraph">
                        Todavía no hay alumnos añadidos
                     </p>
                  )}
               </>
            ) : (
               <p className="text-secondary paragraph">
                  Todavía no hay alumnos añadidos
               </p>
            )}

            <div className="btn-ctr">
               <button className="btn btn-primary" type="submit">
                  {!registerClass ? (
                     <i className="fas fa-edit"></i>
                  ) : (
                     <i className="far fa-save"></i>
                  )}
                  &nbsp; {!registerClass ? "Guardar Cambios" : "Registrar"}
               </button>
            </div>
         </form>
      </>
   );
};

NewClassTab.propTypes = {
   users: PropTypes.object.isRequired,
   classes: PropTypes.object.isRequired,
   registerUpdateClass: PropTypes.func.isRequired,
   removeStudent: PropTypes.func.isRequired,
   clearProfile: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   users: state.users,
   classes: state.classes,
});

export default connect(mapStateToProps, {
   registerUpdateClass,
   removeStudent,
   clearProfile,
})(withRouter(NewClassTab));
