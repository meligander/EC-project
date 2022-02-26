import React, { useState } from "react";
import { connect } from "react-redux";
import { BiFilterAlt } from "react-icons/bi";
import { ImFilePdf } from "react-icons/im";

import {
   clearProfile,
   loadUsers,
   userPDF,
} from "../../../../../../actions/user";
import { clearClasses } from "../../../../../../actions/class";

import StudentTable from "../../../sharedComp/tables/StudentTable";
import RestTable from "../../../sharedComp/tables/RestTable";
import NameField from "../../../sharedComp/NameField";

const SearchTab = ({
   users: {
      users,
      loadingUsers,
      otherValues: { userSearchType },
   },
   categories: { categories, loading },
   typeF,
   loadUsers,
   clearProfile,
   clearClasses,
   userPDF,
}) => {
   const searchType = {
      Alumnos: "student",
      Tutores: "guardian",
      Profesores: "teacher",
      Administradores: "admin",
   };

   const type = searchType[typeF];

   const [filterForm, setFilterForm] = useState({
      name: "",
      lastname: "",
      active: true,
      category: "",
      studentname: "",
      studentlastname: "",
   });

   const { name, lastname, active, category, studentlastname, studentname } =
      filterForm;

   const onChange = (e) => {
      e.persist();
      setFilterForm({
         ...filterForm,
         [e.target.name]:
            e.target.name === "active" ? e.target.checked : e.target.value,
      });
   };

   return (
      <>
         <form
            className="form"
            onSubmit={(e) => {
               e.preventDefault();
               loadUsers({ ...filterForm, type, searchTab: true }, true, true);
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
                     onChange={onChange}
                  >
                     <option value="">* Seleccione Categoría</option>
                     {!loading &&
                        categories.map((category) => (
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
                  onChange={onChange}
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
                  <BiFilterAlt />
                  &nbsp;Buscar
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
                  clearClasses={clearClasses}
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
                  <ImFilePdf />
               </button>
               <span className="tooltiptext">PDF lista de alumnos</span>
            </div>
         </div>
      </>
   );
};

const mapStateToProps = (state) => ({
   users: state.users,
   categories: state.categories,
});

export default connect(mapStateToProps, {
   loadUsers,
   userPDF,
   clearProfile,
   clearClasses,
})(SearchTab);
