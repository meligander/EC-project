import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { FaTrashAlt } from "react-icons/fa";

import { deleteTown, updateTowns } from "../../../../../../../../actions/town";
import { togglePopup } from "../../../../../../../../actions/mixvalues";

import PopUp from "../../../../../../../modal/PopUp";
import EditButtons from "../../../sharedComp/EditButtons";

const TownsTab = ({
   towns: { towns, error },
   togglePopup,
   updateTowns,
   deleteTown,
}) => {
   const [formData, setFormData] = useState([]);
   const [adminValues, setAdminValues] = useState({
      popupType: "",
      toDelete: "",
   });

   const { popupType, toDelete } = adminValues;

   useEffect(() => {
      setFormData(towns);
   }, [towns]);

   const onChange = (e) => {
      e.persist();
      const number = Number(e.target.name.substring(5, e.target.name.length));

      let newFormData = [...formData];

      newFormData[number] = {
         ...formData[number],
         name: e.target.value,
      };
      setFormData(newFormData);
   };

   const addTown = () => {
      let newFormData = [...formData];

      newFormData.push({
         _id: "",
         name: "",
      });
      setFormData(newFormData);
   };

   return (
      <>
         <div className="mt-3">
            <PopUp
               confirm={() => {
                  if (popupType === "save") updateTowns(formData);
                  else {
                     if (formData[toDelete]._id === "") {
                        let newFormData = [...formData];
                        newFormData.splice(toDelete, 1);
                        setFormData(newFormData);
                     } else deleteTown(formData[toDelete]._id);
                  }
               }}
               text={`¿Está seguro que desea ${
                  popupType === "save"
                     ? "guardar los cambios"
                     : "eliminar la localidad"
               }?`}
            />
            <table className="smaller">
               <thead>
                  <tr>
                     <th>Nombre</th>
                     <th>&nbsp;</th>
                  </tr>
               </thead>
               <tbody>
                  {formData.map((town, i) => (
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
                                    popupType: "delete",
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
               add={addTown}
               save={() => {
                  setAdminValues((prev) => ({
                     ...prev,
                     popupType: "save",
                  }));
                  togglePopup("default");
               }}
               type="Localidad"
            />
         </div>
      </>
   );
};

const mapStateToProps = (state) => ({
   towns: state.towns,
});

export default connect(mapStateToProps, {
   updateTowns,
   deleteTown,
   togglePopup,
})(TownsTab);
