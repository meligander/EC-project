import React from "react";

import "./style.scss";

const DateFilter = ({ startDate, endDate, onChange }) => {
   return (
      <div className="date-filter">
         <div>
            <input
               className="form-input"
               type="date"
               name="startDate"
               value={startDate}
               max={endDate !== "" ? endDate : ""}
               id="startDate"
               onChange={onChange}
            />
            <label htmlFor="startDate" className="form-label-show">
               Ingrese desde que fecha desea ver
            </label>
         </div>
         <div>
            <input
               className="form-input"
               type="date"
               name="endDate"
               value={endDate}
               min={startDate !== "" ? startDate : ""}
               onChange={onChange}
            />
            <label htmlFor="endDate" className="form-label-show">
               Ingrese hasta que fecha desea ver
            </label>
         </div>
      </div>
   );
};

export default DateFilter;
