import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Loading from "../../modal/Loading";
import Dashboard from "../../register/Dashboard";
import GoBack from "../../sharedComp/GoBack";
import Alert from "../../sharedComp/Alert";

const PrivateRoutes = ({
   component: Component,
   auth: { userLogged, loading, token },
   types,
   path,
}) => {
   if (!loading) {
      if (Component === Dashboard)
         return <Route exact path="/dashboard/:id" component={Dashboard} />;
      let pass = false;
      if (types.length === 0) {
         pass = true;
      } else {
         for (let x = 0; x < types.length; x++) {
            if (types[x] === userLogged.type) {
               pass = true;
               break;
            }
         }
      }

      if (pass) {
         return (
            <>
               <GoBack />
               <div className="inner-container mt-2">
                  <Alert type="2" />
                  <Route exact path={path} component={Component} />
               </div>
            </>
         );
      } else {
         return <Redirect to={`/dashboard/${userLogged._id}`} />;
      }
   } else {
      if (token === null) {
         return <Redirect to="/login" />;
      } else {
         return <Loading />;
      }
   }
};

PrivateRoutes.propTypes = {
   auth: PropTypes.object.isRequired,
   types: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
   auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoutes);
