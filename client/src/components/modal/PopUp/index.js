import React, { useState } from "react";
import Moment from "react-moment";
import PropTypes from "prop-types";

import logo from "../../../img/logoSinLetras.png";
import "./style.scss";

const PopUp = ({
   toggleModal,
   setToggleModal,
   confirm,
   text,
   users,
   penalty,
   type,
}) => {
   const [formData, setFormData] = useState({
      percentage: "",
      date: "",
      ...(users &&
         type === "report-cards" && {
            observations: Array.from(Array(users.length), () => ""),
         }),
   });

   const { percentage, date, observations } = formData;

   const onChange = (e) => {
      setFormData({
         [e.target.name]: e.target.value,
      });
   };

   const onChangeObservations = (e, index) => {
      let newObservations = [...observations];
      newObservations[index] = e.target.value;
      setFormData({ ...formData, observations: newObservations });
   };

   const chooseType = (type) => {
      switch (type) {
         case "penalty":
            return (
               <div className="popup-penalty">
                  {penalty && (
                     <p className="posted-date">
                        Última Actualización:{" "}
                        <Moment format="DD/MM/YY" date={penalty.date} />
                     </p>
                  )}

                  <h3>Actualización de Recargo</h3>

                  <div className="pt-2">
                     <h4> Recargo Actual: {penalty && penalty.percentage}%</h4>

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
         case "post-likes":
            return (
               <div className="popup-text wrapper both">
                  {users.length > 0 &&
                     users.map((user, i) => (
                        <div className="user" key={i}>
                           <img
                              className="round-img"
                              src={
                                 user.user.img.public_id === ""
                                    ? "https://pngimage.net/wp-content/uploads/2018/06/no-user-image-png-3-300x200.png"
                                    : user.user.img.url
                              }
                              alt="English Centre User"
                           />
                           <h4 className="text-dark">
                              {user.user.name + " " + user.user.lastname}
                           </h4>
                        </div>
                     ))}
               </div>
            );
         case "report-cards":
            return (
               <div className="popup-text wrapper both smaller">
                  {users.length > 0 &&
                     users.map((student, i) => (
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
      <div className={`popup ${!toggleModal ? "hide" : ""}`}>
         <div className="popup-content text-center">
            <div className="popup-img">
               <img src={logo} alt="logo" />
               <button
                  type="button"
                  onClick={(e) => {
                     e.preventDefault();
                     setToggleModal();
                  }}
                  className="btn-cancel"
               >
                  <i className="fas fa-times"></i>
               </button>
            </div>
            {chooseType(type)}
            {type !== "post-likes" && (
               <>
                  <div className="btn-ctr">
                     <button
                        type="button"
                        className="btn btn-success"
                        onClick={(e) => {
                           e.preventDefault();
                           switch (type) {
                              case "penalty":
                                 confirm(percentage);
                                 setFormData({ ...formData, percentage: "" });
                                 break;
                              case "certificate-date":
                                 confirm(date);
                                 setFormData({ ...formData, date: "" });
                                 break;
                              case "report-cards":
                                 confirm(observations);
                                 setFormData({
                                    ...formData,
                                    observations: Array.from(
                                       Array(users.length),
                                       () => ""
                                    ),
                                 });
                                 break;
                              default:
                                 confirm();
                                 break;
                           }
                           setToggleModal();
                        }}
                     >
                        Aceptar
                     </button>
                     <button
                        type="button"
                        className="btn btn-danger"
                        onClick={(e) => {
                           e.preventDefault();
                           setToggleModal();
                        }}
                     >
                        Cancelar
                     </button>
                  </div>
               </>
            )}
         </div>
      </div>
   );
};

PopUp.propTypes = {
   penalty: PropTypes.object,
   type: PropTypes.string,
   users: PropTypes.array,
   toggleModal: PropTypes.bool,
   setToggleModal: PropTypes.func,
   confirm: PropTypes.func,
};

export default PopUp;
