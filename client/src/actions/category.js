import format from "date-fns/format";
import api from "../utils/api";
import { saveAs } from "file-saver";
import history from "../utils/history";

import { setAlert } from "./alert";
import { updateLoadingSpinner, setError } from "./mixvalues";
import { clearProfile } from "./user";

import {
   CATEGORIES_LOADED,
   CATEGORIES_UPDATED,
   CATEGORIES_CLEARED,
   CATEGORIES_ERROR,
} from "./types";

export const loadCategories = (spinner) => async (dispatch) => {
   if (spinner) dispatch(updateLoadingSpinner(true));
   try {
      const res = await api.get("/category");
      dispatch({
         type: CATEGORIES_LOADED,
         payload: res.data,
      });
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setError(CATEGORIES_ERROR, err.response));
         if (spinner) dispatch(setAlert(err.response.data.msg, "danger", "2"));
      }
   }
   if (spinner) dispatch(updateLoadingSpinner(false));
};

export const updateCategories = (formData) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

   try {
      await api.put("/category", formData);

      dispatch({
         type: CATEGORIES_UPDATED,
      });

      dispatch(
         setAlert("Precios de Categorías Modificados", "success", "1", 7000)
      );
      dispatch(clearProfile());

      history.push("/index/dashboard/0");
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setError(CATEGORIES_ERROR, err.response));

         if (err.response.data.errors)
            err.response.data.errors.forEach((error) => {
               dispatch(setAlert(error.msg, "danger", "2"));
            });
         else dispatch(setAlert(err.response.data.msg, "danger", "2"));
      } else error = true;
   }

   if (!error) {
      window.scrollTo(0, 0);
      dispatch(updateLoadingSpinner(false));
   }
};

export const categoriesPDF = (categories) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

   try {
      await api.post("/pdf/category/list", categories);

      const pdf = await api.get("/pdf/category/fetch", {
         responseType: "blob",
      });

      const pdfBlob = new Blob([pdf.data], { type: "application/pdf" });

      saveAs(pdfBlob, `Categorías ${format(new Date(), "dd-MM-yy")}.pdf`);

      dispatch(setAlert("PDF Generado", "success", "2"));
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setError(CATEGORIES_ERROR, err.response));
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
      } else error = true;
   }

   if (!error) {
      window.scrollTo(0, 0);
      dispatch(updateLoadingSpinner(false));
   }
};

export const clearCategories = () => (dispatch) => {
   dispatch({ type: CATEGORIES_CLEARED });
};
