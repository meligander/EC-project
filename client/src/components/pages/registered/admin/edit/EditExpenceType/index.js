import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { FaTrashAlt } from "react-icons/fa";

import {
   deleteExpenceType,
   loadExpenceTypes,
   updateExpenceTypes,
} from "../../../../../../actions/expence";
import { togglePopup } from "../../../../../../actions/mixvalues";

import EditButtons from "../sharedComp/EditButtons";
import PopUp from "../../../../../modal/PopUp";

const EditExpenceType = ({
   expences: { expencetypes, loadingET },
   loadExpenceTypes,
   updateExpenceTypes,
   deleteExpenceType,
   togglePopup,
}) => {
   const [formData, setFormData] = useState([]);

   const [adminValues, setAdminValues] = useState({
      popupType: "",
      toDelete: "",
   });

   const { popupType, toDelete } = adminValues;

   useEffect(() => {
      if (loadingET) loadExpenceTypes(true, true);
      else setFormData(expencetypes);
   }, [loadingET, loadExpenceTypes, expencetypes]);

   const onChange = (e, index) => {
      e.persist();
      const newFormData = [...formData];
      newFormData[index] = {
         ...formData[index],
         [e.target.name]: e.target.value,
      };

      setFormData(newFormData);
   };

   return (
      <>
         <h2>Editar Tipo de Movimientos</h2>
         <PopUp
            confirm={() => {
               if (popupType === "save") updateExpenceTypes(formData);
               else {
                  if (formData[toDelete]._id !== 0)
                     deleteExpenceType(formData[toDelete]._id);
                  else {
                     formData.splice(toDelete, 1);
                     setFormData(formData);
                  }
               }
            }}
            text={`¿Está seguro que desea ${
               popupType === "save"
                  ? "guardar los cambios"
                  : "eliminar el tipo de movimiento"
            }?`}
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
                  formData.map((exptyp, index) => (
                     <tr key={index}>
                        <td data-th="Nombre">
                           <input
                              type="text"
                              name="name"
                              placeholder="Nombre"
                              onChange={(e) => onChange(e, index)}
                              value={exptyp.name}
                           />
                        </td>
                        <td data-th="Tipo">
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
         <EditButtons
            save={() => {
               setAdminValues({
                  ...adminValues,
                  popupType: "save",
               });
               togglePopup("default");
            }}
            add={() => {
               const newFormData = [...formData];
               newFormData.push({
                  _id: 0,
                  name: "",
                  type: "",
               });
               setFormData(newFormData);
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
   togglePopup,
})(EditExpenceType);
