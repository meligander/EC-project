import moment from "moment";
import axios from "axios";
import { saveAs } from "file-saver";

import { updateLoadingSpinner } from "./mixvalues";
import { clearRegisters } from "./register";
import { setAlert } from "./alert";
import { clearProfile } from "./user";

import {
   TRANSACTIONS_LOADED,
   EXPENCETYPES_LOADED,
   EXPENCE_REGISTERED,
   EXPENCE_DELETED,
   EXPENCETYPES_UPDATED,
   EXPENCETYPE_DELETED,
   TRANSACTIONS_CLEARED,
   EXPENCES_CLEARED,
   EXPENCETYPES_CLEARED,
   EXPENCE_ERROR,
   EXPENCETYPE_ERROR,
} from "./types";

export const loadTransactions = (filterData) => async (dispatch) => {
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
      const res = await axios.get(`/api/expence?${filter}`);
      dispatch({
         type: TRANSACTIONS_LOADED,
         payload: res.data,
      });
   } catch (err) {
      const msg = err.response.data.msg;
      const type = err.response.statusText;

      dispatch({
         type: EXPENCE_ERROR,
         payload: {
            type,
            status: err.response.status,
            msg,
         },
      });
      dispatch(setAlert(msg ? msg : type, "danger", "2"));
      window.scroll(0, 0);
   }
   dispatch(updateLoadingSpinner(false));
};

export const loadExpenceTypes = () => async (dispatch) => {
   try {
      const res = await axios.get("/api/expence-type");
      dispatch({
         type: EXPENCETYPES_LOADED,
         payload: res.data,
      });
   } catch (err) {
      dispatch({
         type: EXPENCETYPE_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
   }
};

//Update or register a user
export const registerExpence = (formData, history, user_id) => async (
   dispatch
) => {
   dispatch(updateLoadingSpinner(true));

   let expence = {};
   for (const prop in formData) {
      if (formData[prop] !== "" && formData[prop] !== 0) {
         expence[prop] = formData[prop];
      }
   }

   try {
      await axios.post("/api/expence", expence);

      dispatch({
         type: EXPENCE_REGISTERED,
      });

      dispatch(clearTransactions());
      dispatch(clearRegisters());

      dispatch(setAlert("Gasto/Ingreso Registrado", "success", "1", 7000));
      dispatch(clearProfile());
      history.push(`/dashboard/${user_id}`);
   } catch (err) {
      if (err.response.data.errors) {
         const errors = err.response.data.errors;
         errors.forEach((error) => {
            dispatch(setAlert(error.msg, "danger", "2"));
         });
         dispatch({
            type: EXPENCE_ERROR,
            payload: errors,
         });
      } else {
         const msg = err.response.data.msg;
         const type = err.response.statusText;
         dispatch({
            type: EXPENCE_ERROR,
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

export const deleteExpence = (expence_id) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   try {
      await axios.delete(`/api/expence/${expence_id}`);

      dispatch({
         type: EXPENCE_DELETED,
         payload: expence_id,
      });

      dispatch(setAlert("Movimiento Eliminado", "success", "2"));

      dispatch(clearTransactions());
   } catch (err) {
      const msg = err.response.data.msg;
      const type = err.response.statusText;
      dispatch({
         type: EXPENCE_ERROR,
         payload: {
            type,
            status: err.response.status,
            msg,
         },
      });
      dispatch(setAlert(msg ? msg : type, "danger", "2"));
   }

   window.scrollTo(0, 0);
   dispatch(updateLoadingSpinner(false));
};

export const updateExpenceTypes = (formData) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   try {
      const res = await axios.post("/api/expence-type", formData);

      dispatch({
         type: EXPENCETYPES_UPDATED,
         payload: res.data,
      });

      dispatch(setAlert("Tipos de Movimientos Modificados", "success", "2"));
   } catch (err) {
      const msg = err.response.data.msg;
      const type = err.response.statusText;
      dispatch({
         type: EXPENCE_ERROR,
         payload: {
            type,
            status: err.response.status,
            msg,
         },
      });
      dispatch(setAlert(msg ? msg : type, "danger", "2"));
   }

   window.scrollTo(0, 0);
   dispatch(updateLoadingSpinner(false));
};

export const deleteExpenceType = (toDelete) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   try {
      await axios.delete(`/api/expence-type/${toDelete}`);

      dispatch({
         type: EXPENCETYPE_DELETED,
         payload: toDelete,
      });

      dispatch(setAlert("Tipo de Gasto Eliminado", "success", "2"));
   } catch (err) {
      const msg = err.response.data.msg;
      const type = err.response.statusText;
      dispatch({
         type: EXPENCE_ERROR,
         payload: {
            type,
            status: err.response.status,
            msg,
         },
      });
      dispatch(setAlert(msg ? msg : type, "danger", "2"));
   }

   window.scrollTo(0, 0);
   dispatch(updateLoadingSpinner(false));
};

export const transactionsPDF = (transactions) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   try {
      await axios.post("/api/expence/create-list", transactions);

      const pdf = await axios.get("/api/expence/fetch-list", {
         responseType: "blob",
      });

      const pdfBlob = new Blob([pdf.data], { type: "application/pdf" });

      const date = moment().format("DD-MM-YY");

      saveAs(pdfBlob, `Movimientos ${date}.pdf`);

      dispatch(setAlert("PDF Generado", "success", "2"));
   } catch (err) {
      const msg = err.response.data.msg;
      const type = err.response.statusText;
      dispatch({
         type: EXPENCE_ERROR,
         payload: {
            type,
            status: err.response.status,
            msg,
         },
      });
      dispatch(setAlert(msg ? msg : type, "danger", "2"));
   }

   window.scrollTo(0, 0);
   dispatch(updateLoadingSpinner(false));
};

export const clearExpenceTypes = () => (dispatch) => {
   dispatch({ type: EXPENCETYPES_CLEARED });
};

export const clearExpences = () => (dispatch) => {
   dispatch({ type: EXPENCES_CLEARED });
};

export const clearTransactions = () => (dispatch) => {
   dispatch({ type: TRANSACTIONS_CLEARED });
};
