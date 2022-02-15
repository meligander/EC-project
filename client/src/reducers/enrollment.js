import {
   ENROLLMENT_LOADED,
   ENROLLMENTS_LOADED,
   YEARENROLLMENTS_LOADED,
   ESTIMATEDPROFIT_LOADED,
   ENROLLMENT_REGISTERED,
   ENROLLMENT_UPDATED,
   ENROLLMENT_DELETED,
   ENROLLMENT_CLEARED,
   ENROLLMENTS_CLEARED,
   ENROLLMENT_ERROR,
   ENROLLMENTS_ERROR,
} from "../actions/types";

const initialState = {
   loading: true,
   enrollments: [],
   enrollment: null,
   loadingEnrollment: true,
   otherValues: {
      yearEnrollments: {
         year: "",
         length: "",
      },
      estimatedProfit: "",
   },
   error: {},
};

export default function (state = initialState, action) {
   const { type, payload } = action;
   switch (type) {
      case ENROLLMENT_LOADED:
         return {
            ...state,
            enrollment: payload,
            loadingEnrollment: false,
            error: {},
         };
      case ENROLLMENTS_LOADED:
         return {
            ...state,
            enrollments: payload,
            loading: false,
            error: {},
         };
      case YEARENROLLMENTS_LOADED:
         return {
            ...state,
            otherValues: {
               ...state.otherValues,
               yearEnrollments: payload,
            },
         };
      case ESTIMATEDPROFIT_LOADED:
         return {
            ...state,
            otherValues: {
               ...state.otherValues,
               estimatedProfit: payload,
            },
         };
      case ENROLLMENT_REGISTERED:
         return {
            ...state,
            enrollments:
               state.enrollments.length > 0
                  ? [payload, ...state.enrollments]
                  : [payload],
            loading: false,
            error: {},
         };
      case ENROLLMENT_UPDATED:
         return {
            ...state,
            enrollments: state.enrollments.map((enrollment) =>
               enrollment._id === payload._id ? payload : enrollment
            ),
            loading: false,
         };
      case ENROLLMENT_DELETED:
         return {
            ...state,
            enrollments: state.enrollments.filter(
               (enrollment) => enrollment._id !== payload
            ),
            loading: false,
         };
      case ENROLLMENT_CLEARED:
         return {
            ...state,
            enrollment: null,
            loadingEnrollment: true,
         };
      case ENROLLMENTS_CLEARED:
         return {
            ...state,
            enrollments: [],
            loading: true,
            otherValues: {
               yearEnrollments: {
                  year: "",
                  length: "",
               },
            },
         };
      case ENROLLMENT_ERROR:
         return {
            ...state,
            enrollment: null,
            loadingEnrollment: false,
            error: payload,
         };
      case ENROLLMENTS_ERROR:
         return {
            ...state,
            enrollments: [],
            loading: false,
            error: payload,
            otherValues: {
               yearEnrollments: {
                  year: "",
                  length: "",
               },
            },
         };
      default:
         return state;
   }
}
