import React, { useEffect } from "react";
import { connect } from "react-redux";
import { ImFilePdf } from "react-icons/im";

import { loadRegisters, registerPDF } from "../../../../../../actions/register";
import { formatNumber } from "../../../../../../actions/mixvalues";

const RegisterByMonth = ({
   registers: { registers, loading },
   loadRegisters,
   registerPDF,
}) => {
   useEffect(() => {
      if (loading) loadRegisters({}, true, true);
   }, [loading, loadRegisters]);

   return (
      <>
         <h2>Cajas por Mes</h2>

         <div className="wrapper">
            <table className="my-2">
               <thead>
                  <tr>
                     <th className="blank"></th>
                     <th>Ingresos</th>
                     <th>Egresos</th>
                     <th>Otros Ing.</th>
                     <th>Retiro</th>
                     <th>Diferencia</th>
                  </tr>
               </thead>
               <tbody>
                  {!loading &&
                     registers.map((register, i) => (
                        <tr key={i}>
                           <th>{register.month}</th>
                           <td>
                              {register.income !== 0 &&
                                 "$" + formatNumber(register.income)}
                           </td>
                           <td>
                              {register.expence !== 0 &&
                                 "$" + formatNumber(register.expence)}
                           </td>
                           <td>
                              {register.cheatincome !== 0 &&
                                 "$" + formatNumber(register.cheatincome)}
                           </td>
                           <td>
                              {register.withdrawal !== 0 &&
                                 "$" + formatNumber(register.withdrawal)}
                           </td>
                           <td
                              className={register.difference < 0 ? "debt" : ""}
                           >
                              {register.difference !== 0
                                 ? register.difference < 0
                                    ? "-$" + formatNumber(register.difference)
                                    : "+$" + formatNumber(register.difference)
                                 : ""}
                           </td>
                        </tr>
                     ))}
               </tbody>
            </table>
         </div>
         {!loading && (
            <div className="btn-right">
               <div className="tooltip">
                  <button
                     type="button"
                     className="btn btn-secondary tooltip"
                     onClick={(e) => {
                        e.preventDefault();
                        registerPDF(registers);
                     }}
                  >
                     <ImFilePdf />
                  </button>
                  <span className="tooltiptext">PDF con cajas mensuales</span>
               </div>
            </div>
         )}
      </>
   );
};

const mapStatetoProps = (state) => ({
   registers: state.registers,
});

export default connect(mapStatetoProps, {
   loadRegisters,
   registerPDF,
})(RegisterByMonth);
