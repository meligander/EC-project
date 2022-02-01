import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import format from "date-fns/format";
import { Link } from "react-router-dom";
import { FaEdit, FaGraduationCap, FaPlus, FaTimes } from "react-icons/fa";
import { FiSave } from "react-icons/fi";
import { ImFilePdf } from "react-icons/im";
import es from "date-fns/locale/es";

import { setAlert } from "../../../../../../actions/alert";
import {
   registerNewGrade,
   deleteGrades,
   updateGrades,
   gradesPDF,
   certificatePDF,
   clearGradeTypes,
} from "../../../../../../actions/grade";
import { togglePopup } from "../../../../../../actions/mixvalues";

import PopUp from "../../../../../modal/PopUp";
import Alert from "../../../../sharedComp/Alert";

const GradesTab = ({
   period,
   classes: { classInfo },
   auth: { userLogged },
   grades: { grades, loading, gradeTypes },
   setAlert,
   registerNewGrade,
   deleteGrades,
   updateGrades,
   clearGradeTypes,
   gradesPDF,
   certificatePDF,
   togglePopup,
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

   const [adminValues, setAdminValues] = useState({
      gradePlus: false,
      gradetypes: [],
      popupType: "",
      toDelete: null,
   });

   const { popupType, gradePlus, gradetypes, toDelete } = adminValues;

   useEffect(() => {
      const loadGradeTypes = () => {
         let gradetypes = [];
         if (!grades.header || (grades.header && !grades.header[period - 1])) {
            gradetypes = gradeTypes;
         } else {
            if (grades.header[period - 1]) {
               for (let x = 0; x < gradeTypes.length; x++) {
                  if (
                     grades.header[period - 1].some(
                        (item) => item === gradeTypes[x].name
                     )
                  )
                     gradetypes.push(gradeTypes[x]);
                  /* let equal = false;
                  for (let y = 0; y < grades.header[period - 1].length; y++) {
                     if (gradeTypes[x].name === grades.header[period - 1][y])
                        equal = true;
                  }
                  if (!equal) gradetypes.push(gradeTypes[x]); */
               }
            }
         }
         setAdminValues((prev) => ({ ...prev, gradetypes }));
      };

      const setInput = () => {
         setFormData((prev) => ({
            ...prev,
            newGrades: grades.periods[period - 1]
               ? grades.periods[period - 1]
               : [],
         }));
      };

      if (grades) {
         setInput();
         loadGradeTypes();
      }
   }, [gradeTypes, period, grades]);

   const onChange = (e, row) => {
      e.persist();
      let number = Number(e.target.name.substring(5, e.target.name.length));

      const gradesNumber = newGrades[0].length;
      const rowN = Math.ceil((number + 1) / gradesNumber) - 1;
      const mult = gradesNumber * rowN;
      number = number - mult;
      newGrades[rowN][number] = {
         ...row,
         value: e.target.value,
      };
      setFormData({
         ...formData,
         newGrades,
      });
   };

   const onChangeGradeTypes = (e) => {
      e.persist();
      setFormData({
         ...formData,
         newGradeType: {
            ...newGradeType,
            gradetype: e.target.value,
         },
      });
   };

   const addGradeType = () => {
      registerNewGrade({ ...newGradeType, periods: grades.periods });

      if (grades.periods[period - 1]) {
         setAdminValues((prev) => ({
            ...prev,
            gradetypes: gradetypes.filter(
               (gt) => gt._id !== newGradeType.gradetype
            ),
         }));
      }
   };

   const deleteGradeType = () => {
      if (
         grades.periods[period] &&
         gradeTypes.length === gradetypes.length + 1
      ) {
         setAlert(
            "No puede eliminar la última nota del bimestre",
            "danger",
            "4"
         );
      } else {
         setAdminValues((prev) => ({
            ...prev,
            gradePlus: false,
            gradetypes: [
               ...gradetypes,
               ...gradeTypes.filter((gt) => gt._id === toDelete.gradetype._id),
            ],
         }));
         deleteGrades(toDelete);
         setFormData({
            ...formData,
            newGrades: grades.periods[period - 1]
               ? grades.periods[period - 1]
               : [],
         });
      }
   };

   const saveGrades = () => {
      const gradesPeriod = newGrades.filter((grade) => grade[0].student);
      updateGrades(gradesPeriod, classInfo._id);
   };

   const certificatePdfGenerator = (date) => {
      if (!grades.periods[4])
         setAlert("Las notas del final deben estar cargadas", "danger", "4");
      else {
         const studentsPeriod = grades.periods[period - 1].filter(
            (item) => item[0].student
         );

         const stringDate = format(
            new Date(date),
            "EEEE, do 'de' LLLL 'de' yyyy",
            {
               locale: es,
            }
         );
         certificatePDF(
            grades.students.filter((student) => student.name !== ""),
            grades.header[period - 1],
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
            confirm={() => {
               switch (popupType) {
                  case "save":
                     saveGrades();
                     break;
                  case "delete":
                     deleteGradeType();
                     break;
                  case "certificate-date":
                     certificatePdfGenerator();
                     break;
                  default:
                     break;
               }
            }}
            text={
               popupType !== "certificate-date"
                  ? `¿Está seguro que desea ${
                       popupType === "save"
                          ? "guardar los cambios"
                          : "eliminar el tipo de nota"
                    }?`
                  : null
            }
         />
         {!loading && (
            <div className="wrapper both mt-2">
               <table className="stick">
                  <thead>
                     <tr>
                        <th>&nbsp; Nombre &nbsp;</th>
                        {grades.header[period - 1] &&
                           grades.header[period - 1].map((type, index) => (
                              <th key={index}>{type}</th>
                           ))}
                     </tr>
                  </thead>
                  <tbody>
                     {grades.students.map((student, i) => (
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
                                             setAdminValues((prev) => ({
                                                ...prev,
                                                popupType: "delete",
                                                toDelete: row,
                                             }));
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
         )}
         <div className="btn-right">
            <button
               className="btn btn-primary"
               type="button"
               onClick={(e) => {
                  e.preventDefault();
                  setAdminValues((prev) => ({
                     ...prev,
                     popupType: "save",
                  }));
                  togglePopup("default");
               }}
            >
               <FiSave />
               <span className="hide-md">&nbsp;Guardar Cambios</span>
            </button>
            <button
               className="btn btn-dark"
               type="button"
               onClick={(e) => {
                  e.preventDefault();
                  setAdminValues((prev) => ({
                     ...prev,
                     gradePlus: !gradePlus,
                  }));
               }}
            >
               <FaPlus />
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
                           header: grades.header[period - 1],
                           period: grades.periods[period - 1],
                           periodNumber: period - 1,
                        },
                        classInfo,
                        "bimester"
                     );
                  }}
               >
                  <ImFilePdf />
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
                        setAdminValues((prev) => ({
                           ...prev,
                           popupType: "certificate-date",
                        }));
                        togglePopup("certificate-date");
                     }}
                  >
                     <FaGraduationCap />
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
                  <div className="btn-center mt-1">
                     <button type="submit" className="btn btn-dark">
                        <FaPlus />
                        <span className="hide-md">&nbsp;Agregar</span>
                     </button>
                     {(userLogged.type === "admin" ||
                        userLogged.type === "admin&teacher") && (
                        <div className="tooltip">
                           <Link
                              to="/class/gradetypes/edit"
                              onClick={() => {
                                 window.scroll(0, 0);
                                 clearGradeTypes();
                              }}
                              className="btn btn-mix-secondary"
                           >
                              <FaEdit />
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
   togglePopup,
})(GradesTab);
