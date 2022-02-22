import {
   INSTALLMENT_LOADED,
   INSTALLMENTS_LOADED,
   TOTALDEBT_LOADED,
   INSTALLMENT_UPDATED,
   INSTALLMENT_REGISTERED,
   INSTALLMENT_DELETED,
   EXPIREDINSTALLMENTS_UPDATED,
   INSTALLMENT_CLEARED,
   INSTALLMENTS_CLEARED,
   INSTALLMENTS_ERROR,
   INSTALLMENT_ERROR,
   INSTALLMENT_ADDED,
} from "../actions/types";

const initialState = {
   loading: true,
   installments: [],
   loadingInstallment: true,
   installment: null,
   otherValues: {
      totalDebt: "",
   },
   error: {},
};

export default function (state = initialState, action) {
   const { type, payload } = action;
   switch (type) {
      case INSTALLMENT_LOADED:
         return {
            ...state,
            installment: payload,
            loadingInstallment: false,
            error: {},
         };
      case INSTALLMENTS_LOADED:
         return {
            ...state,
            installments: payload,
            loading: false,
            error: {},
         };
      case TOTALDEBT_LOADED:
         return {
            ...state,
            otherValues: {
               ...state.otherValues,
               totalDebt: payload,
            },
         };
      case INSTALLMENT_REGISTERED:
      case INSTALLMENT_ADDED:
         return {
            ...state,
            installments: [payload, ...state.installments],
            loading: false,
            error: {},
         };
      case INSTALLMENT_UPDATED:
         return {
            ...state,
            installments: state.installments.map((item) =>
               item._id === payload._id ? payload : item
            ),
            loading: false,
            error: {},
         };
      case INSTALLMENT_DELETED:
         return {
            ...state,
            installments: state.installments.filter(
               (item) => item._id !== payload
            ),
            loading: false,
            error: {},
         };
      case EXPIREDINSTALLMENTS_UPDATED:
         return state;
      case INSTALLMENT_CLEARED:
         return {
            ...state,
            installment: null,
            loadingInstallment: true,
         };
      case INSTALLMENTS_CLEARED:
         return {
            ...state,
            installment: [],
            loading: true,
            otherValues: {
               totalDebt: "",
               estimatedProfit: "",
               monthlyDebt: "",
            },
         };
      case INSTALLMENTS_ERROR:
         return {
            ...state,
            installments: [],
            // loading: false,
            error: payload,
         };
      case INSTALLMENT_ERROR:
         return {
            ...state,
            installment: null,
            loadingInstallment: false,
            error: payload,
         };
      default:
         return state;
   }
}
