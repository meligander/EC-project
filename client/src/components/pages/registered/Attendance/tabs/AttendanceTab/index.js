import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { FaPlus, FaTimes } from "react-icons/fa";
import { FiSave } from "react-icons/fi";
import { ImFilePdf } from "react-icons/im";
import format from "date-fns/format";

import {
   registerNewDate,
   deleteDate,
   updateAttendances,
   attendancesPDF,
} from "../../../../../../actions/attendance";
import { togglePopup } from "../../../../../../actions/mixvalues";

import PopUp from "../../../../../modal/PopUp";
import Alert from "../../../../sharedComp/Alert";

const AttendanceTab = ({
   classes: { classInfo },
   attendances: {
      attendances: { header, students, periods },
   },
   period,
   registerNewDate,
   deleteDate,
   updateAttendances,
   attendancesPDF,
   togglePopup,
}) => {
   const year = new Date().getFullYear();

   const [adminValues, setAdminValues] = useState({
      popupType: "",
      toDelete: null,
      newAttendances: [],
   });

   const { popupType, toDelete, newAttendances } = adminValues;

   useEffect(() => {
      setAdminValues((prev) => ({
         ...prev,
         newAttendances: periods[period - 1] ? periods[period - 1] : [],
      }));
   }, [period, periods]);

   const onChange = (e, student, date) => {
      e.persist();
      if (year === classInfo.year) {
         newAttendances[student][date].inassistance = !e.target.checked;

         setAdminValues((prev) => ({
            ...prev,
            newAttendances,
         }));
      }
   };

   return (
      <>
         <Alert type="3" />
         <PopUp
            confirm={(newDate) => {
               switch (popupType) {
                  case "save":
                     updateAttendances(
                        newAttendances.filter(
                           (attendance) => attendance[0].student
                        ),
                        classInfo._id
                     );
                     break;
                  case "delete":
                     deleteDate(
                        toDelete.date,
                        classInfo._id,
                        periods[period] && header[period - 1].length === 1
                     );
                     break;
                  case "new-date":
                     registerNewDate(
                        { ...newDate, period, classroom: classInfo, periods },
                        !periods[period - 1]
                     );
                     break;
                  default:
                     break;
               }
            }}
            info={
               popupType !== "new-date"
                  ? `¿Está seguro que desea ${
                       popupType === "save"
                          ? "guardar los cambios"
                          : "eliminar la fecha"
                    }?`
                  : !periods[period - 1]
            }
         />
         <div className="wrapper both mt-2">
            <table className="stick">
               <thead>
                  <tr>
                     <th>Nombre</th>
                     {header[period - 1] &&
                        header[period - 1].map((day, index) => (
                           <th key={index}>
                              {format(new Date(day.slice(0, -1)), "dd/MM")}
                           </th>
                        ))}
                  </tr>
               </thead>
               <tbody>
                  {students.map((student, i) => (
                     <tr key={i}>
                        <td>{student.name}</td>
                        {newAttendances[i] &&
                           newAttendances[i].map((row, key) => (
                              <td key={key}>
                                 {row.student ? (
                                    <input
                                       type="checkbox"
                                       checked={!row.inassistance}
                                       className="option-input"
                                       name={row.name}
                                       onChange={(e) => onChange(e, i, key)}
                                    />
                                 ) : (
                                    year === classInfo.year && (
                                       <button
                                          type="button"
                                          className="btn btn-danger"
                                          onClick={(e) => {
                                             e.preventDefault();
                                             setAdminValues({
                                                ...adminValues,
                                                popupType: "delete",
                                                toDelete: row,
                                             });
                                             togglePopup("default");
                                          }}
                                       >
                                          <FaTimes />
                                       </button>
                                    )
                                 )}
                              </td>
                           ))}
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
         <div className="btn-right">
            {year === classInfo.year && (
               <>
                  <button
                     className="btn btn-primary"
                     type="button"
                     onClick={(e) => {
                        e.preventDefault();
                        setAdminValues({
                           ...adminValues,
                           popupType: "save",
                        });
                        togglePopup("default");
                     }}
                  >
                     <FiSave />
                     <span className="hide-md">&nbsp;Guardar</span>
                  </button>
                  <button
                     className="btn btn-dark"
                     type="button"
                     onClick={(e) => {
                        e.preventDefault();
                        setAdminValues((prev) => ({
                           ...prev,
                           popupType: "new-date",
                        }));
                        togglePopup("new-date");
                     }}
                  >
                     <FaPlus />
                     <span className="hide-md">&nbsp;Día</span>
                  </button>
               </>
            )}
            <div className="tooltip">
               <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={(e) => {
                     e.preventDefault();
                     attendancesPDF(
                        header[period - 1],
                        students,
                        periods[period - 1],
                        period - 1,
                        classInfo
                     );
                  }}
               >
                  <ImFilePdf />
               </button>
               <span className="tooltiptext">PDF asistencias del bimestre</span>
            </div>
         </div>
      </>
   );
};

const mapStateToProps = (state) => ({
   classes: state.classes,
   attendances: state.attendances,
});

export default connect(mapStateToProps, {
   registerNewDate,
   deleteDate,
   updateAttendances,
   attendancesPDF,
   togglePopup,
})(AttendanceTab);
