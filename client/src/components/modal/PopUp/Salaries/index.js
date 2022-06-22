import React from "react";

import "./style.scss";

const Salaries = ({ onChange, salaries }) => {
   return (
      <>
         <h4 className="heading-tertiary text-left text-dark p-2">
            Actualización de Salarios
         </h4>
         <div className="form">
            <table className="salaries">
               <tbody>
                  <tr>
                     <td>Cursos Bajos:</td>
                     <td>
                        <input
                           id="lowerSalary"
                           type="text"
                           name="lowerSalary"
                           placeholder="Cursos Bajos"
                           value={salaries.lowerSalary}
                           onChange={onChange}
                        />
                     </td>
                  </tr>
                  <tr>
                     <td>Cursos Altos:</td>
                     <td>
                        <input
                           id="higherSalary"
                           type="text"
                           name="higherSalary"
                           placeholder="Cursos Altos"
                           value={salaries.higherSalary}
                           onChange={onChange}
                        />
                     </td>
                  </tr>
                  <tr>
                     <td>Administrativo:</td>
                     <td>
                        <input
                           id="adminSalary"
                           type="text"
                           name="adminSalary"
                           placeholder="Administrativo"
                           value={salaries.adminSalary}
                           onChange={onChange}
                        />
                     </td>
                  </tr>
               </tbody>
            </table>
         </div>
      </>
   );
};

export default Salaries;
