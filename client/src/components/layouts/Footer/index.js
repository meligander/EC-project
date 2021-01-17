import React, { Fragment } from "react";

import "./style.scss";

const Footer = () => {
   return (
      <Fragment>
         <footer className="footer bg-primary">
            <p>
               <span className="hide-sm">Villa de Merlo</span> English Centre
               Copyright &copy;{new Date().getFullYear()}
            </p>
         </footer>
      </Fragment>
   );
};

export default Footer;
