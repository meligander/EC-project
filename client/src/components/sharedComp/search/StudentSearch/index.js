import React, { useState } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import moment from "moment";

import { loadUsers } from "../../../../actions/user";

import Alert from "../../Alert";
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
      type: typeSearch === "Tutor/Student" ? "Alumno y Tutor" : "Alumno",
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
         <h3>{`Búsqueda de ${
            typeSearch === "Tutor/Student" ? "Usuarios" : "Alumnos"
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
                     typeSearch === "Installment" && block
                        ? "btn-black"
                        : "btn-light"
                  }`}
                  type="submit"
                  disabled={typeSearch === "Installment" && block}
                  onClick={(e) => searchStudents(e)}
               >
                  <i className="fas fa-filter"></i>
                  <span className="hide-sm">&nbsp; Buscar</span>
               </button>
            </div>
            <table className="search">
               <thead>
                  <tr>
                     {(typeSearch === "Installment" ||
                        typeSearch === "Student") && <th>Legajo</th>}
                     <th>Nombre</th>
                     {typeSearch === "Tutor/Student" && <th>Tipo</th>}
                     {(typeSearch === "Installment" ||
                        typeSearch === "Student") && <th>Categoría</th>}
                     {typeSearch === "Enrollment" && <th>Edad</th>}
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
                           {(typeSearch === "Installment" ||
                              typeSearch === "Student") && (
                              <td>{user.studentnumber}</td>
                           )}
                           <td>{user.lastname + ", " + user.name}</td>
                           {typeSearch === "Tutor/Student" && (
                              <td>{user.type}</td>
                           )}
                           {(typeSearch === "Installment" ||
                              typeSearch === "Student") && (
                              <td>{user.category && user.category}</td>
                           )}
                           {typeSearch === "Enrollment" && (
                              <td>{moment().diff(user.dob, "years", false)}</td>
                           )}
                        </tr>
                     ))}
               </tbody>
            </table>
            <div className="btn-right">
               <button
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
                  {typeSearch !== "Installment" ? (
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
