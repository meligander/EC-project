import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const ChosenChildrenTable = ({ children, deleteChild, clearProfile }) => {
   return (
      <table className="mb-4">
         <tbody>
            {children.map((child) => {
               return (
                  <tr key={child._id}>
                     <td>
                        <Link
                           to={`/dashboard/${child._id}`}
                           className="btn-text"
                           onClick={() => {
                              clearProfile();
                              window.scroll(0, 0);
                           }}
                        >
                           {!child.lastname
                              ? child.name
                              : child.lastname + ", " + child.name}
                        </Link>
                     </td>
                     <td>
                        <button
                           onClick={(e) => deleteChild(e, child)}
                           className="btn btn-danger"
                        >
                           <i className="far fa-trash-alt"></i> &nbsp; Eliminar
                        </button>
                     </td>
                  </tr>
               );
            })}
         </tbody>
      </table>
   );
};

ChosenChildrenTable.propTypes = {
   children: PropTypes.array.isRequired,
   deleteChild: PropTypes.func.isRequired,
   clearProfile: PropTypes.func.isRequired,
};

export default ChosenChildrenTable;
