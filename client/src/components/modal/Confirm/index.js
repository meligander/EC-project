import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Moment from "react-moment";
import PropTypes from "prop-types";

import { loadPenalty } from "../../../actions/penalty";

import logo from "../../../img/logoSinLetras.png";
import "./style.scss";

const Confirm = ({
   toggleModal,
   setToggleModal,
   confirm,
   text,
   type,
   penalties: { loading, penalty },
   loadPenalty,
}) => {
   const [formData, setFormData] = useState({
      percentage: "",
      date: "",
   });

   const { percentage, date } = formData;

   useEffect(() => {
      if (type === "penalty" && loading) loadPenalty();
   }, [loadPenalty, type, loading]);

   const onChange = (e) => {
      setFormData({
         [e.target.name]: e.target.value,
      });
   };

   const chooseType = (type) => {
      switch (type) {
         case "penalty":
            if (!loading)
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
                  </div>
               );
            break;
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
            <div className="btn-ctr">
               <button
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
                  className="btn btn-danger"
                  onClick={(e) => {
                     e.preventDefault();
                     setToggleModal();
                  }}
               >
                  Cancelar
               </button>
            </div>
         </div>
      </div>
   );
};

Confirm.propTypes = {
   penalties: PropTypes.object.isRequired,
   type: PropTypes.string,
   toggleModal: PropTypes.bool.isRequired,
   setToggleModal: PropTypes.func.isRequired,
   loadPenalty: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   penalties: state.penalties,
});

export default connect(mapStateToProps, { loadPenalty })(Confirm);
