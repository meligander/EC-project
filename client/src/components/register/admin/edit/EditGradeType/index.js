import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import {
   loadGradeTypes,
   updateGradeTypes,
   deleteGradeType,
} from "../../../../../actions/grade";

import Loading from "../../../../modal/Loading";
import EditButtons from "../sharedComp/EditButtons";
import Confirm from "../../../../modal/Confirm";
import { setAlert } from "../../../../../actions/alert";

const EditGradeType = ({
   loadGradeTypes,
   updateGradeTypes,
   deleteGradeType,
   grades: { gradeTypes, loadingGT },
   setAlert,
}) => {
   const [otherValues, setOtherValues] = useState({
      toggleModalDelete: false,
      toggleModalSave: false,
      toDelete: "",
   });

   const [formData, setFormData] = useState({
      header: [],
      rows: [],
      newRow: [],
   });

   const { header, rows, newRow } = formData;

   const { toggleModalDelete, toggleModalSave, toDelete } = otherValues;

   useEffect(() => {
      if (loadingGT) loadGradeTypes();
      else setFormData(gradeTypes);
   }, [loadGradeTypes, loadingGT, gradeTypes]);

   const onChange = (e, index, i) => {
      let newValue = [...rows];

      if (e.target.name === "input") {
         newValue[index][0].name = e.target.value;
      } else {
         newValue[index][i] = {
            ...newValue[index][i],
            checks: e.target.checked,
         };
      }

      setFormData({
         ...formData,
         rows: newValue,
      });
   };

   const addGradeType = () => {
      if (rows[rows.length - 1][0]._id === "") {
         setAlert("Agregue un tipo de nota por vez", "danger", "2");
         window.scroll(0, 0);
      } else {
         let newValue = [...rows, newRow];
         setFormData({
            ...formData,
            rows: newValue,
         });
      }
   };

   const deleteGradeTypeConfirm = () => {
      deleteGradeType(toDelete[0]._id);
   };

   const saveGradeTypes = () => {
      updateGradeTypes(rows);
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
               <div className="wrapper both">
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
                        {rows.length > 0 &&
                           rows.map((row, index) => (
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
                                       <i className="fas fa-times"></i>
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
   loadGradeTypes: PropTypes.func.isRequired,
   updateGradeTypes: PropTypes.func.isRequired,
   deleteGradeType: PropTypes.func.isRequired,
   setAlert: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   grades: state.grades,
});

export default connect(mapStateToProps, {
   loadGradeTypes,
   updateGradeTypes,
   deleteGradeType,
   setAlert,
})(EditGradeType);
