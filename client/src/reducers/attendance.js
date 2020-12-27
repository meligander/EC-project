import {
   STUDENT_ATTENDANCES_LOADED,
   ATTENDANCES_LOADED,
   ATTENDANCES_UPDATED,
   NEW_DATE_REGISTERED,
   DATES_DELETED,
   ATTENDANCES_CLEARED,
   ATTENDANCES_ERROR,
} from "../actions/types";

const initialState = {
   loading: true,
   attendances: {
      header: [],
      students: [],
      period: [],
   },
   error: {},
};

export default function (state = initialState, action) {
   const { type, payload } = action;
   switch (type) {
      case ATTENDANCES_LOADED:
      case STUDENT_ATTENDANCES_LOADED:
      case NEW_DATE_REGISTERED:
      case DATES_DELETED:
         return {
            ...state,
            attendances: payload,
            loading: false,
            error: {},
         };
      case ATTENDANCES_UPDATED:
         return state;
      case ATTENDANCES_CLEARED:
         return initialState;
      case ATTENDANCES_ERROR:
         return {
            ...state,
            error: payload,
         };
      default:
         return state;
   }
}
