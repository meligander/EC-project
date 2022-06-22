import React from "react";

const EmployeeInfo = ({
   type,
   userType,
   degree,
   school,
   cbvu,
   alias,
   onChange,
}) => {
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
         {isAdmin && (
            <>
               <div className="form-group">
                  <input
                     className="form-input"
                     type="text"
                     onChange={onChange}
                     value={cbvu}
                     name="cbvu"
                     id="cbvu"
                     placeholder="CBU/CVU"
                  />
                  <label htmlFor="cbvu" className="form-label">
                     CBU/CVU
                  </label>
               </div>
               <div className="form-group">
                  <input
                     className="form-input"
                     type="text"
                     name="alias"
                     id="alias"
                     disabled={!isAdmin}
                     value={alias}
                     onChange={onChange}
                     placeholder="Alias"
                  />
                  <label htmlFor="degree" className="form-label">
                     Alias
                  </label>
               </div>
            </>
         )}
      </>
   );
};

export default EmployeeInfo;
