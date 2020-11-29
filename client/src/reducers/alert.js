import { ALERT_SETTED, ALERT_REMOVED } from '../actions/types';

const initialState = [];

export default function (state = initialState, action) {
	const { type, payload } = action;
	switch (type) {
		case ALERT_SETTED:
			return [...state, payload];
		case ALERT_REMOVED:
			return state.filter((alert) => alert.id !== payload);
		default:
			return state;
	}
}
