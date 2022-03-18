import api from "../utils/api";
import format from "date-fns/format";
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
         dispatch(setError(ATTENDANCES_ERROR, err.response));
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
         dispatch(setError(ATTENDANCES_ERROR, err.response));
      }
   }
   dispatch(updateLoadingSpinner(false));
};

export const registerNewDate =
   (formData, class_id, period, periods) => async (dispatch) => {
      dispatch(updateLoadingSpinner(true));
      let error = false;
      const bimester = !periods[period - 1];

      try {
         if (period !== 1 && !periods[period - 2]) {
            const errorMessage = {
               response: {
                  status: 402,
                  data: {
                     msg: "Debe agregar por lo menos un día en los bimestres anteriores",
                  },
               },
            };
            throw errorMessage;
         }

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
         dispatch(togglePopup("default"));
      } catch (err) {
         if (err.response.status !== 401) {
            dispatch(setError(DATE_ERROR, err.response));

            if (err.response.data.errors)
               err.response.data.errors.forEach((error) => {
                  dispatch(setAlert(error.msg, "danger", "4"));
               });
            else dispatch(setAlert(err.response.data.msg, "danger", "4"));
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
            dispatch(setError(ATTENDANCES_ERROR, err.response));
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
      dispatch(updateLoadingSpinner(true));
      let error = false;

      try {
         if (last) {
            const errorMessage = {
               response: {
                  status: 402,
                  data: {
                     msg: "No puede eliminar la última fecha del bimestre",
                  },
               },
            };
            throw errorMessage;
         }
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
            dispatch(setError(DATE_ERROR, err.response));
            dispatch(setAlert(err.response.data.msg, "danger", "3"));
         } else error = true;
      }

      if (!error) dispatch(updateLoadingSpinner(false));
   };

export const attendancesPDF =
   (header, attendances, info) => async (dispatch) => {
      dispatch(updateLoadingSpinner(true));
      let error = false;

      try {
         await api.post(`/pdf/attendance/${header ? "list" : "best"}`, {
            header,
            attendances,
            info,
         });

         const pdf = await api.get("/pdf/attendance/fetch", {
            responseType: "blob",
         });

         const pdfBlob = new Blob([pdf.data], { type: "application/pdf" });

         saveAs(
            pdfBlob,
            header
               ? `Asistencia ${info.category} de ${info.teacher}  ${format(
                    new Date(),
                    "dd-MM-yy"
                 )}.pdf`
               : `Mejores Asistencias ${info.year}`
         );

         dispatch(setAlert("PDF Generado", "success", "2"));
      } catch (err) {
         if (err.response.status !== 401) {
            dispatch(setError(ATTENDANCES_ERROR, err.response));
            dispatch(setAlert(err.response.data.msg, "danger", "2"));
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
