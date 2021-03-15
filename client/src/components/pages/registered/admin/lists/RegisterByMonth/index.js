import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import {
   loadRegistersByMonth,
   registerPDF,
} from "../../../../../../actions/register";
import { updatePreviousPage } from "../../../../../../actions/mixvalues";

import Loading from "../../../../../modal/Loading";

const RegisterByMonth = ({
   registers: { registers, loadingRegisters },
   loadRegistersByMonth,
   registerPDF,
   updatePreviousPage,
}) => {
   useEffect(() => {
      if (loadingRegisters) {
         loadRegistersByMonth();
         updatePreviousPage("register");
      }
   }, [loadingRegisters, loadRegistersByMonth, updatePreviousPage]);

   return (
      <>
         {!loadingRegisters ? (
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
                        {!loadingRegisters &&
                           registers.map((register, i) => (
                              <tr key={i}>
                                 <th>{register.month}</th>
                                 <td>
                                    {register.income !== 0 &&
                                       "$" + register.income}
                                 </td>
                                 <td>
                                    {register.expence !== 0 &&
                                       "$" + register.expence}
                                 </td>
                                 <td>
                                    {register.cheatincome !== 0 &&
                                       "$" + register.cheatincome}
                                 </td>
                                 <td>
                                    {register.withdrawal !== 0 &&
                                       "$" + register.withdrawal}
                                 </td>
                                 <td
                                    className={
                                       register.difference < 0 ? "debt" : ""
                                    }
                                 >
                                    {register.difference !== 0
                                       ? register.difference < 0
                                          ? "-$" + register.difference
                                          : "+$" + register.difference
                                       : ""}
                                 </td>
                              </tr>
                           ))}
                     </tbody>
                  </table>
               </div>
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
                        <i className="fas fa-file-pdf"></i>
                     </button>
                     <span className="tooltiptext">
                        PDF con cajas mensuales
                     </span>
                  </div>
               </div>
            </>
         ) : (
            <Loading />
         )}
      </>
   );
};

RegisterByMonth.propTypes = {
   registers: PropTypes.object.isRequired,
   loadRegistersByMonth: PropTypes.func.isRequired,
   registerPDF: PropTypes.func.isRequired,
   updatePreviousPage: PropTypes.func.isRequired,
};

const mapStatetoProps = (state) => ({
   registers: state.registers,
});

export default connect(mapStatetoProps, {
   loadRegistersByMonth,
   registerPDF,
   updatePreviousPage,
})(RegisterByMonth);
