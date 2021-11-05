import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { FaTrashAlt } from "react-icons/fa";

import { deleteTown, updateTowns } from "../../../../../../../../actions/town";

import PopUp from "../../../../../../../modal/PopUp";
import EditButtons from "../../../sharedComp/EditButtons";

const TownsTab = ({
   towns: { towns, loading, error },
   updateTowns,
   deleteTown,
}) => {
   const [formData, setFormData] = useState([]);
   const [adminValues, setAdminValues] = useState({
      toggleModalDelete: false,
      toggleModalSave: false,
      toDelete: "",
   });

   const { toggleModalDelete, toggleModalSave, toDelete } = adminValues;

   useEffect(() => {
      if (!loading) setFormData(towns);
   }, [loading, towns]);

   const onChange = (e) => {
      const number = Number(e.target.name.substring(5, e.target.name.length));

      let newArray = [...formData];

      newArray[number] = {
         ...formData[number],
         name: e.target.value,
      };
      setFormData(newArray);
   };

   const addTown = () => {
      let newArray = [...formData];

      newArray.push({
         _id: "",
         name: "",
      });
      setFormData(newArray);
   };

   const deleteTownConfirm = () => {
      if (formData[toDelete]._id === "") {
         let newArray = [...formData];
         newArray.splice(toDelete, 1);
         setFormData(newArray);
      } else deleteTown(formData[toDelete]._id);
   };

   return (
      <>
         <div className="mt-3">
            <PopUp
               toggleModal={toggleModalDelete}
               confirm={deleteTownConfirm}
               setToggleModal={() =>
                  setAdminValues((prev) => ({
                     ...prev,
                     toggleModalDelete: !toggleModalDelete,
                  }))
               }
               text="¿Está seguro que desea eliminar la localidad?"
            />
            <PopUp
               toggleModal={toggleModalSave}
               confirm={() => updateTowns(formData)}
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
                     <th>&nbsp;</th>
                  </tr>
               </thead>
               <tbody>
                  {formData &&
                     formData.length > 0 &&
                     formData.map((town, i) => (
                        <tr key={i}>
                           <td data-th="Nombre">
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
                                    setAdminValues((prev) => ({
                                       ...prev,
                                       toDelete: i,
                                       toggleModalDelete: !toggleModalDelete,
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
               add={addTown}
               save={() =>
                  setAdminValues((prev) => ({
                     ...prev,
                     toggleModalSave: !toggleModalSave,
                  }))
               }
               type="Localidad"
            />
         </div>
      </>
   );
};

const mapStateToProps = (state) => ({
   towns: state.towns,
});

export default connect(mapStateToProps, { updateTowns, deleteTown })(TownsTab);
