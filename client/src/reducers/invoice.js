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
   DISCOUNT_ADDED,
   PAY_CASH,
   PAY_TRANSFER,
   DISCOUNT_REMOVED,
} from "../actions/types";

const month = new Date().getMonth() + 1;

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
         //Si se la intenta agregar dos veces, no deja
         if (
            state.invoice?.details.some(
               (item) => item.installment === payload._id
            )
         )
            return state;

         const detail = {
            ...payload,
            installment: payload._id,
            payment: "",
         };

         return {
            ...state,
            invoice: {
               ...(state.invoice
                  ? state.invoice
                  : { cashDiscount: false, extraDiscount: false }),
               details: state.invoice
                  ? [...state.invoice.details, detail]
                  : [detail],
            },
         };
      case INVOICEDETAIL_REMOVED:
         return {
            ...state,
            invoice: {
               ...state.invoice,
               details: state.invoice.details.filter(
                  (item) => item.installment !== payload
               ),
            },
         };
      case DISCOUNT_ADDED:
         return {
            ...state,
            invoice: {
               ...state.invoice,
               extraDiscount: true,
               details: state.invoice.details.map((item) => {
                  const discount =
                     item.number > month &&
                     item.status !== "expired" &&
                     item.value > 1000
                        ? Math.floor(
                             (item.value * 0.1 + Number.EPSILON) / 100
                          ) * 100
                        : 0;
                  const value = item.value - discount;

                  return {
                     ...item,
                     value,
                     payment: value,
                     extraDiscount: discount,
                     discount: (item.discount || 0) + discount,
                  };
               }),
            },
         };
      case DISCOUNT_REMOVED:
         return {
            ...state,
            invoice: {
               ...state.invoice,
               extraDiscount: false,
               details: state.invoice.details.map((item) => {
                  return {
                     ...item,
                     value: item.value + item.extraDiscount,
                     payment: "",
                     extraDiscount: null,
                     discount: Math.abs(
                        (item.discount || 0) - (item.extraDiscount || 0)
                     ),
                  };
               }),
            },
         };
      case PAY_CASH:
         return {
            ...state,
            invoice: {
               ...state.invoice,
               cashDiscount: true,
               details: state.invoice.details.map((item) => {
                  const discount =
                     item.number !== 0 && item.value > 1000
                        ? Math.floor(
                             (item.value * (payload / 100) + Number.EPSILON) /
                                100
                          ) * 100
                        : 0;
                  const value = item.value - discount;

                  return {
                     ...item,
                     value,
                     cashDiscount: discount,
                     discount: (item.discount || 0) + discount,
                     payment: state.invoice.extraDiscount ? value : "",
                  };
               }),
            },
         };
      case PAY_TRANSFER:
         return {
            ...state,
            invoice: {
               ...state.invoice,
               cashDiscount: false,
               details: state.invoice.details.map((item) => {
                  const value = item.value + item.cashDiscount;
                  return {
                     ...item,
                     value,
                     cashDiscount: null,
                     discount: Math.abs(
                        (item.discount || 0) - (item.cashDiscount || 0)
                     ),
                     payment: state.invoice.extraDiscount ? value : "",
                  };
               }),
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
            //invoice: null,
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
