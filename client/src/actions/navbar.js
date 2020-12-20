import { logOut } from "./auth";

import { MENU_TOGGLED, PAGE_CHANGED } from "./types";

export const toggleMenu = () => (dispatch) => {
   dispatch({
      type: MENU_TOGGLED,
   });
};

export const changePageAndMenu = (page) => (dispatch) => {
   dispatch(toggleMenu());
   dispatch(changePage(page));
   window.scroll(0, 0);
};

export const changePage = (page) => (dispatch) => {
   dispatch({
      type: PAGE_CHANGED,
      payload: page,
   });
};

export const logOutAndToggle = () => (dispatch) => {
   dispatch(changePageAndMenu("login"));
   dispatch(logOut());
};
