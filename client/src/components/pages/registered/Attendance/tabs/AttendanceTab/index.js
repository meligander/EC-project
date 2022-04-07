import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { FaPlus, FaTimes, FaScroll } from "react-icons/fa";
import { FiSave } from "react-icons/fi";
import { ImFilePdf } from "react-icons/im";
import format from "date-fns/format";

import {
   registerNewDate,
   deleteDate,
   updateAttendances,
   attendancesPDF,
} from "../../../../../../actions/attendance";
import { togglePopup } from "../../../../../../actions/global";

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

   const [newAttendances, setNewAttendances] = useState([]);

   const [adminValues, setAdminValues] = useState({
      popupType: "",
      toDelete: null,
   });

   const { popupType, toDelete } = adminValues;

   useEffect(() => {
      setNewAttendances(periods[period - 1] ? periods[period - 1] : []);
   }, [period, periods]);

   const onChange = (e, student, date) => {
      e.persist();
      if (year === classInfo.year) {
         const newA = [...newAttendances];
         newA[student][date].inassistance = !e.target.checked;

         setNewAttendances(newA);
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
                        classInfo._id,
                        period
                     );
                     break;
                  case "delete":
                     deleteDate(
                        toDelete,
                        classInfo._id,
                        period,
                        periods[period] && header[period - 1].length === 1
                     );
                     break;
                  case "new-date":
                     registerNewDate(
                        !periods[period - 1]
                           ? {
                                ...newDate,
                                day1: classInfo.day1,
                                day2: classInfo.day2,
                             }
                           : newDate,
                        classInfo._id,
                        period,
                        periods
                     );
                     break;
                  default:
                     break;
               }
            }}
            error={popupType === "new-date"}
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
                        <td>
                           {student._id &&
                              student.lastname + ", " + student.name}
                        </td>
                        {newAttendances.length > 0 &&
                           newAttendances[i].map((row, key) => (
                              <td key={key}>
                                 <input
                                    type="checkbox"
                                    checked={!row.inassistance}
                                    className="option-input"
                                    name={row.name}
                                    onChange={(e) => onChange(e, i, key)}
                                 />
                              </td>
                           ))}
                     </tr>
                  ))}
               </tbody>
               <tbody>
                  <tr className="sticky">
                     <td></td>
                     {newAttendances.length > 0 &&
                        newAttendances[0].map((item, i) => (
                           <td key={i}>
                              <button
                                 type="button"
                                 className="btn btn-danger"
                                 onClick={(e) => {
                                    e.preventDefault();
                                    setAdminValues({
                                       ...adminValues,
                                       popupType: "delete",
                                       toDelete: item.date,
                                    });
                                    togglePopup("default");
                                 }}
                              >
                                 <FaTimes />
                              </button>
                           </td>
                        ))}
                  </tr>
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
               className={`btn ${
                  year === classInfo.year ? "btn-dark" : "btn-black"
               }`}
               type="button"
               disabled={year !== classInfo.year}
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
            <div className="tooltip">
               <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={(e) => {
                     e.preventDefault();
                     attendancesPDF(header[period - 1], periods[period - 1], {
                        students:
                           year === classInfo.year
                              ? students.slice(0, -1)
                              : students,
                        teacher:
                           classInfo.teacher.lastname +
                           ", " +
                           classInfo.teacher.name,
                        category: classInfo.category.name,
                        period: period - 1,
                     });
                  }}
               >
                  <ImFilePdf />
               </button>
               <span className="tooltiptext">PDF asistencias del bimestre</span>
            </div>
            {year === classInfo.year && (
               <div className="tooltip">
                  <button
                     type="button"
                     className="btn btn-secondary"
                     onClick={(e) => {
                        e.preventDefault();
                        attendancesPDF(header[period - 1], null, {
                           students: students.slice(0, -1),
                           teacher:
                              classInfo.teacher.lastname +
                              ", " +
                              classInfo.teacher.name,
                           category: classInfo.category.name,
                           period: period - 1,
                        });
                     }}
                  >
                     <FaScroll />
                  </button>
                  <span className="tooltiptext">
                     PDF en blanco para notas y asistencias
                  </span>
               </div>
            )}
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
