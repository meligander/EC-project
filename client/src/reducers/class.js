import {
   CLASS_LOADED,
   CLASSES_LOADED,
   CLASS_REGISTERED,
   CLASS_UPDATED,
   CLASS_DELETED,
   CLASSCATEGORY_UPDATED,
   CLASSSTUDENT_ADDED,
   CLASSSTUDENT_REMOVED,
   CLASS_CLEARED,
   CLASSES_CLEARED,
   CLASS_ERROR,
   CLASSSTUDENTS_LOADED,
   CLASSSTUDENTS_ERROR,
} from "../actions/types";

const initialState = {
   loading: true,
   classInfo: null,
   loadingClasses: true,
   classes: [],
   error: {},
};

export default function (state = initialState, action) {
   const { type, payload } = action;

   switch (type) {
      case CLASS_LOADED:
         return {
            ...state,
            classInfo: { ...payload, students: [] },
            loading: false,
            error: {},
         };
      case CLASSES_LOADED:
         return {
            ...state,
            classes: payload,
            loadingClasses: false,
            error: {},
         };
      case CLASSSTUDENTS_LOADED:
         return {
            ...state,
            classInfo: { ...state.classInfo, students: payload },
            loading: false,
            error: {},
         };
      case CLASS_REGISTERED:
         return {
            ...state,
            classes: state.classes.length > 0 && [...state.classes, payload],
            loadingClasses: false,
            error: {},
         };
      case CLASS_UPDATED:
         return {
            ...state,
            classes: state.classes.map((oneclass) =>
               oneclass._id === payload._id ? payload : oneclass
            ),
            loadingClasses: false,
            error: {},
         };
      case CLASS_DELETED:
         return {
            ...state,
            classes: state.classes.filter((item) => item !== payload),
            loadingClasses: false,
            error: {},
         };
      case CLASSCATEGORY_UPDATED:
         return {
            ...state,
            classInfo: { ...payload, students: [] },
            loading: false,
            error: {},
         };
      case CLASSSTUDENT_ADDED:
         return {
            ...state,
            classInfo: {
               ...state.classInfo,
               students: [...state.classInfo.students, payload],
            },
            loading: false,
            error: {},
         };
      case CLASSSTUDENT_REMOVED:
         return {
            ...state,
            classInfo: {
               ...state.classInfo,
               students: state.classInfo.students.filter(
                  (student) => student._id !== payload
               ),
            },
            error: {},
         };
      case CLASS_CLEARED:
         return {
            ...state,
            classInfo: null,
            loading: true,
            error: {},
         };
      case CLASSES_CLEARED:
         return initialState;
      case CLASS_ERROR:
         return {
            ...state,
            classInfo: null,
            classes: [],
            loading: false,
            loadingClasses: false,
            error: payload,
         };
      case CLASSSTUDENTS_ERROR:
         return {
            ...state,
            classInfo: {
               ...state.classInfo,
               students: [],
            },
            loading: false,
         };
      default:
         return state;
   }
}
