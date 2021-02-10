import moment from "moment";
import api from "../utils/api";
import { saveAs } from "file-saver";

import { setAlert } from "./alert";
import { updateLoadingSpinner } from "./mixvalues";
import { clearTotalDebt, updateExpiredIntallments } from "./installment";
import { clearProfile } from "./user";

import {
   ENROLLMENT_LOADED,
   ENROLLMENTS_LOADED,
   YEARENROLLMENTS_LOADED,
   ENROLLMENT_REGISTERED,
   ENROLLMENT_UPDATED,
   ENROLLMENT_DELETED,
   ENROLLMENT_CLEARED,
   YEARENROLLMENTS_CLEARED,
   ENROLLMENTS_CLEARED,
   ENROLLMENT_ERROR,
} from "./types";

export const loadEnrollment = (enrollment_id) => async (dispatch) => {
   try {
      const res = await api.get(`/enrollment/one/${enrollment_id}`);
      dispatch({
         type: ENROLLMENT_LOADED,
         payload: res.data,
      });
   } catch (err) {
      dispatch({
         type: ENROLLMENT_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
   }
};

export const getYearEnrollments = () => async (dispatch) => {
   try {
      let res = await api.get("/enrollment/year");

      dispatch({
         type: YEARENROLLMENTS_LOADED,
         payload: res.data,
      });
   } catch (err) {
      dispatch({
         type: ENROLLMENT_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
      window.scroll(0, 0);
   }
};

export const loadEnrollments = (filterData) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   try {
      let filter = "";
      const filternames = Object.keys(filterData);
      for (let x = 0; x < filternames.length; x++) {
         const name = filternames[x];
         if (filterData[name] !== "" && filterData[name] !== 0) {
            if (filter !== "") filter = filter + "&";
            filter = filter + filternames[x] + "=" + filterData[name];
         }
      }
      const res = await api.get(`/enrollment?${filter}`);
      dispatch({
         type: ENROLLMENTS_LOADED,
         payload: { enrollments: res.data, type: "enrollments" },
      });
   } catch (err) {
      const msg = err.response.data.msg;
      const type = err.response.statusText;
      dispatch({
         type: ENROLLMENT_ERROR,
         payload: {
            type,
            status: err.response.status,
            msg,
         },
      });
      dispatch(setAlert(msg ? msg : type, "danger", "2"));
      window.scroll(0, 0);
   }

   dispatch(updateLoadingSpinner(false));
};

export const loadStudentAttendance = (filterData) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   try {
      let filter = "";

      const filternames = Object.keys(filterData);
      for (let x = 0; x < filternames.length; x++) {
         const name = filternames[x];
         if (filterData[name] !== "") {
            if (filter !== "") filter = filter + "&";
            filter = filter + filternames[x] + "=" + filterData[name];
         }
      }

      const res = await api.get(`/enrollment/absences?${filter}`);

      dispatch({
         type: ENROLLMENTS_LOADED,
         payload: { enrollments: res.data, type: "attendance" },
      });
   } catch (err) {
      const msg = err.response.data.msg;
      const type = err.response.statusText;
      dispatch({
         type: ENROLLMENT_ERROR,
         payload: {
            type,
            status: err.response.status,
            msg,
         },
      });
      dispatch(setAlert(msg ? msg : type, "danger", "2"));
      window.scroll(0, 0);
   }

   dispatch(updateLoadingSpinner(false));
};

export const loadStudentAverage = (filterData) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   try {
      let filter = "";

      const filternames = Object.keys(filterData);
      for (let x = 0; x < filternames.length; x++) {
         const name = filternames[x];
         if (filterData[name] !== "") {
            if (filter !== "") filter = filter + "&";
            filter = filter + filternames[x] + "=" + filterData[name];
         }
      }

      const res = await api.get(`/enrollment/average?${filter}`);
      dispatch({
         type: ENROLLMENTS_LOADED,
         payload: { enrollments: res.data, type: "average" },
      });
   } catch (err) {
      const msg = err.response.data.msg;
      const type = err.response.statusText;
      dispatch({
         type: ENROLLMENT_ERROR,
         payload: {
            type,
            status: err.response.status,
            msg,
         },
      });
      dispatch(setAlert(msg ? msg : type, "danger", "2"));
      window.scroll(0, 0);
   }

   dispatch(updateLoadingSpinner(false));
};

export const registerEnrollment = (
   formData,
   history,
   user_id,
   enroll_id
) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   let enrollment = {};
   for (const prop in formData) {
      if (formData[prop] !== "") {
         enrollment[prop] = formData[prop];
      }
   }

   try {
      let res;
      if (!enroll_id) {
         res = await api.post("/enrollment", enrollment);
      } else {
         res = await api.put(`/enrollment/${enroll_id}`, enrollment);
      }

      dispatch({
         type: !enroll_id ? ENROLLMENT_REGISTERED : ENROLLMENT_UPDATED,
         ...(enroll_id && { payload: res.data }),
      });

      dispatch(
         setAlert(
            `Inscripción ${!enroll_id ? "Registrada" : "Modificada"}`,
            "success",
            !enroll_id ? "1" : "2",
            7000
         )
      );

      dispatch(updateExpiredIntallments());
      dispatch(clearYearEnrollments());
      dispatch(clearTotalDebt());

      if (!enroll_id) {
         dispatch(clearProfile());
         history.push(`/dashboard/${user_id}`);
      } else {
         history.push("/enrollment-list");
         dispatch(clearEnrollment());
      }
   } catch (err) {
      if (err.response.data.errors) {
         const errors = err.response.data.errors;
         errors.forEach((error) => {
            dispatch(setAlert(error.msg, "danger", "2"));
         });
         dispatch({
            type: ENROLLMENT_ERROR,
            payload: errors,
         });
      } else {
         const msg = err.response.data.msg;
         const type = err.response.statusText;
         dispatch({
            type: ENROLLMENT_ERROR,
            payload: {
               type,
               status: err.response.status,
               msg,
            },
         });
         dispatch(setAlert(msg ? msg : type, "danger", "2"));
      }
   }

   dispatch(updateLoadingSpinner(false));
   window.scrollTo(0, 0);
};

