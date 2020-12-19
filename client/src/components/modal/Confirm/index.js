import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Moment from "react-moment";
import PropTypes from "prop-types";

import { updatePenalty, loadPenalty } from "../../../actions/penalty";

import Alert from "../../sharedComp/Alert";

import logo from "../../../img/logoSinLetras.png";
import "./style.scss";

const Confirm = ({
   toggleModal,
   setToggleModal,
   confirm,
   text,
   type,
   penalty: { loading, penalty },
   updatePenalty,
   loadPenalty,
}) => {
   const [formData, setFormData] = useState({
      percentage: "",
      date: "",
   });

   const { percentage, date } = formData;

   useEffect(() => {
      if (type === "penalty") loadPenalty();
   }, [loadPenalty, type]);

   const penaltyConfirm = () => {
      updatePenalty(formData.percentage);
      setFormData({ ...formData, percentage: "" });
   };

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
                     <p className="posted-date">
                        Última Actualización:{" "}
                        <Moment format="DD/MM/YY" date={penalty.date} />
                     </p>
                     <Alert type="4" />
                     <h3>Actualización de Recargo</h3>

                     <h4 className="pt-2">
                        Recargo Actual: {penalty.percentage} %
                     </h4>

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
            </div>
            {chooseType(type)}
            <div className="btn-ctr">
               <button
                  className="btn btn-success"
                  onClick={(e) => {
                     e.preventDefault();
                     switch (type) {
                        case "penalty":
                           penaltyConfirm();
                           break;
                        case "certificate-date":
                           confirm(date);
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
   toggleModal: PropTypes.bool.isRequired,
   setToggleModal: PropTypes.func.isRequired,
   penalty: PropTypes.object.isRequired,
   updatePenalty: PropTypes.func.isRequired,
   loadPenalty: PropTypes.func.isRequired,
   type: PropTypes.string,
};

const mapStateToProps = (state) => ({
   penalty: state.penalty,
});

export default connect(mapStateToProps, { updatePenalty, loadPenalty })(
   Confirm
);
