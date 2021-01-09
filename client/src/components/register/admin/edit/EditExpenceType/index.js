import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import {
   deleteExpenceType,
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
   deleteExpenceType,
}) => {
   const [newET, setNewET] = useState([]);

   const [otherValues, setOtherValues] = useState({
      toggleModalSave: false,
      toggleModalDelete: false,
      toDelete: "",
      count: 0,
   });

   const { toggleModalSave, toggleModalDelete, toDelete, count } = otherValues;

   useEffect(() => {
      if (loadingET) loadExpenceTypes();
      else setNewET(expencetypes);
   }, [loadingET, loadExpenceTypes, expencetypes]);

   const onChange = (e, index) => {
      let newValue = [...newET];
      newValue[index] = {
         ...newValue[index],
         [e.target.name]: e.target.value,
      };
      setNewET(newValue);
   };

   const addExpenceType = () => {
      let newValue = [...newET];
      newValue.push({
         _id: count,
         name: "",
         type: "",
      });
      setOtherValues({ ...otherValues, count: count + 1 });
      setNewET(newValue);
   };

   const deleteExpenceTypeConfirm = () => {
      if (typeof toDelete._id === "number") {
         const array = newET.filter((et) => et._id !== toDelete._id);
         setNewET(array);
      } else deleteExpenceType(toDelete._id);
   };

   const saveExpenceTypes = () => {
      updateExpenceTypes(newET);
   };

   const setToggleSave = () => {
      setOtherValues({
         ...otherValues,
         toggleModalSave: !toggleModalSave,
      });
   };

   const setToggleDelete = (exptyp) => {
      setOtherValues({
         ...otherValues,
         ...(exptyp && { toDelete: exptyp }),
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
                  confirm={deleteExpenceTypeConfirm}
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
                     {newET &&
                        newET.length > 0 &&
                        newET.map((exptyp, index) => (
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
                                    <option value="">
                                       Seleccione el tipo de movimiento
                                    </option>
                                    <option value="expence">Gasto</option>
                                    <option value="special-income">
                                       Ingreso Especial
                                    </option>
                                    <option value="withdrawal">Retiro</option>
                                 </select>
                              </td>
                              <td>
                                 <button
                                    type="button"
                                    onClick={() => setToggleDelete(exptyp)}
                                    className="btn btn-danger"
                                 >
                                    <i className="far fa-trash-alt"></i>
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
   deleteExpenceType: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   expences: state.expences,
});

export default connect(mapStateToProps, {
   loadExpenceTypes,
   updateExpenceTypes,
   deleteExpenceType,
})(EditExpenceType);
