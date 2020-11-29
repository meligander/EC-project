import React, { useState, useEffect } from 'react';
import DashboardRelative from './DashboardRelative';
import Class from './studentDashboard/Class';
import Attendances from './studentDashboard/Attendances';
import Debts from './studentDashboard/Debts';
import Grades from './studentDashboard/Grades';
import PropTypes from 'prop-types';

const DashboardStudent = ({ user, userLogged }) => {
	const [pass, setPass] = useState(false);

	useEffect(() => {
		if (userLogged.type === 'Tutor' && user.type === 'Alumno') {
			for (let x = 0; x < userLogged.children.length; x++) {
				if (userLogged.children[x].user._id === user._id) {
					setPass(true);
					break;
				}
			}
		}
	}, [userLogged, user]);

	return (
		<>
			<DashboardRelative tutor={true} />
			<Class />
			{(userLogged.type === 'Secretaria' ||
				userLogged.type === 'Admin/Profesor' ||
				userLogged.type === 'Administrador' ||
				(userLogged.type === 'Alumno' && user._id === userLogged._id) ||
				pass) && (
				<>
					<Grades />
					<Attendances />
					<Debts />
				</>
			)}
		</>
	);
};

DashboardStudent.prototypes = {
	user: PropTypes.object.isRequired,
	userLogged: PropTypes.object.isRequired,
};

export default DashboardStudent;
