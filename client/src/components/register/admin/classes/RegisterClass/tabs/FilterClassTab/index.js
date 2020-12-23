import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import {
   updateClassCategory,
   addStudent,
} from "../../../../../../../actions/class";
import { loadUsers } from "../../../../../../../actions/user";
import { setAlert } from "../../../../../../../actions/alert";

import StudentTable from "../../../../../../tables/StudentTable";
import Alert from "../../../../../../sharedComp/Alert";

const FilterClassTab = ({
   location,
   setAlert,
   loadUsers,
   updateClassCategory,
   addStudent,
   categories,
   classes: { classInfo, loading },
   users: { users, loadingUsers },
}) => {
   const registerClass = location.pathname === "/register-class";

   const [category, setCategory] = useState({
      _id: "",
      name: "",
   });

   useEffect(() => {
      if (!registerClass && !loading) {
         setCategory({
            _id: classInfo.category._id,
            name: classInfo.category.name,
         });
      }
   }, [classInfo, registerClass, loading]);

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
         updateClassCategory({ ...(classInfo && { ...classInfo }), category });
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
         addStudent(studentInfo);
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
                  disabled={!registerClass}
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
   setAlert: PropTypes.func.isRequired,
   updateClassCategory: PropTypes.func.isRequired,
   loadUsers: PropTypes.func.isRequired,
   addStudent: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   categories: state.categories,
   classes: state.classes,
   users: state.users,
});

export default connect(mapStateToProps, {
   setAlert,
   loadUsers,
   updateClassCategory,
   addStudent,
})(withRouter(FilterClassTab));
