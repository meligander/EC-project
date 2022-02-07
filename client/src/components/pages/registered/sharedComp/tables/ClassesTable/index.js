import React from "react";
import format from "date-fns/format";
import { Link } from "react-router-dom";

const ClassesTable = ({
   classes,
   clearClass,
   clearClasses,
   clearProfile,
   all = true,
}) => {
   return (
      <div className="wrapper">
         <table>
            <thead>
               <tr>
                  {all && <th>&nbsp; Profesor &nbsp;</th>}
                  <th>Categoría</th>
                  <th>Día 1</th>
                  <th>Comienzo</th>
                  <th>Fin</th>
                  <th>Día 2</th>
                  <th>Comienzo</th>
                  <th>Fin</th>
                  <th>&nbsp;</th>
               </tr>
            </thead>
            <tbody>
               {classes.map((classItem) => {
                  return (
                     <tr key={classItem._id}>
                        {all && (
                           <td>
                              <Link
                                 to={`/index/dashboard/${classItem.teacher._id}`}
                                 className="btn-text"
                                 onClick={() => {
                                    clearProfile();
                                    clearClasses();
                                    window.scroll(0, 0);
                                 }}
                              >
                                 {classItem.teacher.lastname +
                                    ", " +
                                    classItem.teacher.name}
                              </Link>
                           </td>
                        )}
                        <td>{classItem.category.name}</td>
                        <td>{classItem.day1}</td>
                        <td>
                           {classItem.hourin1 &&
                              format(
                                 new Date(classItem.hourin1.slice(0, -1)),
                                 "HH:mm"
                              )}
                        </td>
                        <td>
                           {classItem.hourout1 &&
                              format(
                                 new Date(classItem.hourout1.slice(0, -1)),
                                 "HH:mm"
                              )}
                        </td>
                        <td>{classItem.day2}</td>
                        <td>
                           {classItem.hourin2 &&
                              format(
                                 new Date(classItem.hourin2.slice(0, -1)),
                                 "HH:mm"
                              )}
                        </td>
                        <td>
                           {classItem.hourout2 &&
                              format(
                                 new Date(classItem.hourout2.slice(0, -1)),
                                 "HH:mm"
                              )}
                        </td>
                        <td>
                           <Link
                              onClick={() => {
                                 clearClass();
                                 window.scroll(0, 0);
                              }}
                              to={`/class/single/${classItem._id}`}
                              className="btn-text"
                           >
                              Ver &rarr;
                           </Link>
                        </td>
                     </tr>
                  );
               })}
            </tbody>
         </table>
         {classes.length === 0 && (
            <p className="heading-tertiary text-center text-dark m-2">
               No se han encontrado clases
            </p>
         )}
      </div>
   );
};

export default ClassesTable;
