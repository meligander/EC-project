import React, { useEffect } from "react";
import { connect } from "react-redux";

import { loadCategories } from "../../../../../../actions/category";

import Tabs from "../../../sharedComp/Tabs";
import Average from "./tabs/AverageTab";
import Attendance from "./tabs/AttendanceTab";

const MentionList = ({ loadCategories }) => {
   useEffect(() => {
      loadCategories(false);
   }, [loadCategories]);

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

export default connect(null, { loadCategories })(MentionList);
