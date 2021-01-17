import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import {
   clearGradeTypes,
   loadGrades,
   loadGradeTypesByCategory,
   gradesPDF,
} from "../../../actions/grade";
import { loadClass } from "../../../actions/class";

import GradesTab from "./tabs/GradesTab";
import ClassInfo from "../sharedComp/ClassInfo";
import Loading from "../../modal/Loading";
import Tabs from "../sharedComp/Tabs";

const Grades = ({
   match,
   classes: { loading: loadingClass, classInfo },
   grades: {
      loadingGT,
      loading,
      grades: { header, periods },
   },
   loadGrades,
   loadGradeTypesByCategory,
   loadClass,
   gradesPDF,
   clearGradeTypes,
}) => {
   const [oneLoad, setOneLoad] = useState(true);

   useEffect(() => {
      if (oneLoad) {
         if (loading) loadGrades(match.params.class_id);
         if (loadingClass) loadClass(match.params.class_id);
         clearGradeTypes();
         setOneLoad(false);
      } else {
         if (loadingGT && !loadingClass) {
            loadGradeTypesByCategory(classInfo.category._id);
         }
      }
   }, [
      loading,
      loadingGT,
      loadingClass,
      oneLoad,
      loadGradeTypesByCategory,
      classInfo,
      loadClass,
      loadGrades,
      clearGradeTypes,
      match.params.class_id,
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
         {!loading && !loadingClass ? (
            <>
               <h1 className="text-center light-font p-1 mt-2">Notas</h1>
               <div className="btn-right">
                  <button
                     type="button"
                     className="btn btn-secondary"
                     onClick={(e) => {
                        e.preventDefault();
                        gradesPDF(
                           { header, period: periods },
                           classInfo,
                           "all"
                        );
                     }}
                  >
                     <i className="fas fa-file-pdf"></i>&nbsp; Todas
                     <span className="hide-md"> las notas</span>
                  </button>
               </div>
               <ClassInfo classInfo={classInfo} />

               <div className="few-tabs">{tabs(classInfo.category.name)}</div>
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
   loadGrades: PropTypes.func.isRequired,
   loadGradeTypesByCategory: PropTypes.func.isRequired,
   loadClass: PropTypes.func.isRequired,
   gradesPDF: PropTypes.func.isRequired,
   clearGradeTypes: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   grades: state.grades,
   classes: state.classes,
});

export default connect(mapStateToProps, {
   loadGrades,
   loadClass,
   loadGradeTypesByCategory,
   gradesPDF,
   clearGradeTypes,
})(withRouter(Grades));
