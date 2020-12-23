import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import Loading from "../../modal/Loading";

const GoBack = ({ history, mixvalues: { loadingSpinner, prevPage } }) => {
   const goBack = () => {
      history.push(prevPage);
   };

   return (
      <>
         <button onClick={goBack} className="btn">
            <i className="fas fa-chevron-left"></i> Volver
         </button>
         {loadingSpinner && <Loading />}
      </>
   );
};

GoBack.propTypes = {
   mixvalues: PropTypes.object.isRequired,
};

const mapStatetoProps = (state) => ({
   mixvalues: state.mixvalues,
});

export default connect(mapStatetoProps)(withRouter(GoBack));
