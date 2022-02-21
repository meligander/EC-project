import api from "../utils/api";
import { saveAs } from "file-saver";
import history from "../utils/history";

import { setAlert } from "./alert";
import { updateLoadingSpinner, setError } from "./mixvalues";

import {
   OBSERVATIONS_CLEARED,
   OBSERVATIONS_ERROR,
   OBSERVATIONS_LOADED,
   OBSERVATIONS_UPDATED,
} from "./types";

export const loadObservations =
   (class_id, user_id, spinner) => async (dispatch) => {
      if (spinner) dispatch(updateLoadingSpinner(true));
      try {
         const res = await api.get(
            `/observation/${class_id}${user_id ? "/" + user_id : ""}`
         );
         dispatch({
            type: OBSERVATIONS_LOADED,
            payload: res.data,
         });
      } catch (err) {
         if (err.response.status !== 401) {
            dispatch(setError(OBSERVATIONS_ERROR, err.response));
            dispatch(setAlert(err.response.data.msg, "danger", "2"));
         }
      }
      if (spinner) dispatch(updateLoadingSpinner(false));
   };

export const updateObservations =
   (formData, class_id, period) => async (dispatch) => {
      dispatch(updateLoadingSpinner(true));
      let error = false;

      try {
         await api.put(`/observation/${class_id}/${period}`, formData);

         dispatch({
            type: OBSERVATIONS_UPDATED,
         });

         dispatch(setAlert("Observaciones Modificadas", "success", "2"));

         history.push(`/class/single/${class_id}`);
         window.scrollTo(0, 0);
      } catch (err) {
         if (err.response.status !== 401) {
            dispatch(setError(OBSERVATIONS_ERROR, err.response));
            dispatch(setAlert(err.response.data.msg, "danger", "3"));
         } else error = true;
      }

      if (!error) dispatch(updateLoadingSpinner(false));
   };

export const reportcardPDF = (students, info) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;
   try {
      if (students.length === 0) {
         const errorMessage = {
            response: {
               status: 402,
               data: {
                  msg: "Debe seleccionar al menos un alumno",
               },
            },
         };
         throw errorMessage;
      }
      for (let x = 0; x < students.length; x++) {
         if (students[x].checked) {
            await api.post("/pdf/observation/report-card", {
               student: students[x],
               info,
            });

            const pdf = await api.get("/pdf/observation/fetch", {
               responseType: "blob",
            });

            const pdfBlob = new Blob([pdf.data], {
               type: "application/pdf",
            });

            saveAs(
               pdfBlob,
               `Certificado ${info.category} ${
                  info.period === 6 ? "Cambridge" : ""
               }  ${students[x].name}.pdf`
            );
         }
      }

      dispatch(setAlert("Libretas Generadas", "success", "2"));
   } catch (err) {
      console.log(err);
      if (err.response.status !== 401) {
         dispatch(setError(OBSERVATIONS_ERROR, err.response));
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
      } else error = true;
   }

   if (!error) {
      dispatch(updateLoadingSpinner(false));
      window.scrollTo(0, 0);
   }
};

export const clearObservations = () => (dispatch) => {
   dispatch({ type: OBSERVATIONS_CLEARED });
};
