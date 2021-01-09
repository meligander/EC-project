import React from 'react';
import PropTypes from 'prop-types';

const NameField = ({
	name,
	nameAttribute,
	lastnameAttribute,
	lastname,
	onChange,
	namePlaceholder,
	lastnamePlaceholder,
}) => {
	return (
		<div className='form-group'>
			<div className='two-in-row'>
				<input
					className='form-input'
					type='text'
					name={nameAttribute ? nameAttribute : 'name'}
					placeholder={namePlaceholder ? namePlaceholder : 'Nombre'}
					value={name}
					onChange={onChange}
				/>
				<input
					className='form-input'
					type='text'
					name={lastnameAttribute ? lastnameAttribute : 'lastname'}
					placeholder={lastnamePlaceholder ? lastnamePlaceholder : 'Apellido'}
					value={lastname}
					onChange={onChange}
				/>
			</div>
			<div className='two-in-row'>
				<label className={`form-label ${name === '' ? 'lbl' : ''}`}>
					{namePlaceholder ? namePlaceholder : 'Nombre'}
				</label>
				<label className={`form-label ${lastname === '' ? 'lbl' : ''}`}>
					{lastnamePlaceholder ? lastnamePlaceholder : 'Apellido'}
				</label>
			</div>
		</div>
	);
};

NameField.propTypes = {
	name: PropTypes.string.isRequired,
	lastname: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
};

export default NameField;
