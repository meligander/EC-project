import {
   ADMIN_DASH_LOADED,
   STUDENTNUMBER_LOADED,
   INVOICENUMBER_LOADED,
   INVOICENUMBER_CLEARED,
   LOADING_SPINNER_UPDATED,
   VALUES_CLEARED,
   VALUES_ERROR,
   SEARCH_PAGE_CHANGED,
   TOTAL_DEBT_LOADED,
   LOADING_ADMINDASH_UPDATED,
   STUDENTNUMBER_CLEARED,
} from "../actions/types";

const initialState = {
   loadingSpinner: false,
   loadingAdminDash: true,
   studentNumber: "",
   invoiceNumber: "",
   activeStudents: "",
   activeClasses: "",
   activeTeachers: "",
   enrollments: {
      year: "",
      length: "",
   },
   totalDebt: "",
   page: 0,
   error: {},
};

export default function (state = initialState, action) {
   const { type, payload } = action;
   switch (type) {
      case SEARCH_PAGE_CHANGED:
         return {
            ...state,
            page: payload,
         };
      case TOTAL_DEBT_LOADED:
         return {
            ...state,
            totalDebt: payload,
            loadingAdminDash: false,
         };
      case LOADING_SPINNER_UPDATED:
         return {
            ...state,
            loadingSpinner: payload,
         };
      case LOADING_ADMINDASH_UPDATED:
         return {
            ...state,
            loadingAdminDash: true,
         };
      case ADMIN_DASH_LOADED:
         return {
            ...state,
            activeStudents: payload.activeStudents,
            activeClasses: payload.activeClasses,
            activeTeachers: payload.activeTeachers,
            totalDebt: payload.totalDebt,
            enrollments: payload.enrollments,
            loadingAdminDash: false,
         };
      case STUDENTNUMBER_LOADED:
         return {
            ...state,
            studentNumber: payload,
         };
      case INVOICENUMBER_LOADED:
         return {
            ...state,
            invoiceNumber: payload,
         };
      case VALUES_ERROR:
         return {
            ...state,
            error: payload,
            activeStudents: "",
            activeClasses: "",
            activeTeachers: "",
            totalDebt: "",
            enrollments: "",
            loadingAdminDash: false,
         };
      case VALUES_CLEARED:
         return initialState;
      case INVOICENUMBER_CLEARED:
         return {
            ...state,
            invoiceNumber: "",
         };
      case STUDENTNUMBER_CLEARED:
         return {
            ...state,
            studentNumber: "",
         };
      default:
         return state;
   }
}
