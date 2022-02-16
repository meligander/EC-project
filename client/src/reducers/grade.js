import {
   GRADES_LOADED,
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
   grades: null,
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
               (gradeType) => gradeType._id !== payload
            ),
            loadingGT: false,
         };
      case GRADES_CLEARED:
         return {
            ...state,
            grades: null,
            loading: true,
         };
      case GRADETYPES_CLEARED:
         return { ...state, gradeTypes: [], loadingGT: true };
      case GRADES_ERROR:
         return {
            ...state,
            loading: false,
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
