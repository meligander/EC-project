import React, { useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {
	logoutAndToggle,
	changePageAndMenu,
	changePage,
} from '../../../actions/navbar';
import PropTypes from 'prop-types';

const TutorNavbar = ({
	location,
	navbar: { showMenu, currentNav },
	auth: { userLogged },
	posts: { post },
	logoutAndToggle,
	changePage,
	changePageAndMenu,
}) => {
	useEffect(() => {
		const string = location.pathname.substring(1, location.pathname.length);
		let id = string.substring(
			string.indexOf('/') + 1,
			location.pathname.length
		);
		if (id.length > 25) {
			if (post !== null) id = post.classroom;
		}
		let pass = false;
		for (let x = 0; x < userLogged.children.length; x++) {
			if (
				userLogged.children[x].user._id === id ||
				userLogged.children[x].user.classroom === id
			) {
				changePage(`dashboard${x}`);
				pass = true;
			}
		}
		if (!pass) changePage('index');
	}, [changePage, location.pathname, userLogged.children, post]);

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
			{userLogged.children.length > 0 &&
				userLogged.children.map((child, index) => (
					<li
						key={child._id}
						className={
							!showMenu
								? 'nav-item'
								: `nav-item show ${
										currentNav === 'dashboard' + index ? 'current' : ''
								  }`
						}
					>
						<Link
							className='nav-link'
							to={`/dashboard/${child.user._id}`}
							onClick={() => changePageAndMenu(`dashboard${index}`)}
						>
							<i
								className={`${index % 2 === 0 ? 'fas' : 'far'} fa-user-circle`}
							></i>
							<span className='hide-md'>
								&nbsp; {child.user.lastname + ' ' + child.user.name}
							</span>
						</Link>
					</li>
				))}
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

TutorNavbar.propTypes = {
	navbar: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
	posts: PropTypes.object.isRequired,
	logoutAndToggle: PropTypes.func.isRequired,
	changePageAndMenu: PropTypes.func.isRequired,
	changePage: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	navbar: state.navbar,
	auth: state.auth,
	posts: state.posts,
});

export default connect(mapStateToProps, {
	logoutAndToggle,
	changePageAndMenu,
	changePage,
})(withRouter(TutorNavbar));
