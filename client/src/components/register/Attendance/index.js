import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { loadClass } from "../../../actions/class";
import { loadAttendances } from "../../../actions/attendance";

import AttendanceTab from "./tabs/AttendanceTab";
import ClassInfo from "../../sharedComp/ClassInfo";
import Loading from "../../modal/Loading";
import Tabs from "../../sharedComp/Tabs";

const Attendance = ({
   match,
   classes: { loading, classInfo },
   loadAttendances,
   loadClass,
   attendances,
}) => {
   useEffect(() => {
      if (loading) {
         loadClass(match.params.class_id);
      }
      if (attendances.loading) {
         loadAttendances(match.params.class_id);
      }
   }, [match.params, loadClass, loadAttendances, attendances.loading, loading]);

   return (
      <>
         {!attendances.loading ? (
            <>
               <h1 className="text-center light-font p-1 mt-2">
                  Inasistencias
               </h1>
               <ClassInfo classInfo={classInfo} />
               <div className="few-tabs">
                  <Tabs
                     tablist={[
                        "1° Bimestre",
                        "2° Bimestre",
                        "3° Bimestre",
                        "4° Bimestre",
                     ]}
                     panellist={[
                        AttendanceTab,
                        AttendanceTab,
                        AttendanceTab,
                        AttendanceTab,
                     ]}
                  />
               </div>
            </>
         ) : (
            <Loading />
         )}
      </>
   );
};

Attendance.propTypes = {
   classes: PropTypes.object.isRequired,
   attendances: PropTypes.object.isRequired,
   loadClass: PropTypes.func.isRequired,
   loadAttendances: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   classes: state.classes,
   attendances: state.attendances,
});

export default connect(mapStateToProps, {
   loadClass,
   loadAttendances,
})(withRouter(Attendance));
