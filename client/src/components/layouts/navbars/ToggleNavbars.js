import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AdminNavbar from './AdminNavbar';
import GuestNavbar from './GuestNavbar';
import StudentNavbar from './StudentNavbar';
import TeacherNavbar from './TeacherNavbar';
import TutorNavbar from './TutorNavbar';

const ToggleNavbars = ({ auth: { userLogged, isAuthenticated } }) => {
	if (isAuthenticated) {
		switch (userLogged.type) {
			case 'Alumno':
				return <StudentNavbar />;
			case 'Profesor':
				return <TeacherNavbar />;
			case 'Tutor':
				return <TutorNavbar />;
			case 'Administrador':
			case 'Secretaria':
			case 'Admin/Profesor':
				return <AdminNavbar />;
			default:
				return <GuestNavbar />;
		}
	} else {
		return <GuestNavbar />;
	}
};

ToggleNavbars.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps)(ToggleNavbars);
