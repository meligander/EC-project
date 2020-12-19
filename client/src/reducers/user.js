import {
   REGISTER_SUCCESS,
   USER_LOADED,
   USER_UPDATED,
   USERS_LOADED,
   USERS_CLEARED,
   SEARCH_CLEARED,
   USERS_ERROR,
   USER_ERROR,
   RELATIVES_LOADED,
   USERS_TYPE_CHANGED,
   USER_DELETED,
   USER_REMOVED,
   USER_ADDED,
   TEACHERS_LOADED,
   TEAM_LOADED,
   TEACHERS_ERROR,
} from "../actions/types";

const initialState = {
   loading: true,
   loadingUsers: true,
   user: null,
   users: [],
   usersType: "",
   relatives: [],
   teachers: [],
   loadingTeachers: true,
   relativesLoading: true,
   error: {},
};

export default function (state = initialState, action) {
   const { type, payload } = action;

   switch (type) {
      case REGISTER_SUCCESS:
      case USER_UPDATED:
      case USER_LOADED:
         return {
            ...state,
            loading: false,
            user: payload,
         };
      case TEAM_LOADED:
      case USERS_LOADED:
         return {
            ...state,
            loadingUsers: false,
            users: payload,
         };
      case TEACHERS_LOADED:
         return {
            ...state,
            loadingTeachers: false,
            teachers: payload,
         };
      case USER_REMOVED:
         return {
            ...state,
            users: state.users.filter((user) => user._id !== payload),
         };
      case USER_ADDED:
         return {
            ...state,
            users: [...state.users, payload],
         };
      case USERS_TYPE_CHANGED:
         return {
            ...state,
            usersType: payload,
         };
      case RELATIVES_LOADED:
         return {
            ...state,
            relatives: payload,
            relativesLoading: false,
         };
      case USERS_ERROR:
         return {
            ...state,
            users: [],
            error: payload,
            loadingUsers: false,
            relativesLoading: false,
            relatives: [],
         };
      case TEACHERS_ERROR:
         return {
            ...state,
            teachers: [],
            error: payload,
         };
      case USERS_CLEARED:
         return initialState;
      case USER_DELETED:
         return {
            ...state,
            user: null,
            loading: true,
         };
      case SEARCH_CLEARED:
         return {
            ...state,
            users: [],
            loadingUsers: true,
            usersType: "",
         };
      case USER_ERROR:
         return {
            ...state,
            loading: false,
            relativesLoading: false,
            teachers: [],
            loadingTeachers: false,
            relatives: [],
            users: [],
            usersType: "",
            loadingUsers: false,
            error: payload,
            user: null,
         };
      default:
         return state;
   }
}
