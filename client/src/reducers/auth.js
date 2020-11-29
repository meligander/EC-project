import {
	USERAUTH_LOADED,
	AUTH_ERROR,
	LOGIN_FAIL,
	LOGIN_SUCCESS,
	LOGOUT,
} from '../actions/types';

const initialState = {
	token: localStorage.getItem('token'),
	userLogged: null,
	loading: true,
	isAuthenticated: null,
	visitor: true,
};

export default function (state = initialState, action) {
	const { type, payload } = action;

	switch (type) {
		case USERAUTH_LOADED:
			return {
				...state,
				loading: false,
				userLogged: payload,
				isAuthenticated: true,
				visitor: false,
			};
		case LOGIN_SUCCESS:
			return {
				...state,
				loading: false,
				token: payload.token,
				visitor: false,
			};
		case AUTH_ERROR:
		case LOGIN_FAIL:
		case LOGOUT:
			return {
				...state,
				token: null,
				isAuthenticated: false,
				userLogged: null,
				loading: false,
				visitor: true,
			};
		default:
			return state;
	}
}
