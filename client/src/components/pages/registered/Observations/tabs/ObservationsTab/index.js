import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { FiSave } from "react-icons/fi";
import { FaAddressCard } from "react-icons/fa";

import {
   updateObservations,
   reportcardPDF,
} from "../../../../../../actions/observation";
import { togglePopup } from "../../../../../../actions/global";

import PopUp from "../../../../../modal/PopUp";
import Alert from "../../../../sharedComp/Alert";

const ObservationsTab = ({
   auth: { userLogged },
   classes: { classInfo },
   observations: { observations },
   period,
   updateObservations,
   togglePopup,
   reportcardPDF,
}) => {
   const year = new Date().getFullYear();

   const [newObservations, setNewObservations] = useState([]);

   const [adminValues, setAdminValues] = useState({
      popupType: "",
   });

   const { popupType } = adminValues;

   useEffect(() => {
      setNewObservations(observations[period - 1]);
   }, [period, observations]);

   const onChange = (e, i) => {
      e.persist();
      const newO = [...newObservations];
      newO[i].observation.description = e.target.value;

      setNewObservations(newO);
   };

   return (
      <>
         <Alert type="3" />
         <PopUp
            confirm={(info) => {
               if (popupType === "save")
                  updateObservations(newObservations, classInfo._id, period);
               else
                  reportcardPDF(info.students, {
                     teacher:
                        classInfo.teacher.lastname +
                        ", " +
                        classInfo.teacher.name,
                     category: classInfo.category.name,
                     classroom: classInfo._id,
                     period,
                  });
            }}
            info={
               popupType === "save"
                  ? "¿Está seguro que desea guardar los cambios"
                  : { students: observations[period - 1], period }
            }
            error
         />
         <div className="wrapper both mt-2">
            <table className="stick">
               <thead>
                  <tr>
                     <th>Nombre</th>
                     <th>Observaciones</th>
                  </tr>
               </thead>
               <tbody>
                  {newObservations.map((item, i) => (
                     <tr key={i}>
                        <td>{item.lastname + ", " + item.name}</td>
                        <td>
                           <textarea
                              onChange={(e) => onChange(e, i)}
                              rows={
                                 year !== classInfo.year &&
                                 item.observation.description === ""
                                    ? "1"
                                    : "4"
                              }
                              cols="50"
                              disabled={year !== classInfo.year}
                              name="description"
                              value={item.observation.description}
                           ></textarea>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
         <div className="btn-right">
            <button
               className={`btn ${
                  year === classInfo.year ? "btn-primary" : "btn-black"
               }`}
               type="button"
               disabled={year !== classInfo.year}
               onClick={(e) => {
                  e.preventDefault();
                  setAdminValues((prev) => ({ ...prev, popupType: "save" }));
                  togglePopup("default");
               }}
            >
               <FiSave />
               <span className="hide-md">&nbsp;Guardar</span>
            </button>
            {userLogged.type !== "teacher" && (
               <div className="tooltip">
                  <button
                     type="button"
                     className="btn btn-secondary"
                     onClick={(e) => {
                        e.preventDefault();
                        setAdminValues((prev) => ({
                           ...prev,
                           popupType: "certificate",
                        }));
                        togglePopup("certificate");
                     }}
                  >
                     <FaAddressCard />
                  </button>
                  <span className="tooltiptext">PDF libretas</span>
               </div>
            )}
         </div>
      </>
   );
};

const mapStateToProps = (state) => ({
   auth: state.auth,
   classes: state.classes,
   observations: state.observations,
});

export default connect(mapStateToProps, {
   updateObservations,
   togglePopup,
   reportcardPDF,
})(ObservationsTab);
