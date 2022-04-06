import React, { useEffect, useState } from "react";
import format from "date-fns/format";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { IoIosListBox } from "react-icons/io";
import { BiFilterAlt } from "react-icons/bi";

import { formatNumber } from "../../../../../../actions/global";
import {
   loadRegisters,
   loadRegister,
   registerPDF,
   clearRegisters,
} from "../../../../../../actions/register";

import ListButtons from "../sharedComp/ListButtons";
import DateFilter from "../sharedComp/DateFilter";

const RegisterList = ({
   registers: { registers, loading, loadingRegister, register: last },
   loadRegisters,
   loadRegister,
   clearRegisters,
   registerPDF,
}) => {
   const [filterData, setFilterData] = useState({
      startDate: "",
      endDate: "",
   });

   const [adminValues, setAdminValues] = useState({
      page: 0,
   });

   const { page } = adminValues;

   const { startDate, endDate } = filterData;

   useEffect(() => {
      if (loading || (registers && registers[0].temporary === undefined))
         loadRegisters({}, true, false);
   }, [loading, loadRegisters, registers]);

   useEffect(() => {
      if (loadingRegister) loadRegister(false);
   }, [loadingRegister, loadRegister]);

   const onChange = (e) => {
      e.persist();
      setFilterData({
         ...filterData,
         [e.target.name]: e.target.value,
      });
   };

   return (
      <>
         <h2>Caja Diaria</h2>
         <div className="btn-right mb-1">
            <Link
               to="/register/monthly-list"
               onClick={() => {
                  window.scroll(0, 0);
                  clearRegisters();
               }}
               className="btn btn-light"
            >
               <IoIosListBox />
               <span className="hide-sm">&nbsp;Listado</span>&nbsp;Mensual
            </Link>
         </div>

         <form
            className="form"
            onSubmit={(e) => {
               e.preventDefault();
               setAdminValues((prev) => ({ ...prev, page: 0 }));
               loadRegisters(filterData, true, false);
            }}
         >
            <DateFilter
               endDate={endDate}
               startDate={startDate}
               onChange={onChange}
            />
            <div className="btn-right my-1">
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
                     <th>Fecha</th>
                     <th>Ingresos</th>
                     <th>Egresos</th>
                     <th>Retiro</th>
                     <th>Plata Caja</th>
                     <th>Diferencia</th>
                     <th>Detalles</th>
                  </tr>
               </thead>
               <tbody>
                  {!loading &&
                     registers.map(
                        (register, i) =>
                           i >= page * 10 &&
                           i < (page + 1) * 10 &&
                           register &&
                           register.temporary === false && (
                              <tr key={i}>
                                 <td>
                                    {format(
                                       new Date(register.date),
                                       "dd/MM/yy"
                                    )}
                                 </td>
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
                                 <td>
                                    ${formatNumber(register.registermoney)}
                                 </td>
                                 <td
                                    className={
                                       register.difference < 0 ? "debt" : ""
                                    }
                                 >
                                    {register.difference !== 0 &&
                                       register.difference &&
                                       (register.difference < 0
                                          ? "-$" +
                                            formatNumber(
                                               Math.abs(register.difference)
                                            )
                                          : "+$" +
                                            formatNumber(register.difference))}
                                 </td>
                                 <td>
                                    {register.description &&
                                       register.description}
                                 </td>
                              </tr>
                           )
                     )}
               </tbody>
            </table>
         </div>
         {!loading && (
            <ListButtons
               items={registers}
               type="cajas diarias"
               page={page}
               changePage={(page) =>
                  setAdminValues((prev) => ({ ...prev, page }))
               }
               pdfGenerator={() => registerPDF(registers)}
            />
         )}
      </>
   );
};

const mapStatetoProps = (state) => ({
   auth: state.auth,
   registers: state.registers,
});

export default connect(mapStatetoProps, {
   loadRegisters,
   loadRegister,
   clearRegisters,
   registerPDF,
})(RegisterList);
