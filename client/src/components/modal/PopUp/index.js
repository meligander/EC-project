import React, { useState } from "react";
import format from "date-fns/format";
import { connect } from "react-redux";
import { FaTimes } from "react-icons/fa";

import { togglePopup } from "../../../actions/mixvalues";

import logo from "../../../img/logoSinLetras.png";
import "./style.scss";

const PopUp = ({
   mixvalues: { popupType, popupToggle },
   penalties: { loading, penalty },
   classes: { classInfo, loadingClass },
   togglePopup,
   confirm,
   text,
}) => {
   const [formData, setFormData] = useState({
      percentage: "",
      date: "",
      ...(!loadingClass &&
         popupType === "report-cards" && {
            observations: Array.from(Array(classInfo.student.length), () => ""),
         }),
   });

   const { percentage, date, observations } = formData;

   const onChange = (e) => {
      e.persist();
      setFormData({
         [e.target.name]: e.target.value,
      });
   };

   const onChangeObservations = (e, index) => {
      e.persist();
      let newObservations = [...observations];
      newObservations[index] = e.target.value;
      setFormData((prev) => ({ ...prev, observations: newObservations }));
   };

   const chooseType = () => {
      switch (popupType) {
         case "penalty":
            return (
               <div className="popup-penalty">
                  {!loading && (
                     <>
                        {penalty && (
                           <p className="posted-date">
                              Última Actualización:{" "}
                              {format(new Date(penalty.date), "dd/MM/yy")}
                           </p>
                        )}

                        <h3>Actualización de Recargo</h3>

                        <div className="pt-2">
                           <h4>
                              {" "}
                              Recargo Actual: {penalty && penalty.percentage}%
                           </h4>

                           {!penalty && (
                              <h5 className="paragraph text-danger text-center">
                                 No hay ningún recargo registrado
                              </h5>
                           )}
                        </div>

                        <h4>
                           <input
                              id="percentage"
                              type="number"
                              name="percentage"
                              placeholder="Nuevo Recargo"
                              value={percentage}
                              onChange={onChange}
                           />
                           %
                        </h4>
                     </>
                  )}
               </div>
            );
         case "certificate-date":
            return (
               <div className="popup-date">
                  <h3>¿Para cuando desea fechar los certificados?</h3>
                  <div className="form">
                     <input
                        className="form-input"
                        id="date"
                        type="date"
                        name="date"
                        value={date}
                        onChange={onChange}
                     />
                  </div>
               </div>
            );
         case "active":
            return (
               <div className="popup-text">
                  <h3>{text.question}</h3>
                  <p>{text.info}</p>
               </div>
            );
         //Cambiar forma de hacer los report cards... que se puedan ver todas las observaciones
         case "report-cards":
            return (
               <div className="popup-text wrapper both smaller">
                  {classInfo.student &&
                     classInfo.student.length > 0 &&
                     classInfo.student.map((student, i) => (
                        <div className="student" key={i}>
                           <label htmlFor="observation" className="name">
                              {student.lastname + ", " + student.name}
                           </label>
                           <textarea
                              className="form-input"
                              name={student._id}
                              id="observation"
                              rows="4"
                              onChange={(e) => onChangeObservations(e, i)}
                              value={observations[i]}
                              placeholder="Observaciones"
                           ></textarea>
                        </div>
                     ))}
               </div>
            );
         default:
            return (
               <div className="popup-text">
                  <h3>{text}</h3>
               </div>
            );
      }
   };

   return (
      <div className={`popup ${!popupToggle ? "hide" : ""}`}>
         <div className="popup-content text-center">
            <div className="popup-img">
               <img src={logo} alt="logo" />
               <button
                  type="button"
                  onClick={(e) => {
                     e.preventDefault();
                     togglePopup();
                  }}
                  className="btn-cancel"
               >
                  <FaTimes />
               </button>
            </div>
            {chooseType(popupType)}
            <div className="btn-center">
               <button
                  type="button"
                  className="btn btn-success"
                  onClick={(e) => {
                     e.preventDefault();
                     switch (popupType) {
                        case "penalty":
                           confirm(percentage);
                           setFormData((prev) => ({
                              ...prev,
                              percentage: "",
                           }));
                           break;
                        case "certificate-date":
                           confirm(date);
                           setFormData((prev) => ({ ...prev, date: "" }));
                           break;
                        case "report-cards":
                           confirm(observations);
                           setFormData((prev) => ({
                              ...prev,
                              observations: Array.from(
                                 Array(classInfo.student.length),
                                 () => ""
                              ),
                           }));
                           break;
                        default:
                           confirm();
                           break;
                     }
                     togglePopup();
                  }}
               >
                  Aceptar
               </button>
               <button
                  type="button"
                  className="btn btn-danger"
                  onClick={(e) => {
                     e.preventDefault();
                     togglePopup();
                  }}
               >
                  Cancelar
               </button>
            </div>
         </div>
      </div>
   );
};

const mapStateToProps = (state) => ({
   mixvalues: state.mixvalues,
   penalties: state.penalties,
   classes: state.classes,
});

export default connect(mapStateToProps, { togglePopup })(PopUp);
