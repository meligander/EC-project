import React from "react";

const StudentInfo = ({ isAdmin, discount, chargeday, onChange }) => {
   return (
      <>
         {isAdmin && (
            <>
               <div className="form-group">
                  <select
                     className="form-input"
                     name="discount"
                     id="discount"
                     value={discount}
                     onChange={onChange}
                  >
                     <option value="">* Seleccione el tipo de descuento</option>
                     <option value={0}>Ninguno</option>
                     <option value={10}>Hermanos</option>
                     <option value={50}>Media Beca</option>
                  </select>
                  <label
                     htmlFor="discount"
                     className={`form-label ${discount === "" ? "lbl" : ""}`}
                  >
                     Tipo de descuento
                  </label>
               </div>
               <div className="form-group">
                  <select
                     className="form-input"
                     name="chargeday"
                     id="chargeday"
                     value={chargeday}
                     onChange={onChange}
                  >
                     <option value="">
                        * Seleccione el día en que se aplicará el recargo
                     </option>
                     <option value="10">10</option>
                     <option value="15">15</option>
                     <option value="31">30/31</option>
                  </select>
                  <label
                     htmlFor="chargeday"
                     className={`form-label ${chargeday === "" ? "lbl" : ""}`}
                  >
                     Día de recargo
                  </label>
               </div>
            </>
         )}
      </>
   );
};

export default StudentInfo;
