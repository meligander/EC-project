import moment from "moment";
import api from "../utils/api";
import { saveAs } from "file-saver";
import history from "../utils/history";

import { setAlert } from "./alert";
import { updateLoadingSpinner, updatePageNumber } from "./mixvalues";
import { getTotalDebt } from "./installment";

import {
   ENROLLMENT_LOADED,
   ENROLLMENTS_LOADED,
   YEARENROLLMENTS_LOADED,
   ENROLLMENT_REGISTERED,
   ENROLLMENT_UPDATED,
   ENROLLMENT_DELETED,
   ENROLLMENT_CLEARED,
   ENROLLMENTS_CLEARED,
   ENROLLMENT_ERROR,
   ENROLLMENTS_ERROR,
} from "./types";

export const loadEnrollment = (enrollment_id) => async (dispatch) => {
   try {
      const res = await api.get(`/enrollment/one/${enrollment_id}`);
      dispatch({
         type: ENROLLMENT_LOADED,
         payload: res.data,
      });
   } catch (err) {
      if (err.response.status !== 401)
         dispatch(setEnrollmentsError(ENROLLMENT_ERROR, err.response));
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
      if (err.response.status !== 401) {
         dispatch(setEnrollmentsError(ENROLLMENTS_ERROR, err.response));
         window.scroll(0, 0);
      }
   }
};

export const loadEnrollments = (filterData) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

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
      if (err.response.status !== 401) {
         dispatch(setEnrollmentsError(ENROLLMENTS_ERROR, err.response));
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
         window.scroll(0, 0);
      } else error = true;
   }

   if (!error) dispatch(updateLoadingSpinner(false));
};

export const loadStudentsAvAtt = (filterData, type) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

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

      const res = await api.get(`/enrollment/${type}?${filter}`);

      dispatch({
         type: ENROLLMENTS_LOADED,
         payload: { enrollments: res.data, type },
      });
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setEnrollmentsError(ENROLLMENTS_ERROR, err.response));
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
         window.scroll(0, 0);
      } else error = true;
   }

   if (!error) dispatch(updateLoadingSpinner(false));
};
export const registerEnrollment = (formData) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

   let enrollment = {};
   for (const prop in formData) {
      if (formData[prop] !== "") {
         enrollment[prop] = formData[prop];
      }
   }

   try {
      let res;
      if (formData._id !== "0") res = await api.post("/enrollment", enrollment);
      else res = await api.put(`/enrollment/${formData._id}`, enrollment);

      dispatch({
         type:
            formData._id === "0" ? ENROLLMENT_REGISTERED : ENROLLMENT_UPDATED,
         payload: res.data,
      });

      dispatch(
         setAlert(
            `Inscripción ${formData._id === "0" ? "Registrada" : "Modificada"}`,
            "success",
            formData._id === "0" ? "1" : "2",
            7000
         )
      );
      dispatch(getYearEnrollments());
      dispatch(getTotalDebt());

      history.push("/enrollment-list");
      dispatch(clearEnrollment());
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setEnrollmentsError(ENROLLMENT_ERROR, err.response));

         if (err.response.data.errors)
            err.response.data.errors.forEach((error) => {
               dispatch(setAlert(error.msg, "danger", "2"));
            });
         else dispatch(setAlert(err.response.data.msg, "danger", "2"));
      } else error = true;
   }

   if (!error) {
      dispatch(updateLoadingSpinner(false));
      window.scrollTo(0, 0);
   }
};

export const deleteEnrollment = (enroll_id) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

   try {
      await api.delete(`/enrollment/${enroll_id}`);

      dispatch({
         type: ENROLLMENT_DELETED,
         payload: enroll_id,
      });
      dispatch(getYearEnrollments());
      dispatch(setAlert("Inscripción Eliminada", "success", "2"));
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setEnrollmentsError(ENROLLMENT_ERROR, err.response));
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
      }
   }

   if (!error) {
      window.scrollTo(0, 0);
      dispatch(updateLoadingSpinner(false));
   }
};

export const enrollmentsPDF = (enrollments, average) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

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
      if (err.response.status !== 401) {
         dispatch(setEnrollmentsError(ENROLLMENT_ERROR, err.response));
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
      } else error = true;
   }

   if (!error) {
      window.scrollTo(0, 0);
      dispatch(updateLoadingSpinner(false));
   }
};

export const clearEnrollment = () => (dispatch) => {
   dispatch({ type: ENROLLMENT_CLEARED });
};

export const clearEnrollments = () => (dispatch) => {
   dispatch({ type: ENROLLMENTS_CLEARED });
   dispatch(updatePageNumber(0));
};

const setEnrollmentsError = (type, response) => (dispatch) => {
   dispatch({
      type: type,
      payload: response.data.errors
         ? response.data.errors
         : {
              type: response.statusText,
              status: response.status,
              msg: response.data.msg,
           },
   });
};
