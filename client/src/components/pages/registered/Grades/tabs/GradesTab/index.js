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
import { togglePopup } from "../../../../../../actions/global";

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
         if (!header[period - 1].some((item) => item.name === type.name))
            gradetypes.push(type);
      });
      return gradetypes;
   };

   const [newGrades, setNewGrades] = useState([]);

   const [adminValues, setAdminValues] = useState({
      gradetypes: header[period - 1] ? getGradeTypes() : gradeTypes,
      popupType: "",
      toDelete: null,
   });

   const { popupType, gradetypes, toDelete } = adminValues;

   useEffect(() => {
      setNewGrades(periods[period - 1] ? periods[period - 1] : []);
   }, [period, periods]);

   const onChange = (e, student, grade) => {
      e.persist();
      const value = e.target.value;

      if ((value > 0 && value <= 10) || value === "") {
         const newG = [...newGrades];
         newG[student][grade].value = value;

         setNewGrades(newG);
      }
   };

   const info = () => {
      switch (popupType) {
         case "save":
            return "¿Está seguro que desea guardar los cambios?";
         case "delete":
            return "¿Está seguro que desea eliminar el tipo de nota?";
         case "new-grade":
            return {
               gradetypes,
               isAdmin:
                  userLogged.type === "admin" ||
                  userLogged.type === "admin&teacher",
               clearGradeTypes,
            };
         case "certificate":
            return {
               students:
                  year === classInfo.year ? students.slice(0, -1) : students,
            };
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
                        classInfo._id,
                        period
                     );
                     break;
                  case "delete":
                     deleteGrades(
                        toDelete,
                        classInfo._id,
                        period,
                        periods[period] && header[period - 1].length === 1
                     );
                     setAdminValues((prev) => ({
                        ...prev,
                        gradetypes: [
                           ...gradetypes,
                           gradeTypes.find((item) => item._id === toDelete),
                        ],
                        toDelete: null,
                     }));

                     break;
                  case "certificate":
                     certificatePDF(
                        header[period - 1],
                        periods[period - 1],
                        formInfo.date !== ""
                           ? format(
                                new Date(formInfo.date.replace("-", ",")),
                                "EEEE, do 'de' LLLL 'de' yyyy",
                                {
                                   locale: es,
                                }
                             )
                           : null,
                        {
                           students: formInfo.students,
                           teacher:
                              classInfo.teacher.lastname +
                              ", " +
                              classInfo.teacher.name,
                           category: classInfo.category.name,
                           period: period - 1,
                        },
                        !periods[period - 1]
                     );
                     break;
                  case "new-grade":
                     registerNewGrade(
                        {
                           gradetype: formInfo,
                        },
                        classInfo._id,
                        period,
                        period !== 1 && !periods[period - 2]
                     );
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
            error={popupType === "new-grade" || popupType === "certificate"}
            info={info()}
         />
         <div className="wrapper both mt-2">
            <table className="stick">
               <thead>
                  <tr>
                     <th>&nbsp; Nombre &nbsp;</th>
                     {header[period - 1] &&
                        header[period - 1].map((type, index) => (
                           <th key={index}>{type.name}</th>
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
                        {newGrades.length > 0 &&
                           newGrades[i].map((row, key) => (
                              <td key={key}>
                                 <input
                                    type="text"
                                    name={row.name}
                                    onChange={(e) => onChange(e, i, key)}
                                    value={row.value}
                                    disabled={year !== classInfo.year}
                                    placeholder="Nota"
                                 />
                              </td>
                           ))}
                     </tr>
                  ))}
               </tbody>
               <tbody>
                  <tr className="sticky">
                     <td></td>
                     {newGrades.length > 0 &&
                        newGrades[0].map((item, i) => (
                           <td key={i}>
                              <button
                                 type="button"
                                 className="btn btn-danger"
                                 onClick={(e) => {
                                    e.preventDefault();
                                    setAdminValues((prev) => ({
                                       ...prev,
                                       popupType: "delete",
                                       toDelete: item.gradetype._id,
                                    }));
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
                     popupType: "new-grade",
                  }));
                  togglePopup("new-grade");
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
                     gradesPDF(header[period - 1], periods[period - 1], {
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
                           popupType: "certificate",
                        }));
                        togglePopup("certificate");
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
