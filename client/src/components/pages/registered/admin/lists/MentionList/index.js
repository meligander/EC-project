import React, { useEffect } from "react";
import { connect } from "react-redux";

import { loadCategories } from "../../../../../../actions/category";

import Tabs from "../../../sharedComp/Tabs";
import Average from "./tabs/AverageTab";
import Attendance from "./tabs/AttendanceTab";

const MentionList = ({ loadCategories, categories: { loading } }) => {
   useEffect(() => {
      loadCategories(true);
   }, [loadCategories]);

   return (
      <>
         <h2>Menciones fin de año</h2>
         {!loading && (
            <Tabs
               tablist={["Promedio", "Asistencia"]}
               panellist={[Average, Attendance]}
            />
         )}
      </>
   );
};

const mapStateToProps = (state) => ({
   categories: state.categories,
});

export default connect(mapStateToProps, { loadCategories })(MentionList);
