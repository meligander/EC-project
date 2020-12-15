import {
   USER_GRADES_LOADED,
   GRADES_LOADED,
   GRADES_ERROR,
   GRADES_CLEARED,
   GRADES_DELETED,
   NEW_GRADE_REGISTERED,
   GRADETYPES_LOADED,
   GRADES_UPDATED,
   GRADETYPE_ERROR,
   GRADETYPES_UPDATED,
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
      case USER_GRADES_LOADED:
         return {
            ...state,
            usersGrades: payload,
            loadingUsersGrades: false,
         };
      case GRADES_UPDATED:
         return state;
      case GRADES_DELETED:
      case NEW_GRADE_REGISTERED:
      case GRADES_LOADED:
         return {
            ...state,
            grades: payload,
            loading: false,
            error: {},
         };
      case GRADETYPES_UPDATED:
      case GRADETYPES_LOADED:
         return {
            ...state,
            gradeTypes: payload,
            loadingGT: false,
         };
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
            gradeTypes: [],
            loadingGT: false,
            error: payload,
         };
      case GRADES_CLEARED:
         return initialState;
      default:
         return state;
   }
}
