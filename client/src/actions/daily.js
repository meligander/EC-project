import format from "date-fns/format";
import api from "../utils/api";
import { saveAs } from "file-saver";

import { setAlert } from "./alert";
import {
   updateLoadingSpinner,
   filterData,
   newObject,
   setError,
} from "./global";

import {
   DAILIES_CLEARED,
   DAILIES_ERROR,
   DAILIES_LOADED,
   DAILIES_PDF_ERROR,
   DAILY_DELETED,
   DAILY_ERROR,
   DAILY_REGISTERED,
} from "./types";

export const loadDailies = (formData, spinner) => async (dispatch) => {
   if (spinner) dispatch(updateLoadingSpinner(true));
   let error = false;

   try {
      const res = await api.get(`/daily?${filterData(formData)}`);
      dispatch({
         type: DAILIES_LOADED,
         payload: res.data,
      });
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setError(DAILIES_ERROR, err.response));
         if (spinner) dispatch(setAlert(err.response.data.msg, "danger", "2"));
         window.scrollTo(0, 0);
      } else error = true;
   }

   if (!error && spinner) dispatch(updateLoadingSpinner(false));
};

export const registerDaily = (formData) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

   const daily = newObject(formData);

   try {
      const res = await api.post("/daily", daily);

      dispatch({
         type: DAILY_REGISTERED,
         payload: res.data,
      });

      dispatch(setAlert("Conteo de Caja Registrado", "success", "2"));
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setError(DAILY_ERROR, err.response));

         if (err.response.data.errors)
            err.response.data.errors.forEach((error) => {
               dispatch(setAlert(error.msg, "danger", "2"));
            });
         else dispatch(setAlert(err.response.data.msg, "danger", "2"));
      } else error = true;
   }

   if (!error) {
      window.scroll(0, 0);
      dispatch(updateLoadingSpinner(false));
   }
};

export const deleteDaily = (daily_id) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

   try {
      await api.delete(`/daily/${daily_id}`);

      dispatch({
         type: DAILY_DELETED,
         payload: daily_id,
      });

      dispatch(setAlert("Conteo de Caja Eliminado", "success", "2"));
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setError(DAILY_ERROR, err.response));
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
      } else error = true;
   }

   if (!error) {
      window.scrollTo(0, 0);
      dispatch(updateLoadingSpinner(false));
   }
};

export const dailyPDF = (dailies) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

   try {
      const pdf = await api.post("/pdf/daily/list", dailies, {
         responseType: "blob",
      });

      const pdfBlob = new Blob([pdf.data], { type: "application/pdf" });

      saveAs(
         pdfBlob,
         `Lista de Cierres de Caja ${format(new Date(), "dd-MM-yy")}.pdf`
      );

      dispatch(setAlert("PDF Generado", "success", "2"));
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setError(DAILIES_PDF_ERROR, err.response));
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
      } else error = true;
   }

   if (!error) {
      window.scrollTo(0, 0);
      dispatch(updateLoadingSpinner(false));
   }
};

export const clearDailies = () => (dispatch) => {
   dispatch({ type: DAILIES_CLEARED });
};
