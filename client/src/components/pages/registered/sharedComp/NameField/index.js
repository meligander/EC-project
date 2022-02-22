import React from "react";

const NameField = ({
   name,
   nameAttribute,
   lastnameAttribute,
   lastname,
   onChange,
   namePlaceholder,
   lastnamePlaceholder,
   autoComplete,
}) => {
   return (
      <div className="form-group">
         <div className="two-in-row">
            <input
               className="form-input"
               type="text"
               name={nameAttribute ? nameAttribute : "name"}
               placeholder={namePlaceholder ? namePlaceholder : "Nombre"}
               value={name}
               id="user"
               autoComplete={autoComplete && autoComplete}
               onChange={onChange}
            />
            <input
               className="form-input"
               type="text"
               name={lastnameAttribute ? lastnameAttribute : "lastname"}
               placeholder={
                  lastnamePlaceholder ? lastnamePlaceholder : "Apellido"
               }
               id="user"
               autoComplete={autoComplete && autoComplete}
               value={lastname}
               onChange={onChange}
            />
         </div>
         {!autoComplete && (
            <div className="two-in-row">
               <label className={`form-label ${name === "" ? "lbl" : ""}`}>
                  {namePlaceholder ? namePlaceholder : "Nombre"}
               </label>
               <label className={`form-label ${lastname === "" ? "lbl" : ""}`}>
                  {lastnamePlaceholder ? lastnamePlaceholder : "Apellido"}
               </label>
            </div>
         )}
      </div>
   );
};

export default NameField;
