import React from "react";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import PropTypes from "prop-types";

import "./style.scss";

const RestTable = ({
   loadingUsers,
   users,
   type,
   userSearchType,
   clearProfile,
   clearClasses,
}) => {
   const userType = {
      secretary: "Secretaria",
      admin: "Administrador",
      "admin&teacher": "Admin y Profesor",
   };

   return (
      <table>
         <thead>
            <tr>
               <th>Nombre</th>
               <th className="hide-sm">Email</th>
               <th>Celular</th>
               {type !== "guardian" && <th className="hide-sm">Fecha Nac.</th>}
               {type === "admin" && <th>Rol</th>}
               {type === "guardian" && <th>Nombre Alumno</th>}
            </tr>
         </thead>
         <tbody>
            {!loadingUsers &&
               type === userSearchType &&
               users.map((user) => {
                  let name = "";
                  if (type === "guardian" && user.children[0]) {
                     name =
                        user.children[0].lastname +
                        ", " +
                        user.children[0].name;
                  }
                  return (
                     <tr key={user._id}>
                        <td>
                           <Link
                              className="btn-text"
                              to={`/dashboard/${user._id}`}
                              onClick={() => {
                                 window.scroll(0, 0);
                                 clearProfile();
                                 if (type === "teacher") clearClasses();
                              }}
                           >
                              {user.lastname}, {user.name}
                           </Link>
                        </td>
                        <td className="hide-sm email">
                           {user.email && user.email}
                        </td>
                        <td>{user.cel}</td>
                        {userSearchType !== "guardian" && (
                           <td className="hide-sm">
                              {user.dob && (
                                 <Moment date={user.dob} utc format={"DD/MM"} />
                              )}
                           </td>
                        )}
                        {type === "admin" && <td>{userType[user.type]}</td>}
                        {type === "guardian" && <td>{name}</td>}
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
   clearClasses: PropTypes.func.isRequired,
};

export default RestTable;
