import React from "react";
import { FaPlus } from "react-icons/fa";
import { FiSave } from "react-icons/fi";

const EditButtons = ({ save, add, type }) => {
   return (
      <div className="btn-right mt-5">
         <button
            type="button"
            onClick={(e) => {
               e.preventDefault();
               save();
            }}
            className="btn btn-primary"
         >
            <FiSave />
            <span className="hide-sm">&nbsp; Guardar </span>
         </button>
         <button
            type="button"
            onClick={(e) => {
               e.preventDefault();
               add();
            }}
            className="btn btn-primary"
         >
            <FaPlus />
            <span className="hide-sm">&nbsp; Agregar {type}</span>
         </button>
      </div>
   );
};

export default EditButtons;
