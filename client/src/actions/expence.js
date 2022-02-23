import format from "date-fns/format";
import api from "../utils/api";
import { saveAs } from "file-saver";

import {
   filterData,
   newObject,
   updateLoadingSpinner,
   setError,
} from "./mixvalues";
import { clearRegister } from "./register";
import { setAlert } from "./alert";

import {
   TRANSACTIONS_LOADED,
   EXPENCETYPES_LOADED,
   EXPENCE_REGISTERED,
   EXPENCE_DELETED,
   EXPENCETYPES_UPDATED,
   EXPENCETYPE_DELETED,
   TRANSACTIONS_CLEARED,
   EXPENCE_CLEARED,
   EXPENCETYPES_CLEARED,
   EXPENCE_ERROR,
   EXPENCETYPE_ERROR,
   TRANSACTIONS_ERROR,
   REGISTER_LOADED,
} from "./types";

export const loadTransactions = (formData, spinner) => async (dispatch) => {
   if (spinner) dispatch(updateLoadingSpinner(true));
   let error = false;

   try {
      const res = await api.get(`/expence?${filterData(formData)}`);
      dispatch({
         type: TRANSACTIONS_LOADED,
         payload: res.data,
      });
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setError(TRANSACTIONS_ERROR, err.response));
         if (spinner) dispatch(setAlert(err.response.data.msg, "danger", "2"));
         window.scroll(0, 0);
      } else error = true;
   }

   if (!error && spinner) dispatch(updateLoadingSpinner(false));
};

export const loadWithdrawals = (formData, spinner) => async (dispatch) => {
   if (spinner) dispatch(updateLoadingSpinner(true));
   let error = false;

   try {
      const res = await api.get(`/expence/withdrawal?${filterData(formData)}`);
      dispatch({
         type: TRANSACTIONS_LOADED,
         payload: res.data,
      });
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setError(TRANSACTIONS_ERROR, err.response));
         if (spinner) dispatch(setAlert(err.response.data.msg, "danger", "2"));
         window.scroll(0, 0);
      } else error = true;
   }

   if (!error && spinner) dispatch(updateLoadingSpinner(false));
};

export const loadExpenceTypes = (spinner, expenceType) => async (dispatch) => {
   if (spinner) dispatch(updateLoadingSpinner(true));
   let error = false;
   try {
      const res = await api.get(
         `/expence-type${!expenceType ? "/withdrawal" : ""}`
      );
      dispatch({
         type: EXPENCETYPES_LOADED,
         payload: res.data,
      });
   } catch (err) {
      if (err.response.status !== 401)
         dispatch(setError(EXPENCETYPE_ERROR, err.response));
      else error = true;
   }

   if (!error && spinner) {
      window.scrollTo(0, 0);
      dispatch(updateLoadingSpinner(false));
   }
};

//Update or register a user
export const registerExpence =
   (formData, register, type) => async (dispatch) => {
      dispatch(updateLoadingSpinner(true));
      let error = false;

      let expence = newObject(formData);

      try {
         await api.post("/expence", expence);

         dispatch({
            type: EXPENCE_REGISTERED,
         });

         const value = Number(expence.value);

         dispatch({
            type: REGISTER_LOADED,
            payload: {
               ...register,
               [type]: register[type] + value,
               registermoney: register.registermoney - value,
            },
         });

         dispatch(setAlert("Gasto/Ingreso Registrado", "success", "2", 7000));
      } catch (err) {
         if (err.response.status !== 401) {
            dispatch(setError(EXPENCE_ERROR, err.response));

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

export const deleteExpence = (expence_id) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

   try {
      await api.delete(`/expence/${expence_id}`);

      dispatch({
         type: EXPENCE_DELETED,
         payload: expence_id,
      });

      dispatch(setAlert("Movimiento Eliminado", "success", "2"));

      dispatch(clearRegister());
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setError(EXPENCE_ERROR, err.response));
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
      } else error = true;
   }

   if (!error) {
      window.scrollTo(0, 0);
      dispatch(updateLoadingSpinner(false));
   }
};

export const updateExpenceTypes = (formData) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

   try {
      const res = await api.post("/expence-type", formData);

      dispatch({
         type: EXPENCETYPES_UPDATED,
         payload: res.data,
      });

      dispatch(setAlert("Tipos de Movimientos Modificados", "success", "2"));
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setError(EXPENCE_ERROR, err.response));
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
      } else error = true;
   }

   if (!error) {
      window.scrollTo(0, 0);
      dispatch(updateLoadingSpinner(false));
   }
};

export const deleteExpenceType = (toDelete) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

   try {
      await api.delete(`/expence-type/${toDelete}`);

      dispatch({
         type: EXPENCETYPE_DELETED,
         payload: toDelete,
      });

      dispatch(setAlert("Tipo de Gasto Eliminado", "success", "2"));
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setError(EXPENCE_ERROR, err.response));
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
      } else error = true;
   }

   if (!error) {
      window.scrollTo(0, 0);
      dispatch(updateLoadingSpinner(false));
   }
};

export const transactionsPDF = (transactions, total) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

   try {
      if (total)
         await api.post("/pdf/expence/withdrawal-list", {
            transactions,
            total,
         });
      else await api.post("/pdf/expence/list", transactions);

      const pdf = await api.get("/pdf/expence/fetch", {
         responseType: "blob",
      });

      const pdfBlob = new Blob([pdf.data], { type: "application/pdf" });

      saveAs(pdfBlob, `Movimientos ${format(new Date(), "dd-MM-yy")}.pdf`);

      dispatch(setAlert("PDF Generado", "success", "2"));
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setError(EXPENCE_ERROR, err.response));
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
      } else error = true;
   }

   if (!error) {
      window.scrollTo(0, 0);
      dispatch(updateLoadingSpinner(false));
   }
};

export const clearExpenceTypes = () => (dispatch) => {
   dispatch({ type: EXPENCETYPES_CLEARED });
};

export const clearExpence = () => (dispatch) => {
   dispatch({ type: EXPENCE_CLEARED });
};

export const clearTransactions = () => (dispatch) => {
   dispatch({ type: TRANSACTIONS_CLEARED });
};
