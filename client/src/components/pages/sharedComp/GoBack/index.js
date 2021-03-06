import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import PropTypes from "prop-types";

import { updatePreviousPage } from "../../../../actions/mixvalues";
import { clearProfile } from "../../../../actions/user";
import { clearRegisters } from "../../../../actions/register";

import Loading from "../../../modal/Loading";

import "./style.scss";

const GoBack = ({
   match,
   history,
   mixvalues: { loadingSpinner, prevPage },
   auth: { userLogged },
   updatePreviousPage,
   clearProfile,
   clearRegisters,
}) => {
   const goBack = () => {
      if (match.params.user_id) clearProfile(userLogged.type !== "student");

      switch (prevPage) {
         case "dashboard":
            history.push(`/dashboard/${userLogged._id}`);
            updatePreviousPage("");
            break;
         case "register":
            clearRegisters();
            updatePreviousPage("");
            history.goBack();
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
         <button onClick={goBack} type="button" className="btn btn-goback">
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
   clearRegisters: PropTypes.func.isRequired,
};

const mapStatetoProps = (state) => ({
   mixvalues: state.mixvalues,
   auth: state.auth,
});

export default connect(mapStatetoProps, {
   updatePreviousPage,
   clearProfile,
   clearRegisters,
})(withRouter(GoBack));
