import {
   LOADINGSPINNER_UPDATED,
   NAVBAR_HEIGHT_SETTED,
   FOOTER_HEIGHT_SETTED,
   CURRENTNAV_CHANGED,
   MENU_TOGGLED,
   POPUP_TOGGLED,
   GLOBAL_CLEARED,
   PENALTY_LOADED,
   SALARIES_LOADED,
   PENALTY_UPDATED,
   SALARIES_UPDATED,
   GLOBAL_ERROR,
} from "../actions/types";

const initialState = {
   penalty: "",
   salaries: {},
   loading: true,
   loadingSpinner: false,
   currentNav: "",
   menuToggle: false,
   popupToggle: false,
   popupType: "",
   footer: 0,
   navbar: 0,
   error: {},
};

export default function (state = initialState, action) {
   const { type, payload } = action;
   switch (type) {
      case PENALTY_LOADED:
         return {
            ...state,
            loading: false,
            penalty: payload,
            error: {},
         };
      case SALARIES_LOADED:
         return {
            ...state,
            loading: false,
            salaries: payload,
            error: {},
         };
      case PENALTY_UPDATED:
         return {
            ...state,
            penalty: payload,
            loading: false,
            error: {},
         };
      case SALARIES_UPDATED:
         return {
            ...state,
            salaries: payload,
            loading: false,
            error: {},
         };
      case CURRENTNAV_CHANGED:
         return {
            ...state,
            currentNav: payload.nav,
            ...(payload.toggle && { menuToggle: !state.menuToggle }),
         };
      case MENU_TOGGLED:
         return {
            ...state,
            menuToggle: !state.menuToggle,
         };
      case POPUP_TOGGLED:
         return {
            ...state,
            popupToggle: !state.popupToggle,
            ...(payload.type && { popupType: payload.type }),
         };
      case LOADINGSPINNER_UPDATED:
         return {
            ...state,
            loadingSpinner: payload,
         };
      case NAVBAR_HEIGHT_SETTED:
         return {
            ...state,
            navbar: payload,
         };
      case FOOTER_HEIGHT_SETTED:
         return {
            ...state,
            footer: payload,
         };
      case GLOBAL_CLEARED:
         return {
            ...state,
            loading: true,
            penalty: "",
            salaries: {},
            error: {},
         };
      case GLOBAL_ERROR:
         return {
            ...state,
            loading: false,
            error: payload,
         };
      default:
         return state;
   }
}
