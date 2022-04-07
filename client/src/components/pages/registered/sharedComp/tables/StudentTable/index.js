import React from "react";
import { Link } from "react-router-dom";
import { differenceInYears, format } from "date-fns";
import { FaTrashAlt, FaPlus } from "react-icons/fa";

import { formatNumber } from "../../../../../../actions/global";

const StudentTable = ({
   userSearchType = "student",
   actionWChild,
   users,
   type,
   clearProfile,
   class_id,
}) => {
   return (
      <table>
         <thead>
            <tr>
               <th>Legajo</th>
               <th>Nombre</th>
               <th className="hide-sm">
                  {type !== "class-students" ? "Edad" : "Fecha Nac."}
               </th>
               {type !== "add-child" && type !== "chosen-child" && (
                  <th className="hide-sm">DNI</th>
               )}
               {type === "search" && <th>Categoría</th>}
               {(type === "add-child" || type === "chosen-child") && (
                  <th>&nbsp;</th>
               )}
            </tr>
         </thead>
         <tbody>
            {userSearchType === "student" &&
               users.map((user) => {
                  let years = "";
                  if (type !== "class-students" && user.dob)
                     years = differenceInYears(
                        new Date(),
                        new Date(user.dob.slice(0, -1))
                     );
                  return (
                     <tr key={user._id}>
                        <td>{user.studentnumber}</td>
                        <td>
                           <Link
                              className="btn-text"
                              to={`/index/dashboard/${user._id}${
                                 class_id ? `/${class_id}` : ""
                              }`}
                              onClick={() => {
                                 window.scroll(0, 0);
                                 clearProfile();
                              }}
                           >
                              {user.lastname}, {user.name}
                           </Link>
                        </td>
                        <td className="hide-sm">
                           {type !== "class-students"
                              ? years
                              : user.dob &&
                                format(
                                   new Date(user.dob.slice(0, -1)),
                                   "dd/MM/yy"
                                )}
                        </td>
                        {type !== "add-child" &&
                           type !== "chosen-child" &&
                           user.dni && (
                              <td className="hide-sm">
                                 {formatNumber(user.dni)}
                              </td>
                           )}
                        {type === "search" && <td>{user.category}</td>}
                        {(type === "add-child" || type === "chosen-child") && (
                           <td>
                              <button
                                 type="button"
                                 className={`btn ${
                                    type === "add-child"
                                       ? "btn-dark"
                                       : "btn-danger"
                                 } `}
                                 onClick={(e) => {
                                    e.preventDefault();
                                    actionWChild(user);
                                 }}
                              >
                                 {type === "add-child" ? (
                                    <FaPlus />
                                 ) : (
                                    <FaTrashAlt />
                                 )}
                                 &nbsp;{" "}
                                 {type === "add-child" ? "Agregar" : "Eliminar"}
                              </button>
                           </td>
                        )}
                     </tr>
                  );
               })}
         </tbody>
      </table>
   );
};

export default StudentTable;
