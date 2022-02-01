import React, { useState } from "react";

import InstallmentsSearch from "../../../../../sharedComp/search/InstallmentsSearch";

const InstallmentsSearchTab = () => {
   const [adminValues, setAdminValues] = useState({
      student: {},
   });
   const { student } = adminValues;

   const changeStudent = (student) => {
      setAdminValues((prev) => ({
         ...prev,
         student,
      }));
   };

   return (
      <InstallmentsSearch student={student} changeStudent={changeStudent} />
   );
};

export default InstallmentsSearchTab;
