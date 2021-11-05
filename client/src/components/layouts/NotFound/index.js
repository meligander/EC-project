import React from "react";
import { BsExclamationTriangleFill } from "react-icons/bs";

import "./style.scss";

const NotFound = () => {
   return (
      <div className="bg-white not-found">
         <h1 className="heading-primary">
            <BsExclamationTriangleFill />
            &nbsp; Página Inexistente
         </h1>
         <p className="heading-secondary fancy-heading">
            Lo siento, esta página no existe.
         </p>
      </div>
   );
};

export default NotFound;
