import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DashboardRelative from './DashboardRelative';
import DashboardStudent from './DashboardStudent';
import DashboardTeacher from './DashboardTeacher';
import DashboardAdmin from './DashboardAdmin';

const DashboardTypes = ({ users: { user, loading }, auth: { userLogged } }) => {
	if (!loading) {
		switch (user.type) {
			case 'Alumno':
				return <DashboardStudent user={user} userLogged={userLogged} />;
			case 'Profesor':
				return (
					<>
						{userLogged.type !== 'Alumno' && userLogged.type !== 'Tutor' && (
							<DashboardTeacher />
						)}
					</>
				);
			case 'Tutor':
				return <DashboardRelative tutor={false} />;
			case 'Secretaria':
			case 'Administrador':
			case 'Admin/Profesor':
				return (
					<>
						{(userLogged.type === 'Secretaria' ||
							userLogged.type === 'Administrador' ||
							userLogged.type === 'Admin/Profesor') && (
							<>
								<DashboardAdmin />
							</>
						)}
					</>
				);
			default:
				return <h1>Dashboard</h1>;
		}
	}
};

DashboardTypes.propTypes = {
	users: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	users: state.users,
	auth: state.auth,
});

export default connect(mapStateToProps)(DashboardTypes);
