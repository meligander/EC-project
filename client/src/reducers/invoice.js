import {
   INVOICES_LOADED,
   INVOICE_ERROR,
   INVOICE_LOADED,
   INVOICE_REGISTERED,
   INVOICE_DELETED,
} from "../actions/types";

const initialState = {
   loading: true,
   invoices: [],
   invoice: null,
   loadingInvoices: true,
   error: {},
};

export default function (state = initialState, action) {
   const { type, payload } = action;
   switch (type) {
      case INVOICES_LOADED:
         return {
            ...state,
            invoices: payload,
            loadingInvoices: false,
            error: {},
         };
      case INVOICE_DELETED:
         return {
            ...state,
            invoices: state.invoices.filter(
               (invoice) => invoice._id !== payload
            ),
         };
      case INVOICE_REGISTERED:
         return {
            ...state,
            invoices:
               state.invoices.lenght > 0 ? [payload, ...state.invoices] : [],
            loadingInvoices: state.invoices.length > 0 ? false : true,
         };
      case INVOICE_LOADED:
         return {
            ...state,
            invoice: payload,
            loading: false,
            error: {},
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
