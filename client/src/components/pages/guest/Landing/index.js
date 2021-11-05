import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import "./style.scss";

const Landing = ({ mixvalues: { footer, navbar } }) => {
   return (
      <section
         className="landing"
         style={{ minHeight: `calc(100vh - ${footer}px - ${navbar}px)` }}
      >
         <div className="main-text">
            <h1 className="heading-primary fancy-heading">
               Villa de Merlo English Centre
            </h1>
            <br />
            <p className="heading-tertiary">
               Instituto de inglés para todas las edades
            </p>
            <div className="btn-center mt-5">
               <Link to="/login" className="btn btn-primary">
                  Iniciar Sesión
               </Link>
               <Link to="/contact" className="btn btn-light">
                  Contáctanos
               </Link>
            </div>
         </div>
      </section>
   );
};

const mapStateToProps = (state) => ({
   mixvalues: state.mixvalues,
});

export default connect(mapStateToProps)(Landing);
