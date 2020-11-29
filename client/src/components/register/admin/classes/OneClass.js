import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { loadClass, clearClass, deleteClass } from '../../../../actions/class';
import { clearAttendances } from '../../../../actions/attendance';
import { clearGrades } from '../../../../actions/grade';
import Moment from 'react-moment';
import { Link, withRouter } from 'react-router-dom';
import Loading from '../../../modal/Loading';
import PropTypes from 'prop-types';
import ClassInfo from './ClassInfo';
import Confirm from '../../../modal/Confirm';

const OneClass = ({
	history,
	match,
	classes: { classInfo, loading },
	auth: { userLogged },
	loadClass,
	clearClass,
	deleteClass,
	clearAttendances,
	clearGrades,
}) => {
	const [toggleModal, setToggleModal] = useState(false);

	useEffect(() => {
		clearClass();
		loadClass(match.params.id, false);
	}, [loadClass, match.params.id, clearClass]);

	const setToggle = () => {
		setToggleModal(!toggleModal);
	};

	const confirm = () => {
		deleteClass(classInfo._id, history);
	};

	return (
		<>
			{!loading && classInfo.students ? (
				<>
					<Confirm
						toggleModal={toggleModal}
						setToggleModal={setToggle}
						text='¿Está seguro que desea eliminar el curso?'
						confirm={confirm}
					/>
					<h1 className='pt-3 text-center light-font'>Curso</h1>
					<ClassInfo classInfo={classInfo} />
					{classInfo.students.length > 0 && (
						<table>
							<thead>
								<tr>
									<th>Legajo</th>
									<th>Nombre</th>
									<th>Fec. Nac.</th>
									<th>Celular</th>
									<th>&nbsp;</th>
								</tr>
							</thead>
							<tbody>
								{classInfo.students.map((user) => (
									<tr key={user._id}>
										<td>{user.studentnumber}</td>
										<td>{user.lastname + ' ' + user.name}</td>
										<td>
											{user.dob && <Moment format='DD/MM/YY' date={user.dob} />}
										</td>
										<td>{user.cel && user.cel}</td>
										<td>
											<Link to={`/dashboard/${user._id}`} className='btn-text'>
												Info &rarr;
											</Link>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					)}
					{classInfo.students.length === 0 && (
						<p className='heading-tertiary text-secondary my-5 text-center'>
							No hay ningun alumno anotado en esta clase
						</p>
					)}
					<div className='btn-ctr'>
						{userLogged.type !== 'Alumno' && userLogged.type !== 'Tutor' && (
							<>
								<Link
									to={
										classInfo.students.length > 0
											? `/grades/${classInfo._id}`
											: '!#'
									}
									className={
										classInfo.students.length > 0
											? 'btn btn-primary'
											: 'btn btn-black'
									}
									onClick={clearGrades}
								>
									<i className='fas fa-marker'></i>{' '}
									<span className='hide-sm'>Notas</span>
								</Link>
								<Link
									to={
										classInfo.students.length > 0
											? `/attendance/${classInfo._id}`
											: '!#'
									}
									className={
										classInfo.students.length > 0
											? 'btn btn-primary'
											: 'btn btn-black'
									}
									onClick={clearAttendances}
								>
									<i className='fas fa-check-circle'></i>{' '}
									<span className='hide-sm'>Inasistencias</span>
								</Link>
							</>
						)}
						<Link
							to={
								classInfo.students.length > 0 ? `/chat/${classInfo._id}` : '!#'
							}
							className={
								classInfo.students.length > 0
									? 'btn btn-primary'
									: 'btn btn-black'
							}
						>
							<i className='far fa-comments'></i>{' '}
							<span className='hide-sm'>Chat</span>
						</Link>
					</div>
					<br />
					{userLogged.type !== 'Alumno' && userLogged.type !== 'Tutor' && (
						<div className='btn-right'>
							<button className='btn btn-secondary'>
								<i className='far fa-save'></i>
							</button>
							<button className='btn btn-secondary'>
								<i className='fas fa-print'></i>
							</button>
							<Link
								to={`/edit-class/${classInfo._id}`}
								className='btn btn-light'
							>
								<i className='far fa-edit'></i>
							</Link>
							<button className='btn btn-danger' onClick={setToggle}>
								<i className='far fa-trash-alt'></i>
							</button>
						</div>
					)}
				</>
			) : !loading && classInfo === null ? (
				<div className='class p-2 bg-white'>
					<h1 className='text-primary x-large text-dark p-1'>Curso</h1>
					<p className='lead'>El alumno no está asignado a ninguna clase</p>
				</div>
			) : (
				<Loading />
			)}
		</>
	);
};

OneClass.propTypes = {
	classes: PropTypes.object.isRequired,
	loadClass: PropTypes.func.isRequired,
	clearClass: PropTypes.func.isRequired,
	deleteClass: PropTypes.func.isRequired,
	clearAttendances: PropTypes.func.isRequired,
	clearGrades: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	classes: state.classes,
	auth: state.auth,
});

export default connect(mapStateToProps, {
	loadClass,
	clearClass,
	deleteClass,
	clearGrades,
	clearAttendances,
})(withRouter(OneClass));
