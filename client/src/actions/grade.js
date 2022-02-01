import format from "date-fns/format";
import api from "../utils/api";
import { saveAs } from "file-saver";
import history from "../utils/history";

import { setAlert } from "./alert";
import { updateLoadingSpinner } from "./mixvalues";

import {
   GRADES_LOADED,
   GRADETYPES_LOADED,
   GRADES_UPDATED,
   NEWGRADE_REGISTERED,
   GRADES_DELETED,
   GRADETYPES_UPDATED,
   GRADETYPE_DELETED,
   GRADES_CLEARED,
   GRADETYPES_CLEARED,
   GRADES_ERROR,
   GRADETYPE_ERROR,
} from "./types";

export const loadGrades = (class_id, user_id) => async (dispatch) => {
   if (!user_id) dispatch(updateLoadingSpinner(true));
   try {
      const res = await api.get(
         `/grade/${user_id ? "student/" : ""}${class_id}${
            user_id ? `/${user_id}` : ""
         }`
      );
      dispatch({
         type: GRADES_LOADED,
         payload: res.data,
      });
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
         dispatch(setGradesError(GRADES_ERROR, err.response));
      }
   }
   if (!user_id) dispatch(updateLoadingSpinner(false));
};

export const loadGradeTypes = (category_id, spinner) => async (dispatch) => {
   if (spinner) dispatch(updateLoadingSpinner(true));
   try {
      const res = await api.get(
         `/grade-type${category_id ? `/category/${category_id}` : ""}`
      );
      dispatch({
         type: GRADETYPES_LOADED,
         payload: res.data,
      });
   } catch (err) {
      if (err.response.status !== 401)
         dispatch(setGradesError(GRADETYPE_ERROR, err.response));
   }
   if (spinner) dispatch(updateLoadingSpinner(false));
};

export const registerNewGrade = (formData) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

   try {
      let newGrade = {};
      for (const prop in formData) {
         if (formData[prop] !== "") {
            newGrade[prop] = formData[prop];
         }
      }
      const res = await api.post("/grade", newGrade);

      dispatch({
         type: NEWGRADE_REGISTERED,
         payload: res.data,
      });
      dispatch(setAlert("Nuevo Tipo de Nota Agregado", "success", "3"));
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setGradesError(GRADES_ERROR, err.response));
         dispatch(setAlert(err.response.data.msg, "danger", "3"));
      } else error = true;
   }

   if (!error) dispatch(updateLoadingSpinner(false));
};

export const updateGrades = (formData, class_id) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

   try {
      const res = await api.post("/grade/period", formData);
      dispatch({
         type: GRADES_UPDATED,
         payload: res.data,
      });

      dispatch(setAlert("Calificaciones Modificadas", "success", "2"));
      dispatch({
         type: GRADES_CLEARED,
      });

      history.push(`/class/single/${class_id}`);
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setGradesError(GRADES_ERROR, err.response));
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
      } else error = true;
   }

   if (!error) {
      dispatch(updateLoadingSpinner(false));
      window.scrollTo(0, 0);
   }
};

export const deleteGrades = (grade) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

   try {
      const res = await api.delete(
         `/grade/${grade.gradetype._id}/${grade.classroom}/${grade.period}`
      );

      dispatch({
         type: GRADES_DELETED,
         payload: res.data,
      });

      dispatch(setAlert("Tipo de Nota Eliminado", "success", "4"));
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setGradesError(GRADES_ERROR, err.response));
         dispatch(setAlert(err.response.data.msg, "danger", "4"));
      } else error = true;
   }

   if (!error) dispatch(updateLoadingSpinner(false));
};

export const updateGradeTypes = (formData) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

   try {
      const res = await api.post("/grade-type", formData);

      dispatch({
         type: GRADETYPES_UPDATED,
         payload: res.data,
      });

      dispatch(setAlert("Tipos de Notas Modificados", "success", "2"));
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setGradesError(GRADES_ERROR, err.response));
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
      } else error = true;
   }

   if (!error) {
      window.scrollTo(0, 0);
      dispatch(updateLoadingSpinner(false));
   }
};

export const deleteGradeType = (toDelete) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

   try {
      await api.delete(`/grade-type/${toDelete}`);

      dispatch({
         type: GRADETYPE_DELETED,
         payload: toDelete,
      });

      dispatch(setAlert("Tipo de Nota Eliminado", "success", "2"));
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setGradesError(GRADES_ERROR, err.response));
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
      } else error = true;
   }

   if (!error) {
      window.scrollTo(0, 0);
      dispatch(updateLoadingSpinner(false));
   }
};

