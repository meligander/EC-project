import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import {
   loadGradeTypes,
   updateGradeTypes,
   deleteGradeType,
} from "../../../../../actions/grade";
import { loadCategories } from "../../../../../actions/category";
import { setAlert } from "../../../../../actions/alert";

import Loading from "../../../../modal/Loading";
import EditButtons from "../sharedComp/EditButtons";
import Confirm from "../../../../modal/Confirm";

const EditGradeType = ({
   loadGradeTypes,
   loadCategories,
   updateGradeTypes,
   deleteGradeType,
   setAlert,
   grades: { gradeTypes, loadingGT },
   categories: { categories },
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

   const [otherValues, setOtherValues] = useState({
      toggleModalDelete: false,
      toggleModalSave: false,
      toDelete: "",
      newRow: [],
      amount: 0,
      oneLoad: true,
   });

   const [formData, setFormData] = useState([]);

   const {
      toggleModalDelete,
      toggleModalSave,
      toDelete,
      newRow,
      amount,
      oneLoad,
   } = otherValues;

   useEffect(() => {
      if (oneLoad) {
         loadGradeTypes();
         loadCategories();
         setOtherValues((prev) => ({
            ...prev,
            oneLoad: false,
         }));
      } else {
         if (categories.length > 0 && newRow.length === 0) {
            let newRow = [{ _id: "", name: "" }];
            for (let x = 1; x < categories.length; x++) {
               newRow.push({ category: categories[x]._id, checks: false });
            }
            setOtherValues((prev) => ({
               ...prev,
               newRow,
            }));
         }

         if (!loadingGT) {
            setFormData(gradeTypes);
         }
      }
   }, [
      newRow,
      loadGradeTypes,
      loadingGT,
      gradeTypes,
      loadCategories,
      categories,
      oneLoad,
   ]);

   const onChange = (e, index, i) => {
      let newValue = [...formData];

      if (e.target.name === "input") {
         newValue[index][0].name = e.target.value;
      } else {
         newValue[index][i] = {
            ...newValue[index][i],
            checks: e.target.checked,
         };
      }

      setFormData(newValue);
   };

   const addGradeType = () => {
      let rowToAdd = new Array(15);

      rowToAdd[amount] = [...newRow];
      rowToAdd[amount][0] = {
         _id: "",
         name: "",
      };
      let newValue = [...formData, rowToAdd[amount]];

      setOtherValues({
         ...otherValues,
         amount: amount + 1,
      });

      setFormData(newValue);
   };

   const deleteGradeTypeConfirm = () => {
      console.log(toDelete);
      if (toDelete[0]._id === "") {
         setAlert(
            "El tipo de nota no se ha guardado todavía. Vuelva a recargar la página y desaparecerá.",
            "danger",
            "2"
         );
         window.scroll(0, 0);
      } else {
         deleteGradeType(toDelete[0]._id);
      }
   };

   const saveGradeTypes = () => {
      updateGradeTypes(formData);
      setOtherValues({
         ...otherValues,
         oneLoad: true,
      });
   };

   const setToggleSave = () => {
      setOtherValues({
         ...otherValues,
         toggleModalSave: !toggleModalSave,
      });
   };

   const setToggleDelete = (row) => {
      setOtherValues({
         ...otherValues,
         ...(row && { toDelete: row }),
         toggleModalDelete: !toggleModalDelete,
      });
   };

   return (
      <>
         {!loadingGT ? (
            <>
               <Confirm
                  toggleModal={toggleModalSave}
                  setToggleModal={setToggleSave}
                  confirm={saveGradeTypes}
                  text="¿Está seguro que desea guardar los cambios?"
               />
               <Confirm
                  toggleModal={toggleModalDelete}
                  setToggleModal={setToggleDelete}
                  confirm={deleteGradeTypeConfirm}
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
                        {formData.length > 0 &&
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
                                             onChange={(e) =>
                                                onChange(e, index, i)
                                             }
                                          />
                                       </td>
                                    ) : (
                                       <td key={i}>
                                          <input
                                             className="option-input"
                                             type="checkbox"
                                             onChange={(e) =>
                                                onChange(e, index, i)
                                             }
                                             checked={item.checks}
                                          />
                                       </td>
                                    )
                                 )}
                                 <td>
                                    <button
                                       onClick={() => setToggleDelete(row)}
                                       className="btn btn-danger"
                                    >
                                       <i className="far fa-trash-alt"></i>
                                    </button>
                                 </td>
                              </tr>
                           ))}
                     </tbody>
                  </table>
               </div>
               <EditButtons
                  save={setToggleSave}
                  add={addGradeType}
                  type="Tipo de Nota"
               />
            </>
         ) : (
            <Loading />
         )}
      </>
   );
};

EditGradeType.propTypes = {
   grades: PropTypes.object.isRequired,
   categories: PropTypes.object.isRequired,
   loadGradeTypes: PropTypes.func.isRequired,
   loadCategories: PropTypes.func.isRequired,
   updateGradeTypes: PropTypes.func.isRequired,
   deleteGradeType: PropTypes.func.isRequired,
   setAlert: PropTypes.func.isRequired,
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
   setAlert,
})(EditGradeType);
