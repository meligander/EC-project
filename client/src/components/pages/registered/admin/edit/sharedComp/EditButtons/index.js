import React from "react";
import PropTypes from "prop-types";

const EditButtons = ({ save, add, type }) => {
   return (
      <div className="btn-right p-2">
         <button
            type="button"
            onClick={(e) => {
               e.preventDefault();
               save();
            }}
            className="btn btn-primary"
         >
            <i className="far fa-save"></i>
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
            <i className="fas fa-plus"></i>
            <span className="hide-sm">&nbsp; Agregar {type}</span>
         </button>
      </div>
   );
};

EditButtons.propTypes = {
   save: PropTypes.func.isRequired,
   add: PropTypes.func.isRequired,
   type: PropTypes.string.isRequired,
};

export default EditButtons;
