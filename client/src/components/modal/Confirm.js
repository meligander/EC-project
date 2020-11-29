import React, { useEffect, useState } from 'react';
import logo from '../../img/logo.png';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import { updatePenalty, loadPenalty } from '../../actions/penalty';
import Alert from '../Alert';
import PropTypes from 'prop-types';

const Confirm = ({
	toggleModal,
	setToggleModal,
	confirm,
	text,
	penaltyType,
	penalty: { loading, penalty },
	updatePenalty,
	loadPenalty,
}) => {
	const [formData, setFormData] = useState({
		percentage: '',
	});

	const { percentage } = formData;

	useEffect(() => {
		if (penaltyType) loadPenalty();
	}, [loadPenalty, penaltyType]);

	const penaltyConfirm = () => {
		updatePenalty(formData);
		setFormData({ percentage: '' });
	};

	const onChange = (e) => {
		setFormData({
			percentage: e.target.value,
		});
	};

	return (
		<div className={`popup ${!toggleModal ? 'hide' : ''}`}>
			<div className='popup-content text-center'>
				<div className='popup-img'>
					<img src={logo} alt='logo' />
				</div>

				{!penaltyType ? (
					<div className='popup-text'>
						<h3>{text}</h3>
					</div>
				) : (
					!loading && (
						<div className='popup-penalty'>
							<p className='posted-date'>
								Última Actualización:{' '}
								<Moment format='DD/MM/YY' date={penalty.date} />
							</p>
							<Alert type='4' />
							<h3>Actualización de Recargo</h3>

							<h4 className='pt-2'>Recargo Actual: {penalty.percentage} %</h4>

							<h4>
								<input
									id='percentage'
									type='number'
									placeholder='Nuevo Recargo'
									value={percentage}
									onChange={onChange}
								/>
								%
							</h4>
						</div>
					)
				)}

				<div className='btn-ctr'>
					<button
						className='btn btn-success'
						onClick={(e) => {
							e.preventDefault();
							if (penaltyType) penaltyConfirm();
							else confirm();
							setToggleModal();
						}}
					>
						Aceptar
					</button>
					<button
						className='btn btn-danger'
						onClick={(e) => {
							e.preventDefault();
							setToggleModal();
						}}
					>
						Cancelar
					</button>
				</div>
			</div>
		</div>
	);
};

Confirm.propTypes = {
	toggleModal: PropTypes.bool.isRequired,
	setToggleModal: PropTypes.func.isRequired,
	penalty: PropTypes.object.isRequired,
	updatePenalty: PropTypes.func.isRequired,
	loadPenalty: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	penalty: state.penalty,
});

export default connect(mapStateToProps, { updatePenalty, loadPenalty })(
	Confirm
);
