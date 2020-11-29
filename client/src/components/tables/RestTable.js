import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';

const RestTable = ({ loadingUsers, users, type, usersType }) => {
	return (
		<table>
			<thead>
				<tr>
					<th>Nombre</th>
					<th className='hide-sm'>Email</th>
					<th>Celular</th>
					{type !== 'Tutor' && <th className='hide-sm'>Fec. Nac.</th>}
					{(type === 'Secretaria' || type === 'Administrador') && <th>Rol</th>}
					{type === 'Tutor' && <th>Nombre Alumno</th>}
					<th>&nbsp;</th>
				</tr>
			</thead>
			<tbody>
				{!loadingUsers &&
					type === usersType &&
					users.map((user) => {
						const dob = moment(user.dob).format('DD/MM/YY');
						const username = user.email.substring(0, user.email.indexOf('@'));
						const email = user.email.substring(
							user.email.indexOf('@'),
							user.email.length
						);
						let name;
						if (usersType === 'Tutor') {
							for (let x = 0; x < user.children.length; x++) {
								if (user.children[x]) {
									name =
										user.children[x].user.lastname +
										' ' +
										user.children[x].user.name;
									break;
								}
							}
						}
						return (
							<tr key={user._id}>
								<td>
									{user.lastname} {user.name}
								</td>
								<td className='hide-sm'>
									{user.email && username + ' ' + email}
								</td>
								<td>{user.cel}</td>
								{usersType !== 'Tutor' && (
									<td className='hide-sm'>{user.dob && dob}</td>
								)}
								{usersType === 'Administrador' && <td>{user.type}</td>}
								{usersType === 'Tutor' && <td>{name}</td>}
								<td>
									<Link className='btn-text' to={`/dashboard/${user._id}`}>
										Más Info &rarr;
									</Link>
								</td>
							</tr>
						);
					})}
			</tbody>
		</table>
	);
};

RestTable.propTypes = {
	users: PropTypes.array.isRequired,
	loadingUsers: PropTypes.bool.isRequired,
	type: PropTypes.string.isRequired,
};

export default RestTable;
