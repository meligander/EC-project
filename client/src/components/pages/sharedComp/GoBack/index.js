import React from "react";
import { FaChevronLeft } from "react-icons/fa";
import { withRouter } from "react-router-dom";

import "./style.scss";

const GoBack = ({ history }) => {
   return (
      <>
         <button
            onClick={() => history.goBack()}
            type="button"
            className="btn btn-goback"
         >
            <FaChevronLeft />
            &nbsp;Volver
         </button>
      </>
   );
};

export default withRouter(GoBack);
