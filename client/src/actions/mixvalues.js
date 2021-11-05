import {
   LOADINGSPINNER_UPDATED,
   SEARCHPAGE_CHANGED,
   FOOTER_HEIGHT_SETTED,
   NAVBAR_HEIGHT_SETTED,
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

export const setFooterHeight = (height) => (dispatch) => {
   dispatch({
      type: FOOTER_HEIGHT_SETTED,
      payload: height,
   });
};

export const setNavbarHeight = (height) => (dispatch) => {
   dispatch({
      type: NAVBAR_HEIGHT_SETTED,
      payload: height,
   });
};

export const formatNumber = (number) => {
   if (number) return new Intl.NumberFormat("de-DE").format(number);
   else return null;
};
