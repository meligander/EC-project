import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import {
   loadExpenceTypes,
   updateExpenceTypes,
} from "../../../../../actions/expence";

import EditButtons from "../sharedComp/EditButtons";
import Loading from "../../../../modal/Loading";
import Confirm from "../../../../modal/Confirm";

const EditExpenceType = ({
   expences: { expencetypes, loadingET },
   loadExpenceTypes,
   updateExpenceTypes,
}) => {
   const [formData, setFormData] = useState([]);

   const [otherValues, setOtherValues] = useState({
      toggleModalSave: false,
      toggleModalDelete: false,
      toDelete: "",
   });

   const { toggleModalSave, toggleModalDelete, toDelete } = otherValues;

   useEffect(() => {
      const init = () => {
         setFormData([...expencetypes]);
      };
      if (loadingET) loadExpenceTypes();
      else init();
   }, [loadingET, loadExpenceTypes, expencetypes]);

   const onChange = (e, index) => {
      let newValue = [...formData];
      newValue[index] = {
         ...newValue[index],
         [e.target.name]: e.target.value,
      };
      setFormData(newValue);
   };

   const addExpenceType = () => {
      let newValue = [...formData];
      newValue.push({
         _id: "",
         name: "",
         type: 0,
      });
      setFormData(newValue);
   };

   const deleteExpenceType = () => {
      let newValue = [...formData];
      newValue.splice(toDelete, 1);
      setFormData(newValue);
   };

   const saveExpenceTypes = () => {
      updateExpenceTypes(formData);
   };

   const setToggleSave = () => {
      setOtherValues({
         ...otherValues,
         toggleModalSave: !toggleModalSave,
      });
   };

   const setToggleDelete = (index) => {
      setOtherValues({
         ...otherValues,
         ...(index && { toDelete: index }),
         toggleModalDelete: !toggleModalDelete,
      });
   };

   return (
      <>
         {!loadingET ? (
            <>
               <h2>Tipo de Movimiento</h2>
               <Confirm
                  toggleModal={toggleModalSave}
                  setToggleModal={setToggleSave}
                  confirm={saveExpenceTypes}
                  text="¿Está seguro que desea guardar los cambios?"
               />
               <Confirm
                  toggleModal={toggleModalDelete}
                  setToggleModal={setToggleDelete}
                  confirm={deleteExpenceType}
                  text="¿Está seguro que desea eliminar el tipo de movimiento?"
               />
               <table className="smaller">
                  <thead>
                     <tr>
                        <th>Nombre</th>
                        <th>Tipo</th>
                        <th>&nbsp;</th>
                     </tr>
                  </thead>
                  <tbody>
                     {formData.length > 0 &&
                        formData.map((exptyp, index) => (
                           <tr key={index}>
                              <td>
                                 <input
                                    type="text"
                                    name="name"
                                    placeholder="Nombre"
                                    onChange={(e) => onChange(e, index)}
                                    value={exptyp.name}
                                 />
                              </td>
                              <td>
                                 <select
                                    name="type"
                                    onChange={(e) => onChange(e, index)}
                                    value={exptyp.type}
                                 >
                                    <option value="0">
                                       Seleccione el tipo de movimiento
                                    </option>
                                    <option value="Gasto">Gasto</option>
                                    <option value="Ingreso">Ingreso</option>
                                    <option value="Retiro">Retiro</option>
                                 </select>
                              </td>
                              <td>
                                 <button
                                    onClick={() => setToggleDelete(index)}
                                    className="btn btn-danger"
                                 >
                                    <i className="fas fa-trash"></i>
                                 </button>
                              </td>
                           </tr>
                        ))}
                  </tbody>
               </table>
               <EditButtons
                  save={setToggleSave}
                  add={addExpenceType}
                  type="Tipo de Gasto"
               />
            </>
         ) : (
            <Loading />
         )}
      </>
   );
};

EditExpenceType.propTypes = {
   expences: PropTypes.object.isRequired,
   loadExpenceTypes: PropTypes.func.isRequired,
   updateExpenceTypes: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   expences: state.expences,
});

export default connect(mapStateToProps, {
   loadExpenceTypes,
   updateExpenceTypes,
})(EditExpenceType);
