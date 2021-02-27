import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { loadClass } from "../../../../../../actions/class";
import { loadCategories } from "../../../../../../actions/category";
import { loadUsers } from "../../../../../../actions/user";

import Tabs from "../../../sharedComp/Tabs";
import FilterClassTab from "./tabs/FilterClassTab";
import NewClass from "./tabs/NewClassTab";

const RegisterClass = ({
   location,
   match,
   loadClass,
   loadUsers,
   loadCategories,
   classes: { loading },
   users: { loadingUsers, loadingUsersBK },
}) => {
   const registerClass = location.pathname === "/register-class";

   useEffect(() => {
      if (!registerClass) {
         if (loading && loadingUsersBK && loadingUsers)
            loadClass(match.params.class_id);
      }

      if (loadingUsersBK) {
         loadCategories();
         loadUsers({ type: "teacher", active: true }, false);
         if (!registerClass && loadingUsers) {
            loadUsers({
               type: "student",
               active: true,
               classroom: "null",
               category: match.params.category_id,
            });
         }
      }
   }, [
      loadingUsers,
      loadClass,
      loadCategories,
      loadUsers,
      registerClass,
      match.params,
      loadingUsersBK,
      loading,
   ]);

   return (
      <>
         <h2>
            {location.pathname !== "/register-class"
               ? "Editar Clase"
               : "Nueva Clase"}
         </h2>
         <Tabs
            tablist={["Alumnos", "Clase"]}
            panellist={[FilterClassTab, NewClass]}
         />
      </>
   );
};

RegisterClass.prototypes = {
   users: PropTypes.object.isRequired,
   loadUsers: PropTypes.func.isRequired,
   loadClass: PropTypes.func.isRequired,
   loadCategories: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   users: state.users,
   classes: state.classes,
});

export default connect(mapStateToProps, {
   loadClass,
   loadUsers,
   loadCategories,
})(withRouter(RegisterClass));
