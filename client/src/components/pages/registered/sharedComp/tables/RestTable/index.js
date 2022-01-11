import React from "react";
import { Link } from "react-router-dom";
import format from "date-fns/format";

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
                              to={`/index/dashboard/${user._id}`}
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
                              {user.dob &&
                                 format(
                                    new Date(user.dob.slice(0, -1), "dd/MM")
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

export default RestTable;