export const gradesPDF = (info, classInfo, type) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

   let tableInfo = {
      students: classInfo.students,
      header: info.header,
      period: info.period,
      classInfo,
      ...(type === "bimester" && { periodNumber: info.periodNumber }),
   };

   try {
      let pdf;
      let name = "";
      const date = format(new Date(), "dd-MM-yy");

      switch (type) {
         case "bimester":
            await api.post("/pdf/grade/period-list", tableInfo);
            break;
         case "all":
            await api.post("/pdf/grade/list", tableInfo);
            break;
         case "report-cards":
            for (let x = 0; x < classInfo.students.length; x++) {
               const reportInfo = {
                  student: {
                     _id: classInfo.students[x]._id,
                     name:
                        classInfo.students[x].lastname +
                        ", " +
                        classInfo.students[x].name,
                  },
                  observation: info[x],
                  classInfo: {
                     _id: classInfo._id,
                     teacher:
                        classInfo.teacher.lastname +
                        ", " +
                        classInfo.teacher.name,
                     category: classInfo.category.name,
                  },
               };

               const res = await api.post("/pdf/grade/report-card", reportInfo);

               if (res.data.msg !== "Alumno sin notas") {
                  pdf = await api.get("/pdf/grade/fetch", {
                     responseType: "blob",
                  });

                  name = `Libreta de ${reportInfo.student.name} de ${reportInfo.classInfo.category}`;

                  const pdfBlob = new Blob([pdf.data], {
                     type: "application/pdf",
                  });

                  saveAs(pdfBlob, `${name} ${date}.pdf`);
               }
            }
            break;
         default:
            break;
      }

      if (type !== "report-cards") {
         name = `Notas de ${classInfo.category.name} de ${
            classInfo.teacher.lastname + ", " + classInfo.teacher.name
         }  ${date}.pdf`;

         pdf = await api.get("/pdf/grade/fetch", {
            responseType: "blob",
         });

         const pdfBlob = new Blob([pdf.data], { type: "application/pdf" });

         saveAs(pdfBlob, name);
      }

      dispatch(setAlert("PDF Generado", "success", "2"));
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setGradesError(GRADES_ERROR, err.response));
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
      } else error = true;
   }

   if (!error) {
      window.scrollTo(0, 0);
      dispatch(updateLoadingSpinner(false));
   }
};

export const certificatePDF =
   (students, header, periods, classInfo, certificateDate, periodNumber) =>
   async (dispatch) => {
      dispatch(updateLoadingSpinner(true));
      let error = false;

      try {
         for (let x = 0; x < students.length; x++) {
            const period = periods[x];
            const student = students[x];

            const info = {
               student,
               header,
               period,
               classInfo,
               certificateDate,
            };

            if (periodNumber === 6) {
               await api.post(
                  "/pdf/grade/certificate-cambridge/create-list",
                  info
               );
            } else {
               await api.post("/pdf/grade/certificate", info);
            }

            const pdf = await api.get("/pdf/grade/fetch", {
               responseType: "blob",
            });

            const pdfBlob = new Blob([pdf.data], { type: "application/pdf" });

            saveAs(
               pdfBlob,
               `Certificado ${classInfo.category.name} ${
                  periodNumber === 6 ? "Cambridge" : ""
               }  ${student.name}.pdf`
            );
         }

         dispatch(setAlert("Certificados Generados", "success", "2"));
         window.scrollTo(0, 0);
      } catch (err) {
         if (err.response.status !== 401) {
            dispatch(setGradesError(GRADES_ERROR, err.response));
            dispatch(setAlert(err.response.data.msg, "danger", "4"));
         } else error = true;
      }

      if (!error) dispatch(updateLoadingSpinner(false));
   };

export const clearGrades = () => (dispatch) => {
   dispatch({
      type: GRADES_CLEARED,
   });
};

export const clearGradeTypes = () => (dispatch) => {
   dispatch({
      type: GRADETYPES_CLEARED,
   });
};

const setGradesError = (type, response) => (dispatch) => {
   dispatch({
      type: type,
      payload: {
         type: response.statusText,
         status: response.status,
         msg: response.data.msg,
      },
   });
};
