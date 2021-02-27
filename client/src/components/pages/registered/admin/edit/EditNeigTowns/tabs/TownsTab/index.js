import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { deleteTown, updateTowns } from "../../../../../../../../actions/town";

import PopUp from "../../../../../../../modal/PopUp";
import EditButtons from "../../../sharedComp/EditButtons";

const TownsTab = ({
   towns: { towns, loading, error },
   updateTowns,
   deleteTown,
}) => {
   const [newTowns, setNewTowns] = useState([]);
   const [otherValues, setOtherValues] = useState({
      toggleModalDelete: false,
      toggleModalSave: false,
      toDelete: "",
      count: 0,
   });

   const { toggleModalDelete, toggleModalSave, toDelete, count } = otherValues;

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
         _id: count,
         name: "",
      });
      setNewTowns(newValue);
      setOtherValues({ ...otherValues, count: count + 1 });
   };

   const deleteTownConfirm = () => {
      if (typeof toDelete._id === "number") {
         const array = newTowns.filter((town) => town._id !== toDelete._id);
         setNewTowns(array);
      } else deleteTown(toDelete._id);
   };

   const setToggle = () => {
      setOtherValues({
         ...otherValues,
         toggleModalSave: false,
         toggleModalDelete: false,
      });
   };

   return (
      <>
         <div className="mt-3">
            <PopUp
               toggleModal={toggleModalDelete}
               confirm={deleteTownConfirm}
               setToggleModal={setToggle}
               text="¿Está seguro que desea eliminar la localidad?"
            />
            <PopUp
               toggleModal={toggleModalSave}
               confirm={() => updateTowns(newTowns)}
               setToggleModal={setToggle}
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
                                 type="button"
                                 onClick={(e) => {
                                    e.preventDefault();
                                    setOtherValues({
                                       ...otherValues,
                                       toDelete: town,
                                       toggleModalDelete: true,
                                    });
                                 }}
                                 className="btn btn-danger"
                              >
                                 <i className="far fa-trash-alt"></i>
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
               save={() =>
                  setOtherValues({
                     ...otherValues,
                     toggleModalSave: true,
                  })
               }
               type="Localidad"
            />
         </div>
      </>
   );
};

TownsTab.propTypes = {
   towns: PropTypes.object.isRequired,
   updateTowns: PropTypes.func.isRequired,
   deleteTown: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   towns: state.towns,
});

export default connect(mapStateToProps, { updateTowns, deleteTown })(TownsTab);
