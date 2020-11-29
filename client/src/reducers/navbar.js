import { MENU_TOGGLED, PAGE_CHANGED } from '../actions/types';

const initialState = {
	showMenu: false,
	currentNav: 'index',
};

export default function (state = initialState, action) {
	const { type, payload } = action;
	switch (type) {
		case MENU_TOGGLED:
			return {
				...state,
				showMenu: !state.showMenu,
			};
		case PAGE_CHANGED:
			return {
				...state,
				currentNav: payload,
			};
		default:
			return state;
	}
}
