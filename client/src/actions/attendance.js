import moment from "moment";
import axios from "axios";
import { saveAs } from "file-saver";

import { setAlert } from "./alert";
import { updateLoadingSpinner } from "./mixvalues";

import {
   ATTENDANCES_LOADED,
   STUDENTATTENDANCES_LOADED,
   NEWDATE_REGISTERED,
   ATTENDANCES_UPDATED,
   DATES_DELETED,
   ATTENDANCES_CLEARED,
   ATTENDANCES_ERROR,
} from "./types";

export const loadStudentAttendance = (user_id, class_id) => async (
   dispatch
) => {
   try {
      const res = await axios.get(
         `/api/attendance/student/${class_id}/${user_id}`
      );
      dispatch({
         type: STUDENTATTENDANCES_LOADED,
         payload: res.data,
      });
   } catch (err) {
      dispatch({
         type: ATTENDANCES_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
   }
};

export const loadAttendances = (class_id) => async (dispatch) => {
   try {
      const res = await axios.get(`/api/attendance/${class_id}`);
      dispatch({
         type: ATTENDANCES_LOADED,
         payload: res.data,
      });
   } catch (err) {
      dispatch({
         type: ATTENDANCES_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
   }
};

export const registerNewDate = (newDate) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   try {
      const res = await axios.post("/api/attendance", newDate);

      dispatch({
         type: NEWDATE_REGISTERED,
         payload: res.data,
      });

      dispatch(setAlert("Día Agregado", "success", "2"));
   } catch (err) {
      const msg = err.response.data.msg;
      const type = err.response.statusText;
      dispatch({
         type: ATTENDANCES_ERROR,
         payload: {
            type,
            status: err.response.status,
            msg,
         },
      });
      dispatch(setAlert(msg ? msg : type, "danger", "2"));
   }

   window.scroll(0, 0);
   dispatch(updateLoadingSpinner(false));
};

export const updateAttendances = (formData, history, class_id) => async (
   dispatch
) => {
   dispatch(updateLoadingSpinner(true));
   try {
      await axios.post("/api/attendance/period", formData);
      dispatch({
         type: ATTENDANCES_UPDATED,
      });

      history.push(`/class/${class_id}`);
      dispatch(setAlert("Inasistencias Modificadas", "success", "2"));
   } catch (err) {
      const msg = err.response.data.msg;
      const type = err.response.statusText;
      dispatch({
         type: ATTENDANCES_ERROR,
         payload: {
            type,
            status: err.response.status,
            msg,
         },
      });
      dispatch(setAlert(msg ? msg : type, "danger", "2"));
   }

   window.scroll(0, 0);
   dispatch(updateLoadingSpinner(false));
};

export const deleteDate = (date, classroom) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   try {
      const res = await axios.delete(
         `/api/attendance/date/${date}/${classroom}`
      );

      dispatch({
         type: DATES_DELETED,
         payload: res.data,
      });

      dispatch(setAlert("Fecha eliminada", "success", "2"));
   } catch (err) {
      const msg = err.response.data.msg;
      const type = err.response.statusText;
      dispatch({
         type: ATTENDANCES_ERROR,
         payload: {
            type,
            status: err.response.status,
            msg,
         },
      });
      dispatch(setAlert(msg ? msg : type, "danger", "2"));
   }

   window.scroll(0, 0);
   dispatch(updateLoadingSpinner(false));
};

export const attendancesPDF = (
   header,
   students,
   attendances,
   period,
   classInfo
) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let tableInfo = {
      header,
      students,
      attendances,
      period,
      classInfo,
   };

   try {
      await axios.post("/api/attendance/create-list", tableInfo);

      const pdf = await axios.get("/api/attendance/list/fetch-list", {
         responseType: "blob",
      });

      const pdfBlob = new Blob([pdf.data], { type: "application/pdf" });

      const date = moment().format("DD-MM-YY");

      saveAs(
         pdfBlob,
         `Asistencia de ${classInfo.category.name} de ${
            classInfo.teacher.lastname + " " + classInfo.teacher.name
         }  ${date}.pdf`
      );

      dispatch(setAlert("PDF Generado", "success", "2"));
   } catch (err) {
      const msg = err.response.data.msg;
      const type = err.response.statusText;
      dispatch({
         type: ATTENDANCES_ERROR,
         payload: {
            type,
            status: err.response.status,
            msg,
         },
      });
      dispatch(setAlert(msg ? msg : type, "danger", "2"));
   }

   window.scroll(0, 0);
   dispatch(updateLoadingSpinner(false));
};

export const clearAttendances = () => (dispatch) => {
   dispatch({
      type: ATTENDANCES_CLEARED,
   });
};
