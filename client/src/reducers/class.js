import {
   CLASS_LOADED,
   CLASSES_LOADED,
   ACTIVECLASSES_LOADED,
   CLASS_REGISTERED,
   CLASS_UPDATED,
   CLASS_DELETED,
   CLASSSTUDENT_ADDED,
   CLASSSTUDENT_REMOVED,
   CLASS_CLEARED,
   CLASSES_CLEARED,
   CLASS_ERROR,
   CLASSES_ERROR,
   CLASSCATEGORY_UPDATED,
   CLASSES_PDF_ERROR,
   TEACHERHOURS_LOADED,
} from "../actions/types";

const initialState = {
   classInfo: null,
   loadingClass: true,
   classes: [],
   loading: true,
   otherValues: {
      activeClasses: "",
      teacherHours: {},
   },
   error: {},
};

export default function (state = initialState, action) {
   const { type, payload } = action;

   switch (type) {
      case CLASS_LOADED:
         return {
            ...state,
            classInfo: payload,
            loadingClass: false,
            error: {},
         };
      case CLASSES_LOADED:
         return {
            ...state,
            classes: payload,
            loading: false,
            error: {},
         };
      case ACTIVECLASSES_LOADED:
         return {
            ...state,
            otherValues: {
               ...state.otherValues,
               activeClasses: payload,
            },
         };
      case TEACHERHOURS_LOADED:
         return {
            ...state,
            otherValues: {
               ...state.otherValues,
               teacherHours: payload,
            },
         };
      case CLASS_REGISTERED:
         return {
            ...state,
            classes:
               state.classes.length > 0
                  ? [...state.classes, payload]
                  : [payload],
            loading: false,
            error: {},
         };
      case CLASS_UPDATED:
         return {
            ...state,
            classes: state.classes.map((SingleClass) =>
               SingleClass._id === payload._id ? payload : SingleClass
            ),
            loading: false,
            error: {},
         };
      case CLASS_DELETED:
         return {
            ...state,
            classes: state.classes.filter((item) => item._id !== payload),
            loading: false,
            error: {},
         };
      case CLASSCATEGORY_UPDATED:
         return {
            ...state,
            classInfo: { category: payload, students: [] },
            loadingClass: false,
            error: {},
         };
      case CLASSSTUDENT_ADDED:
         return {
            ...state,
            classInfo: state.classInfo
               ? {
                    ...state.classInfo,
                    students: [...state.classInfo.students, payload],
                 }
               : {
                    students: [payload],
                 },
            loadingClass: false,
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
            loadingClass: false,
            error: {},
         };
      case CLASS_CLEARED:
         return {
            ...state,
            classInfo: null,
            loadingClass: true,
            error: {},
         };
      case CLASSES_CLEARED:
         return {
            ...state,
            classes: [],
            loading: true,
            error: {},
            otherValues: {
               activeClasses: "",
               teacherHours: {},
            },
         };
      case CLASS_ERROR:
         return {
            ...state,
            //classInfo: null,
            loadingClass: false,
            error: payload,
         };
      case CLASSES_ERROR:
         return {
            ...state,
            classes: [],
            loading: false,
            error: payload,
            otherValues: {
               activeClasses: 0,
               teacherHours: {},
            },
         };
      case CLASSES_PDF_ERROR:
         return {
            ...state,
            error: payload,
         };
      default:
         return state;
   }
}
