import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import { updateClassCategory } from "../../../../../../../actions/class";
import { loadCategories } from "../../../../../../../actions/category";
import { loadUsers, removeUser } from "../../../../../../../actions/user";
import { setAlert } from "../../../../../../../actions/alert";

import StudentTable from "../../../../../../tables/StudentTable";
import Alert from "../../../../../../sharedComp/Alert";

const FilterClassTab = ({
   location,
   loadCategories,
   setAlert,
   loadUsers,
   updateClassCategory,
   removeUser,
   categories,
   classes: { classInfo, loading },
   users: { users, loadingUsers },
}) => {
   const register = location.pathname === "/register-class";

   const [category, setCategory] = useState({
      _id: "",
      name: "",
   });

   useEffect(() => {
      if (!register && !loading) {
         setCategory({
            _id: classInfo.category._id,
            name: classInfo.category.name,
         });
      }
      if (categories.loading) {
         loadCategories(true);
      }
   }, [categories.loading, loadCategories, classInfo, loading, register]);

   const filterStudents = (e) => {
      e.preventDefault();
      if (category.name === "") {
         setAlert("Seleccione una categoría", "danger", "2");
         window.scroll(0, 0);
      } else {
         loadUsers({
            type: "Alumno",
            active: true,
            category: category._id,
            classroom: "null",
         });
         updateClassCategory({ ...classInfo, category });
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
         updateClassCategory({
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
                  value={category._id}
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
                  className={`form-label ${category._id === "" ? "lbl" : ""}`}
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
   updateClassCategory: PropTypes.func.isRequired,
   loadUsers: PropTypes.func.isRequired,
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
   updateClassCategory,
   removeUser,
})(withRouter(FilterClassTab));
