import React from "react";

import canada1 from "../../../../../img/canada.jpg";
import canada2 from "../../../../../img/canada2.jpg";
import canada3 from "../../../../../img/canada3.jpg";
import "./style.scss";

const Canada = () => {
   return (
      <section className="section-canada">
         <h2 className="heading-secondary text-primary text-center">
            Viajes a Canada
         </h2>
         <div className="row">
            <div className="text-left section-canada-text">
               <p className="paragraph">
                  Desde el año 1998 organizamos viajes a Canadá en el mes de
                  julio. Los alumnos tienen la posibilidad de vivir un mes en
                  casas de familia, compartir con ellos el idioma, la cultura y
                  las costumbres mientras perfeccionan el idioma. Además, cursan
                  clases diarias, acordes a su nivel de inglés, en la
                  prestigiosa escuela ILAC. Esta experiencia se convierte en
                  imborrable para los alumnos tanto desde el punto de vista
                  personal por el trato con personas de todo el mundo, como
                  desde el punto de vista del idioma ya que se incorpora en sus
                  vidas de una manera integral y natural.
               </p>
            </div>
            <div className="composition">
               <img
                  alt="Foto Canada 1"
                  className="composition-photo composition-photo--p1"
                  src={canada1}
               />
               <img
                  alt="Foto Canada 2"
                  className="composition-photo composition-photo--p2"
                  src={canada2}
               />
               <img
                  alt="Foto Canada 3"
                  className="composition-photo composition-photo--p3"
                  src={canada3}
               />
            </div>
         </div>
      </section>
   );
};

export default Canada;
