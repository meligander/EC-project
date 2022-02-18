import format from "date-fns/format";
import api from "../utils/api";
import { saveAs } from "file-saver";
import history from "../utils/history";

import { setAlert } from "./alert";
import { updateLoadingSpinner, filterData, newObject } from "./mixvalues";
import { getTotalDebt } from "./installment";

import {
   ENROLLMENT_LOADED,
   ENROLLMENTS_LOADED,
   YEARENROLLMENTS_LOADED,
   ESTIMATEDPROFIT_LOADED,
   ENROLLMENT_REGISTERED,
   ENROLLMENT_UPDATED,
   ENROLLMENT_DELETED,
   ENROLLMENT_CLEARED,
   ENROLLMENTS_CLEARED,
   ENROLLMENT_ERROR,
   ENROLLMENTS_ERROR,
} from "./types";

export const loadEnrollment = (enrollment_id, spinner) => async (dispatch) => {
   if (spinner) dispatch(updateLoadingSpinner(true));
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
   if (spinner) dispatch(updateLoadingSpinner(false));
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

export const getEstimatedProfit = () => async (dispatch) => {
   try {
      let res = await api.get("/enrollment/money");

      dispatch({
         type: ESTIMATEDPROFIT_LOADED,
         payload: res.data,
      });
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setEnrollmentsError(ENROLLMENTS_ERROR, err.response));
         window.scroll(0, 0);
      }
   }
};

export const loadEnrollments = (formData, spinner) => async (dispatch) => {
   if (spinner) dispatch(updateLoadingSpinner(true));
   let error = false;

   try {
      const res = await api.get(`/enrollment?${filterData(formData)}`);

      dispatch({
         type: ENROLLMENTS_LOADED,
         payload: res.data,
      });
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setEnrollmentsError(ENROLLMENTS_ERROR, err.response));
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
         window.scroll(0, 0);
      } else error = true;
   }

   if (!error && spinner) dispatch(updateLoadingSpinner(false));
};

export const registerUpdateEnrollment =
   (formData, loaded) => async (dispatch) => {
      dispatch(updateLoadingSpinner(true));
      let error = false;

      let enrollment = newObject(formData);

      try {
         if (!loaded)
            dispatch(loadEnrollments({ year: new Date().getFullYear() }));

         let res;
         if (!enrollment._id) res = await api.post("/enrollment", enrollment);
         else res = await api.put(`/enrollment/${enrollment._id}`, enrollment);

         dispatch({
            type: !enrollment._id ? ENROLLMENT_REGISTERED : ENROLLMENT_UPDATED,
            payload: res.data,
         });

         dispatch(
            setAlert(
               `Inscripción ${!enrollment._id ? "Registrada" : "Modificada"}`,
               "success",
               "2",
               7000
            )
         );
         dispatch(getYearEnrollments());
         dispatch(getTotalDebt());

         history.push("/enrollment/list");
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
            await api.post("/pdf/enrollment/list", enrollments);

            name = "Inscripciones";
            break;
         case "averages":
            await api.post("/pdf/enrollment/averages-list", enrollments);

            name = "Mejores Promedios";
            break;
         case "attendances":
            await api.post("/pdf/enrollment/absences-list", enrollments);

            name = "Mejores Asistencias";
            break;
         default:
            break;
      }

      pdf = await api.get("/pdf/enrollment/fetch", {
         responseType: "blob",
      });

      const pdfBlob = new Blob([pdf.data], { type: "application/pdf" });

      saveAs(pdfBlob, `${name} ${format(new Date(), "dd-MM-yy")}.pdf`);

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
