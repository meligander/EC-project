import React from "react";

import "./style.scss";

const NewDate = ({ onChange, fromDate, toDate, date, bimestre }) => {
   const year = new Date().getFullYear();
   return (
      <div className="new-date">
         {bimestre ? (
            <>
               <div className="form-group">
                  <input
                     className="form-input"
                     id="fromDate"
                     type="date"
                     name="both"
                     min={`${year}-03-01`}
                     max={`${year}-12-01`}
                     onChange={onChange}
                     value={fromDate}
                  />
                  <label htmlFor="fromDate" className="form-label show">
                     Comienzo del bimestre
                  </label>
               </div>
               <div className="form-group">
                  <input
                     className="form-input"
                     id="toDate"
                     type="date"
                     name="both"
                     disabled={fromDate === ""}
                     min={fromDate !== "" ? fromDate : null}
                     max={`${year}-12-15`}
                     onChange={onChange}
                     value={toDate}
                  />
                  <label htmlFor="toDate" className="form-label show">
                     Fin del bimestre
                  </label>
               </div>
            </>
         ) : (
            <div className="form-group">
               <input
                  className="form-input center"
                  id="date"
                  type="date"
                  name="one"
                  min={`${year}-03-01`}
                  max={`${year}-12-15`}
                  onChange={onChange}
                  value={date}
               />
               <label htmlFor="date" className="form-label show">
                  Nuevo día
               </label>
            </div>
         )}
      </div>
   );
};

export default NewDate;
