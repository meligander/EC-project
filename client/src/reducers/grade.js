import {
   GRADES_LOADED,
   USER_GRADES_LOADED,
   GRADETYPES_LOADED,
   GRADES_UPDATED,
   NEW_GRADE_REGISTERED,
   GRADES_DELETED,
   GRADETYPES_UPDATED,
   GRADETYPE_DELETED,
   GRADES_CLEARED,
   GRADETYPES_CLEARED,
   GRADES_ERROR,
   GRADETYPE_ERROR,
} from "../actions/types";

const initialState = {
   loading: true,
   grades: {
      header: [],
      students: [],
      period: [],
   },
   usersGrades: {
      headers: [],
      rows: [],
   },
   loadingUsersGrades: true,
   gradeTypes: [],
   loadingGT: true,
   error: {},
};

export default function (state = initialState, action) {
   const { type, payload } = action;
   switch (type) {
      case GRADES_DELETED:
      case NEW_GRADE_REGISTERED:
      case GRADES_LOADED:
         return {
            ...state,
            grades: payload,
            loading: false,
            error: {},
         };
      case USER_GRADES_LOADED:
         return {
            ...state,
            usersGrades: payload,
            loadingUsersGrades: false,
         };
      case GRADETYPES_LOADED:
      case GRADETYPES_UPDATED:
         return {
            ...state,
            gradeTypes: payload,
            loadingGT: false,
         };

      case GRADES_UPDATED:
         return state;
      case GRADETYPE_DELETED:
         return {
            ...state,
            gradeTypes: state.gradeTypes.map(
               (gradeType) => gradeType._id !== payload
            ),
            loadingGT: false,
         };
      case GRADES_CLEARED:
         return initialState;
      case GRADETYPES_CLEARED:
         return { ...state, gradeTypes: [], loadingGT: true };
      case GRADES_ERROR:
         return {
            ...state,
            grades: [],
            loading: false,
            usersGrades: {
               headers: [],
               rows: [],
            },
            loadingUsersGrades: false,
            error: payload,
         };
      case GRADETYPE_ERROR:
         return {
            ...state,
            loadingGT: false,
            error: payload,
         };
      default:
         return state;
   }
}
