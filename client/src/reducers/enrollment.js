import {
   ENROLLMENT_LOADED,
   ENROLLMENTS_LOADED,
   YEARENROLLMENTS_LOADED,
   ENROLLMENT_REGISTERED,
   ENROLLMENT_UPDATED,
   ENROLLMENT_DELETED,
   ENROLLMENT_CLEARED,
   ENROLLMENTS_CLEARED,
   YEARENROLLMENTS_CLEARED,
   ENROLLMENT_ERROR,
} from "../actions/types";

const initialState = {
   loading: true,
   enrollments: [],
   type: "",
   enrollment: null,
   loadingEnrollments: true,
   otherValues: {
      yearEnrollments: {
         year: "",
         length: "",
      },
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
            loading: false,
            error: {},
         };
      case ENROLLMENTS_LOADED:
         return {
            ...state,
            enrollments: payload.enrollments,
            type: payload.type,
            loadingEnrollments: false,
            error: {},
         };
      case YEARENROLLMENTS_LOADED:
         return {
            ...state,
            otherValues: {
               yearEnrollments: payload,
            },
         };
      case ENROLLMENT_REGISTERED:
         return state;
      case ENROLLMENT_UPDATED:
         return {
            ...state,
            enrollments: state.enrollments.map((enrollment) =>
               enrollment._id === payload._id ? payload : enrollment
            ),
            loadingEnrollments: false,
         };
      case ENROLLMENT_DELETED:
         return {
            ...state,
            enrollments: state.enrollments.filter(
               (enrollment) => enrollment._id !== payload
            ),
            loadingEnrollments: false,
         };
      case ENROLLMENT_CLEARED:
         return {
            ...state,
            enrollment: null,
            loading: true,
         };
      case ENROLLMENTS_CLEARED:
         return initialState;
      case YEARENROLLMENTS_CLEARED:
         return {
            ...state,
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
            enrollments: [],
            loadingEnrollments: false,
            error: payload,
         };
      default:
         return state;
   }
}
