import { MENU_TOGGLED, PAGE_CHANGED } from './types';
import { logout } from './auth';

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

export const logoutAndToggle = () => (dispatch) => {
	dispatch(changePageAndMenu('login'));
	dispatch(logout());
};
