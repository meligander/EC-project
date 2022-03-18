import React, { useEffect } from "react";
import { connect } from "react-redux";
import { ImFilePdf } from "react-icons/im";

import {
   loadGrades,
   loadGradeTypes,
   gradesPDF,
} from "../../../../actions/grade";
import { loadClass } from "../../../../actions/class";

import GradesTab from "./tabs/GradesTab";
import ClassInfo from "../sharedComp/ClassInfo";
import Tabs from "../sharedComp/Tabs";

const Grades = ({
   match,
   classes: { loadingClass, classInfo },
   grades: {
      loadingGT,
      loading,
      grades: { header, periods, students },
   },
   loadGrades,
   loadGradeTypes,
   loadClass,
   gradesPDF,
}) => {
   const _id = match.params.class_id;
   const year = new Date().getFullYear();

   useEffect(() => {
      if (loading) loadGrades(_id, false);
   }, [loading, loadGrades, _id]);

   useEffect(() => {
      if (loadingClass) loadClass(_id, false, false);
   }, [loadingClass, loadClass, _id]);

   useEffect(() => {
      if (!loadingClass && loadingGT)
         loadGradeTypes(classInfo.category._id, false);
   }, [loadingClass, loadingGT, classInfo, loadGradeTypes]);

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
         case "Infantil B":
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
         <h1 className="light-font p-1 mt-2">Notas</h1>
         {!loadingClass && !loading && !loadingGT && (
            <>
               <div className="btn-right">
                  <div className="tooltip">
                     <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={(e) => {
                           e.preventDefault();
                           gradesPDF(
                              header,
                              periods.lenght > 5
                                 ? periods.slice(0, -1)
                                 : periods,
                              {
                                 students:
                                    year === classInfo.year
                                       ? students.slice(0, -1)
                                       : students,
                                 teacher:
                                    classInfo.teacher.lastname +
                                    ", " +
                                    classInfo.teacher.name,
                                 category: classInfo.category.name,
                              }
                           );
                        }}
                     >
                        <ImFilePdf />
                        &nbsp;Todas
                     </button>
                     <span className="tooltiptext">
                        PDF notas de todo el año
                     </span>
                  </div>
               </div>
               <ClassInfo classInfo={classInfo} />

               <div className="few-tabs">{tabs(classInfo.category.name)}</div>
            </>
         )}
      </>
   );
};

const mapStateToProps = (state) => ({
   grades: state.grades,
   classes: state.classes,
});

export default connect(mapStateToProps, {
   loadGrades,
   loadClass,
   loadGradeTypes,
   gradesPDF,
})(Grades);
