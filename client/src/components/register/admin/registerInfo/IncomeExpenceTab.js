import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { loadExpenceTypes, registerExpence } from '../../../../actions/expence';
import { loadUsers } from '../../../../actions/user';
import Confirm from '../../../modal/Confirm';
import PropTypes from 'prop-types';

const IncomeExpenceTab = ({
	auth: { userLogged },
	registers: { register, loading },
	expences,
	users,
	loadExpenceTypes,
	loadUsers,
	registerExpence,
	history,
}) => {
	const [otherValues, setOtherValues] = useState({
		show: false,
		toggleModal: false,
	});

	const [formData, setFormData] = useState({
		expencetype: '',
		value: '',
		description: '',
		hours: '',
		teacher: {
			_id: '',
			name: '',
			salary: '',
		},
	});

	const { expencetype, value, description, hours, teacher } = formData;

	const { show, toggleModal } = otherValues;

	useEffect(() => {
		loadExpenceTypes();
	}, [loadExpenceTypes]);

	const onChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
		if (
			e.target.name === 'expencetype' &&
			e.target.value === '5ebb3804958b15468012db7a'
		) {
			setOtherValues({
				...otherValues,
				show: true,
			});
			loadUsers({ type: 'Profesor', active: true }, false);
		} else
			setOtherValues({
				...otherValues,
				show: false,
			});
	};

	const onChangeTeacher = (e) => {
		let sal = 0;

		for (let x = 0; x < users.users.length; x++) {
			if (users.users[x]._id === e.target.value) {
				sal = users.users[x].salary;
			}
		}
		setFormData({
			...formData,
			teacher: {
				_id: e.target.value,
				name: e.target.options[e.target.selectedIndex].text,
				salary: sal,
			},
		});
	};

	const onSubmit = () => {
		let des = description;
		if (teacher._id !== '') des = 'Pago a ' + teacher.name + '.' + des;
		registerExpence(
			{ expencetype, value, description: des },
			history,
			userLogged._id
		);
	};

	const setToggle = () => {
		setOtherValues({
			...otherValues,
			toggleModal: !toggleModal,
		});
	};

	const setValueAfterHours = (e) => {
		setFormData({
			...formData,
			hours: e.target.value,
			value: e.target.value * teacher.salary,
		});
	};

	return (
		<div className='register income-tab'>
			<Confirm
				toggleModal={toggleModal}
				setToggleModal={setToggle}
				confirm={onSubmit}
				text='¿Está seguro que desea registrar un nuevo movimiento?'
			/>
			<table>
				<tbody>
					<tr>
						<td>Dinero en Caja</td>
						<td>${!loading && register.registermoney}</td>
					</tr>
					<tr>
						<td>Tipo de Gasto</td>
						<td>
							<select
								name='expencetype'
								value={expencetype}
								onChange={onChange}
								id='select'
							>
								<option value='0'>* Tipo de Movimiento</option>
								{!expences.loadingET &&
									expences.expencetypes.map((expty) => (
										<option key={expty._id} value={expty._id}>
											{expty.name}
										</option>
									))}
							</select>
						</td>
					</tr>
					{show && (
						<>
							<tr>
								<td>Profesor</td>
								<td>
									<select
										name='teacher'
										value={teacher._id}
										onChange={onChangeTeacher}
										id='select'
									>
										<option value='0'>* Profesor</option>
										{!users.loadingUsers &&
											users.users.map((user) => (
												<option key={user._id} value={user._id}>
													{user.lastname} {user.name}
												</option>
											))}
									</select>
								</td>
							</tr>
							<tr>
								<td>Horas</td>
								<td>
									<input
										type='number'
										onChange={setValueAfterHours}
										placeholder='Horas'
										value={hours}
										name='hours'
										id=''
									/>
								</td>
							</tr>
						</>
					)}
					<tr>
						<td>Importe</td>
						<td>
							<input
								type='text'
								placeholder='Importe'
								name='value'
								onChange={onChange}
								value={value}
							/>
						</td>
					</tr>
					<tr>
						<td>Descripción</td>
						<td>
							<textarea
								placeholder='Descripción'
								name='description'
								value={description}
								onChange={onChange}
							></textarea>
						</td>
					</tr>
				</tbody>
			</table>

			<div className='btn-ctr mt-5'>
				<button
					type='submit'
					onClick={(e) => {
						e.preventDefault();
						setToggle();
					}}
					className='btn btn-primary'
				>
					<i className='far fa-save'></i>
					<span className='hide-sm'> Guardar</span>
				</button>

				{(userLogged.type === 'Administrador' ||
					userLogged.type === 'Admin/Profesor') && (
					<Link to='/edit-expencetypes' className='btn btn-light'>
						<i className='fas fa-edit'></i>
						<span className='hide-sm'> Tipo Movimiento</span>
					</Link>
				)}
			</div>
		</div>
	);
};

IncomeExpenceTab.propTypes = {
	auth: PropTypes.object.isRequired,
	registers: PropTypes.object.isRequired,
	expences: PropTypes.object.isRequired,
	users: PropTypes.object.isRequired,
	loadExpenceTypes: PropTypes.func.isRequired,
	loadUsers: PropTypes.func.isRequired,
	registerExpence: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
	registers: state.registers,
	expences: state.expences,
	users: state.users,
});

export default connect(mapStateToProps, {
	loadExpenceTypes,
	registerExpence,
	loadUsers,
})(withRouter(IncomeExpenceTab));
