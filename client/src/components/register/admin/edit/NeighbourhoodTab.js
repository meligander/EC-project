import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { updateNeighbourhoods } from '../../../../actions/neighbourhood';
import { connect } from 'react-redux';
import Confirm from '../../../modal/Confirm';
import EditButtons from './EditButtons';

const NeighbourhoodTab = ({
	neighbourhoods: { neighbourhoods, loading, error },
	towns,
	updateNeighbourhoods,
}) => {
	const [newValues, setNewValues] = useState([]);
	const [otherValues, setOtherValues] = useState({
		toggleModalDelete: false,
		toggleModalSave: false,
		neighbourhoodDelete: '',
	});

	const {
		toggleModalDelete,
		toggleModalSave,
		neighbourhoodDelete,
	} = otherValues;

	useEffect(() => {
		const init = () => {
			setNewValues([...neighbourhoods]);
		};
		if (!loading) init();
	}, [loading, neighbourhoods]);

	const onChange = (e, index) => {
		let newValue = [...newValues];
		newValue[index] = {
			...newValue[index],
			[e.target.name]: e.target.value,
		};
		setNewValues(newValue);
	};

	const addNeighbourhood = () => {
		let newValue = [...newValues];
		newValue.push({
			_id: '',
			name: '',
			town: 0,
		});
		setNewValues(newValue);
	};

	const deleteNeighbourhood = () => {
		let newValue = [...newValues];
		newValue.splice(neighbourhoodDelete, 1);
		setNewValues(newValue);
	};

	const saveNeighbourhoods = () => {
		updateNeighbourhoods(newValues);
	};

	const setToggleDelete = (neighbourhood_index) => {
		setOtherValues({
			...otherValues,
			toggleModalDelete: !toggleModalDelete,
			neighbourhoodDelete: neighbourhood_index,
		});
	};

	const setToggleSave = () => {
		setOtherValues({
			...otherValues,
			toggleModalSave: !toggleModalSave,
		});
	};

	return (
		<div className='mt-3'>
			<Confirm
				toggleModal={toggleModalDelete}
				confirm={deleteNeighbourhood}
				setToggleModal={setToggleDelete}
				text='¿Está seguro que desea eliminar el barrio?'
			/>
			<Confirm
				toggleModal={toggleModalSave}
				confirm={saveNeighbourhoods}
				setToggleModal={setToggleSave}
				text='¿Está seguro que desea guardar los cambios?'
			/>
			<table className='smaller'>
				<thead>
					<tr>
						<th>Nombre</th>
						<th>Localidad</th>
						<th>&nbsp;</th>
					</tr>
				</thead>
				<tbody>
					{newValues.length > 0 &&
						newValues.map((item, i) => (
							<tr key={i}>
								<td>
									<input
										type='text'
										name='name'
										onChange={(e) => onChange(e, i)}
										value={item.name}
										placeholder='Nombre'
									/>
								</td>
								<td>
									<select
										name='town'
										onChange={(e) => onChange(e, i)}
										value={newValues[i].town}
									>
										<option value='0'>
											*Seleccione la localidad a la que pertenece
										</option>
										{!towns.loading &&
											towns.towns.length > 0 &&
											towns.towns.map((town, index) => (
												<option key={index} value={town._id}>
													{town.name}
												</option>
											))}
									</select>
								</td>
								<td>
									<button
										onClick={() => setToggleDelete(i)}
										className='btn btn-danger'
									>
										<i className='fas fa-trash'></i>
									</button>
								</td>
							</tr>
						))}
				</tbody>
			</table>
			{newValues.length === 0 && (
				<p className='lead text-dark text-center mt-1'>{error.msg}</p>
			)}
			<EditButtons add={addNeighbourhood} save={setToggleSave} type='Barrio' />
		</div>
	);
};

NeighbourhoodTab.propTypes = {
	neighbourhoods: PropTypes.object.isRequired,
	towns: PropTypes.object.isRequired,
	updateNeighbourhoods: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	neighbourhoods: state.neighbourhoods,
	towns: state.towns,
});

export default connect(mapStateToProps, { updateNeighbourhoods })(
	NeighbourhoodTab
);
