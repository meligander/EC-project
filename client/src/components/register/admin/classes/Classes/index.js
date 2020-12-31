import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import {
   loadClasses,
   clearClass,
   clearClasses,
   classPDF,
} from "../../../../../actions/class";
import { loadCategories } from "../../../../../actions/category";
import {
   loadUsers,
   clearSearch,
   clearProfile,
} from "../../../../../actions/user";

import ClassesTable from "../../../../tables/ClassesTable";
import Loading from "../../../../modal/Loading";

const Classes = ({
   classes: { classes, loadingClasses },
   users,
   auth: { userLogged },
   categories,
   loadClasses,
   loadUsers,
   loadCategories,
   classPDF,
   clearClass,
   clearClasses,
   clearProfile,
   clearSearch,
}) => {
   const [otherValues, setOtherValues] = useState({
      condition: true,
   });

   const { condition } = otherValues;

   const [filterForm, setfilterForm] = useState({
      teacher: "",
      category: "",
   });

   const { teacher, category } = filterForm;

   useEffect(() => {
      if (userLogged.type === "Profesor") {
         if (loadingClasses) loadClasses({ teacher: userLogged._id });
         else
            setOtherValues((prev) => ({
               ...prev,
               condition: !loadingClasses,
            }));
      } else {
         if (loadingClasses) {
            loadUsers({ type: "Profesor", active: true });
            loadCategories();
            loadClasses({});
         } else {
            setOtherValues((prev) => ({
               ...prev,
               condition:
                  !loadingClasses && !categories.loading && !users.loadingUsers,
            }));
         }
      }
   }, [
      loadUsers,
      loadCategories,
      loadClasses,
      userLogged,
      loadingClasses,
      categories.loading,
      users.loadingUsers,
   ]);

   const onChange = (e) => {
      setfilterForm({
         ...filterForm,
         [e.target.name]: e.target.value,
      });
   };

   const onSearch = (e) => {
      e.preventDefault();
      loadClasses(filterForm);
   };

   const pdfGeneratorSave = () => {
      classPDF(classes, "classes");
   };

   return (
      <>
         {condition ? (
            <>
               <h1>Clases</h1>
               {userLogged.type !== "Profesor" && (
                  <form className="form" onSubmit={onSearch}>
                     <div className="form-group">
                        <select
                           id="teacher"
                           className="form-input"
                           name="teacher"
                           onChange={onChange}
                           value={teacher}
                        >
                           <option value="">* Seleccione Profesor</option>
                           {users.users.length > 0 &&
                              users.users.map((teacher) => (
                                 <option key={teacher._id} value={teacher._id}>
                                    {teacher.lastname + " " + teacher.name}
                                 </option>
                              ))}
                        </select>
                        <label
                           htmlFor="teacher"
                           className={`form-label ${
                              teacher === "" ? "lbl" : ""
                           }`}
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
                           {categories.categories.map((category) => (
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
                           className={`form-label ${
                              category === "" ? "lbl" : ""
                           }`}
                        >
                           Categoría
                        </label>
                     </div>
                     <div className="btn-right">
                        <button type="submit" className="btn btn-light">
                           <i className="fas fa-filter"></i>&nbsp; Buscar
                        </button>
                     </div>
                  </form>
               )}

               <div className="pt-4">
                  <ClassesTable
                     classes={classes}
                     all={userLogged.type !== "Profesor" ? true : false}
                     clearClass={clearClass}
                     clearProfile={clearProfile}
                  />
               </div>

               <div className="btn-right">
                  {userLogged.type !== "Profesor" && (
                     <Link
                        to={users.users.length !== 0 ? "/register-class" : "#"}
                        onClick={() => {
                           window.scroll(0, 0);
                           clearClasses();
                           clearSearch();
                        }}
                        className={`btn ${
                           users.users.length !== 0
                              ? "btn-primary"
                              : "btn-black"
                        }`}
                     >
                        <i className="fas fa-plus"></i>&nbsp; Nueva Clase
                     </Link>
                  )}
                  <button
                     className="btn btn-secondary"
                     onClick={pdfGeneratorSave}
                  >
                     <i className="fas fa-file-pdf"></i>
                  </button>
               </div>
            </>
         ) : (
            <Loading />
         )}
      </>
   );
};

Classes.propTypes = {
   classes: PropTypes.object.isRequired,
   users: PropTypes.object.isRequired,
   auth: PropTypes.object.isRequired,
   categories: PropTypes.object.isRequired,
   loadClasses: PropTypes.func.isRequired,
   loadUsers: PropTypes.func.isRequired,
   loadCategories: PropTypes.func.isRequired,
   classPDF: PropTypes.func.isRequired,
   clearProfile: PropTypes.func.isRequired,
   clearClass: PropTypes.func.isRequired,
   clearClasses: PropTypes.func.isRequired,
   clearSearch: PropTypes.func.isRequired,
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
