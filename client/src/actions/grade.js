import {
   USER_GRADES_LOADED,
   GRADES_ERROR,
   GRADES_LOADED,
   GRADES_CLEARED,
   GRADETYPES_LOADED,
   GRADES_DELETED,
   NEW_GRADE_REGISTERED,
   GRADES_UPDATED,
   GRADETYPE_ERROR,
   GRADETYPES_UPDATED,
} from "./types";
import { setAlert } from "./alert";
import moment from "moment";
import { saveAs } from "file-saver";
import { updateLoadingSpinner } from "./mixvalues";
import axios from "axios";

export const loadUsersGrades = (user_id) => async (dispatch) => {
   try {
      const res = await axios.get(`/api/grade/user/${user_id}`);
      dispatch({
         type: USER_GRADES_LOADED,
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
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
      window.scrollTo(500, 0);
   }
};

export const loadGradesByClass = (class_id) => async (dispatch) => {
   try {
      dispatch(updateLoadingSpinner(true));
      const res = await axios.get(`/api/grade/${class_id}`);
      dispatch({
         type: GRADES_LOADED,
         payload: res.data,
      });
      dispatch(updateLoadingSpinner(false));
   } catch (err) {
      dispatch({
         type: GRADES_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
      window.scrollTo(500, 0);
      dispatch(updateLoadingSpinner(false));
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
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
      window.scrollTo(500, 0);
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
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
      window.scrollTo(500, 0);
   }
};

export const registerNewGrade = (newGrade) => async (dispatch) => {
   try {
      dispatch(updateLoadingSpinner(true));
      let grade = JSON.stringify(newGrade);

      const config = {
         headers: {
            "Content-Type": "application/json",
         },
      };
      const res = await axios.post("/api/grade", grade, config);
      dispatch({
         type: NEW_GRADE_REGISTERED,
         payload: res.data,
      });
      dispatch(updateLoadingSpinner(false));
      dispatch(setAlert("Nuevo Tipo de Nota Agregado", "success", "2"));
      window.scrollTo(500, 0);
   } catch (err) {
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
      dispatch({
         type: GRADES_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });

      window.scrollTo(500, 0);
      dispatch(updateLoadingSpinner(false));
   }
};

export const deleteGrades = (grade) => async (dispatch) => {
   try {
      dispatch(updateLoadingSpinner(true));
      const res = await axios.delete(
         `/api/grade/${grade.gradetype}/${grade.classroom}/${grade.period}`
      );

      dispatch({
         type: GRADES_DELETED,
         payload: res.data,
      });

      dispatch(setAlert("Tipo de Nota Eliminado", "success", "2"));
      dispatch(updateLoadingSpinner(false));
      window.scroll(500, 0);
   } catch (err) {
      dispatch({
         type: GRADES_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
      window.scrollTo(500, 0);
      dispatch(updateLoadingSpinner(false));
   }
};

export const updateGrades = (formData, history, class_id) => async (
   dispatch
) => {
   try {
      dispatch(updateLoadingSpinner(true));
      let grades = JSON.stringify(formData);

      const config = {
         headers: {
            "Content-Type": "application/json",
         },
      };
      const res = await axios.post("/api/grade/period", grades, config);
      dispatch({
         type: GRADES_UPDATED,
         payload: res.data,
      });

      dispatch(setAlert("Calificaciones Modificadas", "success", "2"));
      dispatch({
         type: GRADES_CLEARED,
      });

      dispatch(updateLoadingSpinner(false));
      history.push(`/class/${class_id}`);
      window.scrollTo(500, 0);
   } catch (err) {
      dispatch({
         type: GRADES_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
      window.scrollTo(500, 0);
      dispatch(updateLoadingSpinner(false));
   }
};

export const updateGradeTypes = (formData) => async (dispatch) => {
   try {
      dispatch(updateLoadingSpinner(true));
      window.scrollTo(500, 0);

      let gradetypes = JSON.stringify(formData);

      const config = {
         headers: {
            "Content-Type": "application/json",
         },
      };
      const res = await axios.post("/api/grade-type", gradetypes, config);
      dispatch({
         type: GRADETYPES_UPDATED,
         payload: res.data,
      });
      dispatch(setAlert("Tipos de Notas Modificados", "success", "2"));
      dispatch(updateLoadingSpinner(false));
   } catch (err) {
      dispatch({
         type: GRADETYPE_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
      window.scrollTo(500, 0);
      dispatch(updateLoadingSpinner(false));
   }
};

export const gradesPDF = (
   header,
   students,
   periods,
   classInfo,
   period,
   all
) => async (dispatch) => {
   let tableInfo = JSON.stringify({
      students,
      header,
      periods,
      classInfo,
      period,
   });

   dispatch(updateLoadingSpinner(true));
   try {
      const config = {
         headers: {
            "Content-Type": "application/json",
         },
      };

      if (all)
         await axios.post("/api/grade/all/create-list", tableInfo, config);
      else await axios.post("/api/grade/create-list", tableInfo, config);

      const pdf = await axios.get("/api/grade/list/fetch-list", {
         responseType: "blob",
      });

      const pdfBlob = new Blob([pdf.data], { type: "application/pdf" });

      const date = moment().format("DD-MM-YY");

      saveAs(
         pdfBlob,
         `Notas de ${classInfo.category.name} de ${
            classInfo.teacher.lastname + ", " + classInfo.teacher.name
         }  ${date}.pdf`
      );
      dispatch(updateLoadingSpinner(false));
      dispatch(setAlert("PDF Generado", "success", "2"));
      window.scroll(500, 0);
   } catch (err) {
      dispatch({
         type: GRADES_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
      window.scrollTo(500, 0);
      dispatch(updateLoadingSpinner(false));
   }
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
      const config = {
         headers: {
            "Content-Type": "application/json",
         },
      };

      for (let x = 0; x < students.length; x++) {
         let period = [];
         if (classInfo.category.name === "Kinder") {
            period = periods.map((period) =>
               period.filter((item) => item[0].student)
            );
            period.push(x);
         } else period = periods[x];
         const student = students[x];

         const info = JSON.stringify({
            student,
            header,
            period,
            classInfo,
            certificateDate,
         });

         if (periodNumber === 6) {
            await axios.post(
               "/api/grade/certificate-cambridge/create-list",
               info,
               config
            );
         } else {
            await axios.post(
               "/api/grade/certificate/create-list",
               info,
               config
            );
         }

         const pdf = await axios.get("/api/grade/certificate/fetch-list", {
            responseType: "blob",
         });

         const pdfBlob = new Blob([pdf.data], { type: "application/pdf" });

         saveAs(
            pdfBlob,
            `Certificado ${classInfo.category.name} ${
               periodNumber === 6 && "Cambridge"
            }  ${student.name}.pdf`
         );
      }

      dispatch(setAlert("Certificados Generados", "success", "2"));

      dispatch(updateLoadingSpinner(false));
      window.scroll(500, 0);
   } catch (err) {
      dispatch({
         type: GRADES_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
      window.scrollTo(500, 0);
      dispatch(updateLoadingSpinner(false));
   }
};

export const clearGrades = () => (dispatch) => {
   dispatch({
      type: GRADES_CLEARED,
   });
};
