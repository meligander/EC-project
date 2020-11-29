import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { loadStudentDebts, clearInstallments } from '../actions/debts';
import { clearSearch } from '../actions/user';
import { setAlert } from '../actions/alert';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import StudentSearch from './StudentSearch';
import DebtsTable from './tables/DebtsTable';

const InstallmentsSearch = ({
	match,
	location,
	debt: { usersDebts, loadingUsersDebts },
	loadStudentDebts,
	clearSearch,
	clearInstallments,
	setAlert,
}) => {
	useEffect(() => {
		if (match.params.studentid === '0' || location.pathname === '/invoice') {
			clearInstallments();
			clearSearch();
		} else {
			setSelectedStudent((prev) => ({
				...prev,
				_id: match.params.studentid,
			}));
		}
	}, [
		clearSearch,
		clearInstallments,
		match.params.studentid,
		location.pathname,
	]);

	const [selectedStudent, setSelectedStudent] = useState({
		_id: '',
		name: '',
	});
	const invoice = location.pathname === '/invoice';

	const selectStudent = (user) => {
		setSelectedStudent({
			...selectedStudent,
			name: user.lastname + ' ' + user.name,
			_id: user._id,
		});
		clearInstallments();
	};

	const searchInstallments = (e) => {
		e.preventDefault();
		if (selectedStudent._id === '')
			setAlert('Debe seleccionar un usuario primero', 'danger', '3');
		else {
			if (invoice) clearSearch();
			loadStudentDebts(selectedStudent._id);
		}
	};
	return (
		<>
			<div className='form'>
				<StudentSearch
					selectedStudent={selectedStudent}
					addToList={searchInstallments}
					selectStudent={selectStudent}
					studentDebt={true}
					student={true}
				/>
			</div>
			{invoice && (
				<p className='mb-3 paragraph'>
					<span className='text-dark heading-tertiary'>Alumno: </span>
					{selectedStudent.name}
				</p>
			)}
			{!loadingUsersDebts && usersDebts.rows.length > 0 ? (
				<DebtsTable forAdmin={true} />
			) : (
				!loadingUsersDebts &&
				usersDebts.rows.length === 0 && (
					<p className='heading-tertiary'>
						El alumno no tiene deudas hasta el momento
					</p>
				)
			)}
		</>
	);
};

InstallmentsSearch.propTypes = {
	debt: PropTypes.object.isRequired,
	loadStudentDebts: PropTypes.func.isRequired,
	clearSearch: PropTypes.func.isRequired,
	clearInstallments: PropTypes.func.isRequired,
	setAlert: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	debt: state.debt,
});

export default connect(mapStateToProps, {
	loadStudentDebts,
	clearSearch,
	clearInstallments,
	setAlert,
})(withRouter(InstallmentsSearch));
