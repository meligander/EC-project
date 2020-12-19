import React from "react";
import PropTypes from "prop-types";

import "./style.scss";

const DateFilter = ({ startDate, endDate, onChange, max }) => {
   return (
      <div className="date-filter">
         <div>
            <input
               className="form-input"
               type="date"
               name="startDate"
               value={startDate}
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
               max={max}
               onChange={onChange}
            />
            <label htmlFor="endDate" className="form-label-show">
               Ingrese hasta que fecha desea ver
            </label>
         </div>
      </div>
   );
};

DateFilter.propTypes = {
   startDate: PropTypes.string.isRequired,
   endDate: PropTypes.string.isRequired,
   onChange: PropTypes.func.isRequired,
   max: PropTypes.string,
};

export default DateFilter;
