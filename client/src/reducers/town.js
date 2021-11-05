import {
   TOWNS_LOADED,
   TOWNS_UPDATED,
   TOWN_DELETED,
   TOWNS_CLEARED,
   TOWNS_ERROR,
} from "../actions/types";

const initialState = {
   towns: [],
   loading: true,
   error: {},
};

export default function (state = initialState, action) {
   const { type, payload } = action;
   switch (type) {
      case TOWNS_LOADED:
      case TOWNS_UPDATED:
         return {
            ...state,
            loading: false,
            towns: payload,
            error: {},
         };
      case TOWN_DELETED:
         return {
            ...state,
            towns: state.towns.filter((town) => town._id !== payload),
            loading: false,
            error: {},
         };
      case TOWNS_ERROR:
         return {
            ...state,
            loading: false,
            error: payload,
         };
      case TOWNS_CLEARED:
         return initialState;
      default:
         return state;
   }
}
