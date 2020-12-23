import moment from "moment";
import axios from "axios";
import { saveAs } from "file-saver";

import { setAlert } from "./alert";
import { updateLoadingSpinner, clearValues } from "./mixvalues";

import {
   ENROLLMENT_LOADED,
   ENROLLMENTS_LOADED,
   ENROLLMENT_REGISTERED,
   ENROLLMENT_UPDATED,
   ENROLLMENT_DELETED,
   ENROLLMENT_CLEARED,
   ENROLLMENTS_CLEARED,
   ENROLLMENT_ERROR,
} from "./types";

export const loadEnrollments = (filterData) => async (dispatch) => {
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
      const res = await axios.get(`/api/enrollment?${filter}`);
      dispatch({
         type: ENROLLMENTS_LOADED,
         payload: { enrollments: res.data, type: "enrollments" },
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
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
      window.scroll(0, 0);
   }

   dispatch(updateLoadingSpinner(false));
};

export const loadStudentAttendance = (filterData) => async (dispatch) => {
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

      const res = await axios.get(`/api/enrollment/absences?${filter}`);
      dispatch({
         type: ENROLLMENTS_LOADED,
         payload: { enrollments: res.data, type: "attendance" },
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
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
      window.scroll(0, 0);
   }
};

export const loadStudentAverage = (filterData) => async (dispatch) => {
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

      const res = await axios.get(`/api/enrollment/average?${filter}`);
      dispatch({
         type: ENROLLMENTS_LOADED,
         payload: { enrollments: res.data, type: "average" },
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
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
      window.scroll(0, 0);
   }
};

export const loadEnrollment = (enrollment_id) => async (dispatch) => {
   try {
      const res = await axios.get(`/api/enrollment/one/${enrollment_id}`);
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
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
      window.scroll(0, 0);
   }
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
      if (formData[prop]) enrollment[prop] = formData[prop];
   }

   enrollment = JSON.stringify(enrollment);

   const config = {
      headers: {
         "Content-Type": "application/json",
      },
   };
   try {
      let res;
      if (!enroll_id) {
         res = await axios.post("/api/enrollment", enrollment, config);
      } else {
         res = await axios.put(
            `/api/enrollment/${enroll_id}`,
            enrollment,
            config
         );
      }

      dispatch({
         type: !enroll_id ? ENROLLMENT_REGISTERED : ENROLLMENT_UPDATED,
         ...(enroll_id && { payload: res.data }),
      });

      dispatch(
         setAlert(
            `Inscripción ${!enroll_id ? "Registrada" : "Modificada"}`,
            "success",
            "1"
         )
      );

      dispatch(clearValues());

      if (!enroll_id) {
         history.push(`/dashboard/${user_id}`);
      } else {
         history.push("/enrollment-list");
         dispatch(clearEnrollment());
      }
   } catch (err) {
      if (err.response.data.erros) {
         const errors = err.response.data.errors;
         errors.forEach((error) => {
            dispatch(setAlert(error.msg, "danger", "2"));
         });
         dispatch({
            type: ENROLLMENT_ERROR,
            payload: errors,
         });
      } else {
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
         dispatch({
            type: ENROLLMENT_ERROR,
            payload: {
               type: err.response.statusText,
               status: err.response.status,
               msg: err.response.data.msg,
            },
         });
      }
   }

   window.scrollTo(0, 0);
};

export const deleteEnrollment = (enroll_id) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   try {
      await axios.delete(`/api/enrollment/${enroll_id}`);

      dispatch({
         type: ENROLLMENT_DELETED,
         payload: enroll_id,
      });
      dispatch(clearValues());
      dispatch(setAlert("Inscripción Eliminada", "success", "2"));
   } catch (err) {
      dispatch({
         type: ENROLLMENT_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
   }

   window.scrollTo(0, 0);
   dispatch(updateLoadingSpinner(false));
};

export const enrollmentsPDF = (enrollments, average) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   let enrollment = JSON.stringify(enrollments);
   try {
      const config = {
         headers: {
            "Content-Type": "application/json",
         },
      };

      let pdf;
      let name;

      switch (average) {
         case "enrollments":
            await axios.post("/api/enrollment/create-list", enrollment, config);

            pdf = await axios.get("/api/enrollment/fetch-list", {
               responseType: "blob",
            });
            name = "Inscripciones";
            break;
         case "averages":
            await axios.post(
               "/api/enrollment/averages/create-list",
               enrollment,
               config
            );

            pdf = await axios.get("/api/enrollment/averages/fetch-list", {
               responseType: "blob",
            });
            name = "Mejores Promedios";
            break;
         case "attendances":
            await axios.post(
               "/api/enrollment/absences/create-list",
               enrollment,
               config
            );

            pdf = await axios.get("/api/enrollment/absences/fetch-list", {
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
      dispatch({
         type: ENROLLMENT_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
   }

   window.scrollTo(0, 0);
   dispatch(updateLoadingSpinner(false));
};

export const clearEnrollment = () => (dispatch) => {
   dispatch({ type: ENROLLMENT_CLEARED });
};

export const clearEnrollments = () => (dispatch) => {
   dispatch({ type: ENROLLMENTS_CLEARED });
};
