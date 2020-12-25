import moment from "moment";
import axios from "axios";
import { saveAs } from "file-saver";

import { setAlert } from "./alert";
import { updateLoadingSpinner } from "./mixvalues";
import { updateExpiredIntallments } from "./installment";

import {
   CATEGORIES_LOADED,
   CATEGORIES_UPDATED,
   CATEGORIES_CLEARED,
   CATEGORY_ERROR,
} from "./types";

export const loadCategories = (editClass = false) => async (dispatch) => {
   //editClass is to start the spinner when we get to register class // edit class
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
   }
};

export const updateCategories = (formData, history, user_id) => async (
   dispatch
) => {
   dispatch(updateLoadingSpinner(true));
   let categories = JSON.stringify(formData);

   const config = {
      headers: {
         "Content-Type": "application/json",
      },
   };

   try {
      await axios.put("/api/category", categories, config);

      dispatch({
         type: CATEGORIES_UPDATED,
      });

      dispatch(updateExpiredIntallments());
      dispatch(
         setAlert("Precios de Categorías Modificados", "success", "1", 7000)
      );
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
         const msg = err.response.data.msg;
         const type = err.response.statusText;
         dispatch({
            type: CATEGORY_ERROR,
            payload: {
               type,
               status: err.response.status,
               msg,
            },
         });
         dispatch(setAlert(msg ? msg : type, "danger", "2"));
      }
   }

   window.scrollTo(0, 0);
   dispatch(updateLoadingSpinner(false));
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
      const msg = err.response.data.msg;
      const type = err.response.statusText;
      dispatch({
         type: CATEGORY_ERROR,
         payload: {
            type,
            status: err.response.status,
            msg,
         },
      });
      dispatch(setAlert(msg !== "" ? msg : type, "danger", "2"));
   }

   window.scrollTo(0, 0);
   dispatch(updateLoadingSpinner(false));
};

export const clearCategories = () => (dispatch) => {
   dispatch({ type: CATEGORIES_CLEARED });
};
