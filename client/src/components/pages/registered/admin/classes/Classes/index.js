import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { ImFilePdf } from "react-icons/im";
import { FaPlus } from "react-icons/fa";
import { BiFilterAlt } from "react-icons/bi";

import {
   loadClasses,
   clearClass,
   clearClasses,
   classPDF,
} from "../../../../../../actions/class";
import { loadCategories } from "../../../../../../actions/category";
import {
   loadUsers,
   clearSearch,
   clearProfile,
} from "../../../../../../actions/user";

import ClassesTable from "../../../sharedComp/tables/ClassesTable";

const Classes = ({
   classes: { classes, loading },
   users: { users, loading: loadingUsers },
   auth: { userLogged },
   categories: { categories, loading: loadingCategories },
   loadClasses,
   loadUsers,
   loadCategories,
   classPDF,
   clearClass,
   clearClasses,
   clearProfile,
   clearSearch,
}) => {
   const [filterForm, setfilterForm] = useState({
      teacher: "",
      category: "",
      year: new Date().getFullYear(),
   });

   const { teacher, category, year } = filterForm;

   useEffect(() => {
      if (userLogged.type !== "teacher" && loadingUsers)
         loadUsers({ type: "teacher", active: true }, false, true);
   }, [loadUsers, userLogged, loadingUsers]);

   useEffect(() => {
      if (userLogged.type !== "teacher" && loadingCategories)
         loadCategories(false);
   }, [userLogged, loadingCategories, loadCategories]);

   useEffect(() => {
      if (loading) loadClasses({ year }, true);
   }, [loading, loadClasses, year]);

   const onChange = (e) => {
      e.persist();
      setfilterForm({
         ...filterForm,
         [e.target.name]: e.target.value,
      });
   };

   return (
      <>
         <h1>Clases</h1>
         {userLogged.type !== "teacher" && (
            <form
               className="form"
               onSubmit={(e) => {
                  e.preventDefault();
                  loadClasses(filterForm, true);
               }}
            >
               <div className="form-group">
                  <select
                     id="teacher"
                     className="form-input"
                     name="teacher"
                     onChange={onChange}
                     value={teacher}
                  >
                     <option value="">* Seleccione Profesor</option>
                     {!loadingUsers &&
                        users.map((user) => (
                           <option key={user._id} value={user._id}>
                              {user.lastname + ", " + user.name}
                           </option>
                        ))}
                  </select>
                  <label
                     htmlFor="teacher"
                     className={`form-label ${teacher === "" ? "lbl" : ""}`}
                  >
                     Profesor
                  </label>
               </div>
               <div className="form-group">
                  <select
                     id="category"
                     className="form-input"
                     name="category"
                     onChange={onChange}
                     value={category}
                  >
                     <option value="">* Seleccione Categoría</option>
                     {!loadingCategories &&
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
               <div className="form-group">
                  <select
                     id="year"
                     className="form-input"
                     name="year"
                     onChange={onChange}
                     value={year}
                  >
                     <option value="">* Seleccione el Año</option>
                     <option value="2022">2022</option>
                     <option value="2021">2021</option>
                  </select>
                  <label
                     htmlFor="year"
                     className={`form-label ${year === "" ? "lbl" : ""}`}
                  >
                     Año
                  </label>
               </div>

               <div className="btn-right">
                  <button type="submit" className="btn btn-light">
                     <BiFilterAlt />
                     &nbsp;Buscar
                  </button>
               </div>
            </form>
         )}

         <div className="pt-4">
            <ClassesTable
               classes={classes ? classes : []}
               all={userLogged.type !== "teacher"}
               clearClass={clearClass}
               clearClasses={clearClasses}
               clearProfile={clearProfile}
            />
         </div>

         <div className="btn-right">
            {userLogged.type !== "teacher" && (
               <Link
                  to={users.length !== 0 ? "/class/register" : "#"}
                  onClick={() => {
                     if (users.length !== 0) {
                        window.scroll(0, 0);
                        clearClass();
                        clearSearch();
                     }
                  }}
                  className={`btn ${
                     users.length !== 0 ? "btn-dark" : "btn-black"
                  }`}
               >
                  <FaPlus />
                  &nbsp;Nueva Clase
               </Link>
            )}
            <div className="tooltip">
               <button
                  type="button"
                  className="btn btn-secondary tooltip"
                  onClick={(e) => {
                     e.preventDefault();
                     classPDF(classes, "classes");
                  }}
               >
                  <ImFilePdf />
               </button>
               <span className="tooltiptext">PDF con clases y su info</span>
            </div>
         </div>
      </>
   );
};

const mapStateToProps = (state) => ({
   classes: state.classes,
   users: state.users,
   auth: state.auth,
   categories: state.categories,
});

export default connect(mapStateToProps, {
   loadClasses,
   loadCategories,
   loadUsers,
   classPDF,
   clearClass,
   clearClasses,
   clearSearch,
   clearProfile,
})(Classes);
