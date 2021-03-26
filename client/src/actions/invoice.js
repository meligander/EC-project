import api from "../utils/api";
import moment from "moment";
import { saveAs } from "file-saver";

import { setAlert } from "./alert";
import { clearRegisters } from "./register";
import { clearTotalDebt } from "./installment";
import { updateLoadingSpinner } from "./mixvalues";
import { clearProfile } from "./user";

import {
   INVOICE_LOADED,
   INVOICES_LOADED,
   INVOICENUMBER_LOADED,
   INVOICE_REGISTERED,
   INVOICE_DELETED,
   INVOICE_CLEARED,
   INVOICES_CLEARED,
   INVOICE_ERROR,
   INVOICENUMBER_CLEARED,
} from "./types";

export const loadInvoice = (invoice_id) => async (dispatch) => {
   try {
      const res = await api.get(`/invoice/${invoice_id}`);

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
   }
};

export const getInvoiceNumber = () => async (dispatch) => {
   try {
      let res = await api.get("/invoice/last/invoiceid");

      dispatch({
         type: INVOICENUMBER_LOADED,
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
      window.scroll(0, 0);
   }
};

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
      const res = await api.get(`/invoice?${filter}`);
      dispatch({
         type: INVOICES_LOADED,
         payload: res.data,
      });
   } catch (err) {
      const msg = err.response.data.msg;
      const type = err.response.statusText;
      dispatch({
         type: INVOICE_ERROR,
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

export const registerInvoice = (
   formData,
   remaining,
   history,
   user_id
) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   let invoice = {};
   for (const prop in formData) {
      if (formData[prop] !== "" && formData[prop] !== 0) {
         invoice[prop] = formData[prop];
      }
   }

   try {
      await api.post("/invoice", invoice);

      dispatch({
         type: INVOICE_REGISTERED,
      });

      dispatch(invoicePDF(formData, remaining));

      dispatch(clearTotalDebt());
      dispatch(clearRegisters());

      dispatch(setAlert("Factura Registrada", "success", "1", 7000));
      dispatch(clearProfile());
      history.push(`/dashboard/${user_id}`);
   } catch (err) {
      if (err.response.data.errors) {
         const errors = err.response.data.errors;
         errors.forEach((error) => {
            dispatch(setAlert(error.msg, "danger", "2"));
         });
         dispatch({
            type: INVOICE_ERROR,
            payload: errors,
         });
      } else {
         const msg = err.response.data.msg;
         const type = err.response.statusText;
         dispatch({
            type: INVOICE_ERROR,
            payload: {
               type,
               status: err.response.status,
               msg,
            },
         });
         dispatch(setAlert(msg ? msg : type, "danger", "2"));
      }
   }

   dispatch(updateLoadingSpinner(false));
   window.scrollTo(0, 0);
};

export const deleteInvoice = (invoice_id) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   try {
      await api.delete(`/invoice/${invoice_id}`);

      dispatch({
         type: INVOICE_DELETED,
         payload: invoice_id,
      });

      dispatch(clearTotalDebt());
      dispatch(clearRegisters());

      dispatch(setAlert("Factura Eliminada", "success", "2"));
   } catch (err) {
      const msg = err.response.data.msg;
      const type = err.response.statusText;
      dispatch({
         type: INVOICE_ERROR,
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

export const invoicesPDF = (invoices) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   try {
      await api.post("/invoice/create-list", invoices);

      const pdf = await api.get("/invoice/list/fetch-list", {
         responseType: "blob",
      });

      const pdfBlob = new Blob([pdf.data], { type: "application/pdf" });

      const date = moment().format("DD-MM-YY");

      saveAs(pdfBlob, `Ingresos ${date}.pdf`);

      dispatch(setAlert("PDF Generado", "success", "2"));
   } catch (err) {
      const msg = err.response.data.msg;
      const type = err.response.statusText;
      dispatch({
         type: INVOICE_ERROR,
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

export const invoicePDF = (formData, remaining) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   let invoice = {};
   for (const prop in formData) {
      if (formData[prop] !== "" && formData[prop] !== 0) {
         invoice[prop] = formData[prop];
      }
   }

   let name = "";
   switch (invoice.user) {
      case null:
         name = "Usuario Eliminado";
         break;
      case undefined:
         if (invoice.lastname) {
            name = invoice.lastname + ", " + invoice.name;
         } else {
            name = "Usuario no definido";
         }
         break;
      default:
         name = invoice.user.lastname + ", " + invoice.user.name;
         break;
   }

   try {
      await api.post("/invoice/create-invoice", { invoice, remaining });

      const pdf = await api.get("/invoice/for-print/fetch-invoice", {
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

      dispatch(setAlert("PDF Generado", "success", "1"));
   } catch (err) {
      const msg = err.response.data.msg;
      const type = err.response.statusText;
      dispatch({
         type: INVOICE_ERROR,
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

export const clearInvoice = () => (dispatch) => {
   dispatch({ type: INVOICE_CLEARED });
};

export const clearInvoiceNumber = () => (dispatch) => {
   dispatch({ type: INVOICENUMBER_CLEARED });
};

export const clearInvoices = () => (dispatch) => {
   dispatch({ type: INVOICES_CLEARED });
};
