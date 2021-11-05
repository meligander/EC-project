import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { FaTrashAlt } from "react-icons/fa";

import {
   deleteExpenceType,
   loadExpenceTypes,
   updateExpenceTypes,
} from "../../../../../../actions/expence";

import EditButtons from "../sharedComp/EditButtons";
import PopUp from "../../../../../modal/PopUp";

const EditExpenceType = ({
   expences: { expencetypes, loadingET },
   loadExpenceTypes,
   updateExpenceTypes,
   deleteExpenceType,
}) => {
   const [formData, setFormData] = useState([]);

   const [adminValues, setAdminValues] = useState({
      toggleModalSave: false,
      toggleModalDelete: false,
      toDelete: "",
   });

   const { toggleModalSave, toggleModalDelete, toDelete } = adminValues;

   useEffect(() => {
      if (loadingET) loadExpenceTypes();
      else setFormData(expencetypes);
   }, [loadingET, loadExpenceTypes, expencetypes]);

   const onChange = (e, index) => {
      formData[index] = {
         ...formData[index],
         [e.target.name]: e.target.value,
      };

      setFormData(formData);
   };

   return (
      <>
         <h2>Tipo de Movimiento</h2>
         <PopUp
            toggleModal={toggleModalSave}
            setToggleModal={() =>
               setAdminValues((prev) => ({
                  ...prev,
                  toggleModalSave: !toggleModalSave,
               }))
            }
            confirm={() => updateExpenceTypes(formData)}
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
                  deleteExpenceType(formData[toDelete]._id);
               else {
                  formData.splice(toDelete, 1);
                  setFormData(formData);
               }
            }}
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
               {!loadingET &&
                  formData.length > 0 &&
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
                              onClick={(e) => {
                                 e.preventDefault();
                                 setAdminValues({
                                    ...adminValues,
                                    toDelete: index,
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
         <EditButtons
            save={() =>
               setAdminValues({
                  ...adminValues,
                  toggleModalSave: true,
               })
            }
            add={() => {
               formData.push({
                  _id: 0,
                  name: "",
                  type: "",
               });
               setFormData(formData);
            }}
            type="Tipo de Gasto"
         />
      </>
   );
};

const mapStateToProps = (state) => ({
   expences: state.expences,
});

export default connect(mapStateToProps, {
   loadExpenceTypes,
   updateExpenceTypes,
   deleteExpenceType,
})(EditExpenceType);
