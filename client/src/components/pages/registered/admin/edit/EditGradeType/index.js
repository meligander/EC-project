import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { FaTrashAlt } from "react-icons/fa";

import {
   loadGradeTypes,
   updateGradeTypes,
   deleteGradeType,
} from "../../../../../../actions/grade";
import { loadCategories } from "../../../../../../actions/category";

import PopUp from "../../../../../modal/PopUp";
import EditButtons from "../sharedComp/EditButtons";

const EditGradeType = ({
   loadGradeTypes,
   loadCategories,
   updateGradeTypes,
   deleteGradeType,
   grades: { gradeTypes, loadingGT },
   categories: { categories, loading },
}) => {
   const header = [
      "K",
      "IC",
      "IB",
      "IA",
      "P",
      "J",
      "1°",
      "2°",
      "3°",
      "4°",
      "5°",
      "6°",
      "C",
      "Pf",
   ];

   const [adminValues, setAdminValues] = useState({
      toggleModalDelete: false,
      toggleModalSave: false,
      toDelete: "",
      newRow: [],
   });

   const [formData, setFormData] = useState([]);

   const { toggleModalDelete, toggleModalSave, toDelete, newRow } = adminValues;

   useEffect(() => {
      if (loadingGT) loadGradeTypes();
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
      if (e.target.type === "checkbox") {
         formData[index][i] = {
            ...formData[index][i],
            checks: e.target.checked,
         };
      } else {
         formData[index][0].name = e.target.value;
      }
      setFormData(formData);
   };

   return (
      <>
         <PopUp
            toggleModal={toggleModalSave}
            setToggleModal={() =>
               setAdminValues((prev) => ({
                  ...prev,
                  toggleModalSave: !toggleModalSave,
               }))
            }
            confirm={() => {
               updateGradeTypes(formData);
            }}
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
            confirm={() => {
               if (formData[toDelete]._id !== 0)
                  deleteGradeType(formData[toDelete]._id);
               else {
                  formData.splice(toDelete, 1);
                  setFormData(formData);
               }
            }}
            text="¿Está seguro que desea eliminar el tipo de nota?"
         />
         <h2>Editar tipo de notas</h2>
         <div className="wrapper both mt-3">
            <table className="stick">
               <thead>
                  <tr>
                     <th>Nombre</th>
                     {header.length > 0 &&
                        header.map((header, index) => (
                           <th key={index}>{header}</th>
                        ))}
                     <th colSpan="2">&nbsp;</th>
                  </tr>
               </thead>
               <tbody>
                  {!loading &&
                     formData.length > 0 &&
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
                                       toDelete: row,
                                       toggleModalDelete: true,
                                    });
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
            save={() =>
               setAdminValues({
                  ...adminValues,
                  toggleModalSave: true,
               })
            }
            add={() => {
               formData.push([...newRow]);
               setFormData(formData);
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
})(EditGradeType);
