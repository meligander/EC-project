import {
	USER_ATTENDANCES_LOADED,
	ATTENDANCES_LOADED,
	ATTENDANCES_ERROR,
	ATTENDANCES_CLEARED,
	NEW_DATE_REGISTERED,
	ATTENDANCES_UPDATED,
	DATES_DELETED,
} from '../actions/types';

const initialState = {
	loading: true,
	attendances: [],
	error: {},
};

export default function (state = initialState, action) {
	const { type, payload } = action;
	switch (type) {
		case ATTENDANCES_UPDATED:
			return state;
		case DATES_DELETED:
		case NEW_DATE_REGISTERED:
		case USER_ATTENDANCES_LOADED:
		case ATTENDANCES_LOADED:
			return {
				...state,
				attendances: payload,
				loading: false,
				error: {},
			};
		case ATTENDANCES_ERROR:
			return {
				...state,
				userAttendances: [],
				attendances: [],
				loading: false,
				error: payload,
			};
		case ATTENDANCES_CLEARED:
			return initialState;
		default:
			return state;
	}
}
