import {
	TOWNS_LOADED,
	TOWNS_ERROR,
	TOWNS_UPDATED,
	TOWNS_CLEARED,
} from '../actions/types';

const initialState = {
	towns: [],
	loading: true,
	error: {},
};

export default function (state = initialState, action) {
	const { type, payload } = action;
	switch (type) {
		case TOWNS_UPDATED:
		case TOWNS_LOADED:
			return {
				...state,
				loading: false,
				towns: payload,
			};
		case TOWNS_ERROR:
			return {
				...state,
				loading: false,
				error: payload,
			};
		case TOWNS_CLEARED:
			return initialState;
		default:
			return state;
	}
}
