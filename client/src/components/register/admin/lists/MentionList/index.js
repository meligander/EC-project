import React from "react";

import Tabs from "../../../../sharedComp/Tabs";
import Average from "./tabs/AverageTab";
import Attendance from "./tabs/AttendanceTab";

const MentionList = () => {
   return (
      <>
         <h2>Menciones fin de año</h2>
         <Tabs
            tablist={["Promedio", "Asistencia"]}
            panellist={[Average, Attendance]}
         />
      </>
   );
};

export default MentionList;
