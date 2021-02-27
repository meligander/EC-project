import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { withRouter, Link } from "react-router-dom";
import PropTypes from "prop-types";

import { setAlert } from "../../../../../../actions/alert";
import {
   registerNewGrade,
   deleteGrades,
   updateGrades,
   gradesPDF,
   certificatePDF,
   clearGradeTypes,
} from "../../../../../../actions/grade";

import PopUp from "../../../../../modal/PopUp";
import Alert from "../../../../sharedComp/Alert";

const GradesTab = ({
   history,
   period,
   classes: { classInfo },
   auth: { userLogged },
   grades: {
      grades: { header, students, periods },
      loading,
      gradeTypes,
   },
   setAlert,
   registerNewGrade,
   deleteGrades,
   updateGrades,
   clearGradeTypes,
   gradesPDF,
   certificatePDF,
}) => {
   const [formData, setFormData] = useState({
      newGrades: [],
      newGradeType: {
         period,
         classroom: classInfo._id,
         gradetype: "",
      },
   });

   const { newGrades, newGradeType } = formData;

   const [otherValues, setOtherValues] = useState({
      gradePlus: false,
      gradetypes: [],
      toggleModalSave: false,
      toggleModalDelete: false,
      toggleModalDate: false,
      toDelete: null,
   });

   const {
      gradePlus,
      gradetypes,
      toggleModalSave,
      toggleModalDelete,
      toggleModalDate,
      toDelete,
   } = otherValues;

   useEffect(() => {
      const loadGradeTypes = () => {
         let gradetypes = [];
         if (header.length === 0) {
            gradetypes = gradeTypes;
         } else {
            if (header[period - 1]) {
               for (let x = 0; x < gradeTypes.length; x++) {
                  let equal = false;
                  for (let y = 0; y < header[period - 1].length; y++) {
                     if (gradeTypes[x].name === header[period - 1][y])
                        equal = true;
                  }
                  if (!equal) gradetypes.push(gradeTypes[x]);
               }
            } else {
               gradetypes = gradeTypes;
            }
         }
         setOtherValues((prev) => ({ ...prev, gradetypes }));
      };

      const setInput = () => {
         setFormData((prev) => ({
            ...prev,
            newGrades: periods[period - 1] ? periods[period - 1] : [],
         }));
      };

      setInput();
      loadGradeTypes();
   }, [gradeTypes, period, header, periods]);

   const onChange = (e, row) => {
      let number = Number(e.target.name.substring(5, e.target.name.length));
      let changedRows = [...newGrades];
      const gradesNumber = newGrades[0].length;
      const rowN = Math.ceil((number + 1) / gradesNumber) - 1;
      const mult = gradesNumber * rowN;
      number = number - mult;
      changedRows[rowN][number] = {
         ...row,
         value: e.target.value,
      };
      setFormData({
         ...formData,
         newGrades: changedRows,
      });
   };

   const onChangeGradeTypes = (e) => {
      setFormData({
         ...formData,
         newGradeType: {
            ...newGradeType,
            gradetype: e.target.value,
         },
      });
   };

   const addGradeType = () => {
      registerNewGrade({ ...newGradeType, periods });
      if (periods[period - 1]) {
         setOtherValues({
            ...otherValues,
            gradetypes: gradetypes.filter(
               (gt) => gt._id !== newGradeType.gradetype
            ),
         });
      }
   };

   const deleteGradeType = () => {
      if (periods[period] && gradeTypes.length === gradetypes.length + 1) {
         setAlert(
            "No puede eliminar la última nota del bimestre",
            "danger",
            "4"
         );
      } else {
         setOtherValues({
            ...otherValues,
            gradePlus: false,
            gradetypes: [
               ...gradetypes,
               ...gradeTypes.filter((gt) => gt._id === toDelete.gradetype._id),
            ],
         });
         deleteGrades(toDelete);
         setFormData({
            ...formData,
            newGrades: periods[period - 1] ? periods[period - 1] : [],
         });
      }
   };

   const saveGrades = () => {
      const gradesPeriod = newGrades.filter((grade) => grade[0].student);
      updateGrades(gradesPeriod, history, classInfo._id);
   };

   const setToggle = () => {
      setOtherValues({
         ...otherValues,
         toggleModalDate: false,
         toggleModalSave: false,
         toggleModalDelete: false,
      });
   };

   const certificatePdfGenerator = (date) => {
      if (!periods[4])
         setAlert("Las notas del final deben estar cargadas", "danger", "4");
      else {
         const studentsPeriod = periods[period - 1].filter(
            (item) => item[0].student
         );

         const stringDate = moment(date).format("DD [de] MMMM [de] YYYY");
         certificatePDF(
            students.filter((student) => student.name !== ""),
            header[period - 1],
            studentsPeriod,
            classInfo,
            date !== "" ? stringDate : null,
            period
         );
      }
   };

   return (
      <>
         <Alert type="4" />
         <PopUp
            toggleModal={toggleModalSave}
            setToggleModal={setToggle}
            confirm={saveGrades}
            text="¿Está seguro que desea guardar los cambios?"
         />
         <PopUp
            toggleModal={toggleModalDelete}
            setToggleModal={setToggle}
            confirm={deleteGradeType}
            text="¿Está seguro que desea eliminar el tipo de nota?"
         />
         <PopUp
            toggleModal={toggleModalDate}
            setToggleModal={setToggle}
            type="certificate-date"
            confirm={certificatePdfGenerator}
         />
         {!loading && (
            <div className="wrapper both mt-2">
               <table className="stick">
                  <thead>
                     <tr>
                        <th>&nbsp; Nombre &nbsp;</th>
                        {header[period - 1] &&
                           header[period - 1].map((type, index) => (
                              <th key={index}>{type}</th>
                           ))}
                     </tr>
                  </thead>
                  <tbody>
                     {students.map((student, i) => (
                        <tr key={i}>
                           <td>{student.name}</td>
                           {newGrades &&
                              newGrades.length > 0 &&
                              newGrades[i].map((row, key) => (
                                 <td key={key}>
                                    {row.student !== undefined ? (
                                       <input
                                          type="number"
                                          name={row.name}
                                          onChange={(e) => onChange(e, row)}
                                          value={row.value}
                                          placeholder="Nota"
                                       />
                                    ) : (
                                       <button
                                          type="button"
                                          className="btn btn-danger"
                                          onClick={(e) => {
                                             e.preventDefault();
                                             setOtherValues({
                                                ...otherValues,
                                                toggleModalDelete: true,
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
            <button
               className="btn btn-primary"
               type="button"
               onClick={(e) => {
                  e.preventDefault();
                  setOtherValues({ ...otherValues, toggleModalSave: true });
               }}
            >
               <i className="far fa-save"></i>
               <span className="hide-md">&nbsp; Guardar Cambios</span>
            </button>
            <button
               className="btn btn-dark"
               type="button"
               onClick={(e) => {
                  e.preventDefault();
                  setOtherValues({
                     ...otherValues,
                     gradePlus: !gradePlus,
                  });
               }}
            >
               <i className="fas fa-plus"></i>
               <span className="hide-md">&nbsp; Nota</span>
            </button>
            <div className="tooltip">
               <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={(e) => {
                     e.preventDefault();
                     gradesPDF(
                        {
                           header: header[period - 1],
                           period: periods[period - 1],
                           periodNumber: period - 1,
                        },
                        classInfo,
                        "bimester"
                     );
                  }}
               >
                  <i className="fas fa-file-pdf"></i>
               </button>
               <span className="tooltiptext">PDF notas del bimestre</span>
            </div>
            {(period === 5 ||
               period === 6 ||
               (classInfo.category.name === "Kinder" && period === 4)) && (
               <div className="tooltip">
                  <button
                     className="btn btn-secondary"
                     type="button"
                     onClick={(e) => {
                        e.preventDefault();
                        setOtherValues({
                           ...setOtherValues,
                           toggleModalDate: true,
                        });
                     }}
                  >
                     <i className="fas fa-graduation-cap"></i>
                  </button>
                  <span className="tooltiptext">PDF certificados</span>
               </div>
            )}
         </div>

         {gradePlus && (
            <form
               className="form smaller pt-5"
               onSubmit={(e) => {
                  e.preventDefault();
                  addGradeType();
               }}
            >
               <div className="border">
                  <Alert type="3" />
                  <div className="form-group">
                     <select
                        className="form-input center"
                        id="gradetype"
                        value={newGradeType.gradetype}
                        onChange={onChangeGradeTypes}
                     >
                        <option value="">*Seleccione un tipo de nota</option>
                        {gradetypes.length > 0 &&
                           gradetypes.map((gradetype) => (
                              <option key={gradetype._id} value={gradetype._id}>
                                 {gradetype.name}
                              </option>
                           ))}
                     </select>
                     <label
                        htmlFor="new-category"
                        className={`form-label ${
                           newGradeType.gradetype === "" ? "lbl" : ""
                        }`}
                     >
                        Tipo de nota
                     </label>
                  </div>
                  <div className="btn-ctr mt-1">
                     <button type="submit" className="btn btn-dark">
                        <i className="fas fa-plus"></i>
                        <span className="hide-md">&nbsp; Agregar</span>
                     </button>
                     {(userLogged.type === "admin" ||
                        userLogged.type === "admin&teacher") && (
                        <div className="tooltip">
                           <Link
                              to="/edit-gradetypes"
                              onClick={() => {
                                 window.scroll(0, 0);
                                 clearGradeTypes();
                              }}
                              className="btn btn-mix-secondary"
                           >
                              <i className="fas fa-edit"></i>
                           </Link>
                           <span className="tooltiptext">
                              Editar tipo de nota
                           </span>
                        </div>
                     )}
                  </div>
               </div>
            </form>
         )}
      </>
   );
};

GradesTab.propTypes = {
   auth: PropTypes.object.isRequired,
   grades: PropTypes.object.isRequired,
   classes: PropTypes.object.isRequired,
   period: PropTypes.number.isRequired,
   registerNewGrade: PropTypes.func.isRequired,
   deleteGrades: PropTypes.func.isRequired,
   updateGrades: PropTypes.func.isRequired,
   setAlert: PropTypes.func.isRequired,
   gradesPDF: PropTypes.func.isRequired,
   certificatePDF: PropTypes.func.isRequired,
   clearGradeTypes: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   classes: state.classes,
   grades: state.grades,
   auth: state.auth,
});

export default connect(mapStateToProps, {
   setAlert,
   registerNewGrade,
   deleteGrades,
   updateGrades,
   gradesPDF,
   certificatePDF,
   clearGradeTypes,
})(withRouter(GradesTab));
