import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { loadCategories } from "../../../../../actions/category";

import Tabs from "../../../sharedComp/Tabs";
import Average from "./tabs/AverageTab";
import Attendance from "./tabs/AttendanceTab";

const MentionList = ({ loadCategories }) => {
   useEffect(() => {
      loadCategories();
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

MentionList.propTypes = {
   loadCategories: PropTypes.func.isRequired,
};

export default connect(null, { loadCategories })(MentionList);
