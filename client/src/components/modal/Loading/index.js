import React from "react";
import { connect } from "react-redux";

import spinner from "../../../img/spinner.gif";
import "./style.scss";

const Loading = ({ global: { loadingSpinner } }) => {
   return (
      <>
         {loadingSpinner && (
            <div className="blurr-bg">
               <img
                  src={spinner}
                  style={{
                     width: "300px",
                     display: "flex",
                     margin: "0 auto",
                  }}
                  alt=""
               />
            </div>
         )}
      </>
   );
};

const mapStateToProps = (state) => ({
   global: state.global,
});

export default connect(mapStateToProps)(Loading);
