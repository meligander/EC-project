import React from "react";
import format from "date-fns/format";

import "./style.scss";

const PenaltyPercentage = ({ onChange, oldPenalty, oldDiscount, values }) => {
   return (
      <>
         <h3>Actualización de Recargo y/o Descuento</h3>

         {oldPenalty && (
            <p className="posted-date">
               Última Actualización:{" "}
               {format(new Date(oldPenalty.date), "dd/MM/yy")}
            </p>
         )}
         <h4> Recargo Actual: {oldPenalty && oldPenalty.number} %</h4>

         {!oldPenalty && (
            <h5 className="paragraph text-danger text-center">
               No hay ningún recargo registrado
            </h5>
         )}

         <h4>
            <input
               id="penalty"
               type="text"
               name="penalty"
               placeholder="Nuevo Recargo"
               value={values.penalty}
               onChange={onChange}
            />
            %
         </h4>

         {oldDiscount && (
            <p className="posted-date">
               Última Actualización:{" "}
               {format(new Date(oldDiscount.date), "dd/MM/yy")}
            </p>
         )}
         <h4> Descuento Actual: {oldDiscount && oldDiscount.number} %</h4>

         {!oldDiscount && (
            <h5 className="paragraph text-danger text-center">
               No hay ningún descuento registrado
            </h5>
         )}

         <h4>
            <input
               id="discount"
               type="text"
               name="discount"
               placeholder="Nuevo Descuento"
               value={values.discount}
               onChange={onChange}
            />
            %
         </h4>
      </>
   );
};

export default PenaltyPercentage;
