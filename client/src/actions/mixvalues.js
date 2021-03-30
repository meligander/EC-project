import {
   LOADINGSPINNER_UPDATED,
   SEARCHPAGE_CHANGED,
   PREVPAGE_UPDATED,
} from "./types";

export const updateLoadingSpinner = (bool) => (dispatch) => {
   dispatch({
      type: LOADINGSPINNER_UPDATED,
      payload: bool,
   });
};

export const updatePageNumber = (page) => (dispatch) => {
   dispatch({
      type: SEARCHPAGE_CHANGED,
      payload: page,
   });
};

export const updatePreviousPage = (page) => (dispatch) => {
   dispatch({
      type: PREVPAGE_UPDATED,
      payload: page,
   });
};

export const formatNumber = (number) => {
   if (number) return new Intl.NumberFormat("de-DE").format(number);
   else return null;
};
