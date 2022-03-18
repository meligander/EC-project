import React, { useRef, useEffect } from "react";
import getYear from "date-fns/getYear";
import { connect } from "react-redux";

import { setFooterHeight } from "../../../actions/global";

import "./style.scss";

const Footer = ({ setFooterHeight }) => {
   const ref = useRef();

   useEffect(() => {
      setFooterHeight(ref.current.offsetHeight);
   }, [setFooterHeight]);

   return (
      <footer className="footer bg-primary" ref={ref}>
         <p>
            <span className="hide-sm">Villa de Merlo</span> English Centre
            Copyright &copy;{getYear(new Date())}
         </p>
      </footer>
   );
};

export default connect(null, { setFooterHeight })(Footer);
