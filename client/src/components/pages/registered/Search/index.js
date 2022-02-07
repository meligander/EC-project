import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";

import { clearTowns } from "../../../../actions/town";
import { loadCategories } from "../../../../actions/category";
import { clearUser, clearSearch, clearUsers } from "../../../../actions/user";

import Tabs from "../sharedComp/Tabs";
import SearchTab from "./tabs/SearchTab";

const Search = ({
   auth: { userLogged },
   categories: { loading },
   clearUsers,
   clearUser,
   clearTowns,
   clearSearch,
   loadCategories,
}) => {
   const isAdmin =
      userLogged.type === "admin" ||
      userLogged.type === "secretary" ||
      userLogged.type === "admin&teacher";

   useEffect(() => {
      if (loading) loadCategories(true);
   }, [loadCategories, loading]);

   return (
      <>
         <h1>Búsqueda</h1>
         {isAdmin && (
            <div className="btn-right">
               <Link
                  to="/user/edit/0"
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
            {!loading && (
               <Tabs
                  tablist={[
                     "Alumnos",
                     "Tutores",
                     "Profesores",
                     "Administradores",
                  ]}
                  panellist={[SearchTab, SearchTab, SearchTab, SearchTab]}
               />
            )}
         </div>
      </>
   );
};

const mapStateToProps = (state) => ({
   auth: state.auth,
   categories: state.categories,
});

export default connect(mapStateToProps, {
   clearUsers,
   clearUser,
   clearTowns,
   clearSearch,
   loadCategories,
})(Search);
