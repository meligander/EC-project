import {
   INSTALLMENTS_LOADED,
   INSTALLMENT_LOADED,
   INSTALLMENTS_ERROR,
   INSTALLMENT_UPDATED,
   INSTALLMENT_REGISTERED,
   INSTALLMENTS_CLEARED,
   USER_INSTALLMENTS_CLEARED,
   INSTALLMENT_CLEARED,
   INSTALLMENT_DELETED,
   INSTALLMENTS_UPDATED,
   USERS_INSTALLMENTS_LOADED,
   INVOICE_DETAIL_ADDED,
   INVOICE_DETAIL_REMOVED,
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
      case USERS_INSTALLMENTS_LOADED:
         return {
            ...state,
            usersInstallments: payload,
            loadingUsersInstallments: false,
         };
      case INSTALLMENTS_LOADED:
         return {
            ...state,
            installments: payload,
            loadingInstallments: false,
            error: {},
         };
      case INSTALLMENT_LOADED:
         return {
            ...state,
            installment: payload,
            loading: false,
            error: {},
         };
      case INSTALLMENT_UPDATED:
         return {
            ...state,
            loadingUsersInstallments: false,
            usersInstallments: {
               ...state.usersInstallments,
               rows: state.usersInstallments.rows.map((row) =>
                  row.map((installment) =>
                     installment._id === payload._id ? payload : installment
                  )
               ),
            },
         };
      case INSTALLMENT_REGISTERED:
         return {
            ...state,
            loadingUsersInstallments: false,
            usersInstallments: payload,
         };
      case INSTALLMENT_DELETED:
         return {
            ...state,
            loadingUsersInstallments: false,
            usersInstallments: {
               ...state.usersInstallments,
               rows: state.usersInstallments.rows.map((row) =>
                  row.map((installment) =>
                     installment._id === payload
                        ? { _id: "", expired: false, value: "" }
                        : installment
                  )
               ),
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
      case INSTALLMENT_CLEARED:
         return {
            ...state,
            installment: null,
            loading: true,
         };
      case USER_INSTALLMENTS_CLEARED:
         return {
            ...state,
            usersInstallments: {
               years: [],
               rows: [],
            },
            loadingUsersInstallments: true,
         };
      case INSTALLMENTS_UPDATED:
         return state;
      case INSTALLMENTS_CLEARED:
         return initialState;
      default:
         return state;
   }
}
