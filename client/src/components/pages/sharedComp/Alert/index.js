import React from "react";
import { connect } from "react-redux";

import "./style.scss";

const Alert = ({ alerts, type }) =>
   alerts !== null &&
   alerts.map((alert) => (
      <React.Fragment key={alert.id}>
         {alert.type === type && (
            <div className={`alert alert-${alert.alertType}`}>{alert.msg}</div>
         )}
      </React.Fragment>
   ));

const mapStateToProps = (state) => ({
   alerts: state.alert,
});

export default connect(mapStateToProps)(Alert);
