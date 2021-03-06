import {
   PENALTY_LOADED,
   PENALTY_REGISTERED,
   PENALTY_CLEARED,
   PENALTY_ERROR,
} from "../actions/types";

const initialState = {
   penalty: null,
   loading: true,
   error: {},
};

export default function (state = initialState, action) {
   const { type, payload } = action;
   switch (type) {
      case PENALTY_LOADED:
      case PENALTY_REGISTERED:
         return {
            ...state,
            loading: false,
            penalty: payload,
         };
      case PENALTY_CLEARED:
         return initialState;
      case PENALTY_ERROR:
         return {
            ...state,
            loading: false,
            error: payload,
         };

      default:
         return state;
   }
}
