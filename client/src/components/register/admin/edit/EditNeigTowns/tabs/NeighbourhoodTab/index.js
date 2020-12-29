import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import {
   deleteNeighbourhood,
   updateNeighbourhoods,
} from "../../../../../../../actions/neighbourhood";
import { setAlert } from "../../../../../../../actions/alert";

import Confirm from "../../../../../../modal/Confirm";
import EditButtons from "../../../sharedComp/EditButtons";

const NeighbourhoodTab = ({
   towns,
   neighbourhoods: { neighbourhoods, loading, error },
   updateNeighbourhoods,
   deleteNeighbourhood,
   setAlert,
}) => {
   const [newNB, setNewNB] = useState([]);
   const [otherValues, setOtherValues] = useState({
      toggleModalDelete: false,
      toggleModalSave: false,
      toDelete: "",
   });

   const { toggleModalDelete, toggleModalSave, toDelete } = otherValues;

   useEffect(() => {
      if (!loading) setNewNB(neighbourhoods);
   }, [loading, neighbourhoods]);

   const onChange = (e, index) => {
      let newValue = [...newNB];
      newValue[index] = {
         ...newValue[index],
         [e.target.name]: e.target.value,
      };
      setNewNB(newValue);
   };

   const addNeighbourhood = () => {
      let newValue = [...newNB];
      newValue.push({
         _id: "",
         name: "",
         town: 0,
      });
      setNewNB(newValue);
   };

   const deleteNeighbourhoodConfirm = () => {
      if (toDelete._id === "") {
         setAlert(
            "El barrio no se ha guardado todavía. Vuelva a recargar la página y desaparecerá.",
            "danger",
            "2"
         );
      } else deleteNeighbourhood(toDelete._id);
   };

   const saveNeighbourhoods = () => {
      updateNeighbourhoods(newNB);
   };

   const setToggleDelete = (nB) => {
      setOtherValues({
         ...otherValues,
         toggleModalDelete: !toggleModalDelete,
         toDelete: nB,
      });
   };

   const setToggleSave = () => {
      setOtherValues({
         ...otherValues,
         toggleModalSave: !toggleModalSave,
      });
   };

   return (
      <div className="mt-3">
         <Confirm
            toggleModal={toggleModalDelete}
            confirm={deleteNeighbourhoodConfirm}
            setToggleModal={setToggleDelete}
            text="¿Está seguro que desea eliminar el barrio?"
         />
         <Confirm
            toggleModal={toggleModalSave}
            confirm={saveNeighbourhoods}
            setToggleModal={setToggleSave}
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
               {newNB &&
                  newNB.length > 0 &&
                  newNB.map((item, i) => (
                     <tr key={i}>
                        <td>
                           <input
                              type="text"
                              name="name"
                              onChange={(e) => onChange(e, i)}
                              value={item.name}
                              placeholder="Nombre"
                           />
                        </td>
                        <td>
                           <select
                              name="town"
                              onChange={(e) => onChange(e, i)}
                              value={newNB[i].town}
                           >
                              <option value={0}>
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
                              onClick={() => setToggleDelete(item)}
                              className="btn btn-danger"
                           >
                              <i className="fas fa-trash"></i>
                           </button>
                        </td>
                     </tr>
                  ))}
            </tbody>
         </table>
         {newNB.length === 0 && (
            <p className="heading-tertiary text-dark text-center mt-1">
               {error.msg}
            </p>
         )}
         <EditButtons
            add={addNeighbourhood}
            save={setToggleSave}
            type="Barrio"
         />
      </div>
   );
};

NeighbourhoodTab.propTypes = {
   neighbourhoods: PropTypes.object.isRequired,
   towns: PropTypes.object.isRequired,
   updateNeighbourhoods: PropTypes.func.isRequired,
   deleteNeighbourhood: PropTypes.func.isRequired,
   setAlert: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   neighbourhoods: state.neighbourhoods,
   towns: state.towns,
});

export default connect(mapStateToProps, {
   updateNeighbourhoods,
   deleteNeighbourhood,
   setAlert,
})(NeighbourhoodTab);
