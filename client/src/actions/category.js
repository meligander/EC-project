import moment from "moment";
import axios from "axios";
import { saveAs } from "file-saver";

import { setAlert } from "./alert";
import { updateLoadingSpinner } from "./mixvalues";
import { updateExpiredIntallments } from "./installment";
import { clearProfile } from "./user";

import {
   CATEGORIES_LOADED,
   CATEGORIES_UPDATED,
   CATEGORIES_CLEARED,
   CATEGORY_ERROR,
} from "./types";

export const loadCategories = () => async (dispatch) => {
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

   try {
      await axios.put("/api/category", formData);

      dispatch({
         type: CATEGORIES_UPDATED,
      });

      dispatch(updateExpiredIntallments());
      dispatch(
         setAlert("Precios de Categorías Modificados", "success", "1", 7000)
      );
      dispatch(clearProfile());
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

   try {
      await axios.post("/api/category/create-list", categories);

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
