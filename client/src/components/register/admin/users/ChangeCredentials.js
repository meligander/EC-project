import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Loading from '../../../modal/Loading';
import Confirm from '../../../modal/Confirm';

//Actions
import { setAlert } from '../../../../actions/alert';
import { updateCredentials, loadUser } from '../../../../actions/user';

const ChangeCredentials = ({
	match,
	setAlert,
	updateCredentials,
	history,
	loadUser,
	auth: { userLogged },
	users: { user, loading },
}) => {
	const [formData, setFormData] = useState({
		email: '',
		password: '',
		password2: '',
	});

	const [toggleModal, setToggleModal] = useState(false);

	const { email, password, password2 } = formData;

	useEffect(() => {
		if (!loading)
			setFormData((prev) => ({
				...prev,
				email: !user.email ? '' : user.email,
			}));
		else {
			loadUser(match.params.id);
		}
	}, [loading, match.params.id, loadUser, user]);

	const onChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const onSubmit = () => {
		if ((password !== '' || password2 !== '') && password !== password2) {
			setAlert('Las contraseñas deben coincidir', 'danger', '2');
			window.scrollTo(500, 0);
		} else {
			updateCredentials(formData, history, user._id);
		}
	};

	return (
		<>
			{!loading ? (
				<div className='p-4'>
					<Confirm
						toggleModal={toggleModal}
						setToggleModal={setToggleModal}
						confirm={onSubmit}
						text='¿Está seguro que desea aplicar los cambios?'
					/>
					<h3 className='heading-secondary text-primary'>
						Modificar Credenciales
					</h3>
					<h4 className='heading-tertiary text-primary-2 text-moved-right'>
						<i className='fas fa-unlock'></i>{' '}
						{`Cambio de ${
							userLogged.type === 'Administrador' ||
							userLogged.type === 'Secretaria'
								? 'Email y/o '
								: ''
						}Contraseña`}
					</h4>
					<form className='form'>
						<div className='form-group'>
							<input
								className='form-input'
								id='email'
								type='text'
								value={email}
								disabled={
									userLogged.type !== 'Administrador' &&
									userLogged.type !== 'Secretaria'
								}
								name='email'
								onChange={(e) => onChange(e)}
								placeholder='Dirección de correo electrónico'
							/>
							<label htmlFor='email' className='form-label'>
								Dirección de correo electrónico
							</label>
						</div>
						<div className='form-group'>
							<input
								className='form-input'
								id='password'
								type='password'
								value={password}
								placeholder='Nueva contraseña'
								onChange={(e) => onChange(e)}
								name='password'
							/>
							<label htmlFor='email' className='form-label'>
								Nueva contraseña
							</label>
						</div>
						<div className='form-group'>
							<input
								className='form-input'
								id='password2'
								type='password'
								value={password2}
								placeholder='Confirmación de contraseña'
								onChange={(e) => onChange(e)}
								name='password2'
							/>
							<label htmlFor='email' className='form-label'>
								Confirmación de contraseña
							</label>
						</div>
						<div className='btn-right'>
							<button
								onClick={(e) => {
									e.preventDefault();
									setToggleModal(true);
								}}
								className='btn btn-primary'
							>
								<i className='fas fa-user-check'></i> Guardar Cambios
							</button>
						</div>
					</form>
				</div>
			) : (
				<Loading />
			)}
		</>
	);
};

ChangeCredentials.prototypes = {
	setAlert: PropTypes.func.isRequired,
	updateCredentials: PropTypes.func.isRequired,
	loadUser: PropTypes.func.isRequired,
	users: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	users: state.users,
	auth: state.auth,
});

export default connect(mapStateToProps, {
	setAlert,
	updateCredentials,
	loadUser,
})(ChangeCredentials);
