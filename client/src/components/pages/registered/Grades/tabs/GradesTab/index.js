import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import format from "date-fns/format";
import { FaGraduationCap, FaPlus, FaTimes } from "react-icons/fa";
import { FiSave } from "react-icons/fi";
import { ImFilePdf } from "react-icons/im";
import es from "date-fns/locale/es";

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
   grades: {
      grades: { header, students, periods },
      gradeTypes,
   },
   registerNewGrade,
   deleteGrades,
   updateGrades,
   clearGradeTypes,
   gradesPDF,
   certificatePDF,
   togglePopup,
}) => {
   const year = new Date().getFullYear();

   const getGradeTypes = () => {
      let gradetypes = [];

      gradeTypes.forEach((type) => {
         if (!header[period - 1].some((item) => item === type.name))
            gradetypes.push(type);
      });

      return gradetypes;
   };

   const [adminValues, setAdminValues] = useState({
      newGrades: [],
      gradetypes: header[period - 1] ? getGradeTypes() : gradeTypes,
      popupType: "",
      toDelete: null,
   });

   const { newGrades, popupType, gradetypes, toDelete } = adminValues;

   useEffect(() => {
      setAdminValues((prev) => ({
         ...prev,
         newGrades: periods[period - 1] ? periods[period - 1] : [],
      }));
   }, [period, periods]);

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
      setAdminValues((prev) => ({
         ...prev,
         newGrades,
      }));
   };

   const info = () => {
      switch (popupType) {
         case "save":
            return "¿Está seguro que desea guardar los cambios?";
         case "delete":
            return "¿Está seguro que desea eliminar el tipo de nota?";
         case "new-grade-type":
            return {
               gradetypes,
               isAdmin:
                  userLogged.type === "admin" ||
                  userLogged.type === "admin&teacher",
               clearGradeTypes,
            };
         case "certificate-date":
            return null;
         default:
            break;
      }
   };

   return (
      <>
         <Alert type="3" />
         <PopUp
            confirm={(formInfo) => {
               switch (popupType) {
                  case "save":
                     updateGrades(
                        newGrades.filter((grade) => grade[0].student),
                        classInfo._id
                     );
                     break;
                  case "delete":
                     deleteGrades(
                        toDelete,
                        periods[period] &&
                           gradeTypes.length === gradetypes.length + 1
                     );
                     setAdminValues((prev) => ({
                        ...prev,
                        gradetypes: [...gradetypes, toDelete.gradetype],
                     }));

                     break;
                  case "certificate-date":
                     certificatePDF(
                        {
                           students: students.slice(0, -1),
                           headers: header[period - 1],
                           studentsPeriod: periods[period - 1].slice(0, -1),
                           classInfo,
                           date:
                              formInfo !== ""
                                 ? format(
                                      new Date(formInfo),
                                      "EEEE, do 'de' LLLL 'de' yyyy",
                                      {
                                         locale: es,
                                      }
                                   )
                                 : null,
                           periodNumber: period,
                        },
                        !periods[period - 1]
                     );
                     break;
                  case "new-grade-type":
                     registerNewGrade({
                        period,
                        classroom: classInfo._id,
                        gradetype: formInfo,
                        periods: periods,
                     });
                     setAdminValues((prev) => ({
                        ...prev,
                        gradetypes: gradetypes.filter(
                           (gt) => gt._id !== formInfo
                        ),
                     }));
                     break;
                  default:
                     break;
               }
            }}
            info={info()}
         />
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
                        {newGrades[i] &&
                           newGrades[i].map((row, key) => (
                              <td key={key}>
                                 {row.student !== undefined ? (
                                    <input
                                       type="number"
                                       name={row.name}
                                       onChange={(e) => onChange(e, row)}
                                       value={row.value}
                                       min={0}
                                       max={10}
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
         <div className="btn-right">
            <button
               disabled={year !== classInfo.year}
               className={`btn ${
                  year === classInfo.year ? "btn-primary" : "btn-black"
               }`}
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
               className={`btn ${
                  year === classInfo.year ? "btn-dark" : "btn-black"
               }`}
               type="button"
               disabled={year !== classInfo.year}
               onClick={(e) => {
                  e.preventDefault();
                  setAdminValues((prev) => ({
                     ...prev,
                     popupType: "new-grade-type",
                  }));
                  togglePopup("new-grade-type");
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
                           header: header[period - 1],
                           period: periods[period - 1],
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
      </>
   );
};

const mapStateToProps = (state) => ({
   classes: state.classes,
   grades: state.grades,
   auth: state.auth,
});

export default connect(mapStateToProps, {
   registerNewGrade,
   deleteGrades,
   updateGrades,
   gradesPDF,
   certificatePDF,
   clearGradeTypes,
   togglePopup,
})(GradesTab);
