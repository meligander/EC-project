import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { FaPlus, FaTimes } from "react-icons/fa";
import { FiSave } from "react-icons/fi";
import { ImFilePdf } from "react-icons/im";

import { setAlert } from "../../../../../../actions/alert";
import {
   registerNewDate,
   deleteDate,
   updateAttendances,
   attendancesPDF,
} from "../../../../../../actions/attendance";

import PopUp from "../../../../../modal/PopUp";
import Alert from "../../../../sharedComp/Alert";

const AttendanceTab = ({
   classes: { classInfo },
   attendances: {
      attendances: { header, students, periods },
      loading,
   },
   period,
   setAlert,
   registerNewDate,
   deleteDate,
   updateAttendances,
   attendancesPDF,
}) => {
   const [formData, setFormData] = useState({
      newAttendances: [],
      newDay: {
         date: "",
         fromDate: "",
         toDate: "",
         period,
         classroom: classInfo,
      },
   });
   const [adminValues, setAdminValues] = useState({
      dayPlus: false,
      addBimester: false,
      toggleModalSave: false,
      toggleModalDelete: false,
      toDelete: null,
   });

   const {
      dayPlus,
      addBimester,
      toggleModalDelete,
      toggleModalSave,
      toDelete,
   } = adminValues;
   const { newAttendances, newDay } = formData;

   useEffect(() => {
      const setInput = () => {
         setFormData((prev) => ({
            ...prev,
            newAttendances: periods[period - 1] ? periods[period - 1] : [],
         }));

         if (!periods[period - 1]) {
            setAdminValues((prev) => ({
               ...prev,
               addBimester: true,
            }));
         }
      };

      setInput();
   }, [period, periods]);

   const onChange = (e, row) => {
      let number = Number(e.target.name.substring(5, e.target.name.length));

      const daysNumber = newAttendances[0].length;
      const rowN = Math.ceil((number + 1) / daysNumber) - 1;
      const mult = daysNumber * rowN;
      number = number - mult;
      newAttendances[rowN][number] = {
         ...row,
         inassistance: !row.inassistance,
      };

      setFormData((prev) => ({
         ...prev,
         newAttendances,
      }));
   };

   const onChangeDate = (e) => {
      setFormData((prev) => ({
         ...prev,
         newDay: {
            ...newDay,
            [e.target.name]: e.target.value,
         },
      }));
   };

   const addDate = () => {
      registerNewDate(
         { ...newDay, ...(addBimester && { periods }) },
         addBimester
      );

      if (!periods[period - 1]) {
         setAdminValues({
            ...adminValues,
            addBimester: false,
            dayPlus: false,
         });
      }
   };

   const deleteDateAc = () => {
      if (periods[period] && header[period - 1].length === 1) {
         setAlert(
            "No puede eliminar la última fecha del bimestre",
            "danger",
            "4"
         );
      } else {
         deleteDate(
            toDelete.date,
            typeof toDelete.classroom === "object"
               ? toDelete.classroom._id
               : toDelete.classroom
         );
         setAdminValues((prev) => ({ ...prev, dayPlus: false }));
         setFormData((prev) => ({
            ...prev,
            newAttendances: periods[period - 1] ? periods[period - 1] : [],
         }));
      }
   };

   const saveAttendances = () => {
      const AttendancePeriod = newAttendances.filter(
         (attendance) => attendance[0].student
      );
      updateAttendances(AttendancePeriod, classInfo._id);
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
         <Alert type="4" />
         <PopUp
            toggleModal={toggleModalSave}
            setToggleModal={() =>
               setAdminValues((prev) => ({
                  ...prev,
                  toggleModalSave: !toggleModalSave,
               }))
            }
            confirm={saveAttendances}
            text="¿Está seguro que desea guardar los cambios?"
         />
         <PopUp
            toggleModal={toggleModalDelete}
            setToggleModal={() =>
               setAdminValues((prev) => ({
                  ...prev,
                  toggleModalDelete: !toggleModalDelete,
               }))
            }
            confirm={deleteDateAc}
            text="¿Está seguro que desea eliminar la fecha?"
         />
         {!loading && (
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
                           {newAttendances &&
                              newAttendances.length > 0 &&
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
                                                toggleModalDelete: true,
                                                toDelete: row,
                                             });
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
         )}
         <div className="btn-right">
            <button
               className="btn btn-primary"
               type="button"
               onClick={(e) => {
                  e.preventDefault();
                  setAdminValues({
                     ...adminValues,
                     toggleModalSave: true,
                  });
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
                  setAdminValues({ ...adminValues, dayPlus: !dayPlus });
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
                     pdfGenerator();
                  }}
               >
                  <ImFilePdf />
               </button>
               <span className="tooltiptext">PDF asistencias del bimestre</span>
            </div>
         </div>
         {dayPlus && (
            <form
               className="form smaller pt-5"
               onSubmit={(e) => {
                  e.preventDefault();
                  addDate();
               }}
            >
               <div className="border">
                  <Alert type="3" />
                  {addBimester ? (
                     <>
                        <div className="form-group">
                           <input
                              className="form-input center"
                              id="fromDate"
                              type="date"
                              name="fromDate"
                              onChange={onChangeDate}
                              value={newDay.fromDate}
                           />
                           <label
                              htmlFor="fromDate"
                              className="form-label show"
                           >
                              Comienzo del bimestre
                           </label>
                        </div>
                        <div className="form-group">
                           <input
                              className="form-input center"
                              id="toDate"
                              type="date"
                              name="toDate"
                              onChange={onChangeDate}
                              value={newDay.toDate}
                           />
                           <label htmlFor="toDate" className="form-label show">
                              Fin del bimestre
                           </label>
                        </div>
                     </>
                  ) : (
                     <div className="form-group">
                        <input
                           className="form-input center"
                           id="date"
                           type="date"
                           name="date"
                           onChange={onChangeDate}
                           value={newDay.day}
                        />
                        <label htmlFor="date" className="form-label show">
                           Nuevo día
                        </label>
                     </div>
                  )}

                  <div className="btn-center">
                     <button type="submit" className="btn btn-dark">
                        <FaPlus />
                        <span className="hide-sm">&nbsp;Agregar</span>
                     </button>
                  </div>
               </div>
            </form>
         )}
      </>
   );
};

const mapStateToProps = (state) => ({
   classes: state.classes,
   attendances: state.attendances,
});

export default connect(mapStateToProps, {
   setAlert,
   registerNewDate,
   deleteDate,
   updateAttendances,
   attendancesPDF,
})(AttendanceTab);
