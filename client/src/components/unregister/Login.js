import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { loginUser } from '../../actions/auth';
import { changePage } from '../../actions/navbar';
import Alert from '../Alert';
import PropTypes from 'prop-types';

const Login = ({
	loginUser,
	auth: { userLogged, isAuthenticated },
	changePage,
}) => {
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});

	const { email, password } = formData;

	const onChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		let credentials = {};
		if (formData.password !== '') credentials.password = formData.password;
		if ((credentials.email = formData.email !== ''))
			credentials.email = formData.email;
		loginUser(credentials);
		changePage('index');
	};
	if (isAuthenticated) {
		return <Redirect to={`/dashboard/${userLogged._id}`} />;
	}

	return (
		<div className='inner-container'>
			<Alert type='2' />
			<h3 className='heading-secondary text-primary'>Iniciar Sesión</h3>
			<p className='heading-tertiary text-primary-2 text-moved-right'>
				<i className='fas fa-user'></i> Inicie sesión en su cuenta
			</p>
			<form onSubmit={onSubmit} className='form'>
				<div className='form-group'>
					<input
						className='form-input'
						type='email'
						name='email'
						value={email}
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
						type='password'
						value={password}
						name='password'
						onChange={(e) => onChange(e)}
						placeholder='Contraseña'
					/>
					<label htmlFor='name' className='form-label'>
						Contraseña
					</label>
				</div>
				<div className='btn-right'>
					<button type='submit' className='btn btn-primary'>
						<i className='fas fa-sign-in-alt'></i> &nbsp;Iniciar Sesión
					</button>
				</div>
			</form>
		</div>
	);
};

Login.prototypes = {
	loginUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	changePage: PropTypes.func.isRequired,
	loadUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps, {
	loginUser,
	changePage,
})(Login);
