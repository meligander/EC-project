import React, { useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {
	logoutAndToggle,
	changePage,
	changePageAndMenu,
} from '../../../actions/navbar';
import PropTypes from 'prop-types';

const AdminNavbar = ({
	location,
	navbar: { showMenu, currentNav },
	auth: { userLogged },
	logoutAndToggle,
	changePage,
	changePageAndMenu,
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
			case 'classes':
			case 'class':
			case 'attendance':
			case 'grades':
			case 'edit-class':
			case 'edit-gradetypes':
			case 'register-class':
				changePage('classes');
				break;
			case 'cashregister-info':
			case 'edit-expencetypes':
			case 'income-list':
			case 'expence-list':
			case 'register-list':
				changePage('register');
				break;
			case 'register':
			case 'edit-user':
			case 'edit-towns-neighbourhoods':
			case 'credentials':
			case 'search':
				changePage('search');
				break;
			case 'enrollment-list':
			case 'enrollment':
			case 'edit-enrollment':
				changePage('enrollment');
				break;
			case 'invoice':
				changePage('invoice');
				break;
			case 'dashboard':
				if (id === userLogged._id) {
					changePage('index');
				} else {
					changePage('search');
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
						? 'nav-item smaller'
						: `nav-item smaller show ${currentNav === 'index' ? 'current' : ''}`
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
						? 'nav-item smaller'
						: `nav-item smaller show ${
								currentNav === 'search' ? 'current' : ''
						  }`
				}
			>
				<Link
					className='nav-link'
					to='/search'
					onClick={() => changePageAndMenu('search')}
				>
					<i className='fas fa-search'></i>
					<span className='hide-md'> &nbsp; Búsqueda</span>
				</Link>
			</li>
			<li
				className={
					!showMenu
						? 'nav-item smaller'
						: `nav-item smaller show ${
								currentNav === 'classes' ? 'current' : ''
						  }`
				}
			>
				<Link
					className='nav-link'
					to='/classes'
					onClick={() => changePageAndMenu('classes')}
				>
					<i className='fas fa-chalkboard'></i>
					<span className='hide-md'>&nbsp; Cursos</span>
				</Link>
			</li>
			<li
				className={
					!showMenu
						? 'nav-item smaller'
						: `nav-item smaller show ${
								currentNav === 'enrollment' ? 'current' : ''
						  }`
				}
			>
				<Link
					className='nav-link'
					to='/enrollment'
					onClick={() => changePageAndMenu('enrollment')}
				>
					<i className='fas fa-user-edit'></i>
					<span className='hide-md'>&nbsp; Inscripción</span>
				</Link>
			</li>
			<li
				className={
					!showMenu
						? 'nav-item smaller'
						: `nav-item smaller show ${
								currentNav === 'invoice' ? 'current' : ''
						  }`
				}
			>
				<Link
					className='nav-link'
					to='/invoice'
					onClick={() => changePageAndMenu('invoice')}
				>
					<i className='fas fa-hand-holding-usd'></i>
					<span className='hide-md'>&nbsp; Facturación</span>
				</Link>
			</li>
			<li
				className={
					!showMenu
						? 'nav-item smaller'
						: `nav-item smaller show ${
								currentNav === 'register' ? 'current' : ''
						  }`
				}
			>
				<Link
					className='nav-link'
					to='/cashregister-info'
					onClick={() => changePageAndMenu('register')}
				>
					<i className='fas fa-cash-register'></i>
					<span className='hide-md'>&nbsp; Caja</span>
				</Link>
			</li>
			<li className={!showMenu ? 'nav-item smaller' : 'nav-item show smaller'}>
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

AdminNavbar.propTypes = {
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
})(withRouter(AdminNavbar));
