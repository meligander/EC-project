import React, { useEffect } from "react";
import { connect } from "react-redux";

import { loadClass } from "../../../../actions/class";
import { loadAttendances } from "../../../../actions/attendance";

import AttendanceTab from "./tabs/AttendanceTab";
import ClassInfo from "../sharedComp/ClassInfo";
import Tabs from "../sharedComp/Tabs";

const Attendance = ({
   match,
   classes: { loadingClass, classInfo },
   attendances: { loading },
   loadAttendances,
   loadClass,
}) => {
   const _id = match.params.class_id;

   useEffect(() => {
      if (loadingClass) loadClass(_id, false, false);
   }, [_id, loadClass, loadingClass]);

   useEffect(() => {
      if (loading) loadAttendances(_id);
   }, [_id, loadAttendances, loading]);

   return (
      <>
         <h1 className="text-center light-font p-1 mt-2">Inasistencias</h1>
         {!loadingClass && <ClassInfo classInfo={classInfo} />}
         <div className="few-tabs">
            {!loading && !loadingClass && (
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
            )}
         </div>
      </>
   );
};

const mapStateToProps = (state) => ({
   classes: state.classes,
   attendances: state.attendances,
});

export default connect(mapStateToProps, {
   loadClass,
   loadAttendances,
})(Attendance);
