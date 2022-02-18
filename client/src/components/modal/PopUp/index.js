import React, { useState } from "react";
import { connect } from "react-redux";
import { FaTimes } from "react-icons/fa";

import { togglePopup } from "../../../actions/mixvalues";

import NewDate from "./NewDate";
import PenaltyPercentage from "./PenaltyPercentage";
import CertificateDate from "./CertificateDate";

import logo from "../../../img/logoSinLetras.png";
import "./style.scss";
import NewGradeType from "./NewGradeType";

const PopUp = ({
   mixvalues: { popupType, popupToggle },
   togglePopup,
   confirm,
   info,
}) => {
   const [newDate, setNewDate] = useState({
      fromDate: "",
      toDate: "",
      date: "",
   });

   const [newGradeType, setNewGradeType] = useState("");

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

   const onChangeGradeType = (e) => {
      e.persist();
      setNewGradeType(e.target.value);
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
                  {
                     <PenaltyPercentage
                        onChange={onChangePenaltyPercentage}
                        penalty={info.penalty}
                        percentage={penaltyPercentage}
                     />
                  }
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
                  <h3>{info.question}</h3>
                  <p>{info.info}</p>
               </div>
            );
         case "new-date":
            return (
               <NewDate
                  fromDate={newDate.fromDate}
                  toDate={newDate.toDate}
                  date={newDate.date}
                  onChange={onChangeNewDate}
                  bimestre={info}
               />
            );
         case "new-grade-type":
            return typeof info === "object" ? (
               <NewGradeType
                  onChange={onChangeGradeType}
                  gradetype={newGradeType}
                  gradetypes={info.gradetypes}
                  clearGradeTypes={info.clearGradeTypes}
                  isAdmin={info.isAdmin}
                  togglePopup={togglePopup}
               />
            ) : (
               <></>
            );
         case "default":
            return typeof info === "string" ? (
               <div className="popup-text">
                  <h3>{info}</h3>
               </div>
            ) : (
               <></>
            );
         default:
            break;
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
                        case "new-grade-type":
                           confirm(newGradeType);
                           setNewGradeType("");
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
                     togglePopup("default");
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
});

export default connect(mapStateToProps, { togglePopup })(PopUp);
