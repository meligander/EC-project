import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { clearSearch } from '../../../../actions/user';
import { registerInvoice } from '../../../../actions/invoice';
import { removeInstallmentFromList } from '../../../../actions/debts';
import { setAlert } from '../../../../actions/alert';
import { getInvoiceNumber } from '../../../../actions/mixvalues';
import moment from 'moment';
import StudentSearch from '../../../StudentSearch';
import Confirm from '../../../modal/Confirm';

const InvoiceTab = ({
	history,
	debt: { debts },
	auth: { userLogged },
	mixvalues: { invoiceNumber },
	clearSearch,
	setAlert,
	getInvoiceNumber,
	registerInvoice,
	removeInstallmentFromList,
	clearRegister,
}) => {
	const [adminValues, setAdminValues] = useState({
		day: moment().format('DD/MM/YYYY'),
		selectedUser: {},
		registerUser: false,
		toggleModal: false,
	});
	const [invoice, setInvoice] = useState({
		name: '',
		lastname: '',
		email: '',
		user: '',
		invoiceid: '',
		total: 0,
		details: [],
		remaining: 0,
	});

	const {
		name,
		lastname,
		email,
		invoiceid,
		details,
		total,
		remaining,
	} = invoice;
	const { day, selectedUser, registerUser, toggleModal } = adminValues;

	useEffect(() => {
		if (invoiceNumber === '') getInvoiceNumber();
		else {
			if (invoiceid === '')
				setInvoice((prev) => ({
					...prev,
					invoiceid: invoiceNumber,
				}));
		}
		const initInput = () => {
			if (debts.length > details.length) {
				const newItem = {
					item: debts[debts.length - 1],
					payment: '',
				};

				setInvoice((prev) => ({
					...prev,
					details: [...prev.details, newItem],
					remaining: prev.remaining + debts[debts.length - 1].value,
				}));
			}
		};
		if (debts.length > 0) initInput();
	}, [debts, getInvoiceNumber, invoiceNumber, invoiceid, details.length]);

	const selectUser = (user) => {
		setAdminValues({ ...adminValues, selectedUser: user, registerUser: true });
		setInvoice({
			...invoice,
			user: user._id,
			email: user.email,
		});
		clearSearch();
	};

	const onChange = (e) => {
		setInvoice({
			...invoice,
			[e.target.name]: e.target.value,
		});
	};

	const onChangeValue = (e, item, index) => {
		let newDetails = [...details];
		newDetails[index] = {
			item,
			payment: e.target.value,
		};
		const totalAmount = newDetails.reduce(
			(accum, item) => accum + Number(item.payment),
			0
		);
		const totalRemaining = newDetails.reduce(
			(accum, item) => accum + (item.item.value - Number(item.payment)),
			0
		);
		setInvoice({
			...invoice,
			details: newDetails,
			total: totalAmount,
			remaining: totalRemaining,
		});
		setAdminValues({ ...adminValues });
	};

	const removeItem = (id) => {
		removeInstallmentFromList(id);
		setInvoice({
			...invoice,
			details: details.filter((detail) => detail.item._id !== id),
		});
	};

	const installment = (number) => {
		switch (number) {
			case 0:
				return 'Insc';
			case 3:
				return 'Mar';
			case 4:
				return 'Abr';
			case 5:
				return 'May';
			case 6:
				return 'Jun';
			case 7:
				return 'Jul';
			case 8:
				return 'Agto';
			case 9:
				return 'Sept';
			case 10:
				return 'Oct';
			case 11:
				return 'Nov';
			case 12:
				return 'Dic';
			default:
				break;
		}
	};

	const setToggle = () => {
		setAdminValues({ ...adminValues, toggleModal: !toggleModal });
	};

	const beforeToggle = () => {
		if (total === 0) {
			setAlert('Debe registrar el pago de una cuota primero', 'danger', '2');
			window.scroll(0, 0);
		} else setAdminValues({ ...adminValues, toggleModal: !toggleModal });
	};

	const confirm = () => {
		registerInvoice(invoice, history, userLogged._id);
	};

	return (
		<>
			<Confirm
				toggleModal={toggleModal}
				setToggleModal={setToggle}
				confirm={confirm}
				text='¿Está seguro que la factura es correcta?'
			/>
			<form className='form bigger'>
				<div className='form-group my-4'>
					<div className='two-in-row'>
						<input
							className='form-input'
							type='number'
							name='invoiceid'
							value={invoiceid}
							disabled
						/>
						<input className='form-input' type='text' value={day} disabled />
					</div>
					<div className='two-in-row'>
						<label className='form-label'>Factura ID</label>
						<label className='form-label'>Fecha</label>
					</div>
				</div>
				<h3 className='paragraph text-primary'>Usuario a Pagar</h3>
				<div className='form-group'>
					{!registerUser ? (
						<>
							<div className='two-in-row'>
								<input
									className='form-input'
									type='text'
									onChange={onChange}
									name='name'
									value={name}
									placeholder='Nombre'
								/>
								<input
									className='form-input'
									type='text'
									onChange={onChange}
									value={lastname}
									name='lastname'
									placeholder='Apellido'
								/>
							</div>
							<div className='two-in-row'>
								<label className={`form-label ${name === '' ? 'lbl' : ''}`}>
									Nombre
								</label>
								<label className={`form-label ${lastname === '' ? 'lbl' : ''}`}>
									Apellido
								</label>
							</div>
						</>
					) : (
						<>
							<input
								className='form-input'
								type='text'
								value={selectedUser.lastname + ' ' + selectedUser.name}
								placeholder='Alumno'
								disabled
								id='full-name'
							/>
							<label htmlFor='full-name' className='form-label'>
								Nombre Completo
							</label>
						</>
					)}
				</div>
				<div className='form-group mb-3'>
					<input
						className='form-input'
						type='email'
						name='email'
						id='email'
						onChange={onChange}
						value={registerUser ? selectedUser.email : email}
						disabled={registerUser}
						placeholder='Email'
					/>
					<label htmlFor='email' className='form-label'>
						Email
					</label>
				</div>
				<StudentSearch
					studentDebt={true}
					selectStudent={selectUser}
					selectedStudent={selectedUser}
					student={false}
				/>
			</form>
			<h3 className='text-primary heading-tertiary'>Detalle de Factura</h3>
			{details.length > 0 && (
				<table>
					<thead>
						<tr>
							<th>Nombre</th>
							<th>Cuota</th>
							<th>Importe</th>
							<th>A Pagar</th>
							<th>&nbsp;</th>
						</tr>
					</thead>
					<tbody>
						{details.map((invoice, index) => {
							const name = 'payment' + index;
							return (
								<tr key={index}>
									<td>
										{invoice.item.student.lastname +
											' ' +
											invoice.item.student.name}
									</td>
									<td>{installment(invoice.item.number)}</td>
									<td>{invoice.item.value}</td>
									<td>
										<input
											type='number'
											onChange={(e) => onChangeValue(e, invoice.item, index)}
											placeholder='Monto'
											min='0'
											max='1800'
											name={name}
											value={invoice.payment}
										/>
									</td>
									<td>
										<button
											onClick={(e) => {
												e.preventDefault();
												removeItem(invoice.item._id);
											}}
											className='btn btn-secondary-2'
										>
											Quitar
										</button>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			)}

			<div className='text-right my-3'>
				<div className='invoice-detail'>
					<label htmlFor='remaining'>Saldo</label>
					<input type='number' value={remaining} disabled name='remaining' />
				</div>
				<div className='invoice-detail'>
					<label htmlFor='total'>Total a Pagar</label>
					<input type='number' name='total' value={total} disabled />
				</div>
				<button
					type='submit'
					onClick={beforeToggle}
					className='btn btn-primary mt-3'
				>
					<i className='fas fa-file-invoice-dollar'></i> Pagar
				</button>
			</div>
		</>
	);
};

InvoiceTab.propTypes = {
	debt: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
	clearSearch: PropTypes.func.isRequired,
	getInvoiceNumber: PropTypes.func.isRequired,
	registerInvoice: PropTypes.func.isRequired,
	setAlert: PropTypes.func.isRequired,
	removeInstallmentFromList: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	debt: state.debt,
	auth: state.auth,
	mixvalues: state.mixvalues,
});

export default connect(mapStateToProps, {
	clearSearch,
	setAlert,
	getInvoiceNumber,
	registerInvoice,
	removeInstallmentFromList,
})(withRouter(InvoiceTab));
