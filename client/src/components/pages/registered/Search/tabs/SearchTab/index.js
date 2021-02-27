import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { loadCategories } from "../../../../../../actions/category";
import {
   clearProfile,
   loadUsers,
   userPDF,
} from "../../../../../../actions/user";

import StudentTable from "../../../sharedComp/tables/StudentTable";
import RestTable from "../../../sharedComp/tables/RestTable";
import NameField from "../../../sharedComp/NameField";

const SearchTab = ({
   users: { users, loadingUsers, userSearchType },
   categories,
   loadCategories,
   loadUsers,
   clearProfile,
   typeF,
   userPDF,
}) => {
   const searchType = {
      Alumnos: "student",
      Tutores: "guardian",
      Profesores: "teacher",
      Administradores: "admin",
   };

   const [filterForm, setFilterForm] = useState({
      name: "",
      lastname: "",
      active: true,
      category: "",
      studentname: "",
      studentlastname: "",
      type: searchType[typeF],
   });

   const {
      name,
      lastname,
      active,
      category,
      studentlastname,
      studentname,
      type,
   } = filterForm;

   useEffect(() => {
      if (type === "student") loadCategories();
   }, [loadCategories, type]);

   const onChange = (e) => {
      setFilterForm({
         ...filterForm,
         [e.target.name]: e.target.value,
      });
   };

   const onChangeCheckbox = (e) => {
      setFilterForm({
         ...filterForm,
         active: e.target.checked,
      });
   };

   return (
      <>
         <form
            className="form"
            onSubmit={(e) => {
               e.preventDefault();
               loadUsers(filterForm, true, false, true);
            }}
         >
            <NameField
               name={name}
               lastname={lastname}
               onChange={onChange}
               lastnameAttribute="lastname"
               nameAttribute="name"
               lastnamePlaceholder="Apellido"
               namePlaceholder="Nombre"
            />
            {type === "student" && (
               <div className="form-group">
                  <select
                     className="form-input"
                     value={category}
                     name="category"
                     onChange={(e) => onChange(e)}
                  >
                     <option value="">* Seleccione Categoría</option>
                     {!categories.loading &&
                        categories.categories.map((category) => (
                           <React.Fragment key={category._id}>
                              {category.name !== "Inscripción" && (
                                 <option value={category._id}>
                                    {category.name}
                                 </option>
                              )}
                           </React.Fragment>
                        ))}
                  </select>
                  <label
                     htmlFor="category"
                     className={`form-label ${category === "" ? "lbl" : ""}`}
                  >
                     Categoría
                  </label>
               </div>
            )}
            {type === "guardian" && (
               <NameField
                  name={studentname}
                  lastname={studentlastname}
                  nameAttribute="studentname"
                  lastnameAttribute="studentlastname"
                  namePlaceholder="Nombre Alumno"
                  lastnamePlaceholder="Apellido Alumno"
                  onChange={onChange}
               />
            )}
            <div className="form-group mt-1">
               <input
                  className="form-checkbox"
                  onChange={(e) => onChangeCheckbox(e)}
                  type="checkbox"
                  checked={active}
                  name="active"
                  id={`cb${type}`}
               />
               <label className="checkbox-lbl" htmlFor={`cb${type}`}>
                  {active ? "Activos" : "Inactivos"}
               </label>
            </div>
            <div className="btn-right mb-1">
               <button type="submit" className="btn btn-light">
                  <i className="fas fa-filter"></i>&nbsp; Buscar
               </button>
            </div>
         </form>
         <div className="mt-2">
            {type === "student" ? (
               <StudentTable
                  clearProfile={clearProfile}
                  type="search"
                  userSearchType={userSearchType}
                  loadingUsers={loadingUsers}
                  users={users}
               />
            ) : (
               <RestTable
                  clearProfile={clearProfile}
                  loadingUsers={loadingUsers}
                  users={users}
                  type={type}
                  userSearchType={userSearchType}
               />
            )}
         </div>
         <div className="btn-right">
            <div className="tooltip">
               <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={(e) => {
                     e.preventDefault();
                     userPDF(users, userSearchType);
                  }}
               >
                  <i className="fas fa-file-pdf"></i>
               </button>
               <span className="tooltiptext">PDF lista de alumnos</span>
            </div>
         </div>
      </>
   );
};

SearchTab.propTypes = {
   users: PropTypes.object.isRequired,
   categories: PropTypes.object.isRequired,
   loadUsers: PropTypes.func.isRequired,
   loadCategories: PropTypes.func.isRequired,
   userPDF: PropTypes.func.isRequired,
   clearProfile: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   users: state.users,
   categories: state.categories,
});

export default connect(mapStateToProps, {
   loadCategories,
   loadUsers,
   userPDF,
   clearProfile,
})(SearchTab);
