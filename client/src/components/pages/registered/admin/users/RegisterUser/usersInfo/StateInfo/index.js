import React from "react";

const StateInfo = ({ isAdmin, birthprov, birthtown, onChange }) => {
   const state = () => {
      return "Buenos Aires,Catamarca,Córdoba,Corrientes,Chaco,Chubut,Entre Ríos,Formosa,Jujuy,La Pampa,La Rioja,Mendoza,Misiones,Neuquén,Río Negro,Salta,San Juan,San Luis,Santa Cruz,Santa Fe,Santiago del Estero,Tierra del Fuego,Tucumán"
         .split(",")
         .map((item) => (
            <option key={item} value={item}>
               {item}
            </option>
         ));
   };
   return (
      <>
         <div className="form-group">
            <select
               className="form-input"
               value={birthprov}
               name="birthprov"
               id="birthprov"
               disabled={!isAdmin}
               onChange={onChange}
            >
               <option value="0">* Seleccione Provincia de Nacimiento</option>
               {state()}
               <option value=".">Otro</option>
            </select>
            <label
               htmlFor="birthprov"
               className={`form-label ${
                  birthprov === "" || birthprov === "0" ? "lbl" : ""
               }`}
            >
               Provincia de nacimiento
            </label>
         </div>
         <div className="form-group">
            <input
               className="form-input"
               type="text"
               name="birthtown"
               id="birthtown"
               disabled={!isAdmin}
               value={birthtown}
               onChange={onChange}
               placeholder="Localidad de Nacimiento"
            />
            <label htmlFor="birthtown" className="form-label">
               Localidad de Nacimiento
            </label>
         </div>
      </>
   );
};

export default StateInfo;
