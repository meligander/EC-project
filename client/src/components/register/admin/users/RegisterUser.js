import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import PropTypes from 'prop-types';
import Loading from '../../../modal/Loading';
import Confirm from '../../../modal/Confirm';
import RelatedStudents from '../../../RelatedStudents';

//Actions
import { registerUser, loadUser } from '../../../../actions/user';
import { getStudentNumber } from '../../../../actions/mixvalues';
import { loadTowns, clearTowns } from '../../../../actions/town';
import {
	loadTownNeighbourhoods,
	clearNeighbourhoods,
} from '../../../../actions/neighbourhood';

const RegisterUser = ({
	match,
	registerUser,
	history,
	auth,
	users: { user, loading },
	towns,
	neighbourhoods,
	location,
	loadUser,
	loadTowns,
	loadTownNeighbourhoods,
	getStudentNumber,
	mixvalues: { studentNumber },
	clearNeighbourhoods,
	clearTowns,
}) => {
	const isAdmin =
		auth.userLogged.type === 'Administrador' ||
		auth.userLogged.type === 'Secretaria' ||
		auth.userLogged.type === 'Admin/Profesor';
	const [otherValues, setOtherValues] = useState({
		isEditing: false,
		oneGettingInfo: true,
		oneLoad: true,
		cleared: false,
		toggleModal: false,
		previewSource: '',
		fileInputState: '',
		selectedFile: '',
	});

	const {
		isEditing,
		oneLoad,
		cleared,
		oneGettingInfo,
		toggleModal,
		previewSource,
		fileInputState,
		selectedFile,
	} = otherValues;

	const [formData, setFormData] = useState({
		studentnumber: '',
		name: '',
		lastname: '',
		email: '',
		tel: '',
		cel: '',
		type: '',
		dni: '',
		town: 0,
		neighbourhood: 0,
		address: '',
		dob: '',
		birthprov: '',
		birthtown: '',
		sex: 'Femenino',
		salary: '',
		degree: '',
		school: '',
		children: [],
		description: '',
		discount: '',
		chargeday: '',
		img: '',
		active: true,
	});

	const {
		studentnumber,
		name,
		lastname,
		email,
		tel,
		cel,
		type,
		dni,
		town,
		neighbourhood,
		address,
		dob,
		birthprov,
		birthtown,
		sex,
		degree,
		school,
		salary,
		children,
		description,
		discount,
		chargeday,
		active,
	} = formData;

	useEffect(() => {
		const getNumber = () => {
			if (studentNumber !== '') {
				setFormData((prev) => ({
					...prev,
					studentnumber: studentNumber,
				}));
			} else {
				if (oneGettingInfo) {
					getStudentNumber();
					setOtherValues((prev) => ({
						...prev,
						oneGettingInfo: false,
					}));
				}
			}
		};

		if (!cleared) {
			clearTowns();
			clearNeighbourhoods();
			setOtherValues((prev) => ({
				...prev,
				cleared: true,
			}));
		}

		const load = () => {
			setOtherValues((prev) => ({
				...prev,
				isEditing: true,
			}));
			if (user.town) loadTownNeighbourhoods(user.town._id);
			if (user.dob) user.dob = moment.utc(user.dob).format('YYYY-MM-DD');
			setFormData((prev) => ({
				...prev,
				studentnumber: !user.studentnumber ? '' : user.studentnumber,
				name: user.name,
				lastname: user.lastname,
				type: user.type,
				active: user.active,
				tel: !user.tel ? '' : user.tel,
				cel: !user.cel ? '' : user.cel,
				dni: !user.dni ? '' : user.dni,
				town: !user.town ? '' : user.town._id,
				neighbourhood: !user.neighbourhood ? '' : user.neighbourhood._id,
				address: !user.address ? '' : user.address,
				dob: !user.dob ? '' : user.dob,
				birthprov: !user.birthprov ? '' : user.birthprov,
				birthtown: !user.birthtown ? '' : user.birthtown,
				sex: !user.sex ? '' : user.sex,
				degree: !user.degree ? '' : user.degree,
				school: !user.school ? '' : user.school,
				salary: !user.salary ? '' : user.salary,
				description: !user.description ? '' : user.description,
				discount: user.discount === undefined ? '' : user.discount,
				chargeday: !user.chargeday ? '' : user.chargeday,
			}));
		};
		if (towns.loading) loadTowns();
		if (location.pathname !== '/register') {
			if (!loading && oneLoad) {
				load();
				setOtherValues((prev) => ({
					...prev,
					oneLoad: false,
				}));
			} else {
				if (loading && oneGettingInfo) {
					setOtherValues((prev) => ({
						...prev,
						oneGettingInfo: false,
					}));
					loadUser(match.params.id);
				}
			}
		} else {
			getNumber();
		}
	}, [
		oneLoad,
		loading,
		location.pathname,
		match.params.id,
		studentNumber,
		getStudentNumber,
		user,
		towns,
		loadTownNeighbourhoods,
		loadTowns,
		loadUser,
		oneGettingInfo,
		cleared,
		clearTowns,
		clearNeighbourhoods,
	]);

	const onChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
		if (e.target.name === 'town') {
			loadTownNeighbourhoods(e.target.value);
		}
	};

	const onChangeImg = (e) => {
		if (e.target.value) {
			const file = e.target.files[0];
			previewFile(file, e.target.value);
		}
	};

	const previewFile = (file, state) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onloadend = () => {
			setOtherValues({
				...otherValues,
				previewSource: reader.result,
				selectedFile: file,
				fileInputState: state,
			});
		};
	};

	const onChangeCheckbox = (e) => {
		console.log('hola');
		setFormData({
			...formData,
			active: e.target.checked,
		});
	};

	const setChildren = (student, add = true) => {
		if (add) {
			children.push({ user: student });
		} else {
			setFormData({
				...formData,
				children: children.filter((child) => child.user !== student),
			});
		}
	};

	const setToggle = () => {
		setOtherValues({ ...otherValues, toggleModal: !toggleModal });
	};

	const onSubmit = () => {
		registerUser(
			{
				...formData,
				...(selectedFile && { img: previewSource }),
			},
			history,
			isEditing,
			user ? user._id : null
		);
	};

	return (
		<>
			{!loading || (!isEditing && !auth.loading) ? (
				<>
					<Confirm
						toggleModal={toggleModal}
						setToggleModal={setToggle}
						confirm={onSubmit}
						text={`¿Está seguro que desea ${
							isEditing ? 'aplicar los cambios' : 'registrar al nuevo usuario'
						}?`}
					/>
					<div>
						<h2 className='mb-2'>
							<i className={`fas fa-user-${isEditing ? 'edit' : 'plus'}`}></i>{' '}
							{isEditing ? 'Editar' : 'Registrar nuevo'} usuario
						</h2>
						{/* 
						<h4 className='heading-tertiary text-primary-2 mb-4'>
							<i className={`fas fa-user-${isEditing ? 'edit' : 'plus'}`}></i>{' '}
							{isEditing
								? 'Edite la cuenta'
								: 'Crea una cuenta para un nuevo usuario'}
						</h4> */}

						{isEditing && (
							<div className='btn-right mb-3'>
								<Link
									to={`/credentials/${user._id}`}
									className='btn btn-primary'
								>
									<i className='fas fa-unlock'></i> &nbsp; Modificar
									credenciales
								</Link>
							</div>
						)}
						<form
							onSubmit={(e) => {
								e.preventDefault();
								setOtherValues({
									...otherValues,
									toggleModal: true,
								});
							}}
							className='form'
						>
							<h3 className='heading-tertiary text-primary-2'>Datos:</h3>
							<div className='form-group'>
								<input
									type='text'
									name='name'
									id='name'
									className='form-input'
									disabled={!isAdmin}
									value={name}
									onChange={(e) => onChange(e)}
									placeholder='Nombre'
								/>
								<label htmlFor='name' className='form-label'>
									Nombre
								</label>
							</div>
							<div className='form-group'>
								<input
									className='form-input'
									type='text'
									name='lastname'
									id='lastname'
									value={lastname}
									disabled={!isAdmin}
									onChange={(e) => onChange(e)}
									placeholder='Apellido'
								/>
								<label htmlFor='lastname' className='form-label'>
									Apellido
								</label>
							</div>
							{!isEditing && (
								<div className='form-group'>
									<input
										className='form-input'
										type='text'
										value={email}
										name='email'
										id='email'
										onChange={(e) => onChange(e)}
										placeholder='Dirección de correo electrónico'
									/>
									<label htmlFor='email' className='form-label'>
										Dirección de correo electrónico
									</label>
								</div>
							)}
							<div className='form-group'>
								<input
									className='form-input'
									type='text'
									name='tel'
									id='tel'
									disabled={!isAdmin}
									value={tel}
									onChange={(e) => onChange(e)}
									placeholder='Teléfono'
								/>
								<label htmlFor='tel' className='form-label'>
									Teléfono
								</label>
							</div>
							<div className='form-group'>
								<input
									className='form-input'
									type='text'
									name='cel'
									id='cel'
									disabled={!isAdmin}
									value={cel}
									onChange={(e) => onChange(e)}
									placeholder='Celular'
								/>
								<label htmlFor='cel' className='form-label'>
									Celular
								</label>
							</div>
							<div className='form-group'>
								<select
									className='form-input'
									name='type'
									id='type'
									disabled={!isAdmin}
									value={type}
									onChange={(e) => onChange(e)}
								>
									<option value='0'>* Seleccione el tipo de usuario</option>
									<option value='Alumno'>Alumno</option>
									<option value='Tutor'>Tutor</option>
									<option value='Profesor'>Profesor</option>
									<option value='Secretaria'>Secretaria</option>
									{(auth.userLogged.type === 'Administrador' ||
										auth.userLogged.type === 'Admin/Profesor') && (
										<>
											<option value='Administrador'>Administrador</option>
											<option value='Admin/Profesor'>Admin/Profesor</option>
										</>
									)}
								</select>
								<label
									htmlFor='type'
									className={`form-label ${
										type === '' || type === '0' ? 'lbl' : ''
									}`}
								>
									Tipo de usuario
								</label>
							</div>
							{type === 'Alumno' && (
								<div className='form-group'>
									<input
										className='form-input'
										type='number'
										value={studentnumber}
										name='registerNumber'
										id='registerNumber'
										disabled
									/>
									<label htmlFor='registerNumber' className='form-label'>
										Legajo
									</label>
								</div>
							)}
							{type !== 'Administrador' &&
								type !== 'Admin/Profesor' &&
								type !== 'Tutor' && (
									<div className='form-group'>
										<input
											className='form-input'
											type='number'
											value={dni}
											disabled={!isAdmin}
											onChange={(e) => onChange(e)}
											name='dni'
											id='dni'
											placeholder='DNI'
										/>
										<label htmlFor='dni' className='form-label'>
											DNI
										</label>
									</div>
								)}
							<div className='form-group'>
								<div className='radio-group' id='radio-group'>
									<input
										className='form-radio'
										type='radio'
										value='Femenino'
										onChange={(e) => onChange(e)}
										checked={sex === 'Femenino'}
										disabled={!isAdmin}
										name='sex'
										id='rbf'
									/>
									<label className='radio-lbl' htmlFor='rbf'>
										Femenino
									</label>
									<input
										className='form-radio'
										type='radio'
										value='Masculino'
										onChange={(e) => onChange(e)}
										disabled={!isAdmin}
										name='sex'
										checked={sex === 'Masculino'}
										id='rbm'
									/>
									<label className='radio-lbl' htmlFor='rbm'>
										Masculino
									</label>
								</div>
								<label htmlFor='radio-group' className='form-label-show'>
									Seleccione el sexo
								</label>
							</div>

							<div
								className={`${
									(auth.userLogged.type === 'Administrador' ||
										auth.userLogged.type === 'Admin/Profesor') &&
									'border'
								}`}
							>
								<div className='form-group'>
									<select
										className='form-input'
										name='town'
										id='town'
										disabled={!isAdmin}
										value={town}
										onChange={(e) => onChange(e)}
									>
										<option value='0'>* Seleccione localidad donde vive</option>
										{!towns.loading &&
											towns.towns.map((town) => (
												<option key={town._id} value={town._id}>
													{town.name}
												</option>
											))}
									</select>
									<label
										htmlFor='town'
										className={`form-label ${
											town === '' || town === 0 ? 'lbl' : ''
										}`}
									>
										Localidad donde vive
									</label>
								</div>
								<div className='form-group'>
									<select
										className='form-input'
										name='neighbourhood'
										id='neighbourhood'
										value={neighbourhood}
										disabled={!isAdmin}
										onChange={(e) => onChange(e)}
									>
										{!neighbourhoods.loading ? (
											<>
												{neighbourhoods.neighbourhoods.length === 0 ? (
													<option value='0'>
														Dicha localidad no tiene barrios adheridos
													</option>
												) : (
													<>
														<option value='0'>
															* Seleccione barrio donde vive
														</option>
														{neighbourhoods.neighbourhoods.map(
															(neighbourhood) => (
																<option
																	key={neighbourhood._id}
																	value={neighbourhood._id}
																>
																	{neighbourhood.name}
																</option>
															)
														)}
													</>
												)}
											</>
										) : (
											<option value='0'>
												Seleccione primero una localidad
											</option>
										)}
									</select>
									<label
										htmlFor='neighbourhood'
										className={`form-label ${
											neighbourhood === '' || neighbourhood === 0 ? 'lbl' : ''
										}`}
									>
										Barrio donde vive
									</label>
								</div>
								{(auth.userLogged.type === 'Administrador' ||
									auth.userLogged.type === 'Admin/Profesor') && (
									<div className='btn-right'>
										<Link to='/edit-towns-neighbourhoods' className='btn'>
											<i className='far fa-edit'></i> Editar
										</Link>
									</div>
								)}
							</div>
							<div className='form-group'>
								<input
									className='form-input'
									type='text'
									value={address}
									disabled={!isAdmin}
									onChange={(e) => onChange(e)}
									name='address'
									id='address'
									placeholder='Dirección'
								/>
								<label htmlFor='address' className='form-label'>
									Dirección
								</label>
							</div>
							{type !== 'Administrador' &&
								type !== 'Admin/Profesor' &&
								type !== 'Tutor' &&
								type !== '' && (
									<div className='form-group'>
										<input
											className='form-input'
											type='date'
											value={dob}
											disabled={!isAdmin}
											onChange={(e) => onChange(e)}
											name='dob'
											id='dob'
										/>
										<label htmlFor='dob' className='form-label-show'>
											Fecha de nacimiento
										</label>
									</div>
								)}
							{type === 'Alumno' && isAdmin && (
								<>
									<div className='form-group'>
										<select
											className='form-input'
											name='discount'
											id='discount'
											value={discount}
											onChange={(e) => onChange(e)}
										>
											<option value=''>
												* Seleccione el tipo de descuento
											</option>
											<option value='0'>Ninguno</option>
											<option value='10'>Hermanos</option>
											<option value='50'>Media Beca</option>
										</select>
										<label
											htmlFor='discount'
											className={`form-label ${
												discount === '' || discount === '0' ? 'lbl' : ''
											}`}
										>
											Tipo de descuento
										</label>
									</div>
									<div className='form-group'>
										<select
											className='form-input'
											name='chargeday'
											id='chargeday'
											value={chargeday}
											onChange={(e) => onChange(e)}
										>
											<option>* Seleccione día de recargo</option>
											<option value='10'>10</option>
											<option value='15'>15</option>
											<option value='31'>30/31</option>
										</select>
										<label
											htmlFor='chargeday'
											className={`form-label ${
												chargeday === '' || chargeday === '0' ? 'lbl' : ''
											}`}
										>
											Seleccione el dia del mes en que se aplica el recargo a la
											cuota
										</label>
									</div>
								</>
							)}
							{type !== 'Administrador' &&
								type !== 'Admin/Profesor' &&
								type !== 'Tutor' && (
									<>
										<div className='form-group'>
											<select
												className='form-input'
												value={birthprov}
												name='birthprov'
												id='birthprov'
												disabled={!isAdmin}
												onChange={(e) => onChange(e)}
											>
												<option value='0'>
													* Seleccione Provincia de Nacimiento
												</option>
												<option value='Buenos Aires'>Buenos Aires</option>
												<option value='Catamarca'>Catamarca</option>
												<option value='Córdoba'>Córdoba</option>
												<option value='Corrientes'>Corrientes</option>
												<option value='Chaco'>Chaco</option>
												<option value='Chubut'>Chubut</option>
												<option value='Entre Ríos'>Entre Ríos</option>
												<option value='Formosa'>Formosa</option>
												<option value='Jujuy'>Jujuy</option>
												<option value='La Pampa'>La Pampa</option>
												<option value='La Rioja'>La Rioja</option>
												<option value='Mendoza'>Mendoza</option>
												<option value='Misiones'>Misiones</option>
												<option value='Neuquén'>Neuquén</option>
												<option value='Río Negro'>Río Negro</option>
												<option value='Salta'>Salta</option>
												<option value='San Juan'>San Juan</option>
												<option value='San Luis'>San Luis</option>
												<option value='Santa Cruz'>Santa Cruz</option>
												<option value='Santa Fe'>Santa Fe</option>
												<option value='Santiago del Estero'>
													Santiago del Estero
												</option>
												<option value='Tierra del Fuego'>
													Tierra del Fuego
												</option>
												<option value='Tucumán'>Tucumán</option>
											</select>
											<label
												htmlFor='birthprov'
												className={`form-label ${
													birthprov === '' || birthprov === '0' ? 'lbl' : ''
												}`}
											>
												Provincia de nacimiento
											</label>
										</div>
										<div className='form-group'>
											<input
												className='form-input'
												type='text'
												name='birthtown'
												id='birthtown'
												disabled={!isAdmin}
												value={birthtown}
												onChange={(e) => onChange(e)}
												placeholder='Localidad de Nacimiento'
											/>
											<label htmlFor='birthtown' className='form-label'>
												Localidad de Nacimiento
											</label>
										</div>
									</>
								)}
							{type === 'Profesor' && (
								<>
									<div className='form-group'>
										<input
											className='form-input'
											type='text'
											name='degree'
											id='degree'
											disabled={!isAdmin}
											value={degree}
											onChange={(e) => onChange(e)}
											placeholder='Titulo'
										/>
										<label htmlFor='degree' className='form-label'>
											Titulo
										</label>
									</div>
									<div className='form-group'>
										<input
											className='form-input'
											type='text'
											name='school'
											id='school'
											disabled={!isAdmin}
											value={school}
											onChange={(e) => onChange(e)}
											placeholder='Institución donde se graduó'
										/>
										<label htmlFor='degree' className='form-label'>
											Institución donde se graduó
										</label>
									</div>
									{isAdmin && (
										<div className='form-group'>
											<input
												className='form-input'
												type='number'
												onChange={(e) => onChange(e)}
												value={salary}
												name='salary'
												id='salary'
												placeholder='Salario'
											/>
											<label htmlFor='salary' className='form-label'>
												Salario
											</label>
										</div>
									)}
								</>
							)}
							{type !== 'Tutor' && type !== 'Alumno' && type !== '' && (
								<div className='form-group'>
									<textarea
										className='form-input'
										name='description'
										id='description'
										rows='4'
										onChange={(e) => onChange(e)}
										value={description}
										placeholder='Descripción'
									></textarea>
									<label htmlFor='description' className='form-label'>
										Descripción
									</label>
								</div>
							)}
							<div className='form-group my-3'>
								<input
									className='form-checkbox'
									onChange={(e) => onChangeCheckbox(e)}
									type='checkbox'
									disabled={!isAdmin}
									checked={active}
									name='active'
									id='active'
								/>
								<label className='checkbox-lbl' htmlFor='active'>
									{active ? 'Activo' : 'Inactivo'}
								</label>
							</div>
							{type === 'Tutor' && (
								<div className='my-4'>
									<RelatedStudents
										user_id={user !== null && user._id}
										isEditing={isEditing}
										setChildrenForm={setChildren}
										isAdmin={isAdmin}
									/>
								</div>
							)}

							{previewSource && (
								<div className='text-center mt-3'>
									<img
										className='round-img'
										src={previewSource}
										alt='chosen img'
									/>
								</div>
							)}
							{isEditing && (
								<div className='upl-img my-5'>
									<div
										className={`fileUpload ${fileInputState ? 'success' : ''}`}
									>
										<input
											id='fileInput'
											type='file'
											name='image'
											/* value={fileInputState} */
											onChange={(e) => onChangeImg(e)}
											className='upload'
										/>
										<span>
											<i className='fa fa-cloud-upload'></i> Subir imágen
										</span>
									</div>
								</div>
							)}

							<div className='btn-ctr '>
								<button className='btn btn-primary'>
									{isEditing ? (
										<i className='fas fa-user-edit'></i>
									) : (
										<i className='fas fa-user-plus'></i>
									)}{' '}
									{isEditing ? 'Guardar Cambios' : 'Registrar'}
								</button>
							</div>
						</form>
					</div>
				</>
			) : (
				<Loading />
			)}
		</>
	);
};

RegisterUser.prototypes = {
	registerUser: PropTypes.func.isRequired,
	loadTowns: PropTypes.func.isRequired,
	loadTownNeighbourhoods: PropTypes.func.isRequired,
	loadUser: PropTypes.func.isRequired,
	getStudentNumber: PropTypes.func.isRequired,
	clearNeighbourhoods: PropTypes.func.isRequired,
	clearTowns: PropTypes.func.isRequired,
	mixvalues: PropTypes.object.isRequired,
	users: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
	towns: PropTypes.object.isRequired,
	neighbourhoods: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	users: state.users,
	auth: state.auth,
	towns: state.towns,
	neighbourhoods: state.neighbourhoods,
	mixvalues: state.mixvalues,
});

export default connect(mapStateToProps, {
	registerUser,
	loadUser,
	loadTowns,
	loadTownNeighbourhoods,
	getStudentNumber,
	clearNeighbourhoods,
	clearTowns,
})(RegisterUser);
