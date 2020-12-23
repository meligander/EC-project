import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { deleteTown, updateTowns } from "../../../../../../../actions/town";
import { connect } from "react-redux";

import Confirm from "../../../../../../modal/Confirm";
import EditButtons from "../../../sharedComp/EditButtons";
import Loading from "../../../../../../modal/Loading";

const TownsTab = ({
   updateTowns,
   towns: { towns, loading, error },
   deleteTown,
}) => {
   const [newTowns, setNewTowns] = useState([]);
   const [otherValues, setOtherValues] = useState({
      toggleModalDelete: false,
      toggleModalSave: false,
      toDelete: "",
   });

   const { toggleModalDelete, toggleModalSave, toDelete } = otherValues;

   useEffect(() => {
      if (!loading) setNewTowns(towns);
   }, [loading, towns]);

   const onChange = (e) => {
      const number = Number(e.target.name.substring(5, e.target.name.length));
      let newValue = [...newTowns];
      newValue[number] = {
         ...newValue[number],
         name: e.target.value,
      };
      setNewTowns(newValue);
   };

   const addTown = () => {
      let newValue = [...newTowns];
      newValue.push({
         _id: "",
         name: "",
      });
      setNewTowns(newValue);
   };

   const deleteTownConfirm = () => {
      deleteTown(toDelete._id);
   };

   const saveTowns = () => {
      updateTowns(newTowns);
   };

   const setToggleDelete = (town) => {
      setOtherValues({
         ...otherValues,
         toggleModalDelete: !toggleModalDelete,
         toDelete: town,
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
         {" "}
         {!loading ? (
            <div className="mt-3">
               <Confirm
                  toggleModal={toggleModalDelete}
                  confirm={deleteTownConfirm}
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
                     {newTowns &&
                        newTowns.length > 0 &&
                        newTowns.map((town, i) => (
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
                                    onClick={() => setToggleDelete(town)}
                                    className="btn btn-danger"
                                 >
                                    <i className="fas fa-trash"></i>
                                 </button>
                              </td>
                           </tr>
                        ))}
                  </tbody>
               </table>
               {newTowns.length === 0 && (
                  <p className="heading-tertiary text-dark text-center mt-1">
                     {error.msg}
                  </p>
               )}
               <EditButtons
                  add={addTown}
                  save={setToggleSave}
                  type="Localidad"
               />
            </div>
         ) : (
            <Loading />
         )}
      </>
   );
};

TownsTab.propTypes = {
   updateTowns: PropTypes.func.isRequired,
   towns: PropTypes.object.isRequired,
   deleteTown: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   towns: state.towns,
});

export default connect(mapStateToProps, { updateTowns, deleteTown })(TownsTab);
