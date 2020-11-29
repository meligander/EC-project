import React, { useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { changePageAndMenu, changePage } from '../../../actions/navbar';
import PropTypes from 'prop-types';

const GuestNavbar = ({
	location,
	navbar: { showMenu, currentNav },
	changePage,
	changePageAndMenu,
}) => {
	useEffect(() => {
		const string = location.pathname.substring(1, location.pathname.length);
		switch (string) {
			case 'about':
				changePage('about');
				break;
			case 'contact':
				changePage('contact');
				break;
			case 'login':
				changePage('login');
				break;
			default:
				changePage('index');
				break;
		}
	}, [changePage, location.pathname]);
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
					to='/'
					onClick={() => changePageAndMenu('index')}
				>
					<i className='fas fa-home'></i> &nbsp;
					<span className='hide-md'>Página Principal</span>
				</Link>
			</li>
			<li
				className={
					!showMenu
						? 'nav-item'
						: `nav-item show ${currentNav === 'about' ? 'current' : ''}`
				}
			>
				<Link
					className='nav-link'
					to='/about'
					onClick={() => changePageAndMenu('about')}
				>
					<i className='fas fa-info-circle'></i> &nbsp;
					<span className='hide-md'>Acerca de Nosotros</span>
				</Link>
			</li>
			<li
				className={
					!showMenu
						? 'nav-item'
						: `nav-item show ${currentNav === 'contact' ? 'current' : ''}`
				}
			>
				<Link
					className='nav-link'
					to='/contact'
					onClick={() => changePageAndMenu('contact')}
				>
					<i className='fas fa-address-book'></i> &nbsp;
					<span className='hide-md'>Contáctanos</span>
				</Link>
			</li>
			<li
				className={
					!showMenu
						? 'nav-item'
						: `nav-item show ${currentNav === 'login' ? 'current' : ''}`
				}
			>
				<Link
					className='nav-link'
					to='/login'
					onClick={() => changePageAndMenu('login')}
				>
					<i className='fas fa-sign-in-alt'></i> &nbsp;
					<span className='hide-md'>Iniciar Sesión</span>
				</Link>
			</li>
		</ul>
	);
};

GuestNavbar.propTypes = {
	navbar: PropTypes.object.isRequired,
	changePage: PropTypes.func.isRequired,
	changePageAndMenu: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	navbar: state.navbar,
});

export default connect(mapStateToProps, { changePage, changePageAndMenu })(
	withRouter(GuestNavbar)
);
