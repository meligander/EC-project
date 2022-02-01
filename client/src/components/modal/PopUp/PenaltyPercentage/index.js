import React from "react";
import format from "date-fns/format";

const PenaltyPercentage = ({ onChange, penalty, percentage }) => {
   return (
      <>
         {penalty && (
            <p className="posted-date">
               Última Actualización:{" "}
               {format(new Date(penalty.date), "dd/MM/yy")}
            </p>
         )}

         <h3>Actualización de Recargo</h3>

         <div className="pt-2">
            <h4> Recargo Actual: {penalty && penalty.percentage}%</h4>

            {!penalty && (
               <h5 className="paragraph text-danger text-center">
                  No hay ningún recargo registrado
               </h5>
            )}
         </div>

         <h4>
            <input
               id="percentage"
               type="number"
               name="percentage"
               placeholder="Nuevo Recargo"
               value={percentage}
               onChange={onChange}
            />
            %
         </h4>
      </>
   );
};

export default PenaltyPercentage;
