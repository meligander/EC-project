import React from "react";
import Tabs from "../../../Tabs";
import Average from "./AverageTab";
import Attendance from "./AttendanceTab";

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
