import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { clearSearch } from '../../../actions/user';
import PropTypes from 'prop-types';
import Tabs from '../../Tabs';
import SearchTab from './SearchTab';

const Search = ({ auth: { userLogged, loading }, clearSearch }) => {
	useEffect(() => {
		clearSearch();
	}, [clearSearch]);
	return (
		<>
			{!loading && (
				<>
					<h1>
						<i className='fas fa-search'></i> Búsqueda
					</h1>
					{(userLogged.type === 'Administrador' ||
						userLogged.type === 'Secretaria' ||
						userLogged.type === 'Admin/Profesor') && (
						<div className='btn-right'>
							<Link to='/register' className='btn btn-primary'>
								<i className='fas fa-user-plus'></i>
								<span className='hide-sm'> Registrar Usuario</span>
							</Link>
						</div>
					)}
					<div className='few-tabs'>
						<Tabs
							tablist={['Alumnos', 'Tutores', 'Profesores', 'Administradores']}
							panellist={[SearchTab, SearchTab, SearchTab, SearchTab]}
						/>
					</div>
				</>
			)}
		</>
	);
};

Search.propTypes = {
	auth: PropTypes.object.isRequired,
	clearSearch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps, { clearSearch })(Search);
