import React, { useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {
	logoutAndToggle,
	changePage,
	changePageAndMenu,
} from '../../../actions/navbar';
import PropTypes from 'prop-types';

const StudentNavbar = ({
	navbar: { showMenu, currentNav },
	logoutAndToggle,
	auth: { userLogged },
	changePage,
	changePageAndMenu,
	location,
}) => {
	useEffect(() => {
		const string = location.pathname.substring(1, location.pathname.length);
		const path =
			string.indexOf('/') !== -1
				? string.substring(0, string.indexOf('/'))
				: string;
		let id;
		if (path === 'dashboard') {
			id = string.substring(string.indexOf('/') + 1, string.length);
		}
		switch (path) {
			case 'chat':
				changePage('chat');
				break;
			case 'classinfo':
				changePage('classmates');
				break;
			case 'dashboard':
				if (id === userLogged._id) {
					changePage('index');
				} else {
					changePage('classmates');
				}
				break;
			default:
				changePage('index');
				break;
		}
	}, [changePage, location.pathname, userLogged._id]);

	return (
		<ul className={!showMenu ? 'menu-nav' : 'menu-nav show'}>
			<li
				className={
					!showMenu
						? 'nav-item'
						: `nav-item show ${currentNav === 'index' ? 'current' : ''}`
				}
			>
				<Link
					className='nav-link'
					to={`/dashboard/${userLogged._id}`}
					onClick={() => changePageAndMenu('index')}
				>
					<i className='fas fa-home'></i>
					<span className='hide-md'>&nbsp; Página Principal</span>
				</Link>
			</li>
			<li
				className={
					!showMenu
						? 'nav-item'
						: `nav-item show ${currentNav === 'chat' ? 'current' : ''}`
				}
			>
				<Link
					className='nav-link'
					to={`/chat/${
						userLogged.classroom !== null ? userLogged.classroom : 0
					}`}
					onClick={() => changePageAndMenu('chat')}
				>
					<i className='far fa-comments'></i>
					<span className='hide-md'>&nbsp; Posteo Grupal</span>
				</Link>
			</li>
			<li
				className={
					!showMenu
						? 'nav-item'
						: `nav-item show ${currentNav === 'classmates' ? 'current' : ''}`
				}
			>
				<Link
					className='nav-link'
					to={`/class/${
						userLogged.classroom !== null ? userLogged.classroom : 0
					}`}
					onClick={() => changePageAndMenu('classmates')}
				>
					<i className='fas fa-address-book'></i>
					<span className='hide-md'> &nbsp; Compañeros</span>
				</Link>
			</li>
			<li className={!showMenu ? 'nav-item' : 'nav-item show'}>
				<Link
					className='nav-link'
					to='/login'
					onClick={() => logoutAndToggle('login')}
				>
					<i className='fas fa-sign-out-alt'></i>
					<span className='hide-md'> &nbsp; Cerrar Sesión</span>
				</Link>
			</li>
		</ul>
	);
};

StudentNavbar.propTypes = {
	navbar: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
	logoutAndToggle: PropTypes.func.isRequired,
	changePage: PropTypes.func.isRequired,
	changePageAndMenu: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	navbar: state.navbar,
	auth: state.auth,
});

export default connect(mapStateToProps, {
	logoutAndToggle,
	changePage,
	changePageAndMenu,
})(withRouter(StudentNavbar));
