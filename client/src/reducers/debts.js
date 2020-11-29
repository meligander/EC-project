import {
	INSTALLMENTS_LOADED,
	INSTALLMENT_LOADED,
	INSTALLMENTS_ERROR,
	INSTALLMENT_UPDATED,
	INSTALLMENT_REGISTERED,
	INSTALLMENTS_CLEARED,
	INSTALLMENT_CLEARED,
	INSTALLMENT_DELETED,
	INSTALLMENTS_UPDATED,
	USERS_INSTALLMENTS_LOADED,
	INVOICE_DETAIL_ADDED,
} from '../actions/types';

const initialState = {
	loading: true,
	debts: [],
	usersDebts: {
		years: [],
		rows: [],
	},
	loadingUsersDebts: true,
	debt: null,
	loadingDebts: true,
	error: {},
};

export default function (state = initialState, action) {
	const { type, payload } = action;
	switch (type) {
		case INVOICE_DETAIL_ADDED:
			return {
				...state,
				debts: [...state.debts, payload],
				loadingDebts: false,
			};
		case USERS_INSTALLMENTS_LOADED:
			return {
				...state,
				usersDebts: payload,
				loadingUsersDebts: false,
			};
		case INSTALLMENTS_LOADED:
			return {
				...state,
				debts: payload,
				loadingDebts: false,
				error: {},
			};
		case INSTALLMENT_LOADED:
			return {
				...state,
				debt: payload,
				loading: false,
				error: {},
			};
		case INSTALLMENT_UPDATED:
			return {
				...state,
				loadingUsersDebts: false,
				usersDebts: {
					...state.usersDebts,
					rows: state.usersDebts.rows.map((row) =>
						row.map((debt) => (debt._id === payload._id ? payload : debt))
					),
				},
			};
		case INSTALLMENT_REGISTERED:
			return {
				...state,
				loadingUsersDebts: false,
				usersDebts: payload,
			};
		case INSTALLMENT_DELETED:
			return {
				...state,
				loadingUsersDebts: false,
				usersDebts: {
					...state.usersDebts,
					rows: state.usersDebts.rows.map((row) =>
						row.map((debt) =>
							debt._id === payload
								? { _id: '', expired: false, value: '' }
								: debt
						)
					),
				},
			};
		case INSTALLMENTS_ERROR:
			return {
				...state,
				debt: null,
				debts: [],
				usersDebts: {
					years: [],
					rows: [],
				},
				loading: false,
				loadingDebts: false,
				loadingUsersDebts: false,
				error: payload,
			};
		case INSTALLMENT_CLEARED:
			return {
				...state,
				debt: null,
				loading: true,
			};
		case INSTALLMENTS_UPDATED:
			return state;
		case INSTALLMENTS_CLEARED:
			return initialState;
		default:
			return state;
	}
}
