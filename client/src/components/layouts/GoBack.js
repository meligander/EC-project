import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Loading from '../modal/Loading';
import PropTypes from 'prop-types';

const GoBack = ({ history, mixvalues: { loadingSpinner } }) => {
	const goBack = () => {
		history.goBack();
	};

	return (
		<>
			<button onClick={goBack} className='btn'>
				<i className='fas fa-chevron-left'></i> Volver
			</button>
			{loadingSpinner && <Loading />}
		</>
	);
};

GoBack.propTypes = {
	mixvalues: PropTypes.object.isRequired,
};

const mapStatetoProps = (state) => ({
	mixvalues: state.mixvalues,
});

export default connect(mapStatetoProps)(withRouter(GoBack));
