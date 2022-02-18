import React, { useEffect, useState } from "react";
import format from "date-fns/format";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import { IoIosListBox } from "react-icons/io";
import { BiFilterAlt } from "react-icons/bi";

import { formatNumber, togglePopup } from "../../../../../../actions/mixvalues";
import {
   loadRegisters,
   loadRegister,
   deleteRegister,
   registerPDF,
   clearRegisters,
} from "../../../../../../actions/register";

import ListButtons from "../sharedComp/ListButtons";
import DateFilter from "../sharedComp/DateFilter";
import PopUp from "../../../../../modal/PopUp";

const RegisterList = ({
   auth: { userLogged },
   registers: { registers, loading, loadingRegister, register: last },
   loadRegisters,
   loadRegister,
   deleteRegister,
   clearRegisters,
   togglePopup,
   registerPDF,
}) => {
   const isAdmin =
      userLogged.type === "admin" || userLogged.type === "admin&teacher";

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
         <PopUp
            confirm={() => deleteRegister(last._id)}
            info="¿Está seguro que desea eliminar el cierre de caja?"
         />
         <h2>Caja Diaria</h2>
         {isAdmin && (
            <div className="btn-right my-3">
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
         )}

         <form
            className="form"
            onSubmit={(e) => {
               e.preventDefault();
               setAdminValues((prev) => ({ ...prev, page: 0 }));
               loadRegisters(filterData);
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
                     <th>Otros Ing.</th>
                     <th>Retiro</th>
                     <th>Plata Caja</th>
                     <th>Diferencia</th>
                     <th>Detalles</th>
                     {isAdmin && !loadingRegister && !last.temporary && (
                        <th>&nbsp;</th>
                     )}
                  </tr>
               </thead>
               <tbody>
                  {!loading &&
                     registers[0].temporary !== undefined &&
                     registers.map(
                        (register, i) =>
                           i >= page * 10 &&
                           i < (page + 1) * 10 &&
                           !register.temporary && (
                              <tr key={i}>
                                 <td>
                                    {format(
                                       new Date(register.date),
                                       "dd/MM/yy"
                                    )}
                                 </td>
                                 <td>
                                    {register.income &&
                                       "$" + formatNumber(register.income)}
                                 </td>
                                 <td>
                                    {register.expence &&
                                       "$" + formatNumber(register.expence)}
                                 </td>
                                 <td>
                                    {register.cheatincome &&
                                       "$" + formatNumber(register.cheatincome)}
                                 </td>
                                 <td>
                                    {register.withdrawal &&
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
                                 {!loadingRegister &&
                                    !last.temporary &&
                                    isAdmin && (
                                       <td>
                                          {i === 0 && (
                                             <button
                                                type="button"
                                                className="btn btn-danger"
                                                onClick={(e) => {
                                                   e.preventDefault();
                                                   togglePopup("default");
                                                }}
                                             >
                                                <FaTrashAlt />
                                             </button>
                                          )}
                                       </td>
                                    )}
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
   deleteRegister,
   clearRegisters,
   togglePopup,
   registerPDF,
})(RegisterList);
