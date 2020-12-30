import React from "react";
import PropTypes from "prop-types";

const EmployeeInfo = ({
   isAdmin,
   isOwner,
   type,
   birthprov,
   birthtown,
   salary,
   degree,
   school,
   onChange,
}) => {
   return (
      <>
         <div className="form-group">
            <select
               className="form-input"
               value={birthprov}
               name="birthprov"
               id="birthprov"
               disabled={!isAdmin}
               onChange={(e) => onChange(e)}
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
               onChange={(e) => onChange(e)}
               placeholder="Localidad de Nacimiento"
            />
            <label htmlFor="birthtown" className="form-label">
               Localidad de Nacimiento
            </label>
         </div>
         {type === "Profesor" && (
            <>
               <div className="form-group">
                  <input
                     className="form-input"
                     type="text"
                     name="degree"
                     id="degree"
                     disabled={!isAdmin}
                     value={degree}
                     onChange={(e) => onChange(e)}
                     placeholder="Titulo"
                  />
                  <label htmlFor="degree" className="form-label">
                     Titulo
                  </label>
               </div>
               <div className="form-group">
                  <input
                     className="form-input"
                     type="text"
                     name="school"
                     id="school"
                     disabled={!isAdmin}
                     value={school}
                     onChange={(e) => onChange(e)}
                     placeholder="Institución donde se graduó"
                  />
                  <label htmlFor="degree" className="form-label">
                     Institución donde se graduó
                  </label>
               </div>
            </>
         )}
         {isOwner && (
            <div className="form-group">
               <input
                  className="form-input"
                  type="number"
                  onChange={(e) => onChange(e)}
                  value={salary}
                  name="salary"
                  id="salary"
                  placeholder="Salario"
               />
               <label htmlFor="salary" className="form-label">
                  Salario
               </label>
            </div>
         )}
      </>
   );
};

EmployeeInfo.propTypes = {
   isAdmin: PropTypes.bool.isRequired,
   isOwner: PropTypes.bool.isRequired,
   type: PropTypes.string.isRequired,
   birthprov: PropTypes.string.isRequired,
   birthtown: PropTypes.string.isRequired,
   salary: PropTypes.string.isRequired,
   degree: PropTypes.string.isRequired,
   school: PropTypes.string.isRequired,
   onChange: PropTypes.func.isRequired,
};

export default EmployeeInfo;
