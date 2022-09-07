import {
   EXPENCES_LOADED,
   EXPENCETYPES_LOADED,
   EXPENCE_REGISTERED,
   EXPENCE_DELETED,
   EXPENCETYPES_UPDATED,
   EXPENCETYPE_DELETED,
   EXPENCES_CLEARED,
   EXPENCE_CLEARED,
   EXPENCETYPES_CLEARED,
   EXPENCE_ERROR,
   EXPENCETYPE_ERROR,
   EXPENCES_ERROR,
} from "../actions/types";

const initialState = {
   expence: null,
   loadingExpence: true,
   expences: [],
   loading: true,
   expencetypes: [],
   loadingET: true,
   error: {},
};

export default function (state = initialState, action) {
   const { type, payload } = action;
   switch (type) {
      case EXPENCES_LOADED:
         return {
            ...state,
            expences: payload,
            loading: false,
            error: {},
         };
      case EXPENCETYPES_LOADED:
         return {
            ...state,
            expencetypes: payload,
            loadingET: false,
            error: {},
         };
      case EXPENCETYPES_UPDATED:
         return {
            ...state,
            loadingET: false,
            error: {},
         };
      case EXPENCE_REGISTERED:
         return state;
      case EXPENCE_DELETED:
         return {
            ...state,
            expences: state.expences.filter(
               (expence) => expence._id !== payload
            ),
            loading: false,
         };
      case EXPENCETYPE_DELETED:
         return {
            ...state,
            expencetypes: state.expencetypes.filter(
               (item) => item._id !== payload
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
      case EXPENCES_CLEARED:
         return {
            ...state,
            expences: [],
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
      case EXPENCES_ERROR:
         return {
            ...state,
            expences: [],
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
