import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { FaTimes } from "react-icons/fa";

import { togglePopup, createBackup } from "../../../actions/global";
import { clearInvoice } from "../../../actions/invoice";
import { setAlert } from "../../../actions/alert";

import NewDate from "./NewDate";
import PenaltyPercentage from "./PenaltyPercentage";
import Certificate from "./Certificate";
import NewGradeType from "./NewGradeType";
import Alert from "../../pages/sharedComp/Alert";
import RestoreDB from "./RestoreDB";
import InvoiceList from "./InvoiceList";

import logo from "../../../img/logoSinLetras.png";
import "./style.scss";
import Salaries from "./Salaries";

const PopUp = ({
   global: { popupType, popupToggle },
   togglePopup,
   createBackup,
   clearInvoice,
   setAlert,
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

   const [salaries, setSalaries] = useState({
      lowerSalary: "",
      higherSalary: "",
      adminSalary: "",
      classManagerSalary: "",
   });

   const [penaltyPercentage, setPenaltyPercentage] = useState("");

   const [backup, setBackup] = useState("");

   useEffect(() => {
      if (info) {
         if (info.students)
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
         if (info.salaries) {
            setSalaries((prev) => {
               for (const x in info.salaries) prev[x] = info.salaries[x];
               return prev;
            });
         }
      }
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
      if (!isNaN(e.target.value)) setPenaltyPercentage(e.target.value);
   };

   const onChangeBackup = (file) => {
      setBackup(file);
   };

   const onChangeSalary = (e) => {
      e.persist();
      if (!isNaN(e.target.value))
         setSalaries((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
         case "backup":
            return (
               <RestoreDB
                  onChange={onChangeBackup}
                  createBackup={createBackup}
                  setAlert={setAlert}
               />
            );
         case "invoices":
            return (
               <InvoiceList
                  invoices={info}
                  clearInvoice={clearInvoice}
                  togglePopup={togglePopup}
               />
            );
         case "salary":
            return <Salaries onChange={onChangeSalary} salaries={salaries} />;
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
            <div className="mt-2">
               <Alert type="4" />
               {chooseType(popupType)}
            </div>
            <div className="btn-center">
               {popupType !== "invoices" && (
                  <button
                     type="button"
                     className="btn btn-success"
                     onClick={(e) => {
                        e.preventDefault();
                        switch (popupType) {
                           case "penalty":
                              confirm(penaltyPercentage);
                              break;
                           case "certificate":
                              confirm(certificate);
                              break;
                           case "new-date":
                              confirm(newDate);
                              break;
                           case "new-grade":
                              confirm(newGradeType);
                              break;
                           case "backup":
                              confirm(backup);
                              break;
                           case "salary":
                              confirm(salaries);
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
               )}

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
   global: state.global,
});

export default connect(mapStateToProps, {
   togglePopup,
   setAlert,
   createBackup,
   clearInvoice,
})(PopUp);
