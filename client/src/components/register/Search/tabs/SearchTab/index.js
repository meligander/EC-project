import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { loadCategories } from "../../../../../actions/category";
import { loadUsers, userPDF } from "../../../../../actions/user";
import { setAlert } from "../../../../../actions/alert";

import StudentTable from "../../../../tables/StudentTable";
import RestTable from "../../../../tables/RestTable";
import NameField from "../../../../sharedComp/NameField";

const SearchTab = ({
   users: { users, loadingUsers, usersType },
   categories,
   loadCategories,
   loadUsers,
   typeF,
   userPDF,
   setAlert,
}) => {
   const [filterForm, setFilterForm] = useState({
      name: "",
      lastname: "",
      active: true,
      category: "",
      studentname: "",
      studentlastname: "",
      type: typeF.substring(0, typeF.length - (typeF === "Alumnos" ? 1 : 2)),
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

   const searchUsers = (e) => {
      e.preventDefault();
      loadUsers(filterForm, true);
   };

   const pdfGeneratorSave = () => {
      if (users.length === 0) {
         setAlert("Primero debe realizar una búsqueda", "danger", "2");
         window.scrollTo(500, 0);
      } else {
         userPDF(users, usersType);
      }
   };

   useEffect(() => {
      if (type === "Alumno") loadCategories();
   }, [loadCategories, type]);

   return (
      <>
         <form className="form">
            <NameField
               name={name}
               lastname={lastname}
               onChange={onChange}
               lastnameAttribute="lastname"
               nameAttribute="name"
               lastnamePlaceholder="Apellido"
               namePlaceholder="Nombre"
            />
            {type === "Alumno" && (
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
            {type === "Tutor" && (
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
               <button
                  type="submit"
                  onClick={(e) => searchUsers(e)}
                  className="btn btn-light"
               >
                  <i className="fas fa-filter"></i> Buscar
               </button>
            </div>
         </form>
         {type === "Alumno" ? (
            <StudentTable
               search={true}
               type={usersType}
               loadingUsers={loadingUsers}
               users={users}
            />
         ) : (
            <RestTable
               loadingUsers={loadingUsers}
               users={users}
               type={type}
               usersType={usersType}
            />
         )}
         <div className="btn-right">
            <button className="btn btn-secondary" onClick={pdfGeneratorSave}>
               <i className="fas fa-file-pdf"></i>
            </button>
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
   setAlert: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   users: state.users,
   categories: state.categories,
});

export default connect(mapStateToProps, {
   loadCategories,
   loadUsers,
   userPDF,
   setAlert,
})(SearchTab);
