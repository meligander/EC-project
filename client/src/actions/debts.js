import {
   INSTALLMENTS_ERROR,
   INSTALLMENTS_LOADED,
   INSTALLMENT_LOADED,
   INSTALLMENTS_CLEARED,
   INSTALLMENT_CLEARED,
   USER_INSTALLMENTS_CLEARED,
   INSTALLMENT_UPDATED,
   INSTALLMENT_REGISTERED,
   INSTALLMENT_DELETED,
   USERS_INSTALLMENTS_LOADED,
   INVOICE_DETAIL_ADDED,
   INVOICE_DETAIL_REMOVED,
   INSTALLMENTS_UPDATED,
} from "./types";
import axios from "axios";
import moment from "moment";
import { saveAs } from "file-saver";
import { setAlert } from "./alert";
import { updateLoadingSpinner } from "./mixvalues";

export const loadStudentDebts = (user_id, admin = false) => async (
   dispatch
) => {
   if (admin) dispatch(updateLoadingSpinner(true));
   try {
      const res = await axios.get(
         `/api/installment/student/${user_id}/${admin}`
      );
      dispatch({
         type: USERS_INSTALLMENTS_LOADED,
         payload: res.data,
      });
   } catch (err) {
      dispatch({
         type: INSTALLMENTS_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
      window.scroll(0, 0);
   }
   dispatch(updateLoadingSpinner(false));
};

export const loadDebts = (filterData) => async (dispatch) => {
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
      const res = await axios.get(`/api/installment?${filter}`);
      dispatch({
         type: INSTALLMENTS_LOADED,
         payload: res.data,
      });
   } catch (err) {
      dispatch({
         type: INSTALLMENTS_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
      window.scroll(0, 0);
   }

   dispatch(updateLoadingSpinner(false));
};

export const loadDebt = (debt_id) => async (dispatch) => {
   try {
      const res = await axios.get(`/api/installment/${debt_id}`);
      dispatch({
         type: INSTALLMENT_LOADED,
         payload: res.data,
      });
   } catch (err) {
      dispatch({
         type: INSTALLMENTS_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
      window.scroll(0, 0);
   }
};

export const addInstallment = (installment) => (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   dispatch({
      type: INVOICE_DETAIL_ADDED,
      payload: installment,
   });
   dispatch(updateLoadingSpinner(false));
};

export const updateIntallment = (
   formData,
   history,
   edit = false,
   inst_id,
   user_id
) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   let installment = {};
   for (const prop in formData) {
      if (formData[prop] && formData[prop] !== 1)
         installment[prop] = formData[prop];
   }

   installment = JSON.stringify(installment);

   const config = {
      headers: {
         "Content-Type": "application/json",
      },
   };
   try {
      let res;
      if (!edit) {
         res = await axios.post("/api/installment", installment, config);
      } else {
         //Update installment
         res = await axios.put(
            `/api/installment/${inst_id}`,
            installment,
            config
         );
      }
      dispatch({
         type: edit ? INSTALLMENT_UPDATED : INSTALLMENT_REGISTERED,
         payload: res.data,
      });
      dispatch(
         setAlert(edit ? "Cuota modificada" : "Cuota creada", "success", "2")
      );
      dispatch(clearInstallments());
      history.push(`/installments/${user_id}`);
   } catch (err) {
      if (err.response.data.erros) {
         const errors = err.response.data.errors;
         errors.forEach((error) => {
            dispatch(setAlert(error.msg, "danger", "2"));
         });
         dispatch({
            type: INSTALLMENTS_ERROR,
            payload: errors,
         });
      } else {
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
         dispatch({
            type: INSTALLMENTS_ERROR,
            payload: {
               type: err.response.statusText,
               status: err.response.status,
               msg: err.response.data.msg,
            },
         });
      }
   }

   window.scrollTo(0, 0);
};

export const deleteInstallment = (inst_id, history, user_id) => async (
   dispatch
) => {
   dispatch(updateLoadingSpinner(true));

   try {
      await axios.delete(`/api/installment/${inst_id}`);

      dispatch({
         type: INSTALLMENT_DELETED,
         payload: inst_id,
      });

      dispatch(setAlert("Cuota eliminada", "success", "2"));
      dispatch(clearInstallments());
      history.push(`/installments/${user_id}`);
   } catch (err) {
      dispatch({
         type: INSTALLMENTS_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
   }

   window.scroll(0, 0);
};

export const removeInstallmentFromList = (inst_id) => async (dispatch) => {
   try {
      dispatch({
         type: INVOICE_DETAIL_REMOVED,
         payload: inst_id,
      });

      dispatch(setAlert("Cuota eliminada", "success", "5"));
   } catch (err) {
      dispatch({
         type: INSTALLMENTS_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
      window.scroll(0, 0);
   }
};

export const updateExpiredIntallments = () => async (dispatch) => {
   try {
      await axios.put("/api/installment");

      dispatch({
         type: INSTALLMENTS_UPDATED,
      });
   } catch (err) {
      dispatch({
         type: INSTALLMENTS_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
      window.scroll(0, 0);
   }
};

export const debtsPDF = (debts) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   let debt = JSON.stringify(debts);
   try {
      const config = {
         headers: {
            "Content-Type": "application/json",
         },
      };

      await axios.post("/api/installment/create-list", debt, config);

      const pdf = await axios.get("/api/installment/list/fetch-list", {
         responseType: "blob",
      });

      const pdfBlob = new Blob([pdf.data], { type: "application/pdf" });

      const date = moment().format("DD-MM-YY");

      saveAs(pdfBlob, `Deudas ${date}.pdf`);

      dispatch(setAlert("PDF Generado", "success", "2"));
   } catch (err) {
      dispatch({
         type: INSTALLMENTS_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
   }

   window.scroll(0, 0);
   dispatch(updateLoadingSpinner(true));
};

export const clearInstallments = () => (dispatch) => {
   dispatch({
      type: INSTALLMENTS_CLEARED,
   });
};

export const clearUserInstallments = () => (dispatch) => {
   dispatch({
      type: USER_INSTALLMENTS_CLEARED,
   });
};

export const clearInstallment = () => (dispatch) => {
   dispatch({
      type: INSTALLMENT_CLEARED,
   });
};