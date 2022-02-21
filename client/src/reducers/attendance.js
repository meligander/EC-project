import {
   ATTENDANCES_LOADED,
   ATTENDANCES_UPDATED,
   NEWDATE_REGISTERED,
   DATE_DELETED,
   ATTENDANCES_CLEARED,
   ATTENDANCES_ERROR,
   DATE_ERROR,
} from "../actions/types";

const initialState = {
   loading: true,
   attendances: [],
   error: {},
};

export default function (state = initialState, action) {
   const { type, payload } = action;
   switch (type) {
      case ATTENDANCES_LOADED:
      case NEWDATE_REGISTERED:
      case DATE_DELETED:
         return {
            ...state,
            loading: false,
            attendances: payload,
            error: {},
         };
      case ATTENDANCES_UPDATED:
         return state;
      case ATTENDANCES_CLEARED:
         return initialState;
      case ATTENDANCES_ERROR:
         return {
            ...state,
            loading: false,
            error: payload,
         };
      case DATE_ERROR:
         return {
            ...state,
            error: payload,
         };
      default:
         return state;
   }
}
