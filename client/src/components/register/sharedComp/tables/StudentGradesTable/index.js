import React from "react";
import PropTypes from "prop-types";

const StudentGradesTable = ({ studentGrades: { headers, rows }, category }) => {
   const kinderGrade = (value) => {
      switch (true) {
         case value === "":
            return <></>;
         case value < 4:
            return <>M</>;
         case value >= 4 && value < 6:
            return <>R</>;
         case value >= 6 && value < 7.5:
            return <>B</>;
         case value >= 7.5 && value < 9:
            return <>MB</>;
         case value >= 9 && value <= 10:
            return <>S</>;
         default:
            return "";
      }
   };
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
            </tr>
         </thead>
         <tbody>
            {rows.map((row, index) => {
               return (
                  <tr key={index}>
                     <th>{headers[index]}</th>
                     {row.map((item, i) => (
                        <td key={i}>
                           {category === "Kinder"
                              ? kinderGrade(item.value)
                              : item.gradetype &&
                                (item.gradetype.name === "Ket" ||
                                   item.gradetype.name === "Pet" ||
                                   item.gradetype.name === "First" ||
                                   item.gradetype.name === "CAE" ||
                                   item.gradetype.name === "Proficiency")
                              ? item.value * 10 + "%"
                              : item.value
                              ? item.value.toFixed(2)
                              : ""}
                        </td>
                     ))}
                  </tr>
               );
            })}
         </tbody>
      </table>
   );
};

StudentGradesTable.prototypes = {
   studentGrades: PropTypes.object.isRequired,
   category: PropTypes.string.isRequired,
};

export default StudentGradesTable;
