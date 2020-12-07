import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { setAlert } from "../../../actions/alert";
import {
   registerNewDate,
   deleteDate,
   updateAttendances,
   attendancesPDF,
} from "../../../actions/attendance";
import PropTypes from "prop-types";
import Confirm from "../../modal/Confirm";

const AttendanceTab = ({
   history,
   classes: { classInfo },
   attendance: { attendances, loading },
   period,
   setAlert,
   registerNewDate,
   deleteDate,
   updateAttendances,
   navbar,
   attendancesPDF,
}) => {
   const [formData, setFormData] = useState({
      newAttendances: {
         period: "",
         rows: [],
      },
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
            newAttendances:
               attendances.periods[period - 1] !== undefined
                  ? attendances.periods[period - 1]
                  : {
                       period: "",
                       rows: [],
                    },
         }));
      };

      if (newAttendances.rows[0]) {
         if (
            attendances.periods[period - 1].rows[0].length !==
            newAttendances.rows[0].length
         ) {
            setInput();
         }
      } else {
         setInput();
      }
      // eslint-disable-next-line
   }, [period, attendances]);

   const onChange = (e, row) => {
      let number = Number(e.target.name.substring(5, e.target.name.length));
      let changedRows = { ...newAttendances };
      const daysNumber = newAttendances.rows[0].length;
      const rowN = Math.ceil((number + 1) / daysNumber) - 1;
      const mult = daysNumber * rowN;
      number = number - mult;
      changedRows.rows[rowN][number] = {
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
      if (newDay.date === "") {
         setAlert("Primero debe elegir una fecha", "danger", "2");
         window.scroll(0, 0);
      } else {
         registerNewDate(newDay);
         setOtherValues({ ...otherValues, dayPlus: !dayPlus });
      }
   };

   const clickAddDate = () => {
      setOtherValues({ ...otherValues, dayPlus: !dayPlus });
   };

   const deleteDateAc = () => {
      deleteDate(toDelete.date);
      setOtherValues({ ...otherValues, dayPlus: false });
   };

   const saveAttendances = () => {
      updateAttendances(newAttendances.rows, history, classInfo._id);
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
      const headers = {
         header1: attendances.header.header1[period - 1],
         header2: attendances.header.header2,
      };
      attendancesPDF(
         headers,
         attendances.periods[period - 1].rows,
         period - 1,
         classInfo
      );
   };

   return (
      <>
         {!loading && (
            <div className="wrapper">
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
               <table className={!navbar ? "stick" : ""}>
                  <thead>
                     <tr>
                        <th className="bg-strong">Nombre</th>
                        {attendances.header.header1[period - 1] &&
                           attendances.header.header1[
                              period - 1
                           ].map((day, index) => <th key={index}>{day}</th>)}
                     </tr>
                  </thead>
                  <tbody>
                     {attendances.header.header2.map((student, i) => (
                        <tr key={i}>
                           <td className="bg-white">{student}</td>
                           {newAttendances.rows.length > 0 &&
                              newAttendances.rows[i].map((row, key) => (
                                 <td key={key}>
                                    {row.user !== undefined ? (
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
               <span className="hide-md"> Guardar Cambios</span>
            </button>
            <button className="btn btn-light" onClick={clickAddDate}>
               <i className="fas fa-plus"></i>
               <span className="hide-md"> Día</span>
            </button>
            <button className="btn btn-secondary" onClick={pdfGeneratorSave}>
               <i className="far fa-save"></i>
            </button>
         </div>
         {dayPlus && (
            <div className="form smaller pt-5">
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
                  <button className="btn btn-light" onClick={addDate}>
                     <i className="fas fa-plus"></i>
                     <span className="hide-sm"> Agregar</span>
                  </button>
               </div>
            </div>
         )}
      </>
   );
};

AttendanceTab.propTypes = {
   classes: PropTypes.object.isRequired,
   attendance: PropTypes.object.isRequired,
   navbar: PropTypes.bool.isRequired,
   registerNewDate: PropTypes.func.isRequired,
   updateAttendances: PropTypes.func.isRequired,
   deleteDate: PropTypes.func.isRequired,
   period: PropTypes.number.isRequired,
   setAlert: PropTypes.func.isRequired,
   attendancesPDF: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   classes: state.classes,
   attendance: state.attendance,
   navbar: state.navbar.showMenu,
});

export default connect(mapStateToProps, {
   setAlert,
   registerNewDate,
   deleteDate,
   updateAttendances,
   attendancesPDF,
})(withRouter(AttendanceTab));
