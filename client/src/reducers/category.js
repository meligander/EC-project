import {
	CATEGORIES_LOADED,
	CATEGORY_ERROR,
	CATEGORIES_UPDATED,
} from '../actions/types';

const initialState = {
	loading: true,
	categories: [],
	error: {},
};

export default function (state = initialState, action) {
	const { type, payload } = action;
	switch (type) {
		case CATEGORIES_LOADED:
		case CATEGORIES_UPDATED:
			return {
				...state,
				categories: payload,
				loading: false,
				error: {},
			};
		case CATEGORY_ERROR:
			return {
				...state,
				categories: [],
				loading: false,
				error: payload,
			};
		default:
			return state;
	}
}
