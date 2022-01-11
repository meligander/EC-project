import React from "react";

const StudentInfo = ({
   isAdmin,
   discount,
   chargeday,
   birthprov,
   birthtown,
   onChange,
}) => {
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
               <option value="Buenos Aires">Buenos Aires</option>
               <option value="Catamarca">Catamarca</option>
               <option value="Córdoba">Córdoba</option>
               <option value="Corrientes">Corrientes</option>
               <option value="Chaco">Chaco</option>
               <option value="Chubut">Chubut</option>
               <option value="Entre Ríos">Entre Ríos</option>
               <option value="Formosa">Formosa</option>
               <option value="Jujuy">Jujuy</option>
               <option value="La Pampa">La Pampa</option>
               <option value="La Rioja">La Rioja</option>
               <option value="Mendoza">Mendoza</option>
               <option value="Misiones">Misiones</option>
               <option value="Neuquén">Neuquén</option>
               <option value="Río Negro">Río Negro</option>
               <option value="Salta">Salta</option>
               <option value="San Juan">San Juan</option>
               <option value="San Luis">San Luis</option>
               <option value="Santa Cruz">Santa Cruz</option>
               <option value="Santa Fe">Santa Fe</option>
               <option value="Santiago del Estero">Santiago del Estero</option>
               <option value="Tierra del Fuego">Tierra del Fuego</option>
               <option value="Tucumán">Tucumán</option>
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

export default StudentInfo;
