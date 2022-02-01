import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { FaPlus, FaTimes } from "react-icons/fa";
import { FiSave } from "react-icons/fi";
import { ImFilePdf } from "react-icons/im";

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
   const date = new Date();

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

   const onChange = (e, row) => {
      e.persist();
      let number = Number(e.target.name.substring(5, e.target.name.length));

      const daysNumber = newAttendances[0].length;
      const rowN = Math.ceil((number + 1) / daysNumber) - 1;
      const mult = daysNumber * rowN;
      number = number - mult;
      newAttendances[rowN][number] = {
         ...row,
         inassistance: !row.inassistance,
      };

      setAdminValues((prev) => ({
         ...prev,
         newAttendances,
      }));
   };

   const deleteDateAc = () => {
      deleteDate(
         toDelete.date,
         classInfo._id,
         periods[period] && header[period - 1].length === 1
      );
      setAdminValues((prev) => ({
         ...prev,
         newAttendances: periods[period - 1] ? periods[period - 1] : [],
      }));
   };

   const pdfGenerator = () => {
      attendancesPDF(
         header[period - 1],
         students,
         periods[period - 1],
         period - 1,
         classInfo
      );
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
                     deleteDateAc();
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
            text={
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
                           <th key={index}>{day}</th>
                        ))}
                  </tr>
               </thead>
               <tbody>
                  {students.map((student, i) => (
                     <tr key={i}>
                        <td>{student}</td>
                        {newAttendances[0] &&
                           newAttendances[i].map((row, key) => (
                              <td key={key}>
                                 {row.student ? (
                                    <input
                                       type="checkbox"
                                       checked={!row.inassistance}
                                       className="option-input"
                                       name={row.name}
                                       onChange={(e) => onChange(e, row)}
                                    />
                                 ) : (
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
                                 )}
                              </td>
                           ))}
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
         <div className="btn-right">
            {date.getFullYear() === classInfo.year && (
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
                     pdfGenerator();
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
