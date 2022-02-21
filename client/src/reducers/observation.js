import {
   OBSERVATIONS_CLEARED,
   OBSERVATIONS_ERROR,
   OBSERVATIONS_LOADED,
   OBSERVATIONS_UPDATED,
} from "../actions/types";

const initialState = {
   loading: true,
   observations: [],
   error: {},
};

export default function (state = initialState, action) {
   const { type, payload } = action;
   switch (type) {
      case OBSERVATIONS_LOADED:
         return {
            ...state,
            observations: payload,
            loading: false,
            error: {},
         };
      case OBSERVATIONS_UPDATED:
         return state;
      case OBSERVATIONS_CLEARED:
         return initialState;
      case OBSERVATIONS_ERROR:
         return {
            ...state,
            loading: false,
            error: payload,
         };
      default:
         return state;
   }
}
