import api from "../utils/api";
import format from "date-fns/format";
import { saveAs } from "file-saver";
import history from "../utils/history";

import { setAlert } from "./alert";
import { clearRegister } from "./register";
import { getTotalDebt } from "./installment";
import {
   filterData,
   newObject,
   updateLoadingSpinner,
   setError,
} from "./global";

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
   INSTALLMENT_DELETED,
   INSTALLMENT_ADDED,
   DISCOUNT_ADDED,
   PAY_CASH,
   PAY_TRANSFER,
   DISCOUNT_REMOVED,
} from "./types";

export const loadInvoice = (invoice_id, spinner) => async (dispatch) => {
   if (spinner) dispatch(updateLoadingSpinner(true));
   try {
      const res = await api.get(`/invoice/${invoice_id}`);

      dispatch({
         type: INVOICE_LOADED,
         payload: res.data,
      });
   } catch (err) {
      if (err.response.status !== 401)
         dispatch(setError(INVOICE_ERROR, err.response));
   }
   if (spinner) dispatch(updateLoadingSpinner(false));
};

export const getInvoiceNumber = () => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   try {
      let res = await api.get("/invoice/last/invoiceid");

      dispatch({
         type: INVOICENUMBER_LOADED,
         payload: res.data,
      });
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setError(INVOICES_ERROR, err.response));
         window.scroll(0, 0);
      }
   }
   dispatch(updateLoadingSpinner(false));
};

export const loadInvoices = (formData, spinner) => async (dispatch) => {
   if (spinner) dispatch(updateLoadingSpinner(true));
   let error = false;

   try {
      const res = await api.get(`/invoice?${filterData(formData)}`);
      dispatch({
         type: INVOICES_LOADED,
         payload: res.data,
      });
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setError(INVOICES_ERROR, err.response));
         if (spinner) dispatch(setAlert(err.response.data.msg, "danger", "2"));
         window.scroll(0, 0);
      } else error = true;
   }

   if (!error && spinner) dispatch(updateLoadingSpinner(false));
};

export const registerInvoice = (formData) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

   const invoice = newObject(formData);

   try {
      const res = await api.post("/invoice", invoice);

      dispatch({
         type: INVOICE_REGISTERED,
      });

      await dispatch(invoicesPDF(res.data, "invoice"));

      dispatch(getTotalDebt());
      dispatch(clearRegister());

      dispatch(setAlert("Factura Registrada", "success", "1"));
      history.push("/index/dashboard/0");
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setError(INVOICE_ERROR, err.response));

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
      dispatch(clearRegister());

      dispatch(setAlert("Factura Eliminada", "success", "2"));
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setError(INVOICE_ERROR, err.response));
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
      } else error = true;
   }

   if (!error) {
      window.scroll(0, 0);
      dispatch(updateLoadingSpinner(false));
   }
};

export const invoicesPDF = (formData, type) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

   try {
      const pdf = await api.post(
         `/pdf/invoice${type === "list" ? "/list" : ""}`,
         formData,
         {
            responseType: "blob",
         }
      );

      const pdfBlob = new Blob([pdf.data], { type: "application/pdf" });

      const userData = formData.user.user_id ||
         formData.user || { lastname: "Usuario eliminado", name: "" };

      const fullName = [userData.lastname, userData.name]
         .filter(Boolean)
         .join(", ");

      const date =
         type === "list"
            ? format(new Date(), "dd-MM-yy")
            : format(new Date(formData.date), "dd-MM-yy");

      saveAs(
         pdfBlob,
         type === "list"
            ? `Ingresos ${date}.pdf`
            : `Factura ${fullName} ${date}.pdf`
      );

      dispatch(setAlert("PDF Generado", "success", "2"));
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setError(INVOICES_ERROR, err.response));
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
};

export const addDetail = (detail) => (dispatch) => {
   dispatch(setAlert("Cuota agregada correctamente", "success", "3"));
   dispatch({ type: INVOICEDETAIL_ADDED, payload: detail });
   dispatch({ type: INSTALLMENT_DELETED, payload: detail._id });
};

export const addDiscount = () => (dispatch) => {
   dispatch({ type: DISCOUNT_ADDED });
};

export const removeDiscount = (student) => (dispatch) => {
   dispatch({ type: DISCOUNT_REMOVED });
};

export const payCash = (discount) => (dispatch) => {
   dispatch({ type: PAY_CASH, payload: discount });
};

export const payTransfer = () => (dispatch) => {
   dispatch({ type: PAY_TRANSFER });
};

export const removeDetail = (item) => (dispatch) => {
   const installment = {
      ...item,
      _id: item.installment,
   };
   dispatch({ type: INVOICEDETAIL_REMOVED, payload: installment._id });
   dispatch({ type: INSTALLMENT_ADDED, payload: installment });
};
