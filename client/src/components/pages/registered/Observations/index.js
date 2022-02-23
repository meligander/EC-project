import React, { useEffect } from "react";
import { connect } from "react-redux";

import { loadClass } from "../../../../actions/class";
import { loadObservations } from "../../../../actions/observation";

import ObservationsTab from "./tabs/ObservationsTab";
import ClassInfo from "../sharedComp/ClassInfo";
import Tabs from "../sharedComp/Tabs";

const Observations = ({
   match,
   classes: { loadingClass, classInfo },
   observations: { loading },
   loadObservations,
   loadClass,
}) => {
   const _id = match.params.class_id;

   useEffect(() => {
      if (loadingClass) loadClass(_id, false, false);
   }, [_id, loadClass, loadingClass]);

   useEffect(() => {
      if (loading) loadObservations(_id, null, true);
   }, [_id, loadObservations, loading]);

   return (
      <>
         <h1 className="text-center light-font p-1 mt-2">Observaciones</h1>
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
                     ObservationsTab,
                     ObservationsTab,
                     ObservationsTab,
                     ObservationsTab,
                  ]}
               />
            )}
         </div>
      </>
   );
};

const mapStateToProps = (state) => ({
   classes: state.classes,
   observations: state.observations,
});

export default connect(mapStateToProps, {
   loadClass,
   loadObservations,
})(Observations);
