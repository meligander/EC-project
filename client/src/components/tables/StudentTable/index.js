import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import PropTypes from "prop-types";

const StudentTable = ({ type, loadingUsers, users, search, addChild }) => {
   return (
      <table>
         <thead>
            <tr>
               <th>Legajo</th>
               <th>Nombre</th>
               <th className="hide-sm">Edad</th>
               {search && (
                  <>
                     <th className="hide-sm">Celular</th>
                     <th>Categoría</th>
                  </>
               )}
               {!search && <th>&nbsp;</th>}
               <th>&nbsp;</th>
            </tr>
         </thead>
         <tbody>
            {!loadingUsers &&
               type === "Alumno" &&
               users.map((user) => {
                  const years = moment().diff(user.dob, "years", false);
                  return (
                     user.type === "Alumno" && (
                        <tr key={user._id}>
                           <td>{user.studentnumber}</td>
                           <td>
                              {user.lastname}, {user.name}
                           </td>
                           <td className="hide-sm">
                              {user.dob !== undefined && years}
                           </td>
                           {search && (
                              <>
                                 <td className="hide-sm">{user.cel}</td>
                                 <td>{user.category}</td>
                              </>
                           )}
                           <td>
                              <Link
                                 className="btn-text"
                                 to={`/dashboard/${user._id}`}
                              >
                                 Más Info &rarr;
                              </Link>
                           </td>
                           {!search && (
                              <td>
                                 <button
                                    className="btn btn-secondary"
                                    onClick={(e) => addChild(e, user)}
                                 >
                                    Seleccionar
                                 </button>
                              </td>
                           )}
                        </tr>
                     )
                  );
               })}
         </tbody>
      </table>
   );
};

StudentTable.propTypes = {
   users: PropTypes.array.isRequired,
   loadingUsers: PropTypes.bool.isRequired,
   addChild: PropTypes.func,
   search: PropTypes.bool.isRequired,
   type: PropTypes.string.isRequired,
};

export default StudentTable;
