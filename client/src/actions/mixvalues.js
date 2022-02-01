import {
   LOADINGSPINNER_UPDATED,
   FOOTER_HEIGHT_SETTED,
   NAVBAR_HEIGHT_SETTED,
   CURRENTNAV_CHANGED,
   MENU_TOGGLED,
   POPUP_TOGGLED,
} from "./types";

export const updateLoadingSpinner = (bool) => (dispatch) => {
   dispatch({
      type: LOADINGSPINNER_UPDATED,
      payload: bool,
   });
};

export const toggleMenu = () => (dispatch) => {
   dispatch({
      type: MENU_TOGGLED,
   });
};

export const togglePopup = (type) => (dispatch) => {
   dispatch({
      type: POPUP_TOGGLED,
      payload: {
         type,
      },
   });
};

export const updateCurrentNav = (currentNav, toggle) => (dispatch) => {
   dispatch({
      type: CURRENTNAV_CHANGED,
      payload: {
         nav: currentNav,
         toggle,
      },
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
