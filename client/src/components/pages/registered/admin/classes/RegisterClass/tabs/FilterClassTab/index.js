import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { BiFilterAlt } from "react-icons/bi";

import { addStudent } from "../../../../../../../../actions/class";
import { loadUsers, clearProfile } from "../../../../../../../../actions/user";
import { setAlert } from "../../../../../../../../actions/alert";

import StudentTable from "../../../../../sharedComp/tables/StudentTable";
import Alert from "../../../../../../sharedComp/Alert";

const FilterClassTab = ({
   location,
   setAlert,
   loadUsers,
   addStudent,
   clearProfile,
   categories: { categories, loading: loadingCategories },
   classes: { classInfo, loadingClass },
   users: { users, loading },
}) => {
   const registerClass = location.pathname === "/register-class";

   const [category, setCategory] = useState({
      _id: "",
      name: "",
   });

   useEffect(() => {
      if (!registerClass && !loadingClass) {
         setCategory({
            _id: classInfo.category._id,
            name: classInfo.category.name,
         });
      }
   }, [classInfo, registerClass, loadingClass]);

   const filterStudents = (e) => {
      e.preventDefault();
      if (category.name === "") {
         setAlert("Seleccione una categoría", "danger", "2");
         window.scroll(0, 0);
      } else {
         loadUsers({
            type: "student",
            active: true,
            category: category._id,
            classroom: "null",
         });
      }
   };

   const onChange = (e) => {
      setCategory({
         _id: e.target.value,
         name: e.target.options[e.target.selectedIndex].text,
      });
   };

   const addChild = (studentInfo) => {
      let exist = classInfo.students.some(
         (student) => student._id === studentInfo._id
      );

      if (!exist) {
         addStudent(studentInfo);
         setAlert("El alumno se ha agregado correctamente", "success", "3");
      } else {
         setAlert("El alumno ya ha sido agregado", "danger", "3");
      }
   };

   return (
      <>
         <form className="form" onSubmit={filterStudents}>
            {!loadingCategories && (
               <div className="form-group">
                  <select
                     className="form-input"
                     disabled={!registerClass}
                     id="new-category"
                     onChange={onChange}
                     value={category._id}
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
                     htmlFor="new-category"
                     className={`form-label ${
                        category._id === "" ? "lbl" : ""
                     }`}
                  >
                     Categoría
                  </label>
               </div>
            )}

            <div className="text-right">
               <button
                  type="submit"
                  className={`btn ${
                     registerClass ? "btn-light" : "btn-black"
                  } my-1`}
                  disabled={!registerClass}
               >
                  <BiFilterAlt />
                  &nbsp;Buscar
               </button>
            </div>
         </form>
         <div className="mt-2">
            <Alert type="3" />
            {!loading && (
               <StudentTable
                  users={users}
                  clearProfile={clearProfile}
                  actionWChild={addChild}
                  type="add-child"
               />
            )}
         </div>
      </>
   );
};

const mapStateToProps = (state) => ({
   categories: state.categories,
   classes: state.classes,
   users: state.users,
});

export default connect(mapStateToProps, {
   setAlert,
   loadUsers,
   addStudent,
   clearProfile,
})(withRouter(FilterClassTab));
