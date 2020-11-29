import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { loadClass } from '../../../actions/class';
import { loadAttendances } from '../../../actions/attendance';
import AttendanceTab from './AttendanceTab';
import PropTypes from 'prop-types';
import ClassInfo from '../admin/classes/ClassInfo';
import Loading from '../../modal/Loading';
import Tabs from '../../Tabs';

const Attendance = ({
	match,
	classes: { loading, classInfo },
	loadAttendances,
	loadClass,
	attendance,
}) => {
	useEffect(() => {
		if (loading) {
			loadClass(match.params.id);
		}
		if (attendance.loading) {
			loadAttendances(match.params.id);
		}
	}, [
		match.params.id,
		loadClass,
		loadAttendances,
		attendance.loading,
		loading,
	]);

	return (
		<>
			{!attendance.loading ? (
				<>
					<h1 className='text-center light-font p-1 mt-2'>Inasistencias</h1>
					<ClassInfo classInfo={classInfo} />
					<div className='few-tabs'>
						<Tabs
							tablist={[
								'1° Bimestre',
								'2° Bimestre',
								'3° Bimestre',
								'4° Bimestre',
							]}
							panellist={[
								AttendanceTab,
								AttendanceTab,
								AttendanceTab,
								AttendanceTab,
							]}
						/>
					</div>
				</>
			) : (
				<Loading />
			)}
		</>
	);
};

Attendance.propTypes = {
	classes: PropTypes.object.isRequired,
	attendance: PropTypes.object.isRequired,
	loadClass: PropTypes.func.isRequired,
	loadAttendances: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	classes: state.classes,
	attendance: state.attendance,
});

export default connect(mapStateToProps, {
	loadClass,
	loadAttendances,
})(withRouter(Attendance));
