import React, { useState } from "react";
import { connect } from "react-redux";
import { FaTimes } from "react-icons/fa";

import { togglePopup } from "../../../actions/mixvalues";

import NewDate from "./NewDate";
import PenaltyPercentage from "./PenaltyPercentage";
import CertificateDate from "./CertificateDate";

import logo from "../../../img/logoSinLetras.png";
import "./style.scss";

const PopUp = ({
   mixvalues: { popupType, popupToggle },
   penalties: { loading, penalty },
   togglePopup,
   confirm,
   text,
}) => {
   const [newDate, setNewDate] = useState({
      fromDate: "",
      toDate: "",
      date: "",
   });

   const [certificateDate, setCertificateDate] = useState("");

   const [penaltyPercentage, setPenaltyPercentage] = useState("");

   const onChangeCertificateDate = (e) => {
      e.persist();
      setCertificateDate(e.target.value);
   };

   const onChangeNewDate = (e) => {
      e.persist();
      setNewDate((prev) => ({
         ...prev,
         [e.target.id]: e.target.value,
         ...(e.target.name === "both"
            ? { date: "" }
            : { fromDate: "", toDate: "" }),
      }));
   };

   const onChangePenaltyPercentage = (e) => {
      e.persist();
      setPenaltyPercentage(e.target.value);
   };

   const chooseType = () => {
      switch (popupType) {
         case "penalty":
            return (
               <div className="popup-penalty">
                  {!loading && (
                     <PenaltyPercentage
                        onChange={onChangePenaltyPercentage}
                        penalty={penalty}
                        percentage={penaltyPercentage}
                     />
                  )}
               </div>
            );
         case "certificate-date":
            return (
               <CertificateDate
                  date={certificateDate}
                  onChange={onChangeCertificateDate}
               />
            );
         case "active":
            return (
               <div className="popup-text">
                  <h3>{text.question}</h3>
                  <p>{text.info}</p>
               </div>
            );
         case "new-date":
            return (
               <NewDate
                  fromDate={newDate.fromDate}
                  toDate={newDate.toDate}
                  date={newDate.date}
                  onChange={onChangeNewDate}
                  bimestre={text}
               />
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
                     togglePopup("default");
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
                           confirm(penaltyPercentage);
                           setPenaltyPercentage("");
                           break;
                        case "certificate-date":
                           confirm(certificateDate);
                           setCertificateDate("");
                           break;
                        case "new-date":
                           confirm(newDate);
                           setNewDate({ fromDate: "", toDate: "", date: "" });
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
});

export default connect(mapStateToProps, { togglePopup })(PopUp);
