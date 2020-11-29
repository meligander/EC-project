import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import { loadTeachers, addUser } from '../../../../actions/user';
import { updateClass, registerUpdateClass } from '../../../../actions/class';
import ChosenChildrenTable from '../../../tables/ChosenChildrenTable';
import Confirm from '../../../modal/Confirm';
import PropTypes from 'prop-types';

const NewClassTab = ({
	history,
	location,
	updateClass,
	registerUpdateClass,
	loadTeachers,
	addUser,
	users: { teachers, loadingTeachers },
	classes: { classInfo, loading },
}) => {
	const register = location.pathname === '/register-class';
	const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

	const [otherValues, setOtherValues] = useState({
		toggleModal: false,
		oneLoad: true,
	});

	const [formData, setFormData] = useState({
		teacher: '',
		classroom: '',
		day1: '',
		day2: '',
		hourin1: '',
		hourin2: '',
		hourout1: '',
		hourout2: '',
	});

	const { toggleModal, oneLoad } = otherValues;

	const {
		teacher,
		classroom,
		day1,
		day2,
		hourin1,
		hourin2,
		hourout1,
		hourout2,
	} = formData;

	useEffect(() => {
		if (oneLoad) {
			if (loadingTeachers) {
				loadTeachers();
			}
			if (!register && !loading) {
				setFormData((prev) => ({
					...prev,
					teacher: classInfo.teacher._id,
					classroom: classInfo.classroom,
					day1: classInfo.day1,
					day2: classInfo.day2,
					hourin1: moment(classInfo.hourin1).format('HH:mm'),
					hourin2: moment(classInfo.hourin2).format('HH:mm'),
					hourout1: moment(classInfo.hourout1).format('HH:mm'),
					hourout2: moment(classInfo.hourout2).format('HH:mm'),
				}));
				setOtherValues((prev) => ({
					...prev,
					oneLoad: false,
				}));
			}
		}
	}, [
		loadTeachers,
		teachers,
		loadingTeachers,
		classInfo,
		loading,
		register,
		oneLoad,
	]);

	const onChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const deleteChild = (e, studentToDelete) => {
		e.preventDefault();
		let newStudents = classInfo.students.filter(
			(student) => student._id !== studentToDelete._id
		);
		addUser(studentToDelete);
		updateClass({ ...classInfo, students: newStudents });
	};

	const setToggle = (e) => {
		if (e) e.preventDefault();
		setOtherValues({ ...otherValues, toggleModal: !toggleModal });
	};

	const onSubmit = () => {
		if (register) {
			registerUpdateClass(
				{
					...formData,
					category: classInfo.category._id,
					students: classInfo.students,
				},
				history
			);
		} else {
			registerUpdateClass(
				{
					...formData,
					category: classInfo.category._id,
					students: classInfo.students,
				},
				history,
				classInfo._id
			);
		}
	};

	return (
		<>
			<Confirm
				toggleModal={toggleModal}
				setToggleModal={setToggle}
				confirm={onSubmit}
				text='¿Está seguro que los datos son correctos?'
			/>
			<form className='form'>
				<div className='form-group my-3 heading-tertiary'>
					<p>Categoría: &nbsp; {!loading && classInfo.category.name}</p>
				</div>
				<div className='form-group'>
					<select
						id='teacher'
						className='form-input'
						name='teacher'
						onChange={onChange}
						value={teacher}
					>
						<option value=''>* Seleccione Profesor</option>
						{!loadingTeachers &&
							teachers.length > 0 &&
							teachers.map((teacher) => (
								<option key={teacher._id} value={teacher._id}>
									{teacher.lastname + ' ' + teacher.name}
								</option>
							))}
					</select>
					<label
						htmlFor='teacher'
						className={`form-label ${teacher === '' ? 'lbl' : ''}`}
					>
						Categoría
					</label>
				</div>
				<div className='form-group'>
					<input
						className='form-input'
						type='number'
						id='classroom'
						onChange={onChange}
						name='classroom'
						value={classroom}
						placeholder='Aula'
					/>
					<label htmlFor='classroom' className='form-label'>
						Aula
					</label>
				</div>
				<div className='form-group'>
					<select
						id='day1'
						className='form-input'
						name='day1'
						onChange={onChange}
						value={day1}
					>
						<option value=''>* Seleccione Día 1</option>
						{days.map((day, index) => (
							<option key={index} value={day}>
								{day}
							</option>
						))}
					</select>
					<label
						htmlFor='day1'
						className={`form-label ${day1 === '' ? 'lbl' : ''}`}
					>
						Día 1
					</label>
				</div>
				<div className='form-group'>
					<div className='two-in-row'>
						<input
							className='form-input'
							type='time'
							name='hourin1'
							value={hourin1}
							onChange={onChange}
							min='08:00'
							max='22:00'
						/>
						<input
							className='form-input'
							type='time'
							name='hourout1'
							onChange={onChange}
							value={hourout1}
							min='08:00'
							max='22:00'
						/>
					</div>
					<div className='two-in-row'>
						<label className='form-label show'>Entrada</label>
						<label className='form-label show'>Salida</label>
					</div>
				</div>
				<div className='form-group'>
					<select
						id='day2'
						className='form-input'
						name='day2'
						onChange={onChange}
						value={day2}
					>
						<option value='0'>* Seleccione Día 2</option>
						{days.map((day, index) => (
							<option key={index} value={day}>
								{day}
							</option>
						))}
					</select>
					<label
						htmlFor='day2'
						className={`form-label ${day2 === '' ? 'lbl' : ''}`}
					>
						Día 2
					</label>
				</div>
				<div className='form-group'>
					<div className='two-in-row'>
						<input
							className='form-input'
							type='time'
							name='hourin2'
							value={hourin2}
							onChange={onChange}
							min='08:00'
							max='22:00'
						/>
						<input
							className='form-input'
							type='time'
							name='hourout2'
							onChange={onChange}
							value={hourout2}
							min='08:00'
							max='22:00'
						/>
					</div>
					<div className='two-in-row'>
						<label className='form-label show'>Entrada</label>
						<label className='form-label show'>Salida</label>
					</div>
				</div>
			</form>
			<h3 className='text-primary heading-tertiary my-3'>Lista de Alumnos</h3>
			{!loading && classInfo.students ? (
				<>
					{classInfo.students.length > 0 ? (
						<ChosenChildrenTable
							children={classInfo.students}
							deleteChild={deleteChild}
						/>
					) : (
						<p className='text-secondary paragraph'>
							Todavía no hay alumnos añadidos
						</p>
					)}
				</>
			) : (
				<p className='text-secondary paragraph'>
					Todavía no hay alumnos añadidos
				</p>
			)}
			<div className='btn-ctr'>
				<input
					className='btn btn-primary'
					onClick={setToggle}
					type='submit'
					value={register ? 'Registrar' : 'Guardar Cambios'}
				/>
			</div>
		</>
	);
};

NewClassTab.propTypes = {
	users: PropTypes.object.isRequired,
	classes: PropTypes.object.isRequired,
	updateClass: PropTypes.func.isRequired,
	loadTeachers: PropTypes.func.isRequired,
	registerUpdateClass: PropTypes.func.isRequired,
	addUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	users: state.users,
	classes: state.classes,
});

export default connect(mapStateToProps, {
	loadTeachers,
	updateClass,
	registerUpdateClass,
	addUser,
})(withRouter(NewClassTab));
