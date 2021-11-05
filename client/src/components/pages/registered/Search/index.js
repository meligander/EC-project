import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";

import { clearTowns } from "../../../../actions/town";
import { clearUser, clearSearch, clearUsers } from "../../../../actions/user";

import Tabs from "../sharedComp/Tabs";
import SearchTab from "./tabs/SearchTab";

const Search = ({
   auth: { userLogged },
   clearUsers,
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
                     clearUsers();
                     clearTowns();
                     clearSearch();
                     clearUser();
                  }}
               >
                  <FaUserPlus />
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

const mapStateToProps = (state) => ({
   auth: state.auth,
});

export default connect(mapStateToProps, {
   clearUsers,
   clearUser,
   clearTowns,
   clearSearch,
})(Search);
