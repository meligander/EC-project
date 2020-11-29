import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { loadClasses } from '../../../../actions/class';
import { loadCategories } from '../../../../actions/category';
import { loadUsers } from '../../../../actions/user';
import PropTypes from 'prop-types';
import ClassesTable from '../../../tables/ClassesTable';
import Loading from '../../../modal/Loading';

const Classes = ({
	classes: { classes, loadingClasses },
	users,
	auth: { userLogged, loading },
	categories,
	loadClasses,
	loadUsers,
	loadCategories,
}) => {
	const [filterForm, setfilterForm] = useState({
		teacher: '',
		category: '',
	});

	const { teacher, category } = filterForm;

	useEffect(() => {
		if (!loading) {
			if (userLogged.type === 'Profesor') {
				loadClasses({ teacher: userLogged._id });
			} else {
				loadUsers({ type: 'Profesor', active: true }, false);
				loadCategories();
				loadClasses({});
			}
		}
	}, [loadUsers, loadCategories, loadClasses, userLogged, loading]);

	const onChange = (e) => {
		setfilterForm({
			...filterForm,
			[e.target.name]: e.target.value,
		});
	};

	const onSearch = (e) => {
		e.preventDefault();
		loadClasses(filterForm);
	};

	return (
		<>
			{!loadingClasses ? (
				<>
					<h1>Cursos</h1>
					{userLogged.type !== 'Profesor' && (
						<div className='form'>
							<div className='form-group'>
								<select
									id='teacher'
									className='form-input'
									name='teacher'
									onChange={onChange}
									value={teacher}
								>
									<option value=''>* Seleccione Profesor</option>
									{!users.loadingUsers &&
										users.users.length > 0 &&
										users.users.map((teacher) => (
											<option key={teacher._id} value={teacher._id}>
												{teacher.lastname + ' ' + teacher.name}
											</option>
										))}
								</select>
								<label
									htmlFor='teacher'
									className={`form-label ${teacher === '' ? 'lbl' : ''}`}
								>
									Profesor
								</label>
							</div>
							<div className='form-group'>
								<select
									id='category'
									className='form-input'
									name='category'
									onChange={onChange}
									value={category}
								>
									<option value=''>* Seleccione Categoría</option>
									{!categories.loading &&
										categories.categories.map((category) => (
											<React.Fragment key={category._id}>
												{category.name !== 'Inscripción' && (
													<option value={category._id}>{category.name}</option>
												)}
											</React.Fragment>
										))}
								</select>
								<label
									htmlFor='category'
									className={`form-label ${category === '' ? 'lbl' : ''}`}
								>
									Categoría
								</label>
							</div>
							<div className='btn-right'>
								<button
									type='submit'
									onClick={onSearch}
									className='btn btn-light'
								>
									<i className='fas fa-filter'></i> Buscar
								</button>
							</div>
						</div>
					)}

					<div className='pt-4'>
						{!loadingClasses && <ClassesTable classes={classes} all={true} />}
					</div>

					<div className='btn-right'>
						{userLogged.type !== 'Profesor' && (
							<Link to='/register-class' className='btn btn-primary'>
								<i className='fas fa-plus'></i> Curso
							</Link>
						)}
						<button className='btn btn-secondary'>
							<i className='far fa-save'></i>
						</button>
						<button className='btn btn-secondary'>
							<i className='fas fa-print'></i>
						</button>
					</div>
				</>
			) : (
				<Loading />
			)}
		</>
	);
};

Classes.propTypes = {
	classes: PropTypes.object.isRequired,
	users: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
	categories: PropTypes.object.isRequired,
	loadClasses: PropTypes.func.isRequired,
	loadUsers: PropTypes.func.isRequired,
	loadCategories: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	classes: state.classes,
	users: state.users,
	auth: state.auth,
	categories: state.categories,
});

export default connect(mapStateToProps, {
	loadClasses,
	loadCategories,
	loadUsers,
})(Classes);
