import {
   EXPENCES_LOADED,
   EXPENCETYPES_LOADED,
   EXPENCE_REGISTERED,
   EXPENCE_DELETED,
   EXPENCETYPES_UPDATED,
   EXPENCETYPE_DELETED,
   EXPENCES_CLEARED,
   EXPENCETYPES_CLEARED,
   EXPENCE_ERROR,
   EXPENCETYPE_ERROR,
} from "../actions/types";

const initialState = {
   loading: true,
   expences: [],
   expence: null,
   expencetypes: [],
   loadingET: true,
   loadingExpences: true,
   error: {},
};

export default function (state = initialState, action) {
   const { type, payload } = action;
   switch (type) {
      case EXPENCES_LOADED:
         return {
            ...state,
            expences: payload,
            loadingExpences: false,
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
            expences: state.expence.map((expence) => expence._id !== payload),
            loadingExpences: false,
         };
      case EXPENCETYPE_DELETED:
         return {
            ...state,
            expencetypes: state.expence.map(
               (expencetypes) => expencetypes._id !== payload
            ),
            loadingET: false,
         };
      case EXPENCES_CLEARED:
         return initialState;
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
            expences: [],
            loading: false,
            loadingExpences: false,
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
