import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { loadStudentDebts } from '../../../../actions/debts';
import DebtsTable from '../../../tables/DebtsTable';
import PropTypes from 'prop-types';

const Debts = ({
	loadStudentDebts,
	users: { user },
	debt: { usersDebts, loadingUsersDebts },
}) => {
	const forAdmin = false;

	useEffect(() => {
		loadStudentDebts(user._id, forAdmin);
	}, [loadStudentDebts, user, forAdmin]);

	return (
		<div className='bg-light-grey p-2'>
			{!loadingUsersDebts && (
				<>
					<h3 className='heading-tertiary text-primary p-1'>Cuotas</h3>
					<div className='pb-2'>
						{usersDebts.rows.length > 0 ? (
							<DebtsTable forAdmin={forAdmin} />
						) : (
							<p className='heading-tertiary text-center'>
								No hay ninguna cuota registrada
							</p>
						)}
					</div>
				</>
			)}
		</div>
	);
};

Debts.propTypes = {
	loadStudentDebts: PropTypes.func.isRequired,
	users: PropTypes.object.isRequired,
	debt: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	users: state.users,
	debt: state.debt,
});

export default connect(mapStateToProps, { loadStudentDebts })(Debts);
