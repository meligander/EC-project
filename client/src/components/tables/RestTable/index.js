import React from "react";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import PropTypes from "prop-types";

import "./style.scss";

const RestTable = ({ loadingUsers, users, type, usersType, clearProfile }) => {
   return (
      <table>
         <thead>
            <tr>
               <th>Nombre</th>
               <th className="hide-sm">Email</th>
               <th>Celular</th>
               {type !== "Tutor" && <th className="hide-sm">Fec. Nac.</th>}
               {(type === "Secretaria" || type === "Administrador") && (
                  <th>Rol</th>
               )}
               {type === "Tutor" && <th>Nombre Alumno</th>}
               <th>&nbsp;</th>
            </tr>
         </thead>
         <tbody>
            {!loadingUsers &&
               type === usersType &&
               users.map((user) => {
                  let name;
                  if (usersType === "Tutor") {
                     for (let x = 0; x < user.children.length; x++) {
                        if (user.children[x]) {
                           name =
                              user.children[x].lastname +
                              ", " +
                              user.children[x].name;
                           break;
                        }
                     }
                  }
                  return (
                     <tr key={user._id}>
                        <td>
                           {user.lastname}, {user.name}
                        </td>
                        <td className="hide-sm email">
                           {user.email && user.email}
                        </td>
                        <td>{user.cel}</td>
                        {usersType !== "Tutor" && (
                           <td className="hide-sm">
                              {user.dob && (
                                 <Moment
                                    date={user.dob}
                                    utc
                                    format={"DD/MM/YY"}
                                    utc
                                 />
                              )}
                           </td>
                        )}
                        {usersType === "Administrador" && <td>{user.type}</td>}
                        {usersType === "Tutor" && <td>{name}</td>}
                        <td>
                           <Link
                              className="btn-text"
                              to={`/dashboard/${user._id}`}
                              onClick={() => {
                                 window.scroll(0, 0);
                                 clearProfile();
                              }}
                           >
                              Más Info &rarr;
                           </Link>
                        </td>
                     </tr>
                  );
               })}
         </tbody>
      </table>
   );
};

RestTable.propTypes = {
   users: PropTypes.array,
   loadingUsers: PropTypes.bool,
   type: PropTypes.string.isRequired,
   clearProfile: PropTypes.func.isRequired,
};

export default RestTable;
