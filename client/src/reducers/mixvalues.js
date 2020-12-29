import {
   LOADINGSPINNER_UPDATED,
   SEARCHPAGE_CHANGED,
   PREVPAGE_UPDATED,
} from "../actions/types";

const initialState = {
   loadingSpinner: false,
   page: 0,
   prevPage: "",
   error: {},
};

export default function (state = initialState, action) {
   const { type, payload } = action;
   switch (type) {
      case PREVPAGE_UPDATED:
         return {
            ...state,
            prevPage: payload,
         };
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
      default:
         return state;
   }
}
