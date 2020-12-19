import React from "react";

import spinner from "../../../img/spinner.gif";
import "./style.scss";

const Loading = () => {
   return (
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
   );
};

export default Loading;
