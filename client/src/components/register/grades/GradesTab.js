import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { withRouter, Link } from "react-router-dom";
import { setAlert } from "../../../actions/alert";
import {
   registerNewGrade,
   deleteGrades,
   updateGrades,
   clearGrades,
   gradesPDF,
   certificatePDF,
} from "../../../actions/grade";
import PropTypes from "prop-types";
import Confirm from "../../modal/Confirm";

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
   clearGrades,
   navbar,
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
      reload: false,
      toggleModalSave: false,
      toggleModalDelete: false,
      toggleModalDate: false,
      toDelete: null,
   });

   const {
      gradePlus,
      gradetypes,
      reload,
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
            newGrades:
               periods[period - 1] !== undefined ? periods[period - 1] : [],
         }));
      };

      if (periods[period - 1] && (newGrades.length === 0 || reload)) setInput();
      loadGradeTypes();

      // eslint-disable-next-line
   }, [gradeTypes, period, newGrades, reload, header, periods]);

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

   const clickAddGrade = () => {
      setOtherValues({
         ...otherValues,
         gradePlus: !gradePlus,
      });
   };

   const addGradeType = () => {
      let pass = true;
      if (period !== 1) {
         if (!periods[period - 2]) {
            pass = false;
         }
      }
      if (!pass || newGradeType.gradetype === 0) {
         if (newGradeType.gradetype === 0) {
            setAlert("Primero debe elegir un tipo de nota", "danger", "2");
         } else {
            setAlert(
               "Debe agregar por lo menos una nota en los bimestres anteriores",
               "danger",
               "2"
            );
         }
         window.scroll(0, 0);
      } else {
         registerNewGrade(newGradeType);
         setOtherValues({
            ...otherValues,
            gradePlus: !gradePlus,
            gradetypes: gradetypes.filter(
               (gt) => gt._id !== newGradeType.gradetype
            ),
            reload: true,
         });
      }
   };

   const deleteGradeType = () => {
      if (periods[period] && gradeTypes.length === gradetypes.length + 1) {
         setAlert(
            "No puede eliminar la última nota del bimestre",
            "danger",
            "2"
         );
         window.scroll(0, 0);
      } else {
         setOtherValues({
            ...otherValues,
            gradePlus: false,
            gradetypes: [
               ...gradetypes,
               ...gradeTypes.filter((gt) => gt._id === toDelete.gradetype._id),
            ],
            reload: true,
         });
         deleteGrades(toDelete);
      }
   };

   const saveGrades = () => {
      const gradesPeriod = newGrades.filter((grade) => grade[0].student);

      updateGrades(gradesPeriod, history, classInfo._id);
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

   const setToggleDate = (e) => {
      if (e) e.preventDefault();
      setOtherValues({
         ...otherValues,
         toggleModalDate: !toggleModalDate,
      });
   };

   const pdfGeneratorSave = (all) => {
      if (!all) {
         gradesPDF(
            header[period - 1],
            students,
            periods[period - 1],
            classInfo,
            period - 1,
            all
         );
      } else {
         gradesPDF(header, students, periods, classInfo, null, all);
      }
   };

   const certificatePdfGeneratorSave = (date) => {
      const studentsPeriods = periods[period - 1].filter(
         (item) => item[0].student
      );
      let pass = true;
      for (let x = 0; x < studentsPeriods.length; x++) {
         for (let y = 0; y < studentsPeriods[x].length; y++) {
            if (studentsPeriods[x][y].value === "") {
               pass = false;
               break;
            }
         }
         if (!pass) break;
      }

      if (pass) {
         const number = moment(date).format("DD");
         const month = moment(date).format("MMMM");
         const year = moment(date).format("YYYY");
         certificatePDF(
            students.filter((student) => student.name !== ""),
            header[period - 1],
            studentsPeriods,
            classInfo,
            number + " de " + month + " de " + year,
            period
         );
      } else {
         setAlert(
            "Todos los alumnos deben tener cargadas las notas",
            "danger",
            "2"
         );
         window.scroll(0, 0);
      }
   };

   return (
      <>
         {!loading && (
            <div className="wrapper">
               <Confirm
                  toggleModal={toggleModalSave}
                  setToggleModal={setToggleSave}
                  confirm={saveGrades}
                  text="¿Está seguro que desea guardar los cambios?"
               />
               <Confirm
                  toggleModal={toggleModalDelete}
                  setToggleModal={setToggleDelete}
                  confirm={deleteGradeType}
                  text="¿Está seguro que desea eliminar el tipo de nota?"
               />
               <Confirm
                  toggleModal={toggleModalDate}
                  setToggleModal={setToggleDate}
                  type="certificate-date"
                  confirm={certificatePdfGeneratorSave}
               />
               <table className={!navbar ? "stick" : ""}>
                  <thead>
                     <tr>
                        <th className="bg-strong">&nbsp; Nombre &nbsp;</th>
                        {header[period - 1] &&
                           header[period - 1].map((type, index) => (
                              <th key={index}>{type}</th>
                           ))}
                     </tr>
                  </thead>
                  <tbody>
                     {students.map((student, i) => (
                        <tr key={i}>
                           <td className="bg-white">{student.name}</td>
                           {newGrades.length > 0 &&
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
            <button className="btn btn-light" onClick={clickAddGrade}>
               <i className="fas fa-plus"></i>
               <span className="hide-md"> Nota</span>
            </button>
            <button
               className="btn btn-secondary"
               onClick={() => pdfGeneratorSave(false)}
            >
               <i className="fas fa-file-pdf"></i>
            </button>
            {((classInfo.category.name !== "Kinder" &&
               period !== 5 &&
               period !== 6) ||
               (classInfo.category.name === "Kinder" && period !== 4)) && (
               <button
                  className="btn btn-secondary"
                  onClick={() => pdfGeneratorSave(true)}
               >
                  <i className="fas fa-file-pdf"></i> Todas{" "}
                  <span className="hide-md">las notas</span>
               </button>
            )}
            {(period === 5 ||
               period === 6 ||
               (classInfo.category.name === "Kinder" && period === 4)) && (
               <button className="btn btn-secondary" onClick={setToggleDate}>
                  <i className="fas fa-graduation-cap"></i>
               </button>
            )}
         </div>
         {gradePlus && (
            <div className="form smaller pt-5">
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
                  <button
                     type="submit"
                     onClick={addGradeType}
                     className="btn btn-primary"
                  >
                     <i className="fas fa-plus"></i>
                     <span className="hide-md"> Agregar</span>
                  </button>
                  {(userLogged.type === "Administrador" ||
                     userLogged.type === "Admin/Profesor") && (
                     <Link
                        to="/edit-gradetypes"
                        onClick={clearGrades}
                        className="btn btn-light"
                     >
                        <i className="fas fa-edit"></i>
                        <span className="hide-md"> Tipo Nota</span>
                     </Link>
                  )}
               </div>
            </div>
         )}
      </>
   );
};

GradesTab.propTypes = {
   auth: PropTypes.object.isRequired,
   grades: PropTypes.object.isRequired,
   classes: PropTypes.object.isRequired,
   navbar: PropTypes.bool.isRequired,
   period: PropTypes.number.isRequired,
   registerNewGrade: PropTypes.func.isRequired,
   deleteGrades: PropTypes.func.isRequired,
   updateGrades: PropTypes.func.isRequired,
   setAlert: PropTypes.func.isRequired,
   clearGrades: PropTypes.func.isRequired,
   gradesPDF: PropTypes.func.isRequired,
   certificatePDF: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   classes: state.classes,
   grades: state.grades,
   auth: state.auth,
   navbar: state.navbar.showMenu,
});

export default connect(mapStateToProps, {
   setAlert,
   registerNewGrade,
   deleteGrades,
   updateGrades,
   clearGrades,
   gradesPDF,
   certificatePDF,
})(withRouter(GradesTab));
