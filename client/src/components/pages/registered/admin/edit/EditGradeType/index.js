import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { FaTrashAlt } from "react-icons/fa";

import {
   loadGradeTypes,
   updateGradeTypes,
   deleteGradeType,
} from "../../../../../../actions/grade";
import { loadCategories } from "../../../../../../actions/category";
import { togglePopup } from "../../../../../../actions/mixvalues";

import PopUp from "../../../../../modal/PopUp";
import EditButtons from "../sharedComp/EditButtons";

const EditGradeType = ({
   categories: { categories, loading },
   grades: { gradeTypes, loadingGT },
   loadGradeTypes,
   loadCategories,
   updateGradeTypes,
   deleteGradeType,
   togglePopup,
}) => {
   const [adminValues, setAdminValues] = useState({
      popupType: "",
      toDelete: "",
      newRow: [],
   });

   const [formData, setFormData] = useState([]);

   const { popupType, toDelete, newRow } = adminValues;

   useEffect(() => {
      if (loadingGT) loadGradeTypes(null, true);
      else setFormData(gradeTypes);
   }, [loadingGT, loadGradeTypes, gradeTypes]);

   useEffect(() => {
      if (loading) loadCategories();
      else {
         let newRow = [{ _id: 0, name: "" }];
         for (let x = 1; x < categories.length; x++) {
            newRow.push({ category: categories[x]._id, checks: false });
         }
         setAdminValues((prev) => ({
            ...prev,
            newRow,
         }));
      }
   }, [categories, loading, loadCategories]);

   const onChange = (e, index, i) => {
      e.persist();
      let newFormData = [...formData];
      if (e.target.type === "checkbox") {
         newFormData[index][i] = {
            ...newFormData[index][i],
            checks: e.target.checked,
         };
      } else {
         newFormData[index][0].name = e.target.value;
      }
      setFormData(newFormData);
   };

   const header = () => {
      return "K,IC,IB,IA,P,J,1°,2°,3°,4°,5°,6°,C,PF"
         .split(",")
         .map((header, index) => <th key={index}>{header}</th>);
   };

   return (
      <>
         <PopUp
            confirm={() => {
               if (popupType === "save") updateGradeTypes(formData);
               else {
                  if (formData[toDelete][0]._id !== 0)
                     deleteGradeType(formData[toDelete][0]._id);
                  else {
                     formData.splice(toDelete, 1);
                     setFormData(formData);
                  }
               }
            }}
            text={`¿Está seguro que desea ${
               popupType === "save"
                  ? "guardar los cambios"
                  : "eliminar el tipo de nota"
            }?`}
         />
         <h2>Editar Tipo de Notas</h2>
         <div className="wrapper both mt-3">
            <table className="stick">
               <thead>
                  <tr>
                     <th>Nombre</th>
                     {header()}
                     <th colSpan="2">&nbsp;</th>
                  </tr>
               </thead>
               <tbody>
                  {!loading &&
                     formData.map((row, index) => (
                        <tr key={index}>
                           {row.map((item, i) =>
                              i === 0 ? (
                                 <td key={i}>
                                    <input
                                       type="text"
                                       name="input"
                                       value={item.name}
                                       placeholder="Nombre"
                                       onChange={(e) => onChange(e, index, i)}
                                    />
                                 </td>
                              ) : (
                                 <td key={i}>
                                    <input
                                       className="option-input"
                                       type="checkbox"
                                       onChange={(e) => onChange(e, index, i)}
                                       checked={item.checks}
                                    />
                                 </td>
                              )
                           )}
                           <td>
                              <button
                                 type="button"
                                 onClick={(e) => {
                                    e.preventDefault();
                                    setAdminValues({
                                       ...adminValues,
                                       toDelete: index,
                                       popupType: "delete",
                                    });
                                    togglePopup("default");
                                 }}
                                 className="btn btn-danger"
                              >
                                 <FaTrashAlt />
                              </button>
                           </td>
                        </tr>
                     ))}
               </tbody>
            </table>
         </div>
         <EditButtons
            save={() => {
               setAdminValues({
                  ...adminValues,
                  popupType: "save",
               });
               togglePopup("default");
            }}
            add={() => {
               let newFormData = [...formData];
               newFormData.push(JSON.parse(JSON.stringify(newRow)));
               setFormData(newFormData);
            }}
            type="Tipo de Nota"
         />
      </>
   );
};

const mapStateToProps = (state) => ({
   grades: state.grades,
   categories: state.categories,
});

export default connect(mapStateToProps, {
   loadGradeTypes,
   loadCategories,
   updateGradeTypes,
   deleteGradeType,
   togglePopup,
})(EditGradeType);
