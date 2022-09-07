import {
   DAILIES_CLEARED,
   DAILIES_ERROR,
   DAILIES_LOADED,
   DAILIES_PDF_ERROR,
   DAILY_DELETED,
   DAILY_ERROR,
   DAILY_REGISTERED,
} from "../actions/types";

const initialState = {
   dailies: [],
   loading: true,
   error: {},
};

export default function (state = initialState, action) {
   const { type, payload } = action;

   switch (type) {
      case DAILIES_LOADED:
         return {
            ...state,
            loading: false,
            dailies: payload,
            error: {},
         };
      case DAILY_REGISTERED:
         return {
            ...state,
            dailies: [payload, ...state.dailies],
         };
      case DAILY_DELETED:
         return {
            ...state,
            dailies: state.dailies.filter((daily) => daily._id !== payload),
         };
      case DAILIES_CLEARED:
         return {
            ...state,
            dailies: [],
            loading: true,
            error: {},
         };
      case DAILY_ERROR:
      case DAILIES_PDF_ERROR:
         return { ...state, error: payload };
      case DAILIES_ERROR:
         return {
            ...state,
            dailies: [],
            loading: false,
            error: payload,
         };
      default:
         return state;
   }
}
