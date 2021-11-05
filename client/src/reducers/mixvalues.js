import {
   LOADINGSPINNER_UPDATED,
   SEARCHPAGE_CHANGED,
   NAVBAR_HEIGHT_SETTED,
   FOOTER_HEIGHT_SETTED,
} from "../actions/types";

const initialState = {
   loadingSpinner: false,
   page: 0,
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
