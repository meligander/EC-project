import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { loadUsersGrades } from '../../../../actions/grade';
import StudentGradesTable from '../../../tables/StudentGradesTable';
import PropTypes from 'prop-types';

const Grades = ({
	loadUsersGrades,
	grades: { usersGrades, loadingUsersGrades },
	users: { user },
}) => {
	useEffect(() => {
		loadUsersGrades(user._id);
	}, [user._id, loadUsersGrades]);

	return (
		<div className='bg-light-grey p-3'>
			{!loadingUsersGrades && (
				<>
					<h3 className='heading-tertiary p-1 text-primary'>Notas</h3>
					<div className='pb-2'>
						{usersGrades.rows.length === 0 ? (
							<p className='heading-tertiary text-center'>
								No hay notas registradas hasta el momento
							</p>
						) : (
							<StudentGradesTable usersGrades={usersGrades} />
						)}
					</div>
				</>
			)}
		</div>
	);
};

Grades.propTypes = {
	loadUsersGrades: PropTypes.func.isRequired,
	grades: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	grades: state.grades,
	users: state.users,
});

export default connect(mapStateToProps, { loadUsersGrades })(Grades);
