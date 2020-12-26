import React from "react";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const ClassesTable = ({
   classes,
   clearClass,
   clearSearch,
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
                  {!all && <th>Aula</th>}
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
               {classes.length > 0 &&
                  classes.map((classItem) => {
                     return (
                        <tr key={classItem._id}>
                           {all && (
                              <td>
                                 <Link
                                    to={`/dashboard/${classItem.teacher._id}`}
                                    className="btn-text"
                                    onClick={() => {
                                       clearProfile();
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
                           {!all && <td>{classItem.classroom}</td>}
                           <td>{classItem.day1}</td>
                           <td>
                              <Moment format="HH:mm" date={classItem.hourin1} />
                           </td>
                           <td>
                              <Moment
                                 format="HH:mm"
                                 date={classItem.hourout1}
                              />
                           </td>
                           <td>{classItem.day2}</td>
                           <td>
                              <Moment format="HH:mm" date={classItem.hourin2} />
                           </td>
                           <td>
                              <Moment
                                 format="HH:mm"
                                 date={classItem.hourout2}
                              />
                           </td>
                           <td>
                              <Link
                                 onClick={() => {
                                    clearClass();
                                    clearSearch();
                                    window.scroll(0, 0);
                                 }}
                                 to={`/class/${classItem._id}`}
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
            <p className="heading-tertiary text-dark m-2">
               No se han encontrado clases
            </p>
         )}
      </div>
   );
};

ClassesTable.propTypes = {
   classes: PropTypes.array.isRequired,
   all: PropTypes.bool,
   clearClass: PropTypes.func.isRequired,
   clearProfile: PropTypes.func,
   clearSearch: PropTypes.func.isRequired,
};

export default ClassesTable;
