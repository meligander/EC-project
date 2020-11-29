import {
	EXPENCES_LOADED,
	EXPENCETYPES_LOADED,
	EXPENCE_ERROR,
	EXPENCETYPE_ERROR,
	EXPENCETYPES_UPDATED,
	EXPENCE_REGISTERED,
	EXPENCE_DELETED,
} from '../actions/types';

const initialState = {
	loading: true,
	expences: [],
	expence: null,
	expencetypes: [],
	loadingET: true,
	loadingExpences: true,
	error: {},
};

export default function (state = initialState, action) {
	const { type, payload } = action;
	switch (type) {
		case EXPENCETYPES_UPDATED:
		case EXPENCETYPES_LOADED:
			return {
				...state,
				expencetypes: payload,
				loadingET: false,
				error: {},
			};
		case EXPENCES_LOADED:
			return {
				...state,
				expences: payload,
				loadingExpences: false,
				error: {},
			};
		case EXPENCE_ERROR:
			return {
				...state,
				expence: null,
				expences: [],
				loading: false,
				loadingExpences: false,
				error: payload,
			};
		case EXPENCE_DELETED:
			return {
				...state,
				expences: state.expences.filter((expence) => expence._id !== payload),
			};
		case EXPENCETYPE_ERROR:
			return {
				...state,
				expencetypes: [],
				loadingET: false,
				error: payload,
			};
		case EXPENCE_REGISTERED:
			return {
				...state,
				expences: state.expences.length > 0 ? [payload, ...state.expences] : [],
				loadingExpences: state.expences.length > 0 ? false : true,
			};
		default:
			return state;
	}
}
