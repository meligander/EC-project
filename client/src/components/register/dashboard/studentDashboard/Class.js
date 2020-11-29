import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { loadUsersClass } from '../../../../actions/class';
import PropTypes from 'prop-types';

const Class = ({
	loadUsersClass,
	classes: { classInfo, loading },
	users: { user },
}) => {
	useEffect(() => {
		loadUsersClass(user._id);
	}, [loadUsersClass, user]);

	return (
		<div className='class row bg-lighter'>
			{!loading && classInfo !== null ? (
				<>
					<div className='title '>
						<p className='heading-secondary text-primary'>Curso</p>
						<p className='heading-tertiary text-dark m-1'>
							Categoría: <small>{classInfo.category.name}</small>
						</p>
						<Link className='btn-text' to={`/class/${classInfo._id}`}>
							Ver Info
						</Link>
					</div>
					<div className='description bg-white'>
						<div className='heading-tertiary'>
							<p className='text-dark'>
								Profesor:{' '}
								<small>
									{classInfo.teacher.name} {classInfo.teacher.lastname}
								</small>
							</p>
							<Link
								className='btn-text'
								to={`/dashboard/${classInfo.teacher._id}`}
							>
								Ver Info
							</Link>
						</div>

						<p>
							<span className='text-dark'>Aula: </span>
							{classInfo.classroom}
						</p>

						{classInfo.hourin1 === classInfo.hourin2 &&
						classInfo.hourout2 === classInfo.hourout1 ? (
							<>
								<p>
									<span className='text-dark'>Días:</span> {classInfo.day1} y{' '}
									{classInfo.day2}{' '}
								</p>
								<p>
									<span className='text-dark'>Horario: </span>{' '}
									<Moment format='HH:mm' date={classInfo.hourin1} /> -{' '}
									<Moment format='HH:mm' date={classInfo.hourout1} />
								</p>
							</>
						) : (
							<>
								<p>
									<span className='text-dark'>{classInfo.day1}: </span>
									<Moment format='HH:mm' date={classInfo.hourin1} /> -{' '}
									<Moment format='HH:mm' date={classInfo.hourout1} />
								</p>
								<p>
									<span className='text-dark'>{classInfo.day2}: </span>
									<Moment format='HH:mm' date={classInfo.hourin2} /> -{' '}
									<Moment format='HH:mm' date={classInfo.hourout2} />
								</p>
							</>
						)}
					</div>
				</>
			) : (
				<div>
					<p className='heading-tertiary pt-1 text-center'>
						El alumno no está registrado en ningua clase
					</p>
				</div>
			)}
		</div>
	);
};

Class.propTypes = {
	loadUsersClass: PropTypes.func.isRequired,
	users: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	classes: state.classes,
	users: state.users,
});

export default connect(mapStateToProps, { loadUsersClass })(Class);
