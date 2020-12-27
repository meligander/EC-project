import {
   TRANSACTIONS_LOADED,
   EXPENCETYPES_LOADED,
   EXPENCE_REGISTERED,
   EXPENCE_DELETED,
   EXPENCETYPES_UPDATED,
   EXPENCETYPE_DELETED,
   TRANSACTIONS_CLEARED,
   EXPENCES_CLEARED,
   EXPENCETYPES_CLEARED,
   EXPENCE_ERROR,
   EXPENCETYPE_ERROR,
} from "../actions/types";

const initialState = {
   loading: true,
   expence: null,
   transactions: [],
   loadingTransactions: true,
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
            loadingTransactions: false,
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
            transactions: state.transactions.map(
               (expence) => expence._id !== payload
            ),
            loadingTransactions: false,
         };
      case EXPENCETYPE_DELETED:
         return {
            ...state,
            expencetypes: state.expencetypes.map(
               (expencetypes) => expencetypes._id !== payload
            ),
            loadingET: false,
         };
      case EXPENCES_CLEARED:
         return {
            ...state,
            loading: true,
            expence: null,
            transactions: [],
            loadingTransactions: true,
            error: {},
         };
      case TRANSACTIONS_CLEARED:
         return {
            ...state,
            transactions: [],
            loadingTransactions: [],
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
            transactions: [],
            loading: false,
            loadingTransactions: false,
            error: payload,
         };
      case EXPENCETYPE_ERROR:
         return {
            ...state,
            loadingET: false,
            error: payload,
         };
      default:
         return state;
   }
}
