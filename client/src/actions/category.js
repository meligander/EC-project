import moment from "moment";
import api from "../utils/api";
import { saveAs } from "file-saver";
import history from "../utils/history";

import { setAlert } from "./alert";
import { updateLoadingSpinner } from "./mixvalues";
import { clearProfile } from "./user";

import {
   CATEGORIES_LOADED,
   CATEGORIES_UPDATED,
   CATEGORIES_CLEARED,
   CATEGORY_ERROR,
} from "./types";

export const loadCategories = () => async (dispatch) => {
   try {
      const res = await api.get("/category");
      dispatch({
         type: CATEGORIES_LOADED,
         payload: res.data,
      });
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setCategoriesError(CATEGORY_ERROR, err.response));
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
      }
   }
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

      history.push("/dashboard/0");
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setCategoriesError(CATEGORY_ERROR, err.response));

         if (err.response.data.errors)
            err.response.data.errorsforEach((error) => {
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
      await api.post("/category/create-list", categories);

      const pdf = await api.get("/category/fetch-list", {
         responseType: "blob",
      });

      const pdfBlob = new Blob([pdf.data], { type: "application/pdf" });

      const date = moment().format("DD-MM-YY");

      saveAs(pdfBlob, `Categorías ${date}.pdf`);

      dispatch(setAlert("PDF Generado", "success", "2"));
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setCategoriesError(CATEGORY_ERROR, err.response));
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

const setCategoriesError = (type, response) => (dispatch) => {
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
