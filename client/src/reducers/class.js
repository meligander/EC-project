import {
   CLASS_LOADED,
   CLASSES_LOADED,
   CLASSSTUDENTS_LOADED,
   ACTIVECLASSES_LOADED,
   CLASS_REGISTERED,
   CLASS_UPDATED,
   CLASS_DELETED,
   CLASSCATEGORY_UPDATED,
   CLASSSTUDENT_ADDED,
   CLASSSTUDENT_REMOVED,
   CLASS_CLEARED,
   CLASSES_CLEARED,
   ACTIVECLASSES_CLEARED,
   CLASS_ERROR,
   CLASSSTUDENTS_ERROR,
} from "../actions/types";

const initialState = {
   loading: true,
   classInfo: null,
   loadingClasses: true,
   loadingStudents: true,
   classes: [],
   otherValues: {
      activeClasses: "",
   },
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
            loadingStudents: false,
            error: {},
         };
      case ACTIVECLASSES_LOADED:
         return {
            ...state,
            otherValues: {
               activeClasses: payload,
            },
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
         console.log(payload);
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
            loadingStudents: true,
            error: {},
         };
      case CLASSES_CLEARED:
         return initialState;
      case ACTIVECLASSES_CLEARED:
         return {
            ...state,
            otherValues: {
               activeClasses: "",
            },
         };
      case CLASS_ERROR:
         return {
            ...state,
            classInfo: null,
            classes: [],
            loading: false,
            loadingClasses: false,
            otherValues: {
               activeClasses: 0,
            },
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
            loadingStudents: false,
            error: payload,
         };
      default:
         return state;
   }
}
