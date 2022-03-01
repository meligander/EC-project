import React from "react";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";

import "./style.scss";

const NewGradeType = ({
   gradetype,
   gradetypes,
   onChange,
   clearGradeTypes,
   isAdmin,
   togglePopup,
}) => {
   return (
      <div className=" new-grade">
         <div className="new-grade-form">
            <select
               className="form-input center"
               id="gradetype"
               value={gradetype}
               onChange={onChange}
            >
               <option value="">*Seleccione un tipo de nota</option>
               {gradetypes.map((gradetype) => (
                  <option key={gradetype._id} value={gradetype._id}>
                     {gradetype.name}
                  </option>
               ))}
            </select>
            <label
               htmlFor="new-category"
               className={`form-label ${gradetype === "" ? "lbl" : ""}`}
            >
               Tipo de nota
            </label>
         </div>
         {isAdmin && (
            <div className="tooltip">
               <Link
                  to="/class/gradetypes/edit"
                  onClick={() => {
                     window.scroll(0, 0);
                     clearGradeTypes();
                     togglePopup("default");
                  }}
                  className="btn btn-mix-secondary"
               >
                  <FaEdit />
               </Link>
               <span className="tooltiptext">Editar tipo de nota</span>
            </div>
         )}
      </div>
   );
};

export default NewGradeType;
