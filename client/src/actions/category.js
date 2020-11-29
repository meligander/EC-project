import { CATEGORY_ERROR, CATEGORIES_LOADED, CATEGORIES_UPDATED } from './types';
import { setAlert } from './alert';
import { updateLoadingSpinner } from './mixvalues';
import axios from 'axios';

export const loadCategories = () => async (dispatch) => {
	try {
		const res = await axios.get('/api/category');
		dispatch({
			type: CATEGORIES_LOADED,
			payload: res.data,
		});
	} catch (err) {
		dispatch({
			type: CATEGORY_ERROR,
			payload: {
				type: err.response.statusText,
				status: err.response.status,
				msg: err.response.data.msg,
			},
		});
	}
};

export const updateCategories = (formData, history, user_id) => async (
	dispatch
) => {
	dispatch(updateLoadingSpinner(true));
	let categories = JSON.stringify(formData);

	const config = {
		headers: {
			'Content-Type': 'application/json',
		},
	};
	try {
		const res = await axios.put('/api/category', categories, config);
		dispatch({
			type: CATEGORIES_UPDATED,
			payload: res.data,
		});
		dispatch(setAlert('Precios de categorias actualizados', 'success', '1'));
		dispatch(updateLoadingSpinner(false));
		window.scrollTo(500, 0);
		history.push(`/dashboard/${user_id}`);
	} catch (err) {
		console.log(err);
		if (err.response !== null) {
			if (err.response.data.msg !== undefined) {
				dispatch(setAlert(err.response.data.msg, 'danger', '2'));
				dispatch({
					type: CATEGORY_ERROR,
				});
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
