import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import { clearTowns } from "../../../../actions/town";
import {
   clearUser,
   clearSearch,
   clearOtherValues,
} from "../../../../actions/user";

import Tabs from "../sharedComp/Tabs";
import SearchTab from "./tabs/SearchTab";

const Search = ({
   auth: { userLogged },
   clearOtherValues,
   clearUser,
   clearTowns,
   clearSearch,
}) => {
   return (
      <>
         <h1>Búsqueda</h1>
         {(userLogged.type === "admin" ||
            userLogged.type === "secretary" ||
            userLogged.type === "admin&teacher") && (
            <div className="btn-right">
               <Link
                  to="/register"
                  className="btn btn-dark"
                  onClick={() => {
                     window.scroll(0, 0);
                     clearOtherValues("studentNumber");
                     clearTowns();
                     clearSearch();
                     clearUser();
                  }}
               >
                  <i className="fas fa-user-plus"></i>
                  <span className="hide-sm">&nbsp; Registrar Usuario</span>
               </Link>
            </div>
         )}
         <div className="few-tabs">
            <Tabs
               tablist={["Alumnos", "Tutores", "Profesores", "Administradores"]}
               panellist={[SearchTab, SearchTab, SearchTab, SearchTab]}
            />
         </div>
      </>
   );
};

Search.propTypes = {
   auth: PropTypes.object.isRequired,
   clearUser: PropTypes.func.isRequired,
   clearOtherValues: PropTypes.func.isRequired,
   clearTowns: PropTypes.func.isRequired,
   clearSearch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   auth: state.auth,
});

export default connect(mapStateToProps, {
   clearOtherValues,
   clearUser,
   clearTowns,
   clearSearch,
})(Search);
