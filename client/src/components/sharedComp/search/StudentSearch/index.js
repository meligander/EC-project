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
   actionForSelected,
   selectStudent,
   selectedStudent,
   loadUsers,
   //To load Installments after selecting a student
   seeInstallment = false,
   //it could search only students or students and tutors (invoice)
   student = true,
   //
   enrollment = false,
}) => {
   const [filterForm, setFilterForm] = useState({
      name: "",
      lastname: "",
      type: student ? "Alumno" : "Alumno y Tutor",
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
         <h3>{`Búsqueda de ${student ? "Alumnos" : "Usuarios"}`}</h3>
         <div className="border my-2">
            <Alert type="3" />
            <NameField
               name={filterForm.name}
               lastname={filterForm.lastname}
               onChange={onChangeFilter}
            />

            <div className="btn-right mb-2">
               <button
                  className="btn btn-light"
                  type="submit"
                  onClick={(e) => searchStudents(e)}
               >
                  <i className="fas fa-filter"></i>
                  <span className="hide-sm">Buscar</span>
               </button>
            </div>
            <table className="search">
               <thead>
                  <tr>
                     {student && <th>Legajo</th>}
                     <th>Nombre</th>
                     {!student && <th>Tipo</th>}
                     {student && !enrollment && <th>Categoría</th>}
                     {enrollment && <th>Edad</th>}
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
                           {student && <td>{user.studentnumber}</td>}
                           <td>{user.lastname + ", " + user.name}</td>
                           {!student && <td>{user.type}</td>}
                           {student && !enrollment && (
                              <td>{user.category && user.category}</td>
                           )}
                           {enrollment && (
                              <td>{moment().diff(user.dob, "years", false)}</td>
                           )}
                        </tr>
                     ))}
               </tbody>
            </table>
            {student && (
               <div className="btn-right">
                  {!enrollment && (
                     <button className="btn" onClick={actionForSelected}>
                        {!seeInstallment ? (
                           <>
                              <i className="fas fa-user-plus"></i>
                              <span className="hide-md"> Agregar</span>
                           </>
                        ) : (
                           "Ver Cuotas"
                        )}
                     </button>
                  )}
               </div>
            )}
         </div>
      </div>
   );
};

StudentSearch.propTypes = {
   users: PropTypes.object.isRequired,
   loadUsers: PropTypes.func.isRequired,
   actionForSelected: PropTypes.func,
   selectStudent: PropTypes.func.isRequired,
   student: PropTypes.bool,
   enrollment: PropTypes.bool,
};

const mapStateToProps = (state) => ({
   users: state.users,
});

export default connect(mapStateToProps, { loadUsers })(
   withRouter(StudentSearch)
);
