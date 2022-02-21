import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import Loading from "../../modal/Loading";
import Dashboard from "../../pages/registered/Dashboard";
import Alert from "../../pages/sharedComp/Alert";

const PrivateRoutes = ({
   component: Component,
   auth: { userLogged, token },
   types,
   path,
}) => {
   if (userLogged) {
      if (Component === Dashboard)
         return <Route exact path={path} component={Dashboard} />;

      if (
         types.length === 0 ||
         types.some((type) => type === userLogged.type)
      ) {
         return (
            <>
               <Loading />
               <div className="inner-container">
                  <Alert type="2" />
                  <Route exact path={path} component={Component} />
               </div>
            </>
         );
      } else {
         return <Redirect to="/index/dashboard/0" />;
      }
   } else {
      if (token === null) {
         return <Redirect to="/login" />;
      } else {
         return <Loading />;
      }
   }
};

const mapStateToProps = (state) => ({
   auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoutes);
