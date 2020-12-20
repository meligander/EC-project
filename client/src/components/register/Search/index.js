import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import { clearStudentNumber } from "../../../actions/mixvalues";

import Tabs from "../../sharedComp/Tabs";
import SearchTab from "./tabs/SearchTab";

const Search = ({ auth: { userLogged, loading }, clearStudentNumber }) => {
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
};

const mapStateToProps = (state) => ({
   auth: state.auth,
});

export default connect(mapStateToProps, { clearStudentNumber })(Search);
