import moment from "moment";
import axios from "axios";
import { saveAs } from "file-saver";

import { setAlert } from "./alert";
import { updateLoadingSpinner } from "./mixvalues";

import {
   GRADES_LOADED,
   STUDENTGRADES_LOADED,
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

export const loadUsersGrades = (user_id, class_id) => async (dispatch) => {
   try {
      const res = await axios.get(`/api/grade/student/${class_id}/${user_id}`);
      dispatch({
         type: STUDENTGRADES_LOADED,
         payload: res.data,
      });
   } catch (err) {
      dispatch({
         type: GRADES_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
   }
};

export const loadGrades = (class_id) => async (dispatch) => {
   try {
      const res = await axios.get(`/api/grade/${class_id}`);
      dispatch({
         type: GRADES_LOADED,
         payload: res.data,
      });
   } catch (err) {
      dispatch({
         type: GRADES_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
   }
};

export const loadGradeTypes = () => async (dispatch) => {
   try {
      const res = await axios.get("/api/grade-type");
      dispatch({
         type: GRADETYPES_LOADED,
         payload: res.data,
      });
   } catch (err) {
      dispatch({
         type: GRADETYPE_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
   }
};

export const loadGradeTypesByCategory = (category_id) => async (dispatch) => {
   try {
      const res = await axios.get(`/api/grade-type/category/${category_id}`);
      dispatch({
         type: GRADETYPES_LOADED,
         payload: res.data,
      });
   } catch (err) {
      dispatch({
         type: GRADETYPE_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
   }
};

export const registerNewGrade = (formData) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   try {
      let newGrade = {};
      for (const prop in formData) {
         if (formData[prop] !== "") {
            newGrade[prop] = formData[prop];
         }
      }
      const res = await axios.post("/api/grade", newGrade);

      dispatch({
         type: NEWGRADE_REGISTERED,
         payload: res.data,
      });
      dispatch(setAlert("Nuevo Tipo de Nota Agregado", "success", "3"));
   } catch (err) {
      const msg = err.response.data.msg;
      const type = err.response.statusText;
      dispatch({
         type: GRADES_ERROR,
         payload: {
            type,
            status: err.response.status,
            msg,
         },
      });
      dispatch(setAlert(msg ? msg : type, "danger", "3"));
   }

   dispatch(updateLoadingSpinner(false));
};

export const updateGrades = (formData, history, class_id) => async (
   dispatch
) => {
   dispatch(updateLoadingSpinner(true));
   try {
      const res = await axios.post("/api/grade/period", formData);
      dispatch({
         type: GRADES_UPDATED,
         payload: res.data,
      });

      dispatch(setAlert("Calificaciones Modificadas", "success", "2"));
      dispatch({
         type: GRADES_CLEARED,
      });

      history.push(`/class/${class_id}`);
   } catch (err) {
      const msg = err.response.data.msg;
      const type = err.response.statusText;
      dispatch({
         type: GRADES_ERROR,
         payload: {
            type,
            status: err.response.status,
            msg,
         },
      });
      dispatch(setAlert(msg ? msg : type, "danger", "2"));
   }

   dispatch(updateLoadingSpinner(false));
   window.scrollTo(0, 0);
};

export const deleteGrades = (grade) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   try {
      const res = await axios.delete(
         `/api/grade/${grade.gradetype}/${grade.classroom}/${grade.period}`
      );

      dispatch({
         type: GRADES_DELETED,
         payload: res.data,
      });

      dispatch(setAlert("Tipo de Nota Eliminado", "success", "4"));
   } catch (err) {
      const msg = err.response.data.msg;
      const type = err.response.statusText;
      dispatch({
         type: GRADES_ERROR,
         payload: {
            type,
            status: err.response.status,
            msg,
         },
      });
      dispatch(setAlert(msg ? msg : type, "danger", "4"));
   }

   dispatch(updateLoadingSpinner(false));
};

export const updateGradeTypes = (formData) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   try {
      const res = await axios.post("/api/grade-type", formData);

      dispatch({
         type: GRADETYPES_UPDATED,
         payload: res.data,
      });

      dispatch(setAlert("Tipos de Notas Modificados", "success", "2"));
   } catch (err) {
      const msg = err.response.data.msg;
      const type = err.response.statusText;
      dispatch({
         type: GRADES_ERROR,
         payload: {
            type,
            status: err.response.status,
            msg,
         },
      });
      dispatch(setAlert(msg ? msg : type, "danger", "2"));
   }

   window.scrollTo(0, 0);
   dispatch(updateLoadingSpinner(false));
};

export const deleteGradeType = (toDelete) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   try {
      await axios.delete(`/api/grade-type/${toDelete}`);

      dispatch({
         type: GRADETYPE_DELETED,
         payload: toDelete,
      });

      dispatch(setAlert("Tipo de Nota Eliminado", "success", "2"));
   } catch (err) {
      const msg = err.response.data.msg;
      const type = err.response.statusText;
      dispatch({
         type: GRADES_ERROR,
         payload: {
            type,
            status: err.response.status,
            msg,
         },
      });
      dispatch(setAlert(msg ? msg : type, "danger", "2"));
   }

   window.scrollTo(0, 0);
   dispatch(updateLoadingSpinner(false));
};

export const gradesPDF = (info, classInfo, type) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

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
      const date = moment().format("DD-MM-YY");

      switch (type) {
         case "bimester":
            await axios.post("/api/grade/create-list", tableInfo);
            break;
         case "all":
            await axios.post("/api/grade/all/create-list", tableInfo);
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

               await axios.post("/api/grade/report-card", reportInfo);

               pdf = await axios.get("/api/grade/pdf/report-card", {
                  responseType: "blob",
               });

               name = `Libreta de ${reportInfo.student.name} de ${reportInfo.classInfo.category}`;

               const pdfBlob = new Blob([pdf.data], {
                  type: "application/pdf",
               });

               saveAs(pdfBlob, `${name} ${date}.pdf`);
            }
            break;
         default:
            break;
      }

      if (type !== "report-cards") {
         name = `Notas de ${classInfo.category.name} de ${
            classInfo.teacher.lastname + ", " + classInfo.teacher.name
         }  ${date}.pdf`;

         pdf = await axios.get("/api/grade/list/fetch-list", {
            responseType: "blob",
         });

         const pdfBlob = new Blob([pdf.data], { type: "application/pdf" });

         saveAs(pdfBlob, name);
      }

      dispatch(setAlert("PDF Generado", "success", "2"));
   } catch (err) {
      const msg = err.response.data.msg;
      const type = err.response.statusText;
      dispatch({
         type: GRADES_ERROR,
         payload: {
            type,
            status: err.response.status,
            msg,
         },
      });
      dispatch(setAlert(msg ? msg : type, "danger", "2"));
   }

   window.scrollTo(0, 0);
   dispatch(updateLoadingSpinner(false));
};

export const certificatePDF = (
   students,
   header,
   periods,
   classInfo,
   certificateDate,
   periodNumber
) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

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
            await axios.post(
               "/api/grade/certificate-cambridge/create-list",
               info
            );
         } else {
            await axios.post("/api/grade/certificate/create-list", info);
         }

         const pdf = await axios.get("/api/grade/certificate/fetch-list", {
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
      const msg = err.response.data.msg;
      const type = err.response.statusText;
      dispatch({
         type: GRADES_ERROR,
         payload: {
            type,
            status: err.response.status,
            msg,
         },
      });
      dispatch(setAlert(msg ? msg : type, "danger", "4"));
   }

   dispatch(updateLoadingSpinner(false));
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
