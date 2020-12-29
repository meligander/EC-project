import {
   GRADES_LOADED,
   STUDENTGRADES_LOADED,
   GRADETYPES_LOADED,
   GRADES_UPDATED,
   NEWGRADE_REGISTERED,
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
   studentGrades: {
      headers: [],
      rows: [],
   },
   loadingStudentGrades: true,
   gradeTypes: [],
   loadingGT: true,
   error: {},
};

export default function (state = initialState, action) {
   const { type, payload } = action;
   switch (type) {
      case GRADES_DELETED:
      case NEWGRADE_REGISTERED:
      case GRADES_LOADED:
         return {
            ...state,
            grades: payload,
            loading: false,
            error: {},
         };
      case STUDENTGRADES_LOADED:
         return {
            ...state,
            studentGrades: payload,
            loadingStudentGrades: false,
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
            gradeTypes: state.gradeTypes.filter(
               (gradeType) => gradeType[0]._id !== payload
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
            loading: false,
            studentGrades: {
               headers: [],
               rows: [],
            },
            loadingStudentGrades: false,
            error: payload,
         };
      case GRADETYPE_ERROR:
         return {
            ...state,
            loadingGT: false,
            gradeTypes: [],
            error: payload,
         };
      default:
         return state;
   }
}
