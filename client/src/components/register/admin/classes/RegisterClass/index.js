import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { loadClass } from "../../../../../actions/class";
import PropTypes from "prop-types";

import Tabs from "../../../../sharedComp/Tabs";
import FilterClassTab from "./tabs/FilterClassTab";
import NewClass from "./tabs/NewClassTab";

const RegisterClass = ({ location, match, loadClass }) => {
   useEffect(() => {
      if (location.pathname !== "/register-class") {
         loadClass(match.params.id);
      }
   }, [loadClass, location.pathname, match.params.id]);
   return (
      <>
         <h2>
            {location.pathname !== "/register-class"
               ? "Editar Curso"
               : "Nuevo Curso"}
         </h2>
         <Tabs
            tablist={["Alumnos", "Clase"]}
            panellist={[FilterClassTab, NewClass]}
         />
      </>
   );
};

RegisterClass.prototypes = {
   loadClass: PropTypes.func.isRequired,
};

export default connect(null, { loadClass })(withRouter(RegisterClass));
