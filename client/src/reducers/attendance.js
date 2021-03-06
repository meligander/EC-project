import {
   STUDENTATTENDANCES_LOADED,
   ATTENDANCES_LOADED,
   ATTENDANCES_UPDATED,
   NEWDATE_REGISTERED,
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
   studentAttendances: [],
   loadingStudentAttendances: true,
   error: {},
};

export default function (state = initialState, action) {
   const { type, payload } = action;
   switch (type) {
      case ATTENDANCES_LOADED:
      case NEWDATE_REGISTERED:
      case DATES_DELETED:
         return {
            ...state,
            loading: false,
            attendances: payload,
            error: {},
         };

      case STUDENTATTENDANCES_LOADED:
         return {
            ...state,
            loadingStudentAttendances: false,
            studentAttendances: payload,
            error: {},
         };
      case ATTENDANCES_UPDATED:
         return state;
      case ATTENDANCES_CLEARED:
         return initialState;
      case ATTENDANCES_ERROR:
         return {
            ...state,
            loadingStudentAttendances: false,
            studentAttendances: [],
            error: payload,
         };
      default:
         return state;
   }
}
