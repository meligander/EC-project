import {
   INVOICE_LOADED,
   INVOICES_LOADED,
   INVOICENUMBER_LOADED,
   INVOICE_REGISTERED,
   INVOICE_DELETED,
   INVOICE_CLEARED,
   INVOICES_CLEARED,
   INVOICENUMBER_CLEARED,
   INVOICE_ERROR,
} from "../actions/types";

const initialState = {
   loading: true,
   invoices: [],
   invoice: null,
   loadingInvoices: true,
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
            loading: false,
            error: {},
         };
      case INVOICES_LOADED:
         return {
            ...state,
            invoices: payload,
            loadingInvoices: false,
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
      case INVOICE_DELETED:
         return {
            ...state,
            invoices: state.invoices.filter(
               (invoice) => invoice._id !== payload
            ),
         };
      case INVOICES_CLEARED:
         return initialState;
      case INVOICE_CLEARED:
         return {
            ...state,
            loading: true,
            invoice: null,
         };
      case INVOICENUMBER_CLEARED:
         return {
            ...state,
            otherValues: {
               invoiceNumber: "",
            },
         };
      case INVOICE_ERROR:
         return {
            ...state,
            invoices: [],
            invoice: null,
            loading: false,
            loadingInvoices: false,
            error: payload,
         };
      default:
         return state;
   }
}
