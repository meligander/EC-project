import {
   INSTALLMENT_LOADED,
   INSTALLMENTS_LOADED,
   USER_INSTALLMENTS_LOADED,
   INSTALLMENT_UPDATED,
   INSTALLMENT_REGISTERED,
   INSTALLMENT_DELETED,
   INVOICE_DETAIL_ADDED,
   INVOICE_DETAIL_REMOVED,
   EXPIRED_INSTALLMENTS_UPDATED,
   INSTALLMENT_CLEARED,
   INSTALLMENTS_CLEARED,
   USER_INSTALLMENTS_CLEARED,
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
      case USER_INSTALLMENTS_LOADED:
         return {
            ...state,
            usersInstallments: payload,
            loadingUsersInstallments: false,
         };
      case INVOICE_DETAIL_ADDED:
         return {
            ...state,
            installments: [...state.installments, payload],
            loadingInstallments: false,
         };
      case INVOICE_DETAIL_REMOVED:
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
      case EXPIRED_INSTALLMENTS_UPDATED:
         return state;
      case INSTALLMENT_CLEARED:
         return {
            ...state,
            installment: null,
            loading: true,
         };
      case INSTALLMENTS_CLEARED:
         return initialState;
      case USER_INSTALLMENTS_CLEARED:
         return {
            ...state,
            usersInstallments: {
               years: [],
               rows: [],
            },
            loadingUsersInstallments: true,
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
