import format from "date-fns/format";
import api from "../utils/api";
import { saveAs } from "file-saver";
import history from "../utils/history";

import { setAlert } from "./alert";
import {
   newObject,
   updateLoadingSpinner,
   filterData,
   setError,
   togglePopup,
} from "./global";

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
         if (!user_id) dispatch(setAlert(err.response.data.msg, "danger", "2"));
         dispatch(setError(GRADES_ERROR, err.response));
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
         dispatch(setError(GRADETYPE_ERROR, err.response));
   }
   if (spinner) dispatch(updateLoadingSpinner(false));
};

export const loadGradesAv = (formData) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   try {
      const res = await api.get(`/grade/best?${filterData(formData)}`);

      dispatch({
         type: GRADES_LOADED,
         payload: res.data,
      });
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
         dispatch(setError(GRADES_ERROR, err.response));
      }
   }
   dispatch(updateLoadingSpinner(false));
};

export const registerNewGrade =
   (formData, class_id, period, last) => async (dispatch) => {
      dispatch(updateLoadingSpinner(true));
      let error = false;

      try {
         if (last) {
            const errorMessage = {
               response: {
                  status: 402,
                  data: {
                     msg: "Debe agregar por lo menos una nota en los bimestres anteriores",
                  },
               },
            };
            throw errorMessage;
         }

         let newGrade = newObject(formData);

         const res = await api.post(`/grade/${class_id}/${period}`, newGrade);

         dispatch({
            type: NEWGRADE_REGISTERED,
            payload: res.data,
         });
         dispatch(setAlert("Nuevo Tipo de Nota Agregado", "success", "3"));
         dispatch(togglePopup("default"));
      } catch (err) {
         if (err.response.status !== 401) {
            dispatch(setError(GRADES_ERROR, err.response));
            if (err.response.data.errors)
               err.response.data.errors.forEach((error) => {
                  dispatch(setAlert(error.msg, "danger", "4"));
               });
            else dispatch(setAlert(err.response.data.msg, "danger", "4"));
         } else error = true;
      }

      if (!error) dispatch(updateLoadingSpinner(false));
   };

export const updateGrades =
   (formData, class_id, period) => async (dispatch) => {
      dispatch(updateLoadingSpinner(true));
      let error = false;

      try {
         const res = await api.put(`/grade/${class_id}/${period}`, formData);
         dispatch({
            type: GRADES_UPDATED,
            payload: res.data,
         });

         dispatch(setAlert("Calificaciones Modificadas", "success", "2"));
         dispatch({
            type: GRADES_CLEARED,
         });

         history.push(`/class/single/${class_id}`);
         window.scrollTo(0, 0);
      } catch (err) {
         if (err.response.status !== 401) {
            dispatch(setError(GRADES_ERROR, err.response));
            dispatch(setAlert(err.response.data.msg, "danger", "3"));
         } else error = true;
      }

      if (!error) dispatch(updateLoadingSpinner(false));
   };

export const deleteGrades =
   (gradetype, class_id, period, last) => async (dispatch) => {
      dispatch(updateLoadingSpinner(true));
      let error = false;

      try {
         if (last) {
            const errorMessage = {
               response: {
                  status: 402,
                  data: {
                     msg: "No puede eliminar la última nota del bimestre",
                  },
               },
            };
            throw errorMessage;
         }

         const res = await api.delete(
            `/grade/${class_id}/${period}/${gradetype}`
         );

         dispatch({
            type: GRADES_DELETED,
            payload: res.data,
         });

         dispatch(setAlert("Tipo de Nota Eliminado", "success", "3"));
      } catch (err) {
         if (err.response.status !== 401) {
            dispatch(setError(GRADES_ERROR, err.response));
            dispatch(setAlert(err.response.data.msg, "danger", "3"));
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
         dispatch(setError(GRADES_ERROR, err.response));
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
         dispatch(setError(GRADES_ERROR, err.response));
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
      } else error = true;
   }

   if (!error) {
      window.scrollTo(0, 0);
      dispatch(updateLoadingSpinner(false));
   }
};

export const gradesPDF = (header, grades, info) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

   const data = { header, grades, info };
   try {
      const pdf = await api.post(
         `/pdf/grade/${
            !header
               ? "best"
               : info.period !== undefined
               ? "period-list"
               : "list"
         }`,
         !header ? { grades } : data,
         {
            responseType: "blob",
         }
      );

      const name = !header
         ? `Mejores Promedios ${info.year}`
         : `Notas de ${info.category} de ${info.teacher} ${format(
              new Date(),
              "dd-MM-yy"
           )}`;

      const pdfBlob = new Blob([pdf.data], { type: "application/pdf" });

      saveAs(pdfBlob, name);

      dispatch(setAlert("PDF Generado", "success", "2"));
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setError(GRADES_ERROR, err.response));
         dispatch(
            setAlert(
               err.response.data.msg,
               "danger",
               info.period !== undefined && header ? "3" : "2"
            )
         );
      } else error = true;
   }

   if (!error) {
      window.scrollTo(0, 0);
      dispatch(updateLoadingSpinner(false));
   }
};

export const certificatePDF =
   (grades, date, info, last) => async (dispatch) => {
      dispatch(updateLoadingSpinner(true));
      let error = false;

      try {
         info.students = info.students.filter((item) => item.checked);

         if (last || !date || info.students.length === 0) {
            const errorMessage = {
               response: {
                  status: 402,
                  data: {
                     msg: !date
                        ? "Debe ingresar la fecha"
                        : last
                        ? "Las notas del final deben estar cargadas"
                        : "Debe seleccionar al menos un alumno",
                  },
               },
            };
            throw errorMessage;
         }

         for (let x = 0; x < info.students.length; x++) {
            const newInfo = {
               info,
               date,
               student: info.students[x],
               grades: grades.find(
                  (item) => item[0].student._id === info.students[x]._id
               ),
            };

            const pdf = await api.post(
               info.period === 5
                  ? "/pdf/grade/cambridge"
                  : "/pdf/grade/certificate",
               newInfo,
               {
                  responseType: "blob",
               }
            );

            const pdfBlob = new Blob([pdf.data], {
               type: "application/pdf",
            });

            saveAs(
               pdfBlob,
               `Certificado ${info.category} ${
                  info.period === 6 ? "Cambridge" : ""
               } ${info.students[x].name}.pdf`
            );
         }

         dispatch(togglePopup("default"));
         dispatch(setAlert("Certificados Generados", "success", "2"));
      } catch (err) {
         if (err.response.status !== 401) {
            dispatch(setError(GRADES_ERROR, err.response));
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