export const deleteEnrollment = (enroll_id) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   try {
      await api.delete(`/enrollment/${enroll_id}`);

      dispatch({
         type: ENROLLMENT_DELETED,
         payload: enroll_id,
      });
      dispatch(clearYearEnrollments());
      dispatch(setAlert("Inscripción Eliminada", "success", "2"));
   } catch (err) {
      const msg = err.response.data.msg;
      const type = err.response.statusText;
      dispatch({
         type: ENROLLMENT_ERROR,
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

export const enrollmentsPDF = (enrollments, average) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   try {
      let pdf;
      let name;

      switch (average) {
         case "enrollments":
            await api.post("/enrollment/create-list", enrollments);

            pdf = await api.get("/enrollment/fetch-list", {
               responseType: "blob",
            });
            name = "Inscripciones";
            break;
         case "averages":
            await api.post("/enrollment/averages/create-list", enrollments);

            pdf = await api.get("/enrollment/averages/fetch-list", {
               responseType: "blob",
            });
            name = "Mejores Promedios";
            break;
         case "attendances":
            await api.post("/enrollment/absences/create-list", enrollments);

            pdf = await api.get("/enrollment/absences/fetch-list", {
               responseType: "blob",
            });
            name = "Mejores Asistencias";
            break;
         default:
            break;
      }

      const pdfBlob = new Blob([pdf.data], { type: "application/pdf" });

      const date = moment().format("DD-MM-YY");

      saveAs(pdfBlob, `${name} ${date}.pdf`);

      dispatch(setAlert("PDF Generado", "success", "2"));
   } catch (err) {
      const msg = err.response.data.msg;
      const type = err.response.statusText;
      dispatch({
         type: ENROLLMENT_ERROR,
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

export const clearEnrollment = () => (dispatch) => {
   dispatch({ type: ENROLLMENT_CLEARED });
};

export const clearYearEnrollments = () => (dispatch) => {
   dispatch({ type: YEARENROLLMENTS_CLEARED });
};

export const clearEnrollments = () => (dispatch) => {
   dispatch({ type: ENROLLMENTS_CLEARED });
};
