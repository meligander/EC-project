import {
   USER_LOADED,
   USERS_LOADED,
   USERSBK_LOADED,
   REGISTER_SUCCESS,
   USER_UPDATED,
   USER_DELETED,
   USERFORLIST_ADDED,
   USERFROMLIST_REMOVED,
   USERS_CLEARED,
   USER_CLEARED,
   SEARCH_CLEARED,
   USERS_ERROR,
   USER_ERROR,
   USERSBK_ERROR,
   OTHERVALUES_LOADED,
} from "../actions/types";

const initialState = {
   users: [],
   loading: true,
   user: null,
   loadingUser: true,
   usersBK: [],
   loadingBK: true,
   otherValues: {
      userSearchType: "",
      studentNumber: "",
      activeStudents: "",
      activeTeachers: "",
   },
   error: {},
};

export default function (state = initialState, action) {
   const { type, payload } = action;

   switch (type) {
      case USER_LOADED:
         return {
            ...state,
            loadingUser: false,
            user: payload,
            error: {},
         };
      case USERS_LOADED:
         return {
            ...state,
            loading: false,
            users: payload.users,
            otherValues: {
               ...state.otherValues,
               userSearchType: payload.type,
            },
            error: {},
         };
      case USERSBK_LOADED:
         return {
            ...state,
            loadingBK: false,
            usersBK: payload,
            error: {},
         };
      case OTHERVALUES_LOADED:
         return {
            ...state,
            otherValues: {
               ...state.otherValues,
               [payload.type]: payload.info,
            },
         };
      case REGISTER_SUCCESS:
      case USER_UPDATED:
         return {
            ...state,
            user: payload,
            loadingUser: false,
            error: {},
         };
      case USER_DELETED:
         return {
            ...state,
            user: null,
            loading: true,
         };
      case USERFORLIST_ADDED:
         return {
            ...state,
            users: [...state.users, payload],
            loading: false,
         };
      case USERFROMLIST_REMOVED:
         return {
            ...state,
            users: state.users.filter((user) => user._id !== payload),
         };
      case USER_CLEARED:
         return {
            ...state,
            loadingUser: true,
            user: null,
            error: {},
         };
      case USERS_CLEARED:
         return {
            ...state,
            loading: true,
            users: [],
            usersBK: [],
            loadingBK: true,
            otherValues: {
               userSearchType: "",
               studentNumber: "",
               activeStudents: "",
               activeTeachers: "",
            },
            error: {},
         };
      case SEARCH_CLEARED:
         return {
            ...state,
            users: [],
            loading: true,
            usersBK: [],
            loadingBK: true,
            otherValues: {
               ...state.otherValues,
               userSearchType: "",
            },
            error: {},
         };
      case USER_ERROR:
         return {
            ...state,
            loadingUser: true,
            user: null,
            error: payload,
         };
      case USERS_ERROR:
         return {
            ...state,
            users: [],
            loading: false,
            error: payload,
         };
      case USERSBK_ERROR:
         return {
            ...state,
            usersBK: [],
            loadingBK: false,
            error: payload,
         };
      default:
         return state;
   }
}
