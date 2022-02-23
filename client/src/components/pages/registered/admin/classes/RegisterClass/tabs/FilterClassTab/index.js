import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { BiFilterAlt } from "react-icons/bi";

import {
   addStudent,
   updateClassCategory,
} from "../../../../../../../../actions/class";
import { loadUsers, clearProfile } from "../../../../../../../../actions/user";
import { setAlert } from "../../../../../../../../actions/alert";

import StudentTable from "../../../../../sharedComp/tables/StudentTable";
import Alert from "../../../../../../sharedComp/Alert";

const FilterClassTab = ({
   match,
   categories: { categories },
   classes: { classInfo },
   users: { users, loading },
   setAlert,
   loadUsers,
   addStudent,
   updateClassCategory,
   clearProfile,
}) => {
   const _id = match.params.class_id;

   const [category, setCategory] = useState("");

   useEffect(() => {
      if (_id) setCategory(classInfo.category._id);
   }, [classInfo, _id]);

   const filterStudents = (e) => {
      e.preventDefault();
      if (category === "") {
         setAlert("Seleccione una categoría", "danger", "2");
         window.scroll(0, 0);
      } else {
         loadUsers(
            {
               type: "student",
               active: true,
               category: category,
               classroom: null,
            },
            true,
            true
         );
         updateClassCategory(categories.find((item) => item._id === category));
      }
   };

   return (
      <>
         <form className="form" onSubmit={filterStudents}>
            <div className="form-group">
               <select
                  className="form-input"
                  disabled={_id !== undefined}
                  id="new-category"
                  onChange={(e) => {
                     e.persist();
                     setCategory(e.target.value);
                  }}
                  value={category}
               >
                  <option value="">* Seleccione Categoría</option>
                  {categories.map((category) => (
                     <React.Fragment key={category._id}>
                        {category.name !== "Inscripción" && (
                           <option value={category._id}>{category.name}</option>
                        )}
                     </React.Fragment>
                  ))}
               </select>
               <label
                  htmlFor="new-category"
                  className={`form-label ${category === "" ? "lbl" : ""}`}
               >
                  Categoría
               </label>
            </div>

            <div className="btn-right">
               <button
                  type="submit"
                  className={`btn ${!_id ? "btn-light" : "btn-black"}`}
                  disabled={_id !== undefined}
               >
                  <BiFilterAlt />
                  &nbsp;Buscar
               </button>
            </div>
         </form>
         <div className="mt-2">
            <Alert type="3" />
            {!loading && users[0] && users[0].type === "student" && (
               <StudentTable
                  users={users}
                  clearProfile={clearProfile}
                  actionWChild={(studentInfo) =>
                     addStudent(studentInfo, classInfo)
                  }
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
   updateClassCategory,
   clearProfile,
})(withRouter(FilterClassTab));
