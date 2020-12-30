import React from "react";

import Canada from "./Canada";
import BgVideo from "./Team";
import Gallery from "./Gallery";

import cambridge from "../../../img/cambridge.png";
import "./style.scss";

const About = () => {
   return (
      <>
         <header className="header">
            <div className="header-textbox">
               <h2 className="heading-secondary text-white mb-4">
                  Instituto de Inglés en la Villa de Merlo
               </h2>
               <p className="heading-tertiary text-light mb-5">
                  Clases de inglés para todas las edades. bla bla bla
               </p>
            </div>
         </header>

         <section className="section-history">
            <div className="row">
               <div className="history-container">
                  <div className="history-text">
                     <h2 className="heading-secondary text-primary">
                        Un poco de{" "}
                        <span className="indentation">historia...</span>
                     </h2>
                     <p className="paragraph py-3">
                        Nuestro instituto comenzo... bla bla bla Lorem, ipsum
                        dolor sit amet consectetur adipisicing elit. Voluptatem
                        totam cupiditate consequatur velit ut optio corporis
                        beatae, illum tempora necessitatibus et eligendi ad
                        exercitationem magnam eaque ullam ea corrupti porro unde
                        excepturi non voluptas. Dolor illum nostrum suscipit
                        repudiandae itaque?
                     </p>
                  </div>
               </div>
            </div>
         </section>

         <section className="section-cambridge" id="cambridge">
            <div className="row">
               <img
                  className="cmb-img"
                  src={cambridge}
                  alt="Cambrige University"
               />

               <div className="cmb-text">
                  <h2 className="heading-secondary text-light">
                     Examenes Internacionales
                  </h2>
                  <br />
                  <p className="paragraph text-secondary">
                     Cada año los estudiantes tienen la posibilidad de rendir
                     examenes internacionales, los cuales les ayudaran en futuro
                     para ampliar su curriculum... bla bla bla Lorem, ipsum
                     dolor sit amet consectetur adipisicing elit. Voluptatem
                     totam cupiditate consequatur velit ut optio corporis
                     beatae, illum tempora necessitatibus et eligendi ad
                     exercitationem magnam eaque ullam ea corrupti porro unde
                     excepturi non voluptas. Dolor illum nostrum suscipit
                     repudiandae itaque?
                  </p>
               </div>
            </div>
         </section>

         <Canada />

         <BgVideo />

         <Gallery />
      </>
   );
};

export default About;
