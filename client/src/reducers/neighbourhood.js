import {
   NEIGHBOURHOODS_LOADED,
   NEIGHBOURHOODS_UPDATED,
   NEIGHBOURHOOD_DELETED,
   NEIGHBOURHOODS_CLEARED,
   NEIGHBOURHOODS_ERROR,
} from "../actions/types";

const initialState = {
   neighbourhoods: [],
   loading: true,
   error: {},
};

export default function (state = initialState, action) {
   const { type, payload } = action;
   switch (type) {
      case NEIGHBOURHOODS_LOADED:
      case NEIGHBOURHOODS_UPDATED:
         return {
            ...state,
            loading: false,
            neighbourhoods: payload,
         };
      case NEIGHBOURHOOD_DELETED:
         return {
            ...state,
            neighbourhoods: state.neighbourhoods.filter(
               (neighbourhood) => neighbourhood._id !== payload
            ),
            loading: false,
         };
      case NEIGHBOURHOODS_CLEARED:
         return initialState;
      case NEIGHBOURHOODS_ERROR:
         return {
            ...state,
            loading: false,
            error: payload,
         };
      default:
         return state;
   }
}
