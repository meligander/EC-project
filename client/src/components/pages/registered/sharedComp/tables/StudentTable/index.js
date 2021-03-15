import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import PropTypes from "prop-types";

const StudentTable = ({
   userSearchType = "student",
   clearAll = true,
   actionWChild,
   loadingUsers,
   users,
   type,
   clearProfile,
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
                  <th className="hide-sm">Celular</th>
               )}
               {type === "search" && <th>Categoría</th>}
               {(type === "add-child" || type === "chosen-child") && (
                  <th>&nbsp;</th>
               )}
            </tr>
         </thead>
         <tbody>
            {(!loadingUsers || users.length > 0) &&
               userSearchType === "student" &&
               users.map((user) => {
                  let years = "";
                  if (type !== "class-students")
                     years = moment().utc().diff(user.dob, "years", false);
                  return (
                     <tr key={user._id}>
                        <td>{user.studentnumber}</td>
                        <td>
                           <Link
                              className="btn-text"
                              to={`/dashboard/${user._id}`}
                              onClick={() => {
                                 window.scroll(0, 0);
                                 clearProfile(clearAll);
                              }}
                           >
                              {user.lastname}, {user.name}
                           </Link>
                        </td>
                        <td className="hide-sm">
                           {user.dob && type !== "class-students"
                              ? years
                              : moment(user.dob).utc().format("DD/MM/YY")}
                        </td>
                        {type !== "add-child" && type !== "chosen-child" && (
                           <td className="hide-sm">{user.cel}</td>
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
                                 <i
                                    className={
                                       type === "add-child"
                                          ? "fas fa-plus"
                                          : "far fa-trash-alt"
                                    }
                                 ></i>
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

StudentTable.propTypes = {
   users: PropTypes.array,
   loadingUsers: PropTypes.bool.isRequired,
   type: PropTypes.string.isRequired,
   clearProfile: PropTypes.func.isRequired,
   userSearchType: PropTypes.string,
   clearAll: PropTypes.bool,
   actionWChild: PropTypes.func,
};

export default StudentTable;
