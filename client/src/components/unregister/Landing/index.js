import React from "react";
import { Link } from "react-router-dom";

import "./style.scss";

const Landing = () => {
   return (
      <section className="landing">
         <div className="main-text">
            <h1 className="heading-primary fancy-heading">
               Villa de Merlo English Centre
            </h1>
            <br />
            <p className="heading-tertiary">
               Instituto de inglés para todas las edades
            </p>
            <div className="btn-ctr mt-5">
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

export default Landing;
