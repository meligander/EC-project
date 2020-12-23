import React from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import {
   clearStudentNumber,
   updatePreviousPage,
} from "../../../actions/mixvalues";

import Tabs from "../../sharedComp/Tabs";
import SearchTab from "./tabs/SearchTab";

const Search = ({
   location,
   auth: { userLogged, loading },
   clearStudentNumber,
   updatePreviousPage,
}) => {
   return (
      <>
         {!loading && (
            <>
               <h1>
                  <i className="fas fa-search"></i> Búsqueda
               </h1>
               {(userLogged.type === "Administrador" ||
                  userLogged.type === "Secretaria" ||
                  userLogged.type === "Admin/Profesor") && (
                  <div className="btn-right">
                     <Link
                        to="/register"
                        className="btn btn-primary"
                        onClick={() => {
                           window.scroll(0, 0);
                           clearStudentNumber();
                           updatePreviousPage(location.pathname);
                        }}
                     >
                        <i className="fas fa-user-plus"></i>
                        <span className="hide-sm"> Registrar Usuario</span>
                     </Link>
                  </div>
               )}
               <div className="few-tabs">
                  <Tabs
                     tablist={[
                        "Alumnos",
                        "Tutores",
                        "Profesores",
                        "Administradores",
                     ]}
                     panellist={[SearchTab, SearchTab, SearchTab, SearchTab]}
                  />
               </div>
            </>
         )}
      </>
   );
};

Search.propTypes = {
   auth: PropTypes.object.isRequired,
   clearStudentNumber: PropTypes.func.isRequired,
   updatePreviousPage: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   auth: state.auth,
});

export default connect(mapStateToProps, {
   clearStudentNumber,
   updatePreviousPage,
})(withRouter(Search));
