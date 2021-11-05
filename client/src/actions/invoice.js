import api from "../utils/api";
import moment from "moment";
import { saveAs } from "file-saver";
import history from "../utils/history";

import { setAlert } from "./alert";
import { clearRegisters } from "./register";
import { getTotalDebt } from "./installment";
import { updateLoadingSpinner, updatePageNumber } from "./mixvalues";

import {
   INVOICE_LOADED,
   INVOICES_LOADED,
   INVOICENUMBER_LOADED,
   INVOICE_REGISTERED,
   INVOICE_DELETED,
   INVOICE_CLEARED,
   INVOICES_CLEARED,
   INVOICE_ERROR,
   INVOICES_ERROR,
   INVOICEDETAIL_ADDED,
   INVOICEDETAIL_REMOVED,
} from "./types";

export const loadInvoice = (invoice_id) => async (dispatch) => {
   try {
      const res = await api.get(`/invoice/${invoice_id}`);

      dispatch({
         type: INVOICE_LOADED,
         payload: res.data,
      });
   } catch (err) {
      if (err.response.status !== 401)
         dispatch(setInvoicesError(INVOICE_ERROR, err.response));
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
      if (err.response.status !== 401) {
         dispatch(setInvoicesError(INVOICES_ERROR, err.response));
         window.scroll(0, 0);
      }
   }
};

export const loadInvoices = (filterData) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

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
      if (err.response.status !== 401) {
         dispatch(setInvoicesError(INVOICES_ERROR, err.response));
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
         window.scroll(0, 0);
      } else error = true;
   }

   if (!error) dispatch(updateLoadingSpinner(false));
};

export const registerInvoice = (formData) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

   let invoice = {};
   for (const prop in formData) {
      if (formData[prop] !== "" && formData[prop] !== 0) {
         invoice[prop] = formData[prop];
      }
   }

   try {
      const res = await api.post("/invoice", invoice);

      dispatch({
         type: INVOICE_REGISTERED,
      });

      await dispatch(invoicePDF(res.data));

      dispatch(getTotalDebt());
      dispatch(clearRegisters());

      dispatch(setAlert("Factura Registrada", "success", "1", 7000));
      history.push("/dashboard/0");
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setInvoicesError(INVOICE_ERROR, err.response));

         if (err.response.data.errors)
            err.response.data.errors.forEach((error) => {
               dispatch(setAlert(error.msg, "danger", "2"));
            });
         else dispatch(setAlert(err.response.data.msg, "danger", "2"));
      }
   }

   if (!error) {
      dispatch(updateLoadingSpinner(false));
      window.scrollTo(0, 0);
   }
};

export const deleteInvoice = (invoice_id) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

   try {
      await api.delete(`/invoice/${invoice_id}`);

      dispatch({
         type: INVOICE_DELETED,
         payload: invoice_id,
      });

      dispatch(getTotalDebt());
      dispatch(clearRegisters());

      dispatch(setAlert("Factura Eliminada", "success", "2"));
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setInvoicesError(INVOICE_ERROR, err.response));
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
      } else error = true;
   }

   if (!error) {
      window.scroll(0, 0);
      dispatch(updateLoadingSpinner(false));
   }
};

export const invoicesPDF = (invoices) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

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
      if (err.response.status !== 401) {
         dispatch(setInvoicesError(INVOICES_ERROR, err.response));
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
      } else error = true;
   }

   if (!error) {
      window.scroll(0, 0);
      dispatch(updateLoadingSpinner(false));
   }
};

export const invoicePDF = (formData) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

   let fileName = "";

   const { name, lastname, _id } = formData.user;

   if ((name && name !== "") || (lastname && lastname !== ""))
      fileName = lastname + ", " + name;
   else {
      if (_id === null) fileName = "Usuario Eliminado";
      else fileName = _id.lastname + ", " + _id.name;
   }

   try {
      await api.post("/invoice/create-invoice", formData);

      const pdf = await api.get("/invoice/for-print/fetch-invoice", {
         responseType: "blob",
      });

      const pdfBlob = new Blob([pdf.data], { type: "application/pdf" });

      const date = moment(formData.date).format("DD-MM-YY");

      saveAs(pdfBlob, `Factura ${fileName}  ${date}.pdf`);

      dispatch(setAlert("PDF Generado", "success", "1"));
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setInvoicesError(INVOICES_ERROR, err.response));
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
      } else error = true;
   }

   if (!error) {
      window.scroll(0, 0);
      dispatch(updateLoadingSpinner(false));
   }
};

export const clearInvoice = () => (dispatch) => {
   dispatch({ type: INVOICE_CLEARED });
};

export const clearInvoices = () => (dispatch) => {
   dispatch({ type: INVOICES_CLEARED });
   dispatch(updatePageNumber(0));
};

export const addDetail = (detail, details) => (dispatch) => {
   if (detail._id === 0)
      dispatch(setAlert("No se ha seleccionado ninguna cuota", "danger", "4"));
   else {
      if (
         !details ||
         (details && !details.some((item) => item._id === detail._id))
      ) {
         dispatch(setAlert("Cuota agregada correctamente", "success", "4"));
         dispatch({ type: INVOICEDETAIL_ADDED, payload: detail });
      } else {
         dispatch(setAlert("Ya se ha agregado dicha cuota", "danger", "4"));
      }
   }
};

export const removeDetail = (installment) => (dispatch) => {
   dispatch({ type: INVOICEDETAIL_REMOVED, payload: installment });
};

const setInvoicesError = (type, response) => (dispatch) => {
   dispatch({
      type: type,
      payload: response.data.errors
         ? response.data.errors
         : {
              type: response.statusText,
              status: response.status,
              msg: response.data.msg,
           },
   });
};
