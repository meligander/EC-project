import {
   USERAUTH_LOADED,
   AUTH_ERROR,
   LOGIN_FAIL,
   LOGIN_SUCCESS,
   LOGOUT,
   STARTLOGOUT,
   FINISHLOGOUT,
   USERAUTH_UPDATED,
} from "../actions/types";

const initialState = {
   token: localStorage.getItem("token"),
   userLogged: null,
   loading: true,
   isAuthenticated: false,
};

export default function (state = initialState, action) {
   const { type, payload } = action;

   switch (type) {
      case USERAUTH_UPDATED:
      case USERAUTH_LOADED:
         return {
            ...state,
            loading: false,
            userLogged: payload,
            isAuthenticated: true,
         };
      case LOGIN_SUCCESS:
         return {
            ...state,
            loading: false,
            token: payload.token,
         };
      case STARTLOGOUT:
         return {
            ...state,
            token: null,
            isAuthenticated: false,
            loading: true,
         };
      case FINISHLOGOUT:
         return {
            ...state,
            userLogged: null,
         };
      case AUTH_ERROR:
      case LOGIN_FAIL:
      case LOGOUT:
         return {
            ...state,
            token: null,
            isAuthenticated: false,
            userLogged: null,
            loading: false,
         };
      default:
         return state;
   }
}
