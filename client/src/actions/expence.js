import {
	EXPENCETYPES_LOADED,
	EXPENCE_REGISTERED,
	EXPENCE_ERROR,
	EXPENCES_LOADED,
	EXPENCETYPES_UPDATED,
	EXPENCETYPE_ERROR,
	EXPENCE_DELETED,
} from './types';
import axios from 'axios';
import { updateLoadingSpinner } from './mixvalues';
import { clearRegister } from './register';
import { setAlert } from './alert';

export const loadExpences = (filterData) => async (dispatch) => {
	try {
		dispatch(updateLoadingSpinner(true));
		let filter = '';

		const filternames = Object.keys(filterData);
		for (let x = 0; x < filternames.length; x++) {
			const name = filternames[x];
			if (filterData[name] !== '' || filterData[name] !== 0) {
				if (filter !== '') filter = filter + '&';
				filter = filter + filternames[x] + '=' + filterData[name];
			}
		}
		const res = await axios.get(`/api/expence?${filter}`);
		dispatch({
			type: EXPENCES_LOADED,
			payload: res.data,
		});
		dispatch(updateLoadingSpinner(false));
	} catch (err) {
		dispatch({
			type: EXPENCE_ERROR,
			payload: {
				type: err.response.statusText,
				status: err.response.status,
				msg: err.response.data.msg,
			},
		});
		dispatch(updateLoadingSpinner(false));
		dispatch(setAlert(err.response.data.msg, 'danger', '2'));
		window.scroll(0, 0);
	}
};

export const loadExpenceTypes = () => async (dispatch) => {
	try {
		const res = await axios.get('/api/expence-type');
		dispatch({
			type: EXPENCETYPES_LOADED,
			payload: res.data,
		});
	} catch (err) {
		dispatch({
			type: EXPENCETYPE_ERROR,
			payload: {
				type: err.response.statusText,
				status: err.response.status,
				msg: err.response.data.msg,
			},
		});
	}
};

//Update or register a user
export const registerExpence = (formData, history, user_id) => async (
	dispatch
) => {
	dispatch(updateLoadingSpinner(true));
	let expence = JSON.stringify(formData);

	const config = {
		headers: {
			'Content-Type': 'application/json',
		},
	};
	try {
		const res = await axios.post('/api/expence', expence, config);

		dispatch({
			type: EXPENCE_REGISTERED,
			payload: res.data,
		});
		dispatch(setAlert('Gasto/Ingreso Registrado', 'success', '1'));
		dispatch(updateLoadingSpinner(false));
		window.scrollTo(500, 0);
		history.push(`/dashboard/${user_id}`);
		dispatch(clearRegister());
	} catch (err) {
		if (err.response !== null) {
			if (err.response.data.msg !== undefined) {
				dispatch(setAlert(err.response.data.msg, 'danger', '2'));
			} else {
				const errors = err.response.data.errors;
				if (errors.length !== 0) {
					errors.forEach((error) => {
						dispatch(setAlert(error.msg, 'danger', '2'));
					});
				}
			}
			window.scrollTo(500, 0);
		}
		dispatch(updateLoadingSpinner(false));
		dispatch({
			type: EXPENCE_ERROR,
		});
	}
};

export const deleteExpence = (expence_id) => async (dispatch) => {
	try {
		dispatch(updateLoadingSpinner(true));

		await axios.delete(`/api/expence/${expence_id}`);

		dispatch({
			type: EXPENCE_DELETED,
			payload: expence_id,
		});
		dispatch(updateLoadingSpinner(false));
		dispatch(setAlert('Movimiento Eliminado', 'success', '2'));
		window.scroll(500, 0);
		dispatch(clearRegister());
	} catch (err) {
		dispatch({
			type: EXPENCE_ERROR,
			payload: {
				type: err.response.statusText,
				status: err.response.status,
				msg: err.response.data.msg,
			},
		});
		dispatch(updateLoadingSpinner(false));
	}
};

export const updateExpenceTypes = (formData) => async (dispatch) => {
	try {
		dispatch(updateLoadingSpinner(true));
		window.scrollTo(500, 0);

		let expencetypes = JSON.stringify(formData);

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		const res = await axios.post('/api/expence-type', expencetypes, config);
		dispatch({
			type: EXPENCETYPES_UPDATED,
			payload: res.data,
		});
		dispatch(setAlert('Tipos de Movimientos Modificados', 'success', '2'));
		dispatch(updateLoadingSpinner(false));
	} catch (err) {
		if (err.response !== null) {
			if (err.response.data.msg !== undefined) {
				dispatch(setAlert(err.response.data.msg, 'danger', '2'));
			} else {
				const errors = err.response.data.errors;
				if (errors.length !== 0) {
					errors.forEach((error) => {
						dispatch(setAlert(error.msg, 'danger', '2'));
					});
				}
			}
			window.scrollTo(500, 0);
		}
		dispatch(updateLoadingSpinner(false));
	}
};
