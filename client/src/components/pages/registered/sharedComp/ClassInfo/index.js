import React from "react";
import format from "date-fns/format";

import "./style.scss";

const ClassInfo = ({
   classInfo: {
      category,
      teacher,
      classroom,
      day1,
      day2,
      hourin1,
      hourin2,
      hourout1,
      hourout2,
   },
}) => {
   return (
      <div className="class-info">
         <h3>{category.name}</h3>
         <div className="heading-tertiary">
            <p>
               <span className="text-dark">Profesor: </span>
               {teacher.lastname}, {teacher.name}
            </p>
            <p className="paragraph">
               <span className="text-dark">Aula:</span> {classroom}
            </p>
         </div>
         <p></p>
         <div className="days">
            <div>
               <p>
                  <span className="text-dark">Día 1: </span>
                  {day1}
               </p>
               <div className="schedule">
                  <p>
                     <span className="text-dark">Entrada: </span>
                     {hourin1 &&
                        format(new Date(hourin1.slice(0, -1)), "HH:mm")}
                  </p>
                  <p>
                     <span className="text-dark">Salida: </span>
                     {hourout1 &&
                        format(new Date(hourout1.slice(0, -1)), "HH:mm")}
                  </p>
               </div>
            </div>
            <div>
               <p>
                  <span className="text-dark">Día 2: </span>
                  {day2}
               </p>
               <div className="schedule">
                  <p>
                     <span className="text-dark">Entrada: </span>
                     {hourin2 &&
                        format(new Date(hourin2.slice(0, -1)), "HH:mm")}
                  </p>
                  <p>
                     <span className="text-dark">Salida: </span>
                     {hourout2 &&
                        format(new Date(hourout2.slice(0, -1)), "HH:mm")}
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
};

export default ClassInfo;
