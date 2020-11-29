import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Alert = ({ alerts, type }) =>
	alerts !== null &&
	alerts.map((alert) => (
		<React.Fragment key={alert.id}>
			{alert.type === type && (
				<div className={`alert alert-${alert.alertType}`}>{alert.msg}</div>
			)}
		</React.Fragment>
	));

Alert.propTypes = {
	alerts: PropTypes.array.isRequired,
	type: PropTypes.string,
};

const mapStateToProps = (state) => ({
	alerts: state.alert,
});

export default connect(mapStateToProps)(Alert);
