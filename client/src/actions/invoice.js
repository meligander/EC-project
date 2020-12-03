import {
	INVOICES_LOADED,
	INVOICE_REGISTERED,
	INVOICE_ERROR,
	INVOICE_DELETED,
} from './types';
import axios from 'axios';
import { setAlert } from './alert';
import moment from 'moment';
import { saveAs } from 'file-saver';
import { clearRegister } from './register';
import { updateLoadingSpinner, updateAdminDashLoading } from './mixvalues';

export const loadInvoices = (filterData) => async (dispatch) => {
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
		const res = await axios.get(`/api/invoice?${filter}`);
		dispatch({
			type: INVOICES_LOADED,
			payload: res.data,
		});
		dispatch(updateLoadingSpinner(false));
	} catch (err) {
		dispatch({
			type: INVOICE_ERROR,
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

export const deleteInvoice = (invoice_id) => async (dispatch) => {
	try {
		dispatch(updateLoadingSpinner(true));

		await axios.delete(`/api/invoice/${invoice_id}`);

		dispatch({
			type: INVOICE_DELETED,
			payload: invoice_id,
		});
		dispatch(updateLoadingSpinner(false));
		dispatch(updateAdminDashLoading());
		dispatch(clearRegister());
		dispatch(setAlert('Factura Eliminada', 'success', '2'));
		window.scroll(500, 0);
	} catch (err) {
		dispatch({
			type: INVOICE_ERROR,
			payload: {
				type: err.response.statusText,
				status: err.response.status,
				msg: err.response.data.msg,
			},
		});
		dispatch(updateLoadingSpinner(false));
	}
};

export const registerInvoice = (formData, history, user_id) => async (
	dispatch
) => {
	dispatch(updateLoadingSpinner(true));
	let invoice = {};
	for (const prop in formData) {
		if (formData[prop]) invoice[prop] = formData[prop];
	}

	invoice = JSON.stringify(invoice);

	const config = {
		headers: {
			'Content-Type': 'application/json',
		},
	};
	try {
		const res = await axios.post('/api/invoice', invoice, config);

		dispatch({
			type: INVOICE_REGISTERED,
			payload: res.data,
		});
		dispatch(setAlert('Factura Registrada', 'success', '1'));
		dispatch(updateLoadingSpinner(false));
		dispatch(updateAdminDashLoading());
		dispatch(clearRegister());
		window.scrollTo(500, 0);
		history.push(`/dashboard/${user_id}`);
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
			type: INVOICE_ERROR,
		});
	}
};

export const invoicesPDF = (invoices) => async (dispatch) => {
	let invoice = JSON.stringify(invoices);

	try {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		await axios.post('/api/invoice/create-list', invoice, config);

		const pdf = await axios.get('/api/invoice/list/fetch-list', {
			responseType: 'blob',
		});

		const pdfBlob = new Blob([pdf.data], { type: 'application/pdf' });

		const date = moment().format('DD-MM-YY');

		saveAs(pdfBlob, `Ingresos ${date}.pdf`);

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
