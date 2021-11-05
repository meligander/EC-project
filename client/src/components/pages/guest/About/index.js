import React from "react";

import Canada from "./Canada";
import BgVideo from "./Team";
import Gallery from "./Gallery";
import Loading from "../../../modal/Loading";

import cambridge from "../../../../img/cambridge.png";
import "./style.scss";

const About = () => {
   return (
      <>
         <Loading />
         <header className="header">
            <div className="header-textbox">
               <h2 className="heading-secondary text-white">
                  Instituto de Inglés en la Villa de Merlo
               </h2>
               <p className="heading-tertiary text-light">
                  Cursos de Inglés para todas las edades, con amplitud de
                  horarios y con reconocido prestigio en la enseñanza del
                  idioma.
               </p>
            </div>
         </header>

         <section className="section-history">
            <div className="row">
               <div className="history-container">
                  <div className="history-text">
                     <h2 className="heading-secondary text-primary mb-3">
                        Un poco de historia...
                     </h2>
                     <p className="paragraph">
                        <span className="indentation">
                           Nuestro instituto comienza en el año 1988, aunque
                           como un simple emprendimiento de una docente que en
                           su propia casa arma grupos de alumnos, ya que, en ese
                           momento, Merlo era muy pequeño y no habían muchas
                           opciones para el aprendizaje de idioma. Más adelante,
                           como los grupos de alumnos seguían creciendo día a
                           día, fueron dos las docentes que trabajaban desde sus
                           propias casas trabajando en conjunto, con la
                           asistencia de otras profesoras que las ayudaban en la
                           enseñanza de los diferentes cursos. Surgió entonces
                           la necesidad de aunar todos los cursos en un mismo
                           edificio y con mucho esfuerzo se compró el actual
                           inmueble en el año 1997.
                        </span>
                        <br />
                        <span className="indentation">
                           Desde marzo del 1998 el actual edificio comenzó a
                           funcionar y dos años después la totalidad de las
                           aulas estuvieron terminadas.
                        </span>
                        <br />
                        <span className="indentation">
                           Las paredes del instituto muestran pinturas de muchas
                           de las promociones que egresaron y dejaron sus
                           recuerdos en las paredes para ser vistas por futuras
                           generaciones.
                        </span>
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
                     <span className="indentation">
                        Nuestra institución es el único centro de exámenes
                        Cambridge en la zona. Todos los años en el mes de
                        diciembre nuestros alumnos y también los de otras
                        entidades cercanas rinden los exámenes main suite de la
                        Universidad de Cambridge (Ket, Pet, First y Cae).
                     </span>
                     <br />
                     <span className="indentation">
                        Consideramos que la posibilidad que los alumnos tienen
                        de poseer tales certificaciones son de vital importancia
                        para incluir en sus CVs y para la obtención de puestos
                        de trabajo meritorios en el futuro.
                     </span>
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
