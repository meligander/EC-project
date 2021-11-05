import React, { useState } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { BiFilterAlt } from "react-icons/bi";
import { FaMoneyCheckAlt, FaPlus } from "react-icons/fa";

import { loadUsers } from "../../../../../../actions/user";

import Alert from "../../../../sharedComp/Alert";
import NameField from "../../NameField";

import "./style.scss";

const StudentSearch = ({
   users: { users, loading },
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
   });

   const { name, lastname } = filterForm;

   const onChangeFilter = (e) => {
      setFilterForm((prev) => ({
         ...prev,
         [e.target.name]: e.target.value,
      }));
   };
   const searchStudents = () => {
      loadUsers(
         {
            ...filterForm,
            active: true,
            type:
               typeSearch === "guardian/student"
                  ? "guardian/student"
                  : "student",
         },
         true,
         true
      );
   };

   return (
      <div className="my-2">
         <h3 className="text-dark">{`Búsqueda de ${
            typeSearch === "guardian/student" ? "Usuarios" : "Alumnos"
         }`}</h3>
         <div className="border my-2">
            <Alert type="3" />
            <NameField
               name={name}
               lastname={lastname}
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
                  onClick={(e) => {
                     e.preventDefault();
                     searchStudents();
                  }}
               >
                  <BiFilterAlt />
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
                  {!loading &&
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
            <div className="btn-right mt-2">
               <button
                  type="button"
                  className={`btn ${
                     typeSearch !== "installment" ? "btn-dark" : ""
                  }`}
                  onClick={(e) => {
                     e.preventDefault();
                     setFilterForm((prev) => ({
                        ...prev,
                        name: "",
                        lastname: "",
                     }));
                     actionForSelected();
                  }}
               >
                  {typeSearch !== "installment" ? (
                     <>
                        <FaPlus />
                        <span className="hide-md">&nbsp; Agregar</span>
                     </>
                  ) : (
                     <>
                        <FaMoneyCheckAlt />
                        <span className="hide-md">&nbsp; Ver Cuotas</span>
                     </>
                  )}
               </button>
            </div>
         </div>
      </div>
   );
};

const mapStateToProps = (state) => ({
   users: state.users,
});

export default connect(mapStateToProps, { loadUsers })(StudentSearch);
