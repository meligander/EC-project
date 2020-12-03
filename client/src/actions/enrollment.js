import {
	ENROLLMENT_LOADED,
	ENROLLMENT_REGISTERED,
	ENROLLMENTS_LOADED,
	ENROLLMENT_ERROR,
	ENROLLMENT_DELETED,
	ENROLLMENT_CLEARED,
	ENROLLMENT_UPDATED,
} from './types';
import axios from 'axios';
import moment from 'moment';
import { saveAs } from 'file-saver';
import { setAlert } from './alert';
import { updateLoadingSpinner, updateAdminDashLoading } from './mixvalues';

export const loadEnrollments = (filterData) => async (dispatch) => {
	try {
		dispatch(updateLoadingSpinner(true));
		let filter = '';

		const filternames = Object.keys(filterData);
		for (let x = 0; x < filternames.length; x++) {
			const name = filternames[x];
			if (filterData[name] !== '') {
				if (filter !== '') filter = filter + '&';
				filter = filter + filternames[x] + '=' + filterData[name];
			}
		}
		const res = await axios.get(`/api/enrollment?${filter}`);
		dispatch({
			type: ENROLLMENTS_LOADED,
			payload: res.data,
		});
		dispatch(updateLoadingSpinner(false));
	} catch (err) {
		if (err.response) {
			dispatch({
				type: ENROLLMENT_ERROR,
				payload: {
					type: err.response.statusText,
					status: err.response.status,
					msg: err.response.data.msg,
				},
			});
			dispatch(setAlert(err.response.data.msg, 'danger', '2'));
			window.scroll(0, 0);
		}

		dispatch(updateLoadingSpinner(false));
	}
};

export const loadEnrollment = (enrollment_id) => async (dispatch) => {
	try {
		const res = await axios.get(`/api/enrollment/one/${enrollment_id}`);
		dispatch({
			type: ENROLLMENT_LOADED,
			payload: res.data,
		});
	} catch (err) {
		dispatch({
			type: ENROLLMENT_ERROR,
			payload: {
				type: err.response.statusText,
				status: err.response.status,
				msg: err.response.data.msg,
			},
		});
	}
};

export const registerEnrollment = (
	formData,
	history,
	user_id,
	enroll_id = 0
) => async (dispatch) => {
	dispatch(updateLoadingSpinner(true));
	let enrollment = {};
	for (const prop in formData) {
		if (formData[prop]) enrollment[prop] = formData[prop];
	}

	enrollment = JSON.stringify(enrollment);

	const config = {
		headers: {
			'Content-Type': 'application/json',
		},
	};
	try {
		let res;
		if (!enroll_id) {
			res = await axios.post('/api/enrollment', enrollment, config);
		} else {
			res = await axios.put(`/api/enrollment/${enroll_id}`, enrollment, config);
		}

		dispatch({
			type: !enroll_id ? ENROLLMENT_REGISTERED : ENROLLMENT_UPDATED,
			payload: res.data,
		});
		dispatch(updateLoadingSpinner(false));
		dispatch(updateAdminDashLoading());
		dispatch(
			setAlert(
				`Inscripción ${!enroll_id ? 'Registrada' : 'Modificada'}`,
				'success',
				'1'
			)
		);
		window.scrollTo(500, 0);
		if (!enroll_id) {
			history.push(`/dashboard/${user_id}`);
		} else {
			history.push('/enrollment-list');
		}
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

export const deleteEnrollment = (enroll_id) => async (dispatch) => {
	try {
		dispatch(updateLoadingSpinner(true));
		await axios.delete(`/api/enrollment/${enroll_id}`);

		dispatch({
			type: ENROLLMENT_DELETED,
			payload: enroll_id,
		});
		dispatch(updateAdminDashLoading());
		dispatch(updateLoadingSpinner(false));
		dispatch(setAlert('Inscripción Eliminada', 'success', '2'));
		window.scroll(500, 0);
	} catch (err) {
		dispatch({
			type: ENROLLMENT_ERROR,
			payload: {
				type: err.response.statusText,
				status: err.response.status,
				msg: err.response.data.msg,
			},
		});
		dispatch(updateLoadingSpinner(false));
	}
};

export const enrollmentsPDF = (enrollments) => async (dispatch) => {
	let enrollment = JSON.stringify(enrollments);

	try {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		await axios.post('/api/enrollment/create-list', enrollment, config);

		const pdf = await axios.get('/api/enrollment/fetch-list', {
			responseType: 'blob',
		});

		const pdfBlob = new Blob([pdf.data], { type: 'application/pdf' });

		const date = moment().format('DD-MM-YY');

		saveAs(pdfBlob, `Inscripciones ${date}.pdf`);

		dispatch(setAlert('PDF Generado', 'success', '2'));
		window.scroll(500, 0);
	} catch (err) {
		console.log(err.response);
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

export const clearEnrollment = () => (dispatch) => {
	dispatch({ type: ENROLLMENT_CLEARED });
};
