import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { loadGradeTypes, updateGradeTypes } from '../../../../actions/grade';
import { loadCategories } from '../../../../actions/category';
import Loading from '../../../modal/Loading';
import PropTypes from 'prop-types';
import EditButtons from './EditButtons';
import Confirm from '../../../modal/Confirm';

const EditGradeTypes = ({
	loadGradeTypes,
	loadCategories,
	updateGradeTypes,
	categories: { categories, loading },
	grades: { gradeTypes, loadingGT },
}) => {
	const [otherValues, setOtherValues] = useState({
		newRow: [],
		toggleModalDelete: false,
		toggleModalSave: false,
		oneLoad: true,
		toDelete: '',
	});

	const [formData, setFormData] = useState({
		header: [],
		rows: [],
	});

	const {
		newRow,
		toggleModalDelete,
		toggleModalSave,
		oneLoad,
		toDelete,
	} = otherValues;
	const { header, rows } = formData;

	useEffect(() => {
		const createNewRow = () => {
			let row = new Array(categories.length);
			row[0] = { _id: '', name: '' };
			for (let x = 1; x < categories.length; x++) {
				row[x] = {
					category: categories[x]._id,
					checks: false,
				};
			}
			setOtherValues((prev) => ({
				...prev,
				newRow: row,
				oneLoad: false,
			}));
		};
		if (loadingGT && loading) {
			loadCategories();
			loadGradeTypes();
		} else {
			if (!loadingGT && oneLoad) {
				setFormData(gradeTypes);
				createNewRow();
			}
		}
	}, [
		loadGradeTypes,
		loadCategories,
		loadingGT,
		loading,
		oneLoad,
		gradeTypes,
		categories,
	]);

	const onChange = (e, index, i) => {
		let newValue = [...rows];

		if (e.target.name === 'input') {
			newValue[index][0].name = e.target.value;
		} else {
			newValue[index][i] = {
				...newValue[index][i],
				checks: e.target.checked,
			};
		}
		setFormData({
			...formData,
			rows: newValue,
		});
	};

	const addGradeType = () => {
		let newValue = [...rows];
		newValue.push(newRow);
		setFormData({
			...formData,
			rows: newValue,
		});
	};

	const deleteGradeType = () => {
		let newValue = [...rows];
		newValue.splice(toDelete, 1);
		setFormData({
			...formData,
			rows: newValue,
		});
	};

	const saveGradeTypes = () => {
		updateGradeTypes(rows);
	};

	const setToggleSave = () => {
		setOtherValues({
			...otherValues,
			toggleModalSave: !toggleModalSave,
		});
	};

	const setToggleDelete = (index) => {
		setOtherValues({
			...otherValues,
			...(index && { toDelete: index }),
			toggleModalDelete: !toggleModalDelete,
		});
	};

	return (
		<>
			{!loadingGT ? (
				<>
					<Confirm
						toggleModal={toggleModalSave}
						setToggleModal={setToggleSave}
						confirm={saveGradeTypes}
						text='¿Está seguro que desea guardar los cambios?'
					/>
					<Confirm
						toggleModal={toggleModalDelete}
						setToggleModal={setToggleDelete}
						confirm={deleteGradeType}
						text='¿Está seguro que desea eliminar el tipo de nota?'
					/>
					<h2>Editar tipo de notas</h2>
					<table>
						<thead>
							<tr>
								<th colSpan='5'>Nombre</th>
								{header &&
									header.map((header, index) => <th key={index}>{header}</th>)}
								<th colSpan='2'>&nbsp;</th>
							</tr>
						</thead>
						<tbody>
							{rows &&
								rows.map((row, index) => (
									<tr key={index}>
										{row.map((item, i) =>
											i === 0 ? (
												<td colSpan='5' key={i}>
													<input
														type='text'
														name='input'
														value={item.name}
														placeholder='Nombre'
														onChange={(e) => onChange(e, index, i)}
													/>
												</td>
											) : (
												<td key={i}>
													<input
														className='option-input'
														type='checkbox'
														onChange={(e) => onChange(e, index, i)}
														checked={item.checks}
													/>
												</td>
											)
										)}
										<td className='btn-close'>
											<button
												onClick={() => setToggleDelete(index)}
												className='btn btn-danger'
											>
												<i className='fas fa-times'></i>
											</button>
										</td>
									</tr>
								))}
						</tbody>
					</table>
					<EditButtons
						save={setToggleSave}
						add={addGradeType}
						type='Tipo de Nota'
					/>
				</>
			) : (
				<Loading />
			)}
		</>
	);
};

EditGradeTypes.propTypes = {
	grades: PropTypes.object.isRequired,
	categories: PropTypes.object.isRequired,
	loadGradeTypes: PropTypes.func.isRequired,
	loadCategories: PropTypes.func.isRequired,
	updateGradeTypes: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	grades: state.grades,
	categories: state.categories,
});

export default connect(mapStateToProps, {
	loadGradeTypes,
	updateGradeTypes,
	loadCategories,
})(EditGradeTypes);
