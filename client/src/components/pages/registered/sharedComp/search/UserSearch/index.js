import React, { useState } from "react";
import { connect } from "react-redux";
import differenceInYears from "date-fns/differenceInYears";
import { BiFilterAlt } from "react-icons/bi";
import { FaMoneyCheckAlt, FaPlus } from "react-icons/fa";

import { loadUsers } from "../../../../../../actions/user";

import Alert from "../../../../sharedComp/Alert";
import NameField from "../../NameField";

import "./style.scss";

const UserSearch = ({
   users: { users, loading },
   loadUsers,
   actionForSelected,
   selectStudent,
   selectedStudent,
   typeSearch,
   block,
   newInvoice,
}) => {
   const instStudent = typeSearch === "installment" || typeSearch === "student";

   const [filterForm, setFilterForm] = useState({
      name: "",
      lastname: "",
   });

   const { name, lastname } = filterForm;

   const onChangeFilter = (e) => {
      e.persist();
      setFilterForm((prev) => ({
         ...prev,
         [e.target.name]: e.target.value,
      }));
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
                     loadUsers(
                        {
                           ...filterForm,
                           ...(newInvoice && { active: true }),
                           type:
                              typeSearch === "guardian/student"
                                 ? "guardian/student"
                                 : "student",
                        },
                        true,
                        true,
                        true
                     );
                  }}
               >
                  <BiFilterAlt />
                  <span className="hide-sm">&nbsp; Buscar</span>
               </button>
            </div>
            <table className="search">
               <thead>
                  <tr>
                     {instStudent && <th>Legajo</th>}
                     <th>Nombre</th>
                     {typeSearch === "guardian/student" && <th>Tipo</th>}
                     {instStudent && <th>Categoría</th>}
                     {typeSearch === "enrollment" && <th>Edad</th>}
                  </tr>
               </thead>
               <tbody>
                  {!loading &&
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
                           {instStudent && <td>{user.studentnumber}</td>}
                           <td>{user.lastname + ", " + user.name}</td>
                           {typeSearch === "guardian/student" && (
                              <td>
                                 {user.type === "student" ? "Alumno" : "Tutor"}
                              </td>
                           )}
                           {instStudent && (
                              <td>{user.category && user.category}</td>
                           )}
                           {typeSearch === "enrollment" && (
                              <td>
                                 {differenceInYears(
                                    new Date(),
                                    new Date(user.dob.slice(0, -1))
                                 )}
                              </td>
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

export default connect(mapStateToProps, { loadUsers })(UserSearch);