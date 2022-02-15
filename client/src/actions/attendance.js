import api from "../utils/api";
import format from "date-fns/format";
import { saveAs } from "file-saver";
import history from "../utils/history";

import { setAlert } from "./alert";
import { newObject, updateLoadingSpinner, filterData } from "./mixvalues";

import {
   ATTENDANCES_LOADED,
   NEWDATE_REGISTERED,
   ATTENDANCES_UPDATED,
   DATE_DELETED,
   ATTENDANCES_CLEARED,
   ATTENDANCES_ERROR,
   DATE_ERROR,
} from "./types";

export const loadAttendances = (class_id, user_id) => async (dispatch) => {
   if (!user_id) dispatch(updateLoadingSpinner(true));
   try {
      const res = await api.get(
         `/attendance/${class_id}${user_id ? `/${user_id}` : ""}`
      );

      dispatch({
         type: ATTENDANCES_LOADED,
         payload: res.data,
      });
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
         dispatch(setAttendanceError(ATTENDANCES_ERROR, err.response));
      }
   }
   if (!user_id) dispatch(updateLoadingSpinner(false));
};

export const loadAttendancesAv = (formData) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   try {
      const res = await api.get(`/attendance/best?${filterData(formData)}`);

      dispatch({
         type: ATTENDANCES_LOADED,
         payload: res.data,
      });
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
         dispatch(setAttendanceError(ATTENDANCES_ERROR, err.response));
      }
   }
   dispatch(updateLoadingSpinner(false));
};

export const registerNewDate =
   (formData, class_id, period, bimester) => async (dispatch) => {
      dispatch(updateLoadingSpinner(true));
      let error = false;

      try {
         let newDate = newObject(formData);

         const res = await api.post(
            `/attendance/${class_id}/${period}${bimester ? "/bimester" : ""}`,
            newDate
         );

         dispatch({
            type: NEWDATE_REGISTERED,
            payload: res.data,
         });

         dispatch(
            setAlert(
               bimester ? "Días del Bimestre Agregados" : "Día Agregado",
               "success",
               "3"
            )
         );
      } catch (err) {
         if (err.response.status !== 401) {
            dispatch(setAttendanceError(DATE_ERROR, err.response));

            if (err.response.data.errors)
               err.response.data.errors.forEach((error) => {
                  dispatch(setAlert(error.msg, "danger", "3"));
               });
            else dispatch(setAlert(err.response.data.msg, "danger", "3"));
         } else error = true;
      }

      if (!error) dispatch(updateLoadingSpinner(false));
   };

export const updateAttendances =
   (formData, class_id, period) => async (dispatch) => {
      dispatch(updateLoadingSpinner(true));
      let error = false;

      try {
         await api.put(`/attendance/${class_id}/${period}`, formData);
         dispatch({
            type: ATTENDANCES_UPDATED,
         });

         history.push(`/class/single/${class_id}`);
         dispatch(setAlert("Inasistencias Modificadas", "success", "2"));
      } catch (err) {
         if (err.response.status !== 401) {
            dispatch(setAttendanceError(ATTENDANCES_ERROR, err.response));
            dispatch(setAlert(err.response.data.msg, "danger", "2"));
         } else error = true;
      }

      if (!error) {
         window.scroll(0, 0);
         dispatch(updateLoadingSpinner(false));
      }
   };

export const deleteDate =
   (date, classroom, period, last) => async (dispatch) => {
      if (last) {
         dispatch(
            setAlert(
               "No puede eliminar la última fecha del bimestre",
               "danger",
               "3"
            )
         );
      } else {
         dispatch(updateLoadingSpinner(true));
         let error = false;
         try {
            const res = await api.delete(
               `/attendance/${classroom}/${period}/${date}`
            );

            dispatch({
               type: DATE_DELETED,
               payload: res.data,
            });

            dispatch(setAlert("Fecha eliminada", "success", "3"));
         } catch (err) {
            if (err.response.status !== 401) {
               dispatch(setAttendanceError(DATE_ERROR, err.response));
               dispatch(setAlert(err.response.data.msg, "danger", "3"));
            } else error = true;
         }

         if (!error) dispatch(updateLoadingSpinner(false));
      }
   };

export const attendancesPDF =
   (header, students, attendances, period, classInfo) => async (dispatch) => {
      dispatch(updateLoadingSpinner(true));
      let error = false;

      let tableInfo = {
         header,
         students,
         attendances,
         period,
         classInfo,
      };

      try {
         await api.post("/pdf/attendance/list", tableInfo);

         const pdf = await api.get("/pdf/attendance/fetch", {
            responseType: "blob",
         });

         const pdfBlob = new Blob([pdf.data], { type: "application/pdf" });

         saveAs(
            pdfBlob,
            `Asistencia de ${classInfo.category.name} de ${
               classInfo.teacher.lastname + " " + classInfo.teacher.name
            }  ${format(new Date(), "dd-MM-yy")}.pdf`
         );

         dispatch(setAlert("PDF Generado", "success", "2"));
      } catch (err) {
         if (err.response.status !== 401) {
            dispatch(setAttendanceError(ATTENDANCES_ERROR, err.response));
            dispatch(setAlert(err.response.data.msg, "danger", "3"));
         } else error = true;
      }

      if (!error) {
         window.scroll(0, 0);
         dispatch(updateLoadingSpinner(false));
      }
   };

export const clearAttendances = () => (dispatch) => {
   dispatch({
      type: ATTENDANCES_CLEARED,
   });
};

const setAttendanceError = (type, response) => (dispatch) => {
   dispatch({
      type: type,
      payload: {
         type: response.statusText,
         status: response.status,
         msg: response.data.msg,
      },
   });
};
