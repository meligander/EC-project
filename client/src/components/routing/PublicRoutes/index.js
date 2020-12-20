import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const PublicRoutes = ({
   component: Component,
   auth: { isAuthenticated, userLogged },
   path,
}) => {
   if (isAuthenticated) return <Redirect to={`/dashboard/${userLogged._id}`} />;
   else return <Route exact path={path} component={Component} />;
};

PublicRoutes.propTypes = {
   auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
   auth: state.auth,
});

export default connect(mapStateToProps)(PublicRoutes);
