import React, { useEffect } from "react";
import { connect } from "react-redux";

import { loadClass } from "../../../../../../actions/class";
import { loadCategories } from "../../../../../../actions/category";
import { loadUsers } from "../../../../../../actions/user";

import Tabs from "../../../sharedComp/Tabs";
import FilterClassTab from "./tabs/FilterClassTab";
import NewClass from "./tabs/NewClassTab";

const RegisterClass = ({
   match,
   classes: { loadingClass, classInfo },
   users: { loading, loadingBK },
   categories: { loading: loadingCategories },
   loadClass,
   loadUsers,
   loadCategories,
}) => {
   const _id = match.params.class_id;

   useEffect(() => {
      if (_id && loadingClass) loadClass(_id);
   }, [_id, loadingClass, loadClass]);

   useEffect(() => {
      if (loadingCategories) loadCategories(!_id);
   }, [loadingCategories, loadCategories, _id]);

   useEffect(() => {
      if (loadingBK)
         loadUsers({ type: "teacher", active: true }, false, false, false);
   }, [loadingBK, loadUsers]);

   useEffect(() => {
      if (_id && loading && !loadingClass) {
         loadUsers(
            {
               type: "student",
               active: true,
               classroom: "null",
               category: classInfo.category._id,
            },
            false,
            true,
            false
         );
      }
   }, [loading, loadUsers, _id, loadingClass, classInfo]);

   return (
      <>
         <h2>{_id ? "Editar Clase" : "Nueva Clase"}</h2>
         {_id ? (
            <Tabs
               tablist={["Clase", "Alumnos"]}
               panellist={[NewClass, FilterClassTab]}
            />
         ) : (
            <Tabs
               tablist={["Alumnos", "Clase"]}
               panellist={[FilterClassTab, NewClass]}
            />
         )}
      </>
   );
};

const mapStateToProps = (state) => ({
   users: state.users,
   classes: state.classes,
   categories: state.categories,
});

export default connect(mapStateToProps, {
   loadClass,
   loadUsers,
   loadCategories,
})(RegisterClass);
