import React, { useState } from "react";

import InstallmentsSearch from "../../../../../sharedComp/search/InstallmentsSearch";

const InstallmentsSearchTab = () => {
   const [adminValues, setAdminValues] = useState({
      student: null,
   });
   const { student } = adminValues;

   const changeStudent = (student) => {
      setAdminValues((prev) => ({
         ...prev,
         student,
      }));
   };

   return (
      <div className="mt-4">
         <InstallmentsSearch student={student} changeStudent={changeStudent} />
      </div>
   );
};

export default InstallmentsSearchTab;
