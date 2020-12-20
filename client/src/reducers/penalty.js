import {
   PENALTY_LOADED,
   PENALTY_ERROR,
   PENALTY_REGISTERED,
   PENALTY_CLEARED,
} from "../actions/types";

const initialState = {
   penalty: null,
   loading: true,
   error: {},
};

export default function (state = initialState, action) {
   const { type, payload } = action;
   switch (type) {
      case PENALTY_REGISTERED:
      case PENALTY_LOADED:
         return {
            ...state,
            loading: false,
            penalty: payload,
         };
      case PENALTY_ERROR:
         return {
            ...state,
            loading: false,
            error: payload,
         };
      case PENALTY_CLEARED:
         return initialState;
      default:
         return state;
   }
}
