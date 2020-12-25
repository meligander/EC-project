import {
   USER_LOADED,
   USERS_LOADED,
   USERSBK_LOADED,
   USERS_TYPE_CHANGED,
   REGISTER_SUCCESS,
   USER_UPDATED,
   USER_DELETED,
   USERS_CLEARED,
   USER_CLEARED,
   SEARCH_CLEARED,
   USERS_ERROR,
   USER_ERROR,
   USERFORLIST_ADDED,
   USERFROMLIST_REMOVED,
} from "../actions/types";

const initialState = {
   loading: true,
   loadingUsers: true,
   user: null,
   users: [],
   usersType: "",
   usersBK: [],
   loadingUsersBK: true,
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
      case REGISTER_SUCCESS:
      case USER_UPDATED:
         return state;
      case USERS_TYPE_CHANGED:
         return {
            ...state,
            usersType: payload,
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
            usersType: "",
         };
      case USER_ERROR:
         return {
            ...state,
            loading: true,
            loadingUsers: true,
            user: null,
            users: [],
            usersType: "",
            usersBK: [],
            loadingUsersBK: true,
            error: {},
         };
      case USERS_ERROR:
         return {
            ...state,
            users: [],
            loadingUsers: false,
            usersBK: [],
            loadingUsersBK: true,
            error: payload,
         };
      default:
         return state;
   }
}
