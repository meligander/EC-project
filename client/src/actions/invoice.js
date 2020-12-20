import axios from "axios";
import moment from "moment";
import { saveAs } from "file-saver";

import { setAlert } from "./alert";
import { clearRegisters } from "./register";
import { updateLoadingSpinner, updateAdminDashLoading } from "./mixvalues";

import {
   INVOICES_LOADED,
   INVOICE_LOADED,
   INVOICE_REGISTERED,
   INVOICE_ERROR,
   INVOICE_DELETED,
   INVOICE_CLEARED,
   INVOICES_CLEARED,
} from "./types";

export const loadInvoices = (filterData) => async (dispatch) => {
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
      const res = await axios.get(`/api/invoice?${filter}`);
      dispatch({
         type: INVOICES_LOADED,
         payload: res.data,
      });
   } catch (err) {
      dispatch({
         type: INVOICE_ERROR,
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

export const loadInvoice = (invoice_id) => async (dispatch) => {
   try {
      const res = await axios.get(`/api/invoice/${invoice_id}`);

      dispatch({
         type: INVOICE_LOADED,
         payload: res.data,
      });
   } catch (err) {
      dispatch({
         type: INVOICE_ERROR,
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

export const deleteInvoice = (invoice_id) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   try {
      await axios.delete(`/api/invoice/${invoice_id}`);

      dispatch({
         type: INVOICE_DELETED,
         payload: invoice_id,
      });

      dispatch(updateAdminDashLoading());
      dispatch(clearRegisters());
      dispatch(setAlert("Factura Eliminada", "success", "2"));
   } catch (err) {
      dispatch({
         type: INVOICE_ERROR,
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

export const registerInvoice = (
   formData,
   remaining,
   history,
   user_id
) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   let invoice = {};
   for (const prop in formData) {
      if (formData[prop]) invoice[prop] = formData[prop];
   }

   invoice = JSON.stringify(invoice);

   const config = {
      headers: {
         "Content-Type": "application/json",
      },
   };
   try {
      const res = await axios.post("/api/invoice", invoice, config);

      dispatch({
         type: INVOICE_REGISTERED,
         payload: res.data,
      });

      dispatch(invoicePDF(formData, remaining));

      dispatch(updateAdminDashLoading());
      dispatch(clearRegisters());

      dispatch(setAlert("Factura Registrada", "success", "1", 10000));
      history.push(`/dashboard/${user_id}`);
   } catch (err) {
      if (err.response.data.erros) {
         const errors = err.response.data.errors;
         errors.forEach((error) => {
            dispatch(setAlert(error.msg, "danger", "2"));
         });
         dispatch({
            type: INVOICE_ERROR,
            payload: errors,
         });
      } else {
         dispatch(setAlert(err.response.data.msg, "danger", "2", 10000));
         dispatch({
            type: INVOICE_ERROR,
            payload: {
               type: err.response.statusText,
               status: err.response.status,
               msg: err.response.data.msg,
            },
         });
      }
   }

   dispatch(updateLoadingSpinner(false));
   window.scrollTo(0, 0);
};

export const invoicesPDF = (invoices) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let invoice = JSON.stringify(invoices);

   try {
      const config = {
         headers: {
            "Content-Type": "application/json",
         },
      };

      await axios.post("/api/invoice/create-list", invoice, config);

      const pdf = await axios.get("/api/invoice/list/fetch-list", {
         responseType: "blob",
      });

      const pdfBlob = new Blob([pdf.data], { type: "application/pdf" });

      const date = moment().format("DD-MM-YY");

      saveAs(pdfBlob, `Ingresos ${date}.pdf`);

      dispatch(setAlert("PDF Generado", "success", "2"));
   } catch (err) {
      dispatch({
         type: INVOICE_ERROR,
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

export const invoicePDF = (invoice, remaining) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   let invoiceDetails = JSON.stringify({ invoice, remaining });

   const name =
      !invoice.lastname || invoice.lastname === ""
         ? `${invoice.user.lastname}, ${invoice.user.name}`
         : `${invoice.lastname}, ${invoice.name}`;

   try {
      const config = {
         headers: {
            "Content-Type": "application/json",
         },
      };

      await axios.post("/api/invoice/create-invoice", invoiceDetails, config);

      const pdf = await axios.get("/api/invoice/for-print/fetch-invoice", {
         responseType: "blob",
      });

      const pdfBlob = new Blob([pdf.data], { type: "application/pdf" });

      let date;
      if (invoice.date) {
         date = moment(invoice.date).format("DD-MM-YY");
      } else {
         date = moment().format("DD-MM-YY");
      }

      saveAs(pdfBlob, `Factura ${name}  ${date}.pdf`);

      dispatch(setAlert("PDF Generado", "success", "2"));
   } catch (err) {
      dispatch({
         type: INVOICE_ERROR,
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

export const clearInvoice = () => (dispatch) => {
   dispatch({ type: INVOICE_CLEARED });
};

export const clearInvoices = () => (dispatch) => {
   dispatch({ type: INVOICES_CLEARED });
};
