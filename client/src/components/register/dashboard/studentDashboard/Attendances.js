import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import { loadStudentAttendance } from '../../../../actions/attendance';
import PropTypes from 'prop-types';

const DashboardAttendances = ({
	loadStudentAttendance,
	users: { user },
	attendance: { attendances, loading },
}) => {
	useEffect(() => {
		loadStudentAttendance(user._id);
	}, [loadStudentAttendance, user._id]);

	return (
		<div className='bg-white p-2'>
			{!loading && (
				<>
					<h3 className='heading-tertiary text-primary p-1 m-1'>
						Inasistencias{' '}
						{attendances.length > 0 && (
							<span className='badge badge-secondary'>
								{' '}
								{attendances.length}
							</span>
						)}
					</h3>

					{attendances.length > 0 ? (
						<div className='absence'>
							{' '}
							{attendances.map((attendance, index) => (
								<div key={index} className='paragraph p-1'>
									<i className='far fa-times-circle'></i>{' '}
									<Moment format='DD/MM' date={attendance.date} utc />
								</div>
							))}
						</div>
					) : (
						<p className='heading-tertiary text-center'>No hay inasistencias</p>
					)}
				</>
			)}
		</div>
	);
};

DashboardAttendances.propTypes = {
	loadStudentAttendance: PropTypes.func.isRequired,
	users: PropTypes.object.isRequired,
	attendance: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	users: state.users,
	attendance: state.attendance,
});

export default connect(mapStateToProps, { loadStudentAttendance })(
	DashboardAttendances
);
