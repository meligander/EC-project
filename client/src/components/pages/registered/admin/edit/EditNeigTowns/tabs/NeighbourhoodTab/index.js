import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { FaTrashAlt } from "react-icons/fa";

import {
   deleteNeighbourhood,
   updateNeighbourhoods,
} from "../../../../../../../../actions/neighbourhood";

import PopUp from "../../../../../../../modal/PopUp";
import EditButtons from "../../../sharedComp/EditButtons";

const NeighbourhoodTab = ({
   towns,
   neighbourhoods: { neighbourhoods, loading, error },
   updateNeighbourhoods,
   deleteNeighbourhood,
}) => {
   const [formData, setFormData] = useState([]);
   const [adminValues, setAdminValues] = useState({
      toggleModalDelete: false,
      toggleModalSave: false,
      toDelete: "",
   });

   const { toggleModalDelete, toggleModalSave, toDelete } = adminValues;

   useEffect(() => {
      if (!loading) setFormData(neighbourhoods);
   }, [loading, neighbourhoods]);

   const onChange = (e, index) => {
      let newArray = [...formData];

      newArray[index] = {
         ...formData[index],
         [e.target.name]: e.target.value,
      };
      setFormData(newArray);
   };

   const addNeighbourhood = () => {
      let newArray = [...formData];
      newArray.push({
         _id: "",
         name: "",
         town: "",
      });
      setFormData(newArray);
   };

   const deleteNeighbourhoodConfirm = () => {
      if (formData[toDelete]._id === "") {
         let newArray = [...formData];
         newArray.splice(toDelete, 1);
         setFormData(newArray);
      } else deleteNeighbourhood(formData[toDelete]._id);
   };

   return (
      <div className="mt-3">
         <PopUp
            toggleModal={toggleModalDelete}
            confirm={deleteNeighbourhoodConfirm}
            setToggleModal={() =>
               setAdminValues((prev) => ({
                  ...prev,
                  toggleModalDelete: !toggleModalDelete,
               }))
            }
            text="¿Está seguro que desea eliminar el barrio?"
         />
         <PopUp
            toggleModal={toggleModalSave}
            confirm={() => updateNeighbourhoods(formData)}
            setToggleModal={() =>
               setAdminValues((prev) => ({
                  ...prev,
                  toggleModalSave: !toggleModalSave,
               }))
            }
            text="¿Está seguro que desea guardar los cambios?"
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
               {formData &&
                  formData.length > 0 &&
                  formData.map((item, i) => (
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
                              {towns.towns.length > 0 &&
                                 towns.towns.map((town, index) => (
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
                                    toggleModalDelete: !toggleModalDelete,
                                    toDelete: i,
                                 }));
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
            save={() =>
               setAdminValues((prev) => ({
                  ...prev,
                  toggleModalSave: !toggleModalSave,
               }))
            }
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
})(NeighbourhoodTab);
