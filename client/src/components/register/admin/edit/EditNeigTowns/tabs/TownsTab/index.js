import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { clearTowns, updateTowns } from "../../../../../../../actions/town";
import { connect } from "react-redux";

import Confirm from "../../../../../../modal/Confirm";
import EditButtons from "../../../sharedComp/EditButtons";

const TownsTab = ({
   updateTowns,
   clearTowns,
   towns: { towns, loading, error },
}) => {
   const [newValues, setNewValues] = useState([]);
   const [otherValues, setOtherValues] = useState({
      toggleModalDelete: false,
      toggleModalSave: false,
      townDelete: "",
   });

   const { toggleModalDelete, toggleModalSave, townDelete } = otherValues;

   useEffect(() => {
      const init = () => {
         setNewValues([...towns]);
      };
      if (!loading) init();
   }, [loading, towns]);

   const onChange = (e) => {
      const number = Number(e.target.name.substring(5, e.target.name.length));
      let newValue = [...newValues];
      newValue[number] = {
         ...newValue[number],
         name: e.target.value,
      };
      setNewValues(newValue);
   };

   const addTown = () => {
      let newValue = [...newValues];
      newValue.push({
         _id: "",
         name: "",
      });
      setNewValues(newValue);
   };

   const deleteTown = () => {
      let newValue = [...newValues];
      newValue.splice(townDelete, 1);
      setNewValues(newValue);
   };

   const saveTowns = () => {
      updateTowns(newValues);
      clearTowns();
   };

   const setToggleDelete = (town_index) => {
      setOtherValues({
         ...otherValues,
         toggleModalDelete: !toggleModalDelete,
         townDelete: town_index,
      });
   };

   const setToggleSave = () => {
      setOtherValues({
         ...otherValues,
         toggleModalSave: !toggleModalSave,
      });
   };

   return (
      <>
         <div className="mt-3">
            <Confirm
               toggleModal={toggleModalDelete}
               confirm={deleteTown}
               setToggleModal={setToggleDelete}
               text="¿Está seguro que desea eliminar la localidad?"
            />
            <Confirm
               toggleModal={toggleModalSave}
               confirm={saveTowns}
               setToggleModal={setToggleSave}
               text="¿Está seguro que desea guardar los cambios?"
            />
            <table className="smaller">
               <thead>
                  <tr>
                     <th>Nombre</th>
                     <th>&nbsp;</th>
                  </tr>
               </thead>
               <tbody>
                  {newValues.length > 0 &&
                     newValues.map((town, i) => (
                        <tr key={i}>
                           <td>
                              <input
                                 type="text"
                                 name={`input${i}`}
                                 onChange={onChange}
                                 value={town.name}
                                 placeholder="Nombre"
                              />
                           </td>
                           <td>
                              <button
                                 onClick={() => setToggleDelete(i)}
                                 className="btn btn-danger"
                              >
                                 <i className="fas fa-trash"></i>
                              </button>
                           </td>
                        </tr>
                     ))}
               </tbody>
            </table>
            {newValues.length === 0 && (
               <p className="heading-tertiary text-dark text-center mt-1">
                  {error.msg}
               </p>
            )}
            <EditButtons add={addTown} save={setToggleSave} type="Localidad" />
         </div>
      </>
   );
};

TownsTab.propTypes = {
   updateTowns: PropTypes.func.isRequired,
   towns: PropTypes.object.isRequired,
   clearTowns: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   towns: state.towns,
});

export default connect(mapStateToProps, { updateTowns, clearTowns })(TownsTab);
