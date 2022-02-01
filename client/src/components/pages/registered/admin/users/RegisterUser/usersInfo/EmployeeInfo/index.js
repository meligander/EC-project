import React from "react";

const EmployeeInfo = ({ type, userType, salary, degree, school, onChange }) => {
   const isOwner = userType === "admin" || userType === "admin&teacher";
   const isAdmin = userType === "secretary" || isOwner;

   return (
      <>
         {type === "teacher" && (
            <>
               <div className="form-group">
                  <input
                     className="form-input"
                     type="text"
                     name="degree"
                     id="degree"
                     disabled={!isAdmin}
                     value={degree}
                     onChange={onChange}
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
                     onChange={onChange}
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
                  onChange={onChange}
                  value={salary}
                  name="salary"
                  id="salary"
                  placeholder="Salario por hora"
               />
               <label htmlFor="salary" className="form-label">
                  Salario por hora
               </label>
            </div>
         )}
      </>
   );
};

export default EmployeeInfo;
