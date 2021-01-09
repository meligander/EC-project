import {
   USER_LOADED,
   USERS_LOADED,
   USERSBK_LOADED,
   STUDENTNUMBER_LOADED,
   ACTIVEUSERS_LOADED,
   USERSEARCHTYPE_CHANGED,
   REGISTER_SUCCESS,
   USER_UPDATED,
   USER_DELETED,
   USERFORLIST_ADDED,
   USERFROMLIST_REMOVED,
   USERS_CLEARED,
   USER_CLEARED,
   SEARCH_CLEARED,
   OTHERVALUES_CLEARED,
   USERS_ERROR,
   USER_ERROR,
   USERSBK_ERROR,
} from "../actions/types";

const initialState = {
   loading: true,
   loadingUsers: true,
   user: null,
   users: [],
   userSearchType: "",
   usersBK: [],
   loadingUsersBK: true,
   otherValues: {
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
            loading: false,
            user: payload,
         };
      case USERS_LOADED:
         return {
            ...state,
            loadingUsers: false,
            users: payload,
         };
      case USERSBK_LOADED:
         return {
            ...state,
            loadingUsersBK: false,
            usersBK: payload,
         };
      case STUDENTNUMBER_LOADED:
         return {
            ...state,
            otherValues: {
               ...state.otherValues,
               studentNumber: payload,
            },
         };
      case ACTIVEUSERS_LOADED:
         return {
            ...state,
            otherValues: {
               ...state.otherValues,
               [payload.type]: payload.info,
            },
         };
      case REGISTER_SUCCESS:
      case USER_UPDATED:
         return state;
      case USERSEARCHTYPE_CHANGED:
         return {
            ...state,
            userSearchType: payload,
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
            loading: true,
            user: null,
            usersBK: [],
            loadingUsersBK: true,
         };
      case USERS_CLEARED:
         return initialState;
      case SEARCH_CLEARED:
         return {
            ...state,
            users: [],
            loadingUsers: true,
            usersBK: [],
            loadingUsersBK: true,
            userSearchType: "",
         };
      case OTHERVALUES_CLEARED:
         return {
            ...state,
            otherValues: {
               ...state.otherValues,
               [payload]: "",
            },
         };
      case USER_ERROR:
         return {
            ...state,
            loadingUsers: true,
            users: [],
            userSearchType: "",
            usersBK: [],
            loadingUsersBK: true,
            error: payload,
            otherValues: {
               ...state.otherValues,
               [payload.userType]: 0,
            },
         };
      case USERS_ERROR:
         return {
            ...state,
            users: [],
            loadingUsers: false,
            error: payload,
         };
      case USERSBK_ERROR:
         return {
            ...state,
            usersBK: [],
            loadingUsersBK: false,
            error: payload,
         };
      default:
         return state;
   }
}
