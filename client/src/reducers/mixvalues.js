import {
   LOADINGSPINNER_UPDATED,
   SEARCHPAGE_CHANGED,
   NAVBAR_HEIGHT_SETTED,
   FOOTER_HEIGHT_SETTED,
   CURRENTNAV_CHANGED,
   MENU_TOGGLED,
   POPUP_TOGGLED,
} from "../actions/types";

const initialState = {
   loadingSpinner: false,
   page: 0,
   currentNav: "",
   menuToggle: false,
   popupToggle: false,
   popupType: "",
   footer: 0,
   navbar: 0,
};

export default function (state = initialState, action) {
   const { type, payload } = action;
   switch (type) {
      case SEARCHPAGE_CHANGED:
         return {
            ...state,
            page: payload,
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
      default:
         return state;
   }
}
