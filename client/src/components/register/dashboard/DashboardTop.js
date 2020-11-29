import React, { useState } from 'react';
import Moment from 'react-moment';
import Confirm from '../../modal/Confirm';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { deleteUser } from '../../../actions/user';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const DashboardTop = ({
	history,
	deleteUser,
	user: {
		_id,
		type,
		name,
		lastname,
		studentnumber,
		active,
		dni,
		email,
		cel,
		tel,
		address,
		neighbourhood,
		town,
		dob,
		birthprov,
		birthtown,
		sex,
		chargeday,
		discount,
		degree,
		school,
		description,
		salary,
		img,
	},
	auth: { userLogged },
}) => {
	const [toggleModal, settoggleModal] = useState(false);

	const isAdmin =
		userLogged.type === 'Administrador' || userLogged.type === 'Admin/Profesor';

	const setToggle = () => {
		settoggleModal(!toggleModal);
	};

	const confirm = () => {
		deleteUser(_id, history, userLogged._id);
	};

	return (
		<>
			<Confirm
				setToggleModal={setToggle}
				toggleModal={toggleModal}
				confirm={confirm}
				text='¿Está seguro que desea eliminar el usuario?'
			/>
			<div className='profile-top bg-primary p-3'>
				<div className='img-about m-1'>
					<img src={img} alt='Perfil Alumno' className='round-img p-1' />
					<h3 className='heading-secondary text-center text-secondary light-font my-1'>
						{name + ' ' + lastname}
					</h3>
					{type === 'Alumno' && (
						<p className='heading-tertiary'>
							<span className='text-dark'>Legajo: </span>
							{studentnumber}
						</p>
					)}
					<p className='heading-tertiary text-dark'>
						Usuario {active ? 'Activo' : 'Inactivo'}
					</p>
				</div>

				<div className='about p-1'>
					<div className='about-info'>
						<h4 className='heading-tertiary'>Info {type}:</h4>
						{type !== 'Tutor' &&
							type !== 'Administrador' &&
							type !== 'Admin/Profesor' && (
								<p>
									<span className='text-dark'>DNI: </span>
									{dni}
								</p>
							)}
						<p>
							<span className='text-dark'>Email: </span>
							{email}
						</p>
						<p>
							<span className='text-dark'>Celular: </span>
							{cel}
						</p>
						<p>
							<span className='text-dark'>Teléfono: </span>
							{tel}
						</p>
						<p>
							<span className='text-dark'>Dirección: </span>
							{address},{' '}
							{neighbourhood !== undefined && neighbourhood !== null
								? neighbourhood.name + ', '
								: ''}
							{town !== undefined && town !== null && town.name}
						</p>
						{type !== 'Tutor' &&
							type !== 'Administrador' &&
							type !== 'Admin/Profesor' && (
								<p>
									<span className='text-dark'>Fecha de Nacimiento: </span>
									<Moment format='DD/MM/YYYY' date={dob} utc />
								</p>
							)}
						{type !== 'Tutor' &&
							type !== 'Administrador' &&
							type !== 'Admin/Profesor' && (
								<p>
									<span className='text-dark'>Lugar de Nacimiento: </span>
									{birthtown}, {birthprov}
								</p>
							)}
						{type === 'Profesor' && (
							<>
								<p>
									<span className='text-dark'>Título: </span>
									{degree}
								</p>
								<p>
									<span className='text-dark'>Institución: </span>
									{school}
								</p>
							</>
						)}
						{isAdmin && salary !== undefined && (
							<p>
								<span className='text-dark'>Salario: </span>
								{salary}
							</p>
						)}
						<p>
							<span className='text-dark'>Sexo: </span>
							{sex}
						</p>

						{type !== 'Tutor' && type !== 'Alumno' && (
							<p>
								<span className='text-dark'>Descripción: </span>
								{description}
							</p>
						)}

						{/* <!-- Solo para secretaria y admin --> */}
						{type === 'Alumno' && (
							<>
								{(isAdmin || userLogged.type === 'Secretaria') && (
									<p>
										<span className='text-dark'>Descuento: </span>
										{discount}
									</p>
								)}
								{(isAdmin || userLogged.type === 'Secretaria') && (
									<p>
										<span className='text-dark'>Dia recargo: </span>
										{chargeday}
									</p>
								)}
							</>
						)}
					</div>
					<div className='about-btn'>
						{(isAdmin || userLogged.type === 'Secretaria') && (
							<button className='btn btn-danger' onClick={setToggle}>
								<i className='fas fa-user-minus'></i>{' '}
								<span className='hide-md'>Eliminar</span>
							</button>
						)}
						{(isAdmin ||
							userLogged.type === 'Secretaria' ||
							userLogged._id === _id) && (
							<Link to={`/edit-user/${_id}`} className='btn btn-light'>
								<i className='far fa-edit'></i>{' '}
								<span className='hide-md'>Editar</span>
							</Link>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

DashboardTop.propTypes = {
	user: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
	deleteUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
	user: state.users.user,
});

export default connect(mapStateToProps, { deleteUser })(
	withRouter(DashboardTop)
);
