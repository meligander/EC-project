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
         let value;
         if (
            state.invoice &&
            state.invoice.studentsD &&
            state.invoice.studentsD.some((item) => item === payload.student._id)
         )
            value =
               payload.number > 2 &&
               payload.status !== "expired" &&
               payload.number > month
                  ? payload.value - (payload.value * 10) / 100
                  : payload.status === "expired"
                  ? Math.round(
                       (payload.value * 0.90909 + Number.EPSILON) * 100
                    ) / 100
                  : payload.value;

         const detail = {
            ...payload,
            _id: "",
            installment: payload._id,
            payment: "",
            ...(value && {
               value,
               discount: payload.value - value,
               payment: value,
            }),
         };

         return {
            ...state,
            invoice: {
               ...(state.invoice && state.invoice),
               details: state.invoice
                  ? [...state.invoice.details, detail]
                  : [detail],
            },
         };
      case INVOICEDETAIL_REMOVED:
         return {
            ...state,
            invoice: {
               ...(state.invoice && state.invoice),
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
               studentsD: state.invoice.studentsD
                  ? [...state.invoice.studentsD, payload]
                  : [payload],
               details: state.invoice.details.map((item) => {
                  const value =
                     item.number > 2 &&
                     item.status !== "expired" &&
                     item.number > month
                        ? item.value - (item.value * 10) / 100
                        : item.status === "expired"
                        ? Math.round(
                             (item.value * 0.90909 + Number.EPSILON) * 100
                          ) / 100
                        : item.value;

                  return item.student._id === payload
                     ? {
                          ...item,
                          value,
                          payment: value,
                          discount: item.number > 2 ? item.value - value : 0,
                       }
                     : item;
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
