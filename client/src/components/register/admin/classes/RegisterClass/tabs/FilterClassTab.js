import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import { updateClass, clearClass } from "../../../../../../actions/class";
import { loadCategories } from "../../../../../../actions/category";
import { loadUsers, removeUser } from "../../../../../../actions/user";
import { setAlert } from "../../../../../../actions/alert";

import StudentTable from "../../../../../tables/StudentTable";
import Alert from "../../../../../sharedComp/Alert";

const FilterClassTab = ({
   location,
   loadCategories,
   setAlert,
   loadUsers,
   updateClass,
   removeUser,
   clearClass,
   categories,
   classes: { classInfo, loading },
   users: { users, loadingUsers },
}) => {
   const [otherValues, setOtherValues] = useState({
      firstClear: true,
      register: location.pathname === "/register-class",
      oneLoad: true,
   });

   const [newCategory, setCategory] = useState({
      _id: "",
      name: "",
   });

   const { firstClear, oneLoad, register } = otherValues;

   useEffect(() => {
      if (firstClear) {
         clearClass();
         setOtherValues((prev) => ({
            ...prev,
            firstClear: false,
         }));
      }
      if (!register && !loading && oneLoad) {
         setCategory({
            _id: classInfo.category._id,
            name: classInfo.category.name,
         });
         loadUsers(
            {
               type: "Alumno",
               active: true,
               category: classInfo.category._id,
               classroom: "null",
            },
            false,
            null,
            false,
            !register ? false : true
         );
         setOtherValues((prev) => ({
            ...prev,
            oneLoad: false,
         }));
      }
      if (categories.loading && oneLoad) {
         loadCategories();
         if (register)
            setOtherValues((prev) => ({
               ...prev,
               oneLoad: false,
            }));
      }
   }, [
      categories.loading,
      loadCategories,
      classInfo,
      loading,
      clearClass,
      loadUsers,
      firstClear,
      register,
      oneLoad,
   ]);

   const filterStudents = (e) => {
      e.preventDefault();
      if (newCategory.name === "") {
         setAlert("Seleccione una categoría", "danger", "2");
         window.scroll(0, 0);
      } else {
         loadUsers(
            {
               type: "Alumno",
               active: true,
               category: newCategory._id,
               classroom: "null",
            },
            false
         );
         updateClass({ ...classInfo, category: newCategory, students: [] });
      }
   };

   const onChange = (e) => {
      setCategory({
         _id: e.target.value,
         name: e.target.options[e.target.selectedIndex].text,
      });
   };

   const addChild = (e, studentInfo) => {
      e.preventDefault();
      let exist = false;
      for (let x = 0; x < classInfo.students.length; x++) {
         if (classInfo.students[x]._id === studentInfo._id) exist = true;
      }
      if (!exist) {
         updateClass({
            ...classInfo,
            students: [...classInfo.students, studentInfo],
         });
         removeUser(studentInfo._id);
         setAlert("El alumno se ha agregado correctamente", "success", "3");
      } else {
         setAlert("El alumno ya ha sido agregado", "danger", "3");
      }
   };

   return (
      <>
         <form className="form">
            <div className="form-group">
               <select
                  className="form-input"
                  name="new-category"
                  disabled={!register}
                  id="new-category"
                  onChange={onChange}
                  value={newCategory._id}
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
                  htmlFor="new-category"
                  className={`form-label ${
                     newCategory._id === "" ? "lbl" : ""
                  }`}
               >
                  Categoría
               </label>
            </div>
            <div className="text-right">
               <button
                  onClick={filterStudents}
                  className="btn btn-primary my-1"
               >
                  Buscar Alumnos
               </button>
            </div>
         </form>
         <div className="mt-2">
            <Alert type="3" />
            <StudentTable
               users={users}
               loadingUsers={loadingUsers}
               search={false}
               addChild={addChild}
               type="Alumno"
            />
         </div>
      </>
   );
};

FilterClassTab.propTypes = {
   categories: PropTypes.object.isRequired,
   classes: PropTypes.object.isRequired,
   users: PropTypes.object.isRequired,
   loadCategories: PropTypes.func.isRequired,
   setAlert: PropTypes.func.isRequired,
   updateClass: PropTypes.func.isRequired,
   loadUsers: PropTypes.func.isRequired,
   clearClass: PropTypes.func.isRequired,
   removeUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   categories: state.categories,
   classes: state.classes,
   users: state.users,
});

export default connect(mapStateToProps, {
   loadCategories,
   setAlert,
   loadUsers,
   updateClass,
   clearClass,
   removeUser,
})(withRouter(FilterClassTab));
