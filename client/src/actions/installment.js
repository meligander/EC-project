import moment from "moment";
import axios from "axios";
import { saveAs } from "file-saver";

import { setAlert } from "./alert";
import { updateLoadingSpinner, updatePreviousPage } from "./mixvalues";

import {
   INSTALLMENT_LOADED,
   INSTALLMENTS_LOADED,
   USER_INSTALLMENTS_LOADED,
   INSTALLMENT_UPDATED,
   INSTALLMENT_REGISTERED,
   INSTALLMENT_DELETED,
   INVOICE_DETAIL_ADDED,
   INVOICE_DETAIL_REMOVED,
   EXPIRED_INSTALLMENTS_UPDATED,
   INSTALLMENT_CLEARED,
   INSTALLMENTS_CLEARED,
   USER_INSTALLMENTS_CLEARED,
   INSTALLMENTS_ERROR,
} from "./types";

export const loadStudentInstallments = (user_id, admin = false) => async (
   dispatch
) => {
   //admin: if is for the dashboard, dont start it... only when is the admin loading the installments
   if (admin) dispatch(updateLoadingSpinner(true));
   try {
      const res = await axios.get(
         `/api/installment/student/${user_id}/${admin}`
      );
      dispatch({
         type: USER_INSTALLMENTS_LOADED,
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
   dispatch(updateLoadingSpinner(false));
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

export const loadInstallment = (installment_id) => async (dispatch) => {
   try {
      const res = await axios.get(`/api/installment/${installment_id}`);
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

export const addInstallment = (installment) => (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   dispatch({
      type: INVOICE_DETAIL_ADDED,
      payload: installment,
   });
   dispatch(updateLoadingSpinner(false));
};

export const updateIntallment = (formData, history, user_id, inst_id) => async (
   dispatch
) => {
   dispatch(updateLoadingSpinner(true));

   const installment = JSON.stringify(formData);

   const config = {
      headers: {
         "Content-Type": "application/json",
      },
   };
   try {
      let res;
      if (!inst_id) {
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
         type: inst_id ? INSTALLMENT_UPDATED : INSTALLMENT_REGISTERED,
      });

      dispatch(updatePreviousPage("dashboard"));

      dispatch(setAlert(res.data.msg, "success", "2"));
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
   dispatch(updateLoadingSpinner(false));
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
   dispatch(updateLoadingSpinner(false));
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
         type: EXPIRED_INSTALLMENTS_UPDATED,
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

export const installmentsPDF = (installments) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   let installment = JSON.stringify(installments);
   try {
      const config = {
         headers: {
            "Content-Type": "application/json",
         },
      };

      await axios.post("/api/installment/create-list", installment, config);

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
