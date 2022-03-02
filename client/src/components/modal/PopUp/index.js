import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { FaTimes } from "react-icons/fa";

import { togglePopup } from "../../../actions/mixvalues";

import NewDate from "./NewDate";
import PenaltyPercentage from "./PenaltyPercentage";
import Certificate from "./Certificate";
import NewGradeType from "./NewGradeType";
import Alert from "../../pages/sharedComp/Alert";

import logo from "../../../img/logoSinLetras.png";
import "./style.scss";

const PopUp = ({
   mixvalues: { popupType, popupToggle },
   togglePopup,
   confirm,
   info,
   error,
}) => {
   const [newDate, setNewDate] = useState({
      fromDate: "",
      toDate: "",
      date: "",
   });

   const [newGradeType, setNewGradeType] = useState("");

   const [certificate, setCertificate] = useState({
      date: "",
      students: [],
   });

   const [penaltyPercentage, setPenaltyPercentage] = useState("");

   useEffect(() => {
      console.log("hola");
      if (info && info.students)
         setCertificate((prev) => ({
            ...prev,
            students: info.students.map((item) => {
               return {
                  ...item,
                  name: item.lastname + ", " + item.name,
                  checked: false,
               };
            }),
         }));
   }, [info]);

   const onChangeCertificate = (e, i) => {
      e.persist();
      if (e.target.name === "date")
         setCertificate((prev) => ({ ...prev, date: e.target.value }));
      else {
         let newStudents = [...certificate.students];
         newStudents[i].checked = e.target.checked;

         setCertificate((prev) => ({
            ...prev,
            students: newStudents,
         }));
      }
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
         case "certificate":
            return typeof info === "object" ? (
               <Certificate
                  date={certificate.date}
                  students={certificate.students}
                  period={info.period}
                  onChange={onChangeCertificate}
               />
            ) : (
               <></>
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
         case "new-grade":
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
            <Alert type="4" />
            <div className={popupType === "certificate" ? "wrapper both" : ""}>
               {chooseType(popupType)}
            </div>
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
                        case "certificate":
                           confirm(certificate);
                           setCertificate({ date: "", students: [] });
                           break;
                        case "new-date":
                           confirm(newDate);
                           setNewDate({ fromDate: "", toDate: "", date: "" });
                           break;
                        case "new-grade":
                           confirm(newGradeType);
                           setNewGradeType("");
                           break;
                        default:
                           confirm();
                           break;
                     }
                     if (!error) togglePopup("default");
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
