import {
   ENROLLMENTS_LOADED,
   ENROLLMENT_REGISTERED,
   ENROLLMENT_LOADED,
   ENROLLMENT_ERROR,
   ENROLLMENT_DELETED,
   ENROLLMENT_CLEARED,
   ENROLLMENT_UPDATED,
} from "../actions/types";

const initialState = {
   loading: true,
   enrollments: [],
   type: "",
   enrollment: null,
   loadingEnrollments: true,
   error: {},
};

export default function (state = initialState, action) {
   const { type, payload } = action;
   switch (type) {
      case ENROLLMENTS_LOADED:
         return {
            ...state,
            enrollments: payload.enrollments,
            type: payload.type,
            loadingEnrollments: false,
            error: {},
         };
      case ENROLLMENT_REGISTERED:
      case ENROLLMENT_LOADED:
         return {
            ...state,
            enrollment: payload,
            loading: false,
            error: {},
         };
      case ENROLLMENT_DELETED:
         return {
            ...state,
            enrollments: state.enrollments.filter(
               (enrollment) => enrollment._id !== payload
            ),
            loadingEnrollments: false,
         };
      case ENROLLMENT_UPDATED:
         return {
            ...state,
            enrollments: state.enrollments.map((enrollment) =>
               enrollment._id === payload._id ? payload : enrollment
            ),
            loadingEnrollments: false,
         };
      case ENROLLMENT_ERROR:
         return {
            ...state,
            enrollments: [],
            enrollment: null,
            loading: false,
            loadingEnrollments: false,
            error: payload,
         };
      case ENROLLMENT_CLEARED:
         return {
            ...state,
            enrollment: null,
            loading: true,
         };
      default:
         return state;
   }
}
