import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { setAlert } from '../../../actions/alert';
import {
	registerNewGrade,
	deleteGrades,
	updateGrades,
	clearGrades,
} from '../../../actions/grade';
import PropTypes from 'prop-types';
import Confirm from '../../modal/Confirm';

const GradesTab = ({
	history,
	period,
	classes: { classInfo },
	auth: { userLogged },
	grades: { grades, loading, gradeTypes, loadingGT },
	setAlert,
	registerNewGrade,
	deleteGrades,
	updateGrades,
	clearGrades,
	navbar,
}) => {
	const [formData, setFormData] = useState({
		newGrades: {
			period: '',
			rows: [],
		},
		newGradeType: {
			period,
			classroom: classInfo._id,
			gradetype: '',
		},
	});

	const { newGrades, newGradeType } = formData;

	const [otherValues, setOtherValues] = useState({
		gradePlus: false,
		className: '',
		gradetypes: [],
		toggleModalSave: false,
		toggleModalDelete: false,
		toDelete: null,
	});

	const {
		gradePlus,
		className,
		gradetypes,
		toggleModalSave,
		toggleModalDelete,
		toDelete,
	} = otherValues;
	const nameHeader = useRef();

	useEffect(() => {
		const loadGradeTypes = () => {
			let gradetypes = [];
			if (grades.header.header1.length === 0) {
				gradetypes = gradeTypes;
			} else {
				if (grades.header.header1[period - 1]) {
					for (let x = 0; x < gradeTypes.length; x++) {
						let equal = false;
						for (let y = 0; y < grades.header.header1[period - 1].length; y++) {
							if (gradeTypes[x].name === grades.header.header1[period - 1][y])
								equal = true;
						}
						if (!equal) gradetypes.push(gradeTypes[x]);
					}
				} else {
					gradetypes = gradeTypes;
				}
			}
			setOtherValues((prev) => ({ ...prev, gradetypes }));
		};

		const setInput = () => {
			setFormData((prev) => ({
				...prev,
				newGrades:
					grades.periods[period - 1] !== undefined
						? grades.periods[period - 1]
						: {
								period: '',
								rows: [],
						  },
			}));
		};
		if (nameHeader.current && !newGrades.rows[0]) {
			if (nameHeader.current.offsetWidth < nameHeader.current.scrollWidth) {
				setOtherValues((prev) => ({
					...prev,
					className: 'fit',
				}));
			}
		}
		if (newGrades.rows[0]) {
			if (
				grades.periods[period - 1].rows[0].length !== newGrades.rows[0].length
			) {
				setInput();
			}
			if (!loadingGT) {
				loadGradeTypes();
			}
		} else {
			setInput();
		}
	}, [gradeTypes, grades, period, newGrades.rows, loadingGT]);

	const onChange = (e, row) => {
		let number = Number(e.target.name.substring(5, e.target.name.length));
		let changedRows = { ...newGrades };
		const gradesNumber = newGrades.rows[0].length;
		const rowN = Math.ceil((number + 1) / gradesNumber) - 1;
		const mult = gradesNumber * rowN;
		number = number - mult;
		changedRows.rows[rowN][number] = {
			...row,
			value: e.target.value,
		};
		setFormData({
			...formData,
			newGrades: changedRows,
		});
	};

	const onChangeGradeTypes = (e) => {
		setFormData({
			...formData,
			newGradeType: {
				...newGradeType,
				gradetype: e.target.value,
			},
		});
	};

	const clickAddGrade = () => {
		setOtherValues({
			...otherValues,
			gradePlus: !gradePlus,
		});
	};

	const addGradeType = () => {
		if (newGradeType.gradetype === 0) {
			setAlert('Primero debe elegir un tipo de nota', 'danger', '2');
			window.scroll(0, 0);
		} else {
			registerNewGrade(newGradeType);
			setOtherValues({
				...otherValues,
				gradePlus: !gradePlus,
				gradetypes: gradetypes.filter(
					(gt) => gt._id !== newGradeType.gradetype
				),
			});
		}
	};

	const deleteGradeType = () => {
		deleteGrades(toDelete);
		setOtherValues({
			...otherValues,
			gradePlus: false,
			gradetypes: [
				...gradetypes,
				...gradeTypes.filter((gt) => gt._id === toDelete.gradetype._id),
			],
		});
	};

	const saveGrades = () => {
		updateGrades(newGrades.rows, history, classInfo._id);
	};

	const setToggleSave = (e) => {
		if (e) e.preventDefault();
		setOtherValues({
			...otherValues,
			toggleModalSave: !toggleModalSave,
		});
	};

	const setToggleDelete = (e) => {
		if (e) e.preventDefault();
		setOtherValues({
			...otherValues,
			toggleModalDelete: !toggleModalDelete,
		});
	};

	return (
		<>
			{!loading && (
				<div className='wrapper'>
					<Confirm
						toggleModal={toggleModalSave}
						setToggleModal={setToggleSave}
						confirm={saveGrades}
						text='¿Está seguro que desea guardar los cambios?'
					/>
					<Confirm
						toggleModal={toggleModalDelete}
						setToggleModal={setToggleDelete}
						confirm={deleteGradeType}
						text='¿Está seguro que desea eliminar el tipo de nota?'
					/>
					<table className={!navbar ? `${className} stick` : className}>
						<thead>
							<tr>
								<th ref={nameHeader} className='bg-strong'>
									&nbsp; Nombre &nbsp;
								</th>
								{grades.header.header1[period - 1] &&
									grades.header.header1[period - 1].map((type, index) => (
										<th key={index}>{type}</th>
									))}
							</tr>
						</thead>
						<tbody>
							{grades.header.header2.map((student, i) => (
								<tr key={i}>
									<td className='bg-white'>{student}</td>
									{newGrades.rows.length > 0 &&
										newGrades.rows[i].map((row, key) => (
											<td key={key}>
												{row.student !== undefined ? (
													<input
														type='number'
														name={row.name}
														onChange={(e) => onChange(e, row)}
														value={row.value}
														placeholder='Nota'
													/>
												) : (
													<button
														className='btn btn-danger'
														onClick={() => {
															setOtherValues({
																...otherValues,
																toggleModalDelete: !toggleModalDelete,
																toDelete: row,
															});
														}}
													>
														<i className='fas fa-times'></i>
													</button>
												)}
											</td>
										))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
			<div className='btn-right'>
				<button className='btn btn-primary' onClick={setToggleSave}>
					<i className='far fa-save'></i>
					<span className='hide-md'> Guardar Cambios</span>
				</button>
				<button className='btn btn-light' onClick={clickAddGrade}>
					<i className='fas fa-plus'></i>
					<span className='hide-md'> Nota</span>
				</button>
				<button className='btn btn-secondary'>
					<i className='far fa-save'></i>
				</button>
				<span className='hide-sm'>
					<button className='btn btn-secondary'>
						<i className='fas fa-print'></i>
					</button>
					<button className='btn btn-secondary'>
						<i className='fas fa-print'></i> En Blanco
					</button>
				</span>
			</div>
			{gradePlus && (
				<div className='form smaller pt-5'>
					<div className='form-group'>
						<select
							className='form-input center'
							id='gradetype'
							value={newGradeType.gradetype}
							onChange={onChangeGradeTypes}
						>
							<option value=''>*Seleccione un tipo de nota</option>
							{gradetypes.length > 0 &&
								gradetypes.map((gradetype) => (
									<option key={gradetype._id} value={gradetype._id}>
										{gradetype.name}
									</option>
								))}
						</select>
						{console.log(newGradeType.gradetype)}
						<label
							htmlFor='new-category'
							className={`form-label ${
								newGradeType.gradetype === '' ? 'lbl' : ''
							}`}
						>
							Tipo de nota
						</label>
					</div>
					<div className='btn-ctr mt-1'>
						<button
							type='submit'
							onClick={addGradeType}
							className='btn btn-primary'
						>
							<i className='fas fa-plus'></i>
							<span className='hide-md'> Agregar</span>
						</button>
						{(userLogged.type === 'Administrador' ||
							userLogged.type === 'Admin/Profesor') && (
							<Link
								to='/edit-gradetypes'
								onClick={clearGrades}
								className='btn btn-light'
							>
								<i className='fas fa-edit'></i>
								<span className='hide-md'> Tipo Nota</span>
							</Link>
						)}
					</div>
				</div>
			)}
		</>
	);
};

GradesTab.propTypes = {
	auth: PropTypes.object.isRequired,
	grades: PropTypes.object.isRequired,
	classes: PropTypes.object.isRequired,
	navbar: PropTypes.bool.isRequired,
	period: PropTypes.number.isRequired,
	registerNewGrade: PropTypes.func.isRequired,
	deleteGrades: PropTypes.func.isRequired,
	updateGrades: PropTypes.func.isRequired,
	setAlert: PropTypes.func.isRequired,
	clearGrades: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	classes: state.classes,
	grades: state.grades,
	auth: state.auth,
	navbar: state.navbar.showMenu,
});

export default connect(mapStateToProps, {
	setAlert,
	registerNewGrade,
	deleteGrades,
	updateGrades,
	clearGrades,
})(withRouter(GradesTab));
