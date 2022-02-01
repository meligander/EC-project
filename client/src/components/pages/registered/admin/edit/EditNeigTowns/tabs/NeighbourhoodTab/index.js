import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { FaTrashAlt } from "react-icons/fa";

import {
   deleteNeighbourhood,
   updateNeighbourhoods,
} from "../../../../../../../../actions/neighbourhood";
import { togglePopup } from "../../../../../../../../actions/mixvalues";

import PopUp from "../../../../../../../modal/PopUp";
import EditButtons from "../../../sharedComp/EditButtons";

const NeighbourhoodTab = ({
   towns: { towns },
   neighbourhoods: { neighbourhoods, error },
   togglePopup,
   updateNeighbourhoods,
   deleteNeighbourhood,
}) => {
   const [formData, setFormData] = useState([]);
   const [adminValues, setAdminValues] = useState({
      popupType: "",
      toDelete: "",
   });

   const { popupType, toDelete } = adminValues;

   useEffect(() => {
      setFormData(neighbourhoods);
   }, [neighbourhoods]);

   const onChange = (e, index) => {
      e.persist();
      let newFormData = [...formData];

      newFormData[index] = {
         ...formData[index],
         [e.target.name]: e.target.value,
      };
      setFormData(newFormData);
   };

   const addNeighbourhood = () => {
      let newFormData = [...formData];
      newFormData.push({
         _id: "",
         name: "",
         town: "",
      });
      setFormData(newFormData);
   };

   return (
      <div className="mt-3">
         <PopUp
            confirm={() => {
               if (popupType === "save") updateNeighbourhoods(formData);
               else {
                  if (formData[toDelete]._id === "") {
                     let newFormData = [...formData];
                     newFormData.splice(toDelete, 1);
                     setFormData(newFormData);
                  } else deleteNeighbourhood(formData[toDelete]._id);
               }
            }}
            text={`¿Está seguro que desea ${
               popupType === "save"
                  ? "guardar los cambios"
                  : "eliminar el barrio"
            }?`}
         />
         <table className="smaller">
            <thead>
               <tr>
                  <th>Nombre</th>
                  <th>Localidad</th>
                  <th>&nbsp;</th>
               </tr>
            </thead>
            <tbody>
               {formData.map((item, i) => (
                  <tr key={i}>
                     <td data-th="Nombre">
                        <input
                           type="text"
                           name="name"
                           onChange={(e) => onChange(e, i)}
                           value={item.name}
                           placeholder="Nombre"
                        />
                     </td>
                     <td data-th="Localidad">
                        <select
                           name="town"
                           onChange={(e) => onChange(e, i)}
                           value={formData[i].town}
                        >
                           <option value="">
                              *Seleccione la localidad a la que pertenece
                           </option>
                           {towns.map((town, index) => (
                              <option key={index} value={town._id}>
                                 {town.name}
                              </option>
                           ))}
                        </select>
                     </td>
                     <td>
                        <button
                           type="button"
                           onClick={(e) => {
                              e.preventDefault();
                              setAdminValues((prev) => ({
                                 ...prev,
                                 popupType: "delete",
                                 toDelete: i,
                              }));
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
         {formData.length === 0 && (
            <p className="heading-tertiary text-dark text-center mt-1">
               {error.msg}
            </p>
         )}
         <EditButtons
            add={addNeighbourhood}
            save={() => {
               setAdminValues((prev) => ({
                  ...prev,
                  popupType: "save",
               }));
               togglePopup("default");
            }}
            type="Barrio"
         />
      </div>
   );
};

const mapStateToProps = (state) => ({
   neighbourhoods: state.neighbourhoods,
   towns: state.towns,
});

export default connect(mapStateToProps, {
   updateNeighbourhoods,
   deleteNeighbourhood,
   togglePopup,
})(NeighbourhoodTab);
