import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import { setAlert } from "../../../../../actions/alert";
import {
   registerNewDate,
   deleteDate,
   updateAttendances,
   attendancesPDF,
} from "../../../../../actions/attendance";

import Confirm from "../../../../modal/Confirm";

const AttendanceTab = ({
   history,
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
         period,
         classroom: classInfo._id,
      },
   });
   const [otherValues, setOtherValues] = useState({
      dayPlus: false,
      toggleModalSave: false,
      toggleModalDelete: false,
      toDelete: null,
   });

   const {
      dayPlus,
      toggleModalDelete,
      toggleModalSave,
      toDelete,
   } = otherValues;
   const { newAttendances, newDay } = formData;

   useEffect(() => {
      const setInput = () => {
         setFormData((prev) => ({
            ...prev,
            newAttendances: periods[period - 1] ? periods[period - 1] : [],
         }));
      };

      setInput();
   }, [period, periods]);

   const onChange = (e, row) => {
      let number = Number(e.target.name.substring(5, e.target.name.length));
      let changedRows = [...newAttendances];
      const daysNumber = newAttendances[0].length;
      const rowN = Math.ceil((number + 1) / daysNumber) - 1;
      const mult = daysNumber * rowN;
      number = number - mult;
      changedRows[rowN][number] = {
         ...row,
         inassistance: !row.inassistance,
      };

      setFormData({
         ...formData,
         newAttendances: changedRows,
      });
   };

   const onChangeDate = (e) => {
      setFormData({
         ...formData,
         newDay: {
            ...newDay,
            date: e.target.value,
         },
      });
   };

   const addDate = () => {
      registerNewDate({ ...newDay, periods });
      setOtherValues({ ...otherValues, dayPlus: !dayPlus });
      setFormData({
         ...formData,
         newAttendances: periods[period - 1],
      });
   };

   const clickAddDate = () => {
      setOtherValues({ ...otherValues, dayPlus: !dayPlus });
   };

   const deleteDateAc = () => {
      if (periods[period] && header[period - 1].length === 1) {
         setAlert(
            "No puede eliminar la última fecha del bimestre",
            "danger",
            "2"
         );
         window.scroll(0, 0);
      } else {
         deleteDate(toDelete.date, toDelete.classroom);
         setOtherValues({ ...otherValues, dayPlus: false });
         setFormData({
            ...formData,
            newAttendances: periods[period - 1] ? periods[period - 1] : [],
         });
      }
   };

   const saveAttendances = () => {
      const AttendancePeriod = newAttendances.filter(
         (attendance) => attendance[0].student
      );
      updateAttendances(AttendancePeriod, history, classInfo._id);
   };

   const setToggleSave = (e) => {
      if (e) e.preventDefault();
      setOtherValues({
         ...otherValues,
         toggleModalSave: !toggleModalSave,
      });
   };

   const setToggleDelete = (e) => {
      if (e) e.preventDefault();
      setOtherValues({
         ...otherValues,
         toggleModalDelete: !toggleModalDelete,
      });
   };

   const pdfGeneratorSave = () => {
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
         {!loading && (
            <div className="wrapper both">
               <Confirm
                  toggleModal={toggleModalSave}
                  setToggleModal={setToggleSave}
                  confirm={saveAttendances}
                  text="¿Está seguro que desea guardar los cambios?"
               />
               <Confirm
                  toggleModal={toggleModalDelete}
                  setToggleModal={setToggleDelete}
                  confirm={deleteDateAc}
                  text="¿Está seguro que desea eliminar la fecha?"
               />
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
                                          className="btn btn-danger"
                                          onClick={() => {
                                             setOtherValues({
                                                ...otherValues,
                                                toggleModalDelete: !toggleModalDelete,
                                                toDelete: row,
                                             });
                                          }}
                                       >
                                          <i className="fas fa-times"></i>
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
            <button className="btn btn-primary" onClick={setToggleSave}>
               <i className="far fa-save"></i>
               <span className="hide-md">&nbsp; Guardar</span>
            </button>
            <button className="btn btn-light" onClick={clickAddDate}>
               <i className="fas fa-plus"></i>
               <span className="hide-md">&nbsp; Día</span>
            </button>
            <button className="btn btn-secondary" onClick={pdfGeneratorSave}>
               <i className="fas fa-file-pdf"></i>
            </button>
         </div>
         {dayPlus && (
            <div className="form smaller pt-5">
               <div className="border">
                  <div className="form-group">
                     <input
                        className="form-input center"
                        id="date"
                        type="date"
                        name="newDate"
                        onChange={onChangeDate}
                        value={newDay.day}
                     />
                     <label htmlFor="date" className="form-label show">
                        Nuevo día
                     </label>
                  </div>
                  <div className="btn-ctr">
                     <button className="btn btn-dark" onClick={addDate}>
                        <i className="fas fa-plus"></i>
                        <span className="hide-sm">&nbsp; Agregar</span>
                     </button>
                  </div>
               </div>
            </div>
         )}
      </>
   );
};

AttendanceTab.propTypes = {
   classes: PropTypes.object.isRequired,
   attendances: PropTypes.object.isRequired,
   registerNewDate: PropTypes.func.isRequired,
   updateAttendances: PropTypes.func.isRequired,
   deleteDate: PropTypes.func.isRequired,
   period: PropTypes.number.isRequired,
   setAlert: PropTypes.func.isRequired,
   attendancesPDF: PropTypes.func.isRequired,
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
})(withRouter(AttendanceTab));
