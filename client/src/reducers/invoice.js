import {
   INVOICE_LOADED,
   INVOICES_LOADED,
   INVOICE_REGISTERED,
   INVOICE_DELETED,
   INVOICE_CLEARED,
   INVOICES_CLEARED,
   INVOICE_ERROR,
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
