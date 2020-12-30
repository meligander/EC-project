import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import PropTypes from "prop-types";

import { updatePreviousPage } from "../../../actions/mixvalues";
import { clearProfile } from "../../../actions/user";

import Loading from "../../modal/Loading";

const GoBack = ({
   match,
   history,
   mixvalues: { loadingSpinner, prevPage },
   auth: { userLogged },
   updatePreviousPage,
   clearProfile,
}) => {
   const goBack = () => {
      if (match.params.user_id) clearProfile();

      switch (prevPage) {
         case "dashboard":
            history.push(`/dashboard/${userLogged._id}`);
            updatePreviousPage("");
            break;
         case "":
            history.goBack();
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
   clearProfile: PropTypes.func.isRequired,
};

const mapStatetoProps = (state) => ({
   mixvalues: state.mixvalues,
   auth: state.auth,
});

export default connect(mapStatetoProps, { updatePreviousPage, clearProfile })(
   withRouter(GoBack)
);
