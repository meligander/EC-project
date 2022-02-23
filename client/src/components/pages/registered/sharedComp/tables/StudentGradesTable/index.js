import React from "react";

const StudentGradesTable = ({
   studentGrades: { headers, rows, finalGrades },
   category,
}) => {
   const kinderGraden = (value) => {
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

   const getGrade = (grade, percentage) => {
      if (category === "Kinder") return kinderGraden(grade);
      if (percentage) return grade * 10 + "%";
      if (grade % 1 !== 0)
         return Math.round((grade + Number.EPSILON) * 100) / 100;
      else return grade;
   };

   return (
      <>
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
                              {item.value
                                 ? getGrade(
                                      item.value,
                                      item.gradetype.percentage
                                   )
                                 : ""}
                           </td>
                        ))}
                     </tr>
                  );
               })}
            </tbody>
         </table>

         {finalGrades && (
            <>
               <h3 className="text-primary text-center mt-3 pb-1">
                  Exámenes Finales
               </h3>
               <table
                  className={`final-grades ${
                     finalGrades.length === 2 ? "small" : ""
                  }`}
               >
                  <tbody>
                     {finalGrades.map((rows, index) => (
                        <tr key={index + "rows"}>
                           {rows.map((item, i) => (
                              <React.Fragment key={i + "finals"}>
                                 {index % 2 === 0 ? (
                                    <th>{item}</th>
                                 ) : (
                                    <td>
                                       {getGrade(item.value, item.percentage)}
                                    </td>
                                 )}
                              </React.Fragment>
                           ))}
                        </tr>
                     ))}
                  </tbody>
               </table>
            </>
         )}
      </>
   );
};

export default StudentGradesTable;
