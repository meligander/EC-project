import {
	NEIGHBOURHOODS_LOADED,
	NEIGHBOURHOODS_ERROR,
	NEIGHBOURHOODS_UPDATED,
	NEIGHBOURHOODS_CLEARED,
} from './types';
import { updateLoadingSpinner } from './mixvalues';
import { setAlert } from './alert';
import axios from 'axios';

export const loadTownNeighbourhoods = (town_id) => async (dispatch) => {
	try {
		const res = await axios.get(`/api/neighbourhood/town/${town_id}`);
		dispatch({
			type: NEIGHBOURHOODS_LOADED,
			payload: res.data,
		});
	} catch (err) {
		dispatch({
			type: NEIGHBOURHOODS_ERROR,
			payload: {
				type: err.response.statusText,
				status: err.response.status,
				msg: err.response.data.msg,
			},
		});
	}
};

export const loadNeighbourhoods = () => async (dispatch) => {
	try {
		const res = await axios.get('/api/neighbourhood');
		dispatch({
			type: NEIGHBOURHOODS_LOADED,
			payload: res.data,
		});
	} catch (err) {
		dispatch({
			type: NEIGHBOURHOODS_ERROR,
			payload: {
				type: err.response.statusText,
				status: err.response.status,
				msg: err.response.data.msg,
			},
		});
	}
};

export const updateNeighbourhoods = (formData) => async (dispatch) => {
	try {
		dispatch(updateLoadingSpinner(true));
		window.scrollTo(500, 0);

		let neighbourhoods = JSON.stringify(formData);

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		const res = await axios.post('/api/neighbourhood', neighbourhoods, config);
		dispatch({
			type: NEIGHBOURHOODS_UPDATED,
			payload: res.data,
		});
		dispatch(setAlert('Barrios Modificados', 'success', '2'));
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

export const clearNeighbourhoods = () => (dispatch) => {
	dispatch({
		type: NEIGHBOURHOODS_CLEARED,
	});
};
