import {
	ATTENDANCES_ERROR,
	USER_ATTENDANCES_LOADED,
	NEW_DATE_REGISTERED,
	DATES_DELETED,
	ATTENDANCES_LOADED,
	ATTENDANCES_UPDATED,
	ATTENDANCES_CLEARED,
} from './types';
import { setAlert } from './alert';
import { updateLoadingSpinner } from './mixvalues';
import axios from 'axios';

export const loadStudentAttendance = (user_id) => async (dispatch) => {
	try {
		const res = await axios.get(`/api/attendance/user/${user_id}`);
		dispatch({
			type: USER_ATTENDANCES_LOADED,
			payload: res.data,
		});
	} catch (err) {
		dispatch({
			type: ATTENDANCES_ERROR,
			payload: {
				type: err.response.statusText,
				status: err.response.status,
				msg: err.response.data.msg,
			},
		});
	}
};

export const loadAttendances = (class_id) => async (dispatch) => {
	try {
		dispatch(updateLoadingSpinner(true));
		const res = await axios.get(`/api/attendance/${class_id}`);
		dispatch({
			type: ATTENDANCES_LOADED,
			payload: res.data,
		});
		dispatch(updateLoadingSpinner(false));
	} catch (err) {
		dispatch({
			type: ATTENDANCES_ERROR,
			payload: {
				type: err.response.statusText,
				status: err.response.status,
				msg: err.response.data.msg,
			},
		});
		dispatch(updateLoadingSpinner(false));
	}
};

export const updateAttendances = (formData, history, class_id) => async (
	dispatch
) => {
	try {
		let attendances = [];
		attendances = JSON.stringify(formData);

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		const res = await axios.post('/api/attendance/period', attendances, config);
		dispatch({
			type: ATTENDANCES_UPDATED,
			payload: res.data,
		});
		history.push(`/class/${class_id}`);
		dispatch(setAlert('Inasistencias Modificadas', 'success', '2'));
		window.scrollTo(500, 0);
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
	}
};

export const registerNewDate = (newDate) => async (dispatch) => {
	try {
		dispatch(updateLoadingSpinner(true));
		let date = {};
		date = JSON.stringify(newDate);

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		const res = await axios.post('/api/attendance', date, config);
		dispatch({
			type: NEW_DATE_REGISTERED,
			payload: res.data,
		});
		dispatch(updateLoadingSpinner(false));
		dispatch(setAlert('Día Agregado', 'success', '2'));
		window.scrollTo(500, 0);
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

export const deleteDate = (date) => async (dispatch) => {
	try {
		dispatch(updateLoadingSpinner(true));
		const res = await axios.delete(`/api/attendance/date/${date}`);

		dispatch({
			type: DATES_DELETED,
			payload: res.data,
		});

		dispatch(setAlert('Fecha eliminada', 'success', '2'));
		dispatch(updateLoadingSpinner(false));
		window.scroll(500, 0);
	} catch (err) {
		dispatch({
			type: ATTENDANCES_ERROR,
			payload: {
				type: err.response.statusText,
				status: err.response.status,
				msg: err.response.data.msg,
			},
		});
		dispatch(updateLoadingSpinner(false));
	}
};

export const clearAttendances = () => (dispatch) => {
	dispatch({
		type: ATTENDANCES_CLEARED,
	});
};
