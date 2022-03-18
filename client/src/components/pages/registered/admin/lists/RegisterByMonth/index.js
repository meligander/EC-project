import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { ImFilePdf } from "react-icons/im";
import { BiFilterAlt } from "react-icons/bi";

import { loadRegisters, registerPDF } from "../../../../../../actions/register";
import { formatNumber } from "../../../../../../actions/global";

const RegisterByMonth = ({
   registers: { registers, loading },
   loadRegisters,
   registerPDF,
}) => {
   const thisYear = new Date().getFullYear();
   const yearArray = new Array(3).fill().map((item, index) => thisYear - index);

   const [filterData, setFilterData] = useState({
      year: thisYear,
   });

   const { year } = filterData;

   useEffect(() => {
      if (loading) loadRegisters({ year: thisYear }, true, true);
   }, [loading, loadRegisters, thisYear]);

   const onChange = (e) => {
      e.persist();
      setFilterData({
         ...filterData,
         [e.target.name]: e.target.value,
      });
   };

   return (
      <>
         <h2>Cajas por Mes</h2>

         <form
            className="form"
            onSubmit={(e) => {
               e.preventDefault();
               loadRegisters(filterData, true, true);
            }}
         >
            <div className="form-group">
               <select
                  className="form-input"
                  id="year"
                  name="year"
                  onChange={onChange}
                  value={year}
               >
                  <option value="">* Seleccione el Año</option>
                  {yearArray.map((item) => (
                     <option key={item} value={item}>
                        {item}
                     </option>
                  ))}
               </select>
               <label
                  htmlFor="year"
                  className={`form-label ${year === "" ? "lbl" : ""}`}
               >
                  Año
               </label>
            </div>
            <div className="btn-right mb-1">
               <button type="submit" className="btn btn-light">
                  <BiFilterAlt />
                  &nbsp;Buscar
               </button>
            </div>
         </form>

         <div className="wrapper">
            <table className="my-2">
               <thead>
                  <tr>
                     <th className="blank"></th>
                     <th>Ingresos</th>
                     <th>Egresos</th>
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
                              {register.withdrawal !== 0 &&
                                 "$" + formatNumber(register.withdrawal)}
                           </td>
                           <td
                              className={register.difference < 0 ? "debt" : ""}
                           >
                              {register.difference !== 0
                                 ? register.difference < 0
                                    ? "-$" +
                                      formatNumber(
                                         Math.abs(register.difference)
                                      )
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
