import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import { updatePreviousPage } from "../../../actions/mixvalues";

import Loading from "../../modal/Loading";

const GoBack = ({
   history,
   mixvalues: { loadingSpinner, prevPage },
   auth: { userLogged },
   updatePreviousPage,
}) => {
   const goBack = () => {
      switch (prevPage) {
         case "dashboard":
            history.push(`/dashboard/${userLogged._id}`);
            updatePreviousPage("");
            break;
         case "":
            history.goBack();
            break;
         case "twice":
            history.go(-2);
            break;
         default:
            history.push(prevPage);
            updatePreviousPage("dashboard");
            break;
      }
   };

   return (
      <>
         <button onClick={goBack} className="btn mb-1">
            <i className="fas fa-chevron-left"></i> Volver
         </button>
         {loadingSpinner && <Loading />}
      </>
   );
};

GoBack.propTypes = {
   mixvalues: PropTypes.object.isRequired,
   auth: PropTypes.object.isRequired,
   updatePreviousPage: PropTypes.func.isRequired,
};

const mapStatetoProps = (state) => ({
   mixvalues: state.mixvalues,
   auth: state.auth,
});

export default connect(mapStatetoProps, { updatePreviousPage })(
   withRouter(GoBack)
);
