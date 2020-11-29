import React, { useState, useEffect } from 'react';
import Tabs from '../../../Tabs';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import RegisterTab from './RegisterTab';
import IncomeExpenceTab from './IncomeExpenceTab';
import { loadRegister } from '../../../../actions/register';
import Loading from '../../../modal/Loading';
import PropTypes from 'prop-types';

const RegisterInfo = ({ loadRegister, registers: { register, loading } }) => {
	const [date, setDate] = useState(new Date());

	useEffect(() => {
		const changeDate = () => {
			if (register.temporary) setDate(register.date);
		};
		if (!loading) {
			changeDate();
		} else {
			loadRegister();
		}
	}, [loadRegister, loading, register]);

	return (
		<>
			{!loading ? (
				<>
					<h1 className='text-center'>Caja</h1>
					<h3 className='heading-tertiary my-4 text-dark'>
						<i className='fas fa-calendar-day'></i>{' '}
						<Moment format='LLLL' locale='es' date={date} />
					</h3>
					<Tabs
						tablist={['Caja Diaria', 'Ingreso/Egreso']}
						panellist={[RegisterTab, IncomeExpenceTab]}
					/>
				</>
			) : (
				<Loading />
			)}
		</>
	);
};

RegisterInfo.propTypes = {
	registers: PropTypes.object.isRequired,
	loadRegister: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	registers: state.registers,
});

export default connect(mapStateToProps, { loadRegister })(RegisterInfo);
