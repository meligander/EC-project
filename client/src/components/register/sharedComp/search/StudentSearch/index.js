import React, { useState } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import moment from "moment";

import { loadUsers } from "../../../../../actions/user";

import Alert from "../../../../sharedComp/Alert";
import NameField from "../../NameField";

import "./style.scss";

const StudentSearch = ({
   users: { users },
   loadUsers,
   actionForSelected,
   selectStudent,
   selectedStudent,
   typeSearch,
   block,
}) => {
   const [filterForm, setFilterForm] = useState({
      name: "",
      lastname: "",
      active: true,
      type: typeSearch === "guardian/student" ? "guardian/student" : "student",
   });

   const onChangeFilter = (e) => {
      setFilterForm({
         ...filterForm,
         [e.target.name]: e.target.value,
      });
   };
   const searchStudents = (e) => {
      e.preventDefault();
      loadUsers(filterForm, true, true);
   };

   return (
      <div className="my-2">
         <h3 className="text-dark">{`Búsqueda de ${
            typeSearch === "guardian/student" ? "Usuarios" : "Alumnos"
         }`}</h3>
         <div className="border my-2">
            <Alert type="3" />
            <NameField
               name={filterForm.name}
               lastname={filterForm.lastname}
               onChange={onChangeFilter}
            />

            <div className="btn-right mb-2">
               <button
                  className={`btn ${
                     typeSearch === "installment" && block
                        ? "btn-black"
                        : "btn-light"
                  }`}
                  type="button"
                  disabled={typeSearch === "installment" && block}
                  onClick={(e) => searchStudents(e)}
               >
                  <i className="fas fa-filter"></i>
                  <span className="hide-sm">&nbsp; Buscar</span>
               </button>
            </div>
            <table className="search">
               <thead>
                  <tr>
                     {(typeSearch === "installment" ||
                        typeSearch === "student") && <th>Legajo</th>}
                     <th>Nombre</th>
                     {typeSearch === "guardian/student" && <th>Tipo</th>}
                     {(typeSearch === "installment" ||
                        typeSearch === "student") && <th>Categoría</th>}
                     {typeSearch === "enrollment" && <th>Edad</th>}
                  </tr>
               </thead>
               <tbody>
                  {users &&
                     users.length > 0 &&
                     users.map((user) => (
                        <tr
                           key={user._id}
                           onDoubleClick={() => selectStudent(user)}
                           className={
                              selectedStudent._id === user._id ||
                              selectedStudent === user._id
                                 ? "selected"
                                 : ""
                           }
                        >
                           {(typeSearch === "installment" ||
                              typeSearch === "student") && (
                              <td>{user.studentnumber}</td>
                           )}
                           <td>{user.lastname + ", " + user.name}</td>
                           {typeSearch === "guardian/student" && (
                              <td>
                                 {user.type === "student" ? "Alumno" : "Tutor"}
                              </td>
                           )}
                           {(typeSearch === "installment" ||
                              typeSearch === "student") && (
                              <td>{user.category && user.category}</td>
                           )}
                           {typeSearch === "enrollment" && (
                              <td>{moment().diff(user.dob, "years", false)}</td>
                           )}
                        </tr>
                     ))}
               </tbody>
            </table>
            <div className="btn-right">
               <button
                  type="button"
                  className="btn"
                  onClick={(e) => {
                     setFilterForm({
                        ...filterForm,
                        name: "",
                        lastname: "",
                     });
                     actionForSelected(e);
                  }}
               >
                  {typeSearch !== "installment" ? (
                     <>
                        <i className="fas fa-plus"></i>
                        <span className="hide-md">&nbsp; Agregar</span>
                     </>
                  ) : (
                     <>
                        <i className="fas fa-money-check-alt"></i>
                        <span className="hide-md">&nbsp; Ver Cuotas</span>
                     </>
                  )}
               </button>
            </div>
         </div>
      </div>
   );
};

StudentSearch.propTypes = {
   users: PropTypes.object.isRequired,
   selectedStudent: PropTypes.object.isRequired,
   loadUsers: PropTypes.func.isRequired,
   actionForSelected: PropTypes.func.isRequired,
   selectStudent: PropTypes.func.isRequired,
   typeSearch: PropTypes.string.isRequired,
   block: PropTypes.bool,
};

const mapStateToProps = (state) => ({
   users: state.users,
});

export default connect(mapStateToProps, { loadUsers })(
   withRouter(StudentSearch)
);
