import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

const PublicRoutes = ({
   component: Component,
   auth: { isAuthenticated },
   path,
}) => {
   if (isAuthenticated) {
      return <Redirect to={"/dashboard/0"} />;
   } else return <Route exact path={path} component={Component} />;
};

const mapStateToProps = (state) => ({
   auth: state.auth,
});

export default connect(mapStateToProps)(PublicRoutes);
