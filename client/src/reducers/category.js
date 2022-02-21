import {
   CATEGORIES_LOADED,
   CATEGORIES_UPDATED,
   CATEGORIES_CLEARED,
   CATEGORIES_ERROR,
} from "../actions/types";

const initialState = {
   loading: true,
   categories: [],
   error: {},
};

export default function (state = initialState, action) {
   const { type, payload } = action;
   switch (type) {
      case CATEGORIES_LOADED:
         return {
            ...state,
            categories: payload,
            loading: false,
            error: {},
         };
      case CATEGORIES_UPDATED:
         return state;
      case CATEGORIES_CLEARED:
         return initialState;
      case CATEGORIES_ERROR:
         return {
            ...state,
            loading: false,
            error: payload,
         };
      default:
         return state;
   }
}
