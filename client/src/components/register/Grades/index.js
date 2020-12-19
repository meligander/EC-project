import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import {
   loadGradesByClass,
   loadGradeTypesByCategory,
} from "../../../actions/grade";
import { loadClass } from "../../../actions/class";

import GradesTab from "./tabs/GradesTab";
import ClassInfo from "../../sharedComp/ClassInfo";
import Loading from "../../modal/Loading";
import Tabs from "../../sharedComp/Tabs";

const Grades = ({
   match,
   classes,
   grades: { gradeTypes, loading, error },
   loadGradesByClass,
   loadGradeTypesByCategory,
   loadClass,
}) => {
   const [oneLoad, setOneLoad] = useState(true);
   useEffect(() => {
      if (oneLoad) {
         loadGradesByClass(match.params.id);
         loadClass(match.params.id);
         setOneLoad(false);
      } else {
         if (gradeTypes.length === 0 && !classes.loading && !error.type) {
            loadGradeTypesByCategory(classes.classInfo.category._id);
         }
      }
   }, [
      classes.loading,
      oneLoad,
      loadGradeTypesByCategory,
      classes.classInfo,
      loadClass,
      loadGradesByClass,
      match.params.id,
      gradeTypes,
      error.type,
   ]);

   const tabs = (className) => {
      switch (className) {
         case "Kinder":
            return (
               <Tabs
                  tablist={[
                     "1° Bimestre",
                     "2° Bimestre",
                     "3° Bimestre",
                     "4° Bimestre",
                  ]}
                  panellist={[GradesTab, GradesTab, GradesTab, GradesTab]}
               />
            );
         case "Infantil A":
         case "Preparatorio":
         case "Junior":
            return (
               <div className="few-tabs">
                  <Tabs
                     tablist={[
                        "1° Bimestre",
                        "2° Bimestre",
                        "3° Bimestre",
                        "4° Bimestre",
                        "Final",
                        "Cambridge",
                     ]}
                     panellist={[
                        GradesTab,
                        GradesTab,
                        GradesTab,
                        GradesTab,
                        GradesTab,
                        GradesTab,
                     ]}
                  />
               </div>
            );
         default:
            return (
               <Tabs
                  tablist={[
                     "1° Bimestre",
                     "2° Bimestre",
                     "3° Bimestre",
                     "4° Bimestre",
                     "Final",
                  ]}
                  panellist={[
                     GradesTab,
                     GradesTab,
                     GradesTab,
                     GradesTab,
                     GradesTab,
                  ]}
               />
            );
      }
   };

   return (
      <>
         {!loading && !classes.loading ? (
            <>
               <h1 className="text-center light-font p-1 mt-2">Notas</h1>

               <ClassInfo classInfo={classes.classInfo} />
               <div className="few-tabs">
                  {tabs(classes.classInfo.category.name)}
               </div>
            </>
         ) : (
            <Loading />
         )}
      </>
   );
};

Grades.propTypes = {
   grades: PropTypes.object.isRequired,
   classes: PropTypes.object.isRequired,
   loadGradesByClass: PropTypes.func.isRequired,
   loadGradeTypesByCategory: PropTypes.func.isRequired,
   loadClass: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   grades: state.grades,
   classes: state.classes,
});

export default connect(mapStateToProps, {
   loadGradesByClass,
   loadClass,
   loadGradeTypesByCategory,
})(withRouter(Grades));
