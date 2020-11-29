import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { loadUser, clearProfile } from '../../../actions/user';
import PropTypes from 'prop-types';
import DashboardTop from './DashboardTop';
import DashboardTypes from './DashboardTypes';
import GoBack from '../../layouts/GoBack';
import Loading from '../../modal/Loading';

const Dashboard = ({
	match,
	auth,
	users: { user, loading },
	mixvalues: { loadingSpinner },
	loadUser,
	clearProfile,
}) => {
	useEffect(() => {
		if (loading || user._id !== match.params.id) {
			if (user) {
				clearProfile();
			} else {
				loadUser(match.params.id);
			}
		}
	}, [loadUser, match.params.id, clearProfile, loading, user]);
	return (
		<>
			{!loading ? (
				<>
					{user._id !== auth.userLogged._id && <GoBack />}
					<div className='my-1'>
						{loadingSpinner && <Loading />}
						<DashboardTop />
						<DashboardTypes />
					</div>
				</>
			) : (
				<Loading />
			)}
		</>
	);
};

Dashboard.prototypes = {
	users: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
	mixvalues: PropTypes.object.isRequired,
	loadUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
	users: state.users,
	mixvalues: state.mixvalues,
});

export default connect(mapStateToProps, { loadUser, clearProfile })(Dashboard);
