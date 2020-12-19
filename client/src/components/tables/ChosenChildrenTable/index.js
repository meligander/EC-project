import React from "react";
import PropTypes from "prop-types";

const ChosenChildrenTable = ({ children, deleteChild }) => {
   return (
      <table className="mb-4">
         <tbody>
            {children.map((child) => {
               return (
                  <tr key={child._id}>
                     <td>
                        {!child.lastname
                           ? child.name
                           : child.lastname + ", " + child.name}
                     </td>
                     <td>
                        <button
                           onClick={(e) => deleteChild(e, child)}
                           className="btn btn-danger"
                        >
                           Eliminar
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
};

export default ChosenChildrenTable;
