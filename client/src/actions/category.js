import moment from "moment";
import axios from "axios";
import { saveAs } from "file-saver";

import { setAlert } from "./alert";
import { updateLoadingSpinner } from "./mixvalues";

import {
   CATEGORY_ERROR,
   CATEGORIES_LOADED,
   CATEGORIES_UPDATED,
   CATEGORIES_CLEARED,
} from "./types";

export const loadCategories = (editClass = false) => async (dispatch) => {
   if (editClass) dispatch(updateLoadingSpinner(true));
   try {
      const res = await axios.get("/api/category");
      dispatch({
         type: CATEGORIES_LOADED,
         payload: res.data,
      });
   } catch (err) {
      dispatch({
         type: CATEGORY_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
      window.scrollTo(0, 0);
   }
};

export const updateCategories = (formData, history, user_id) => async (
   dispatch
) => {
   let categories = JSON.stringify(formData);

   const config = {
      headers: {
         "Content-Type": "application/json",
      },
   };

   try {
      const res = await axios.put("/api/category", categories, config);

      dispatch({
         type: CATEGORIES_UPDATED,
         payload: res.data,
      });

      dispatch(setAlert("Precios de categorias actualizados", "success", "1"));
      history.push(`/dashboard/${user_id}`);
   } catch (err) {
      if (err.response.data.errors) {
         const errors = err.response.data.errors;
         errors.forEach((error) => {
            dispatch(setAlert(error.msg, "danger", "2"));
         });
         dispatch({
            type: CATEGORY_ERROR,
            payload: errors,
         });
      } else {
         dispatch({
            type: CATEGORY_ERROR,
            payload: {
               type: err.response.statusText,
               status: err.response.status,
               msg: err.response.data.msg,
            },
         });
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
      }
   }

   window.scrollTo(0, 0);
};

export const categoriesPDF = (categories) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   let category = JSON.stringify(categories);

   try {
      const config = {
         headers: {
            "Content-Type": "application/json",
         },
      };

      await axios.post("/api/category/create-list", category, config);

      const pdf = await axios.get("/api/category/fetch-list", {
         responseType: "blob",
      });

      const pdfBlob = new Blob([pdf.data], { type: "application/pdf" });

      const date = moment().format("DD-MM-YY");

      saveAs(pdfBlob, `Categorías ${date}.pdf`);

      dispatch(setAlert("PDF Generado", "success", "2"));
   } catch (err) {
      dispatch({
         type: CATEGORY_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
   }

   window.scrollTo(0, 0);
   dispatch(updateLoadingSpinner(true));
};

export const clearCategories = () => (dispatch) => {
   dispatch({ type: CATEGORIES_CLEARED });
};
