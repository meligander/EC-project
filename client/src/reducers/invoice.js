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
} from "../actions/types";

const initialState = {
   invoice: null,
   loadingInvoice: true,
   invoices: [],
   loading: true,
   otherValues: {
      invoiceNumber: "",
   },
   error: {},
};

export default function (state = initialState, action) {
   const { type, payload } = action;
   switch (type) {
      case INVOICE_LOADED:
         return {
            ...state,
            invoice: payload,
            loadingInvoice: false,
            error: {},
         };
      case INVOICES_LOADED:
         return {
            ...state,
            invoices: payload,
            loading: false,
            error: {},
         };
      case INVOICENUMBER_LOADED:
         return {
            ...state,
            otherValues: {
               invoiceNumber: payload,
            },
         };
      case INVOICE_REGISTERED:
         return state;
      case INVOICEDETAIL_ADDED:
         const detail = {
            ...payload,
            _id: "",
            installment: payload._id,
            payment: "",
         };
         return {
            ...state,
            invoice: {
               details: state.invoice
                  ? [...state.invoice.details, detail]
                  : [detail],
            },
         };
      case INVOICEDETAIL_REMOVED:
         return {
            ...state,
            invoice: {
               details: state.invoice.details.filter(
                  (item) => item.installment !== payload
               ),
            },
         };
      case INVOICE_DELETED:
         return {
            ...state,
            invoices: state.invoices.filter(
               (invoice) => invoice._id !== payload
            ),
         };

      case INVOICE_CLEARED:
         return {
            ...state,
            loadingInvoice: true,
            invoice: null,
            error: {},
         };
      case INVOICES_CLEARED:
         return {
            ...state,
            invoices: [],
            loading: true,
            otherValues: {
               invoiceNumber: "",
            },
            error: {},
         };
      case INVOICE_ERROR:
         return {
            ...state,
            invoice: null,
            loadingInvoice: false,
            error: payload,
         };
      case INVOICES_ERROR:
         return {
            ...state,
            invoices: [],
            loading: false,
            otherValues: {
               invoiceNumber: "",
            },
            error: payload,
         };
      default:
         return state;
   }
}
