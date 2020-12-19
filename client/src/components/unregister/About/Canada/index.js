import React from "react";

import canada1 from "../../../../img/canada.jpg";
import canada2 from "../../../../img/canada2.jpg";
import canada3 from "../../../../img/canada3.jpg";
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
                  Cada año los estudiantes tienen la posibilidad de viajar a
                  Canadá durante el mes de Julio... bla bla bla Lorem, ipsum
                  dolor sit amet consectetur adipisicing elit. Voluptatem totam
                  cupiditate consequatur velit ut optio corporis beatae, illum
                  tempora necessitatibus et eligendi ad exercitationem magnam
                  eaque ullam ea corrupti porro unde excepturi non voluptas.
                  Dolor illum nostrum suscipit repudiandae itaque?
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
