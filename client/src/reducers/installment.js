import {
   INSTALLMENT_LOADED,
   INSTALLMENTS_LOADED,
   STUDENTINSTALLMENTS_LOADED,
   TOTALDEBT_LOADED,
   INSTALLMENT_UPDATED,
   INSTALLMENT_REGISTERED,
   INSTALLMENT_DELETED,
   INVOICEDETAIL_ADDED,
   INVOICEDETAIL_REMOVED,
   EXPIREDINSTALLMENTS_UPDATED,
   INSTALLMENT_CLEARED,
   INSTALLMENTS_CLEARED,
   STUDENTINSTALLMENTS_CLEARED,
   TOTALDEBT_CLEARED,
   INSTALLMENTS_ERROR,
} from "../actions/types";

const initialState = {
   loading: true,
   installments: [],
   usersInstallments: {
      years: [],
      rows: [],
   },
   loadingUsersInstallments: true,
   installment: null,
   loadingInstallments: true,
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
            loading: false,
            error: {},
         };
      case INSTALLMENTS_LOADED:
         return {
            ...state,
            installments: payload,
            loadingInstallments: false,
            error: {},
         };
      case STUDENTINSTALLMENTS_LOADED:
         return {
            ...state,
            usersInstallments: payload,
            loadingUsersInstallments: false,
         };
      case TOTALDEBT_LOADED:
         return {
            ...state,
            otherValues: {
               totalDebt: payload,
            },
         };
      case INVOICEDETAIL_ADDED:
         return {
            ...state,
            installments: [...state.installments, payload],
            loadingInstallments: false,
         };
      case INVOICEDETAIL_REMOVED:
         return {
            ...state,
            installments: state.installments.filter(
               (installment) => installment._id !== payload
            ),
            loadingInstallments: false,
         };
      case INSTALLMENT_UPDATED:
      case INSTALLMENT_REGISTERED:
      case INSTALLMENT_DELETED:
      case EXPIREDINSTALLMENTS_UPDATED:
         return state;
      case INSTALLMENT_CLEARED:
         return {
            ...state,
            installment: null,
            loading: true,
         };
      case INSTALLMENTS_CLEARED:
         return initialState;
      case STUDENTINSTALLMENTS_CLEARED:
         return {
            ...state,
            usersInstallments: {
               years: [],
               rows: [],
            },
            loadingUsersInstallments: true,
         };
      case TOTALDEBT_CLEARED:
         return {
            ...state,
            otherValues: {
               totalDebt: "",
            },
         };
      case INSTALLMENTS_ERROR:
         return {
            ...state,
            installment: null,
            installments: [],
            usersInstallments: {
               years: [],
               rows: [],
            },
            loading: false,
            loadingInstallments: false,
            loadingUsersInstallments: false,
            error: payload,
         };
      default:
         return state;
   }
}
