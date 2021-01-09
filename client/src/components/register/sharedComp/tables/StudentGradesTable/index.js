import React from "react";
import PropTypes from "prop-types";

const StudentGradesTable = ({ studentGrades: { headers, rows } }) => {
   return (
      <table>
         <thead>
            <tr>
               <th className="inherit">&nbsp;</th>
               <th>
                  1° B<span className="hide-sm">imestre</span>
               </th>
               <th>
                  2° B<span className="hide-sm">imestre</span>
               </th>
               <th>
                  3° B<span className="hide-sm">imestre</span>
               </th>
               <th>
                  4° B<span className="hide-sm">imestre</span>
               </th>
               <th>
                  F<span className="hide-sm">inal</span>
               </th>
            </tr>
         </thead>
         <tbody>
            {rows.map((row, index) => {
               return (
                  <tr key={index}>
                     <th>{headers[index]}</th>
                     {row.map((item, i) => {
                        return <td key={i}>{item.value}</td>;
                     })}
                  </tr>
               );
            })}
         </tbody>
      </table>
   );
};

StudentGradesTable.prototypes = {
   studentGrades: PropTypes.object.isRequired,
};

export default StudentGradesTable;
