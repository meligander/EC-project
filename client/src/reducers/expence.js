import {
   TRANSACTIONS_LOADED,
   EXPENCETYPES_LOADED,
   EXPENCE_REGISTERED,
   EXPENCE_DELETED,
   EXPENCETYPES_UPDATED,
   EXPENCETYPE_DELETED,
   TRANSACTIONS_CLEARED,
   EXPENCE_CLEARED,
   EXPENCETYPES_CLEARED,
   EXPENCE_ERROR,
   EXPENCETYPE_ERROR,
   TRANSACTIONS_ERROR,
} from "../actions/types";

const initialState = {
   loadingExpence: true,
   expence: null,
   transactions: [],
   loading: true,
   expencetypes: [],
   loadingET: true,
   error: {},
};

export default function (state = initialState, action) {
   const { type, payload } = action;
   switch (type) {
      case TRANSACTIONS_LOADED:
         return {
            ...state,
            transactions: payload,
            loading: false,
            error: {},
         };
      case EXPENCETYPES_LOADED:
      case EXPENCETYPES_UPDATED:
         return {
            ...state,
            expencetypes: payload,
            loadingET: false,
            error: {},
         };
      case EXPENCE_REGISTERED:
         return state;
      case EXPENCE_DELETED:
         return {
            ...state,
            transactions: state.transactions.filter(
               (expence) => expence._id !== payload
            ),
            loadingTransactions: false,
         };
      case EXPENCETYPE_DELETED:
         return {
            ...state,
            expencetypes: state.expencetypes.filter(
               (expencetypes) => expencetypes._id !== payload
            ),
            loadingET: false,
         };
      case EXPENCE_CLEARED:
         return {
            ...state,
            loadingExpence: true,
            expence: null,
            error: {},
         };
      case TRANSACTIONS_CLEARED:
         return {
            ...state,
            transactions: [],
            loading: true,
         };
      case EXPENCETYPES_CLEARED:
         return {
            ...state,
            expencetypes: [],
            loadingET: true,
         };
      case EXPENCE_ERROR:
         return {
            ...state,
            expence: null,
            loadingExpence: false,
            error: payload,
         };
      case TRANSACTIONS_ERROR:
         return {
            ...state,
            transactions: [],
            loading: false,
            error: payload,
         };
      case EXPENCETYPE_ERROR:
         return {
            ...state,
            loadingET: false,
            expencetypes: [],
            error: payload,
         };
      default:
         return state;
   }
}
