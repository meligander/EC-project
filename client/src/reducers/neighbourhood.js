import {
	NEIGHBOURHOODS_LOADED,
	NEIGHBOURHOODS_ERROR,
	NEIGHBOURHOODS_UPDATED,
	NEIGHBOURHOODS_CLEARED,
} from '../actions/types';

const initialState = {
	neighbourhoods: [],
	loading: true,
	error: {},
};

export default function (state = initialState, action) {
	const { type, payload } = action;
	switch (type) {
		case NEIGHBOURHOODS_UPDATED:
		case NEIGHBOURHOODS_LOADED:
			return {
				...state,
				loading: false,
				neighbourhoods: payload,
			};
		case NEIGHBOURHOODS_ERROR:
			return {
				...state,
				loading: false,
				error: payload,
				neighbourhoods: [],
			};
		case NEIGHBOURHOODS_CLEARED:
			return initialState;
		default:
			return state;
	}
}
