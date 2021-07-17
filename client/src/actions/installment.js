import moment from "moment";
import api from "../utils/api";
import { saveAs } from "file-saver";

import { setAlert } from "./alert";
import { updateLoadingSpinner, updatePreviousPage } from "./mixvalues";

import {
   INSTALLMENT_LOADED,
   TOTALDEBT_LOADED,
   ESTIMATEDPROFIT_LOADED,
   INSTALLMENTS_LOADED,
   STUDENTINSTALLMENTS_LOADED,
   INSTALLMENT_UPDATED,
   INSTALLMENT_REGISTERED,
   INSTALLMENT_DELETED,
   INVOICEDETAIL_ADDED,
   INVOICEDETAIL_REMOVED,
   EXPIREDINSTALLMENTS_UPDATED,
   INSTALLMENT_CLEARED,
   TOTALDEBT_CLEARED,
   INSTALLMENTS_CLEARED,
   STUDENTINSTALLMENTS_CLEARED,
   INSTALLMENTS_ERROR,
   MONTHLYDEBT_LOADED,
} from "./types";

export const loadInstallment = (installment_id) => async (dispatch) => {
   try {
      const res = await api.get(`/installment/${installment_id}`);
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
   }
};

export const getTotalDebt = () => async (dispatch) => {
   try {
      let res = await api.get("/installment/month/debts");

      dispatch({
         type: TOTALDEBT_LOADED,
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
      window.scroll(0, 0);
   }
};

export const getMonthlyDebt = (month) => async (dispatch) => {
   try {
      let res = await api.get(`/installment/month/${month}`);

      dispatch({
         type: month === 12 ? ESTIMATEDPROFIT_LOADED : MONTHLYDEBT_LOADED,
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
      window.scroll(0, 0);
   }
};

export const loadStudentInstallments = (user_id, admin = false) => async (
   dispatch
) => {
   //admin: if is for the dashboard, dont do it... only when is the admin loading the installments
   if (admin) dispatch(updateLoadingSpinner(true));
   try {
      const res = await api.get(`/installment/student/${user_id}/${admin}`);
      dispatch({
         type: STUDENTINSTALLMENTS_LOADED,
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
   }
   if (admin) dispatch(updateLoadingSpinner(false));
};

export const loadInstallments = (filterData) => async (dispatch) => {
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
      const res = await api.get(`/installment?${filter}`);
      dispatch({
         type: INSTALLMENTS_LOADED,
         payload: res.data,
      });
   } catch (err) {
      const msg = err.response.data.msg;
      const type = err.response.statusText;
      dispatch({
         type: INSTALLMENTS_ERROR,
         payload: {
            type,
            status: err.response.status,
            msg,
         },
      });

      window.scroll(0, 0);
      dispatch(setAlert(msg ? msg : type, "danger", "2"));
   }

   dispatch(updateLoadingSpinner(false));
};

export const addInstallment = (installment) => (dispatch) => {
   dispatch({
      type: INVOICEDETAIL_ADDED,
      payload: installment,
   });
};

export const updateIntallment = (formData, history, user_id, inst_id) => async (
   dispatch
) => {
   dispatch(updateLoadingSpinner(true));

   let installment = {};
   for (const prop in formData) {
      if (formData[prop] !== "" && formData[prop] !== 0) {
         installment[prop] = formData[prop];
      }
   }

   try {
      let res;
      if (!inst_id) {
         res = await api.post("/installment", installment);
      } else {
         //Update installment
         res = await api.put(`/installment/${inst_id}`, installment);
      }
      dispatch({
         type: inst_id ? INSTALLMENT_UPDATED : INSTALLMENT_REGISTERED,
      });

      dispatch(updatePreviousPage("dashboard"));

      dispatch(setAlert(res.data.msg, "success", "2"));
      dispatch(clearInstallments());
      history.push(`/installments/${user_id}`);
   } catch (err) {
      if (err.response.data.errors) {
         const errors = err.response.data.errors;
         errors.forEach((error) => {
            dispatch(setAlert(error.msg, "danger", "2"));
         });
         dispatch({
            type: INSTALLMENTS_ERROR,
            payload: errors,
         });
      } else {
         const msg = err.response.data.msg;
         const type = err.response.statusText;
         dispatch({
            type: INSTALLMENTS_ERROR,
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

export const updateExpiredIntallments = () => async (dispatch) => {
   try {
      await api.put("/installment");

      dispatch({
         type: EXPIREDINSTALLMENTS_UPDATED,
      });
   } catch (err) {
      const msg = err.response.data.msg;
      const type = err.response.statusText;
      dispatch({
         type: INSTALLMENTS_ERROR,
         payload: {
            type,
            status: err.response.status,
            msg,
         },
      });
      dispatch(setAlert(msg ? msg : type, "danger", "1", 7000));
      window.scroll(0, 0);
   }
};

export const deleteInstallment = (inst_id, history, user_id) => async (
   dispatch
) => {
   dispatch(updateLoadingSpinner(true));

   try {
      await api.delete(`/installment/${inst_id}`);

      dispatch({
         type: INSTALLMENT_DELETED,
         payload: inst_id,
      });

      dispatch(setAlert("Cuota eliminada", "success", "2"));
      dispatch(clearInstallments());
      history.push(`/installments/${user_id}`);
   } catch (err) {
      const msg = err.response.data.msg;
      const type = err.response.statusText;
      dispatch({
         type: INSTALLMENTS_ERROR,
         payload: {
            type,
            status: err.response.status,
            msg,
         },
      });
      dispatch(setAlert(msg ? msg : type, "danger", "2"));
   }

   window.scroll(0, 0);
   dispatch(updateLoadingSpinner(false));
};

export const removeInstallmentFromList = (inst_id) => async (dispatch) => {
   try {
      dispatch({
         type: INVOICEDETAIL_REMOVED,
         payload: inst_id,
      });

      dispatch(setAlert("Cuota eliminada", "success", "5"));
   } catch (err) {
      const msg = err.response.data.msg;
      const type = err.response.statusText;
      dispatch({
         type: INSTALLMENTS_ERROR,
         payload: {
            type,
            status: err.response.status,
            msg,
         },
      });
      dispatch(setAlert(msg ? msg : type, "danger", "2"));
      window.scroll(0, 0);
   }
};

export const installmentsPDF = (installments) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   try {
      await api.post("/installment/create-list", installments);

      const pdf = await api.get("/installment/list/fetch-list", {
         responseType: "blob",
      });

      const pdfBlob = new Blob([pdf.data], { type: "application/pdf" });

      const date = moment().format("DD-MM-YY");

      saveAs(pdfBlob, `Deudas ${date}.pdf`);

      dispatch(setAlert("PDF Generado", "success", "2"));
   } catch (err) {
      const msg = err.response.data.msg;
      const type = err.response.statusText;
      dispatch({
         type: INSTALLMENTS_ERROR,
         payload: {
            type,
            status: err.response.status,
            msg,
         },
      });
      dispatch(setAlert(msg ? msg : type, "danger", "2"));
   }

   window.scroll(0, 0);
   dispatch(updateLoadingSpinner(false));
};

export const clearInstallment = () => (dispatch) => {
   dispatch({
      type: INSTALLMENT_CLEARED,
   });
};

export const clearTotalDebt = () => (dispatch) => {
   dispatch({
      type: TOTALDEBT_CLEARED,
   });
};

export const clearInstallments = () => (dispatch) => {
   dispatch({
      type: INSTALLMENTS_CLEARED,
   });
};

export const clearUserInstallments = () => (dispatch) => {
   dispatch({
      type: STUDENTINSTALLMENTS_CLEARED,
   });
};
