import {
	REGISTER_LOADED,
	REGISTERS_LOADED,
	REGISTER_ERROR,
	REGISTER_CLEARED,
	REGISTER_CLOSED,
	REGISTER_DELETED,
} from '../actions/types';

const initialState = {
	loading: true,
	register: null,
	registers: [],
	loadingRegisters: true,
	error: {},
};

export default function (state = initialState, action) {
	const { type, payload } = action;

	switch (type) {
		case REGISTER_LOADED:
			return {
				...state,
				register: payload,
				loading: false,
				error: {},
			};
		case REGISTERS_LOADED:
			return {
				...state,
				registers: payload,
				loadingRegisters: false,
			};
		case REGISTER_DELETED:
			return {
				...state,
				registers: state.registers.filter(
					(register) => register._id !== payload
				),
			};
		case REGISTER_CLOSED:
			return {
				...state,
				registers:
					state.registers.lenght > 0 ? [payload, ...state.registers] : [],
				loadingRegisters: state.register.length > 0 ? false : true,
			};
		case REGISTER_ERROR:
			return {
				...state,
				register: null,
				registers: [],
				loading: false,
				loadingRegisters: false,
				error: payload,
			};

		case REGISTER_CLEARED:
			return initialState;
		default:
			return state;
	}
}
