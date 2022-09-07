import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import format from "date-fns/format";
import { Link } from "react-router-dom";
import { BiFilterAlt } from "react-icons/bi";
import { FaTrashAlt } from "react-icons/fa";
import { IoIosListBox } from "react-icons/io";

import {
   loadWithdrawals,
   loadExpenceTypes,
   expencesPDF,
   deleteExpence,
   clearExpences,
} from "../../../../../../actions/expence";
import { formatNumber, togglePopup } from "../../../../../../actions/global";
import { loadRegister } from "../../../../../../actions/register";

import ListButtons from "../sharedComp/ListButtons";
import DateFilter from "../sharedComp/DateFilter";
import PopUp from "../../../../../modal/PopUp";

const WithdrawalList = ({
   expences: { expences, loading, expencetypes, loadingET },
   registers: { register, loadingRegister },
   loadWithdrawals,
   loadExpenceTypes,
   loadRegister,
   deleteExpence,
   togglePopup,
   clearExpences,
   expencesPDF,
}) => {
   const [filterData, setFilterData] = useState({
      startDate: "",
      endDate: "",
      expencetype: "",
   });

   const { startDate, endDate, expencetype } = filterData;

   const [adminValues, setAdminValues] = useState({
      total: 0,
      page: 0,
      toDelete: "",
   });

   const { total, page, toDelete } = adminValues;

   useEffect(() => {
      if (loadingET) loadExpenceTypes(false, false);
   }, [loadingET, loadExpenceTypes]);

   useEffect(() => {
      if (loadingRegister) loadRegister(false);
   }, [loadRegister, loadingRegister]);

   useEffect(() => {
      if (loading || (expences[0] && expences[0].month))
         loadWithdrawals({}, true, false);
      else
         setAdminValues((prev) => ({
            ...prev,
            total: expences.reduce((sum, item) => sum + item.value, 0),
         }));
   }, [loading, loadWithdrawals, expences]);

   const onChange = (e) => {
      e.persist();
      setFilterData({
         ...filterData,
         [e.target.name]: e.target.value,
      });
   };

   return (
      <>
         <h2>Listado Retiros de Dinero</h2>
         <PopUp
            info="¿Está seguro que desea eliminar el retiro?"
            confirm={() => deleteExpence(toDelete)}
         />
         <p className="heading-tertiary text-moved-right">
            Total: ${formatNumber(total)}
         </p>
         <div className="btn-right mb-1">
            <Link
               to="/register/withdrawal/monthly-list"
               onClick={() => {
                  window.scroll(0, 0);
                  clearExpences();
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
               loadWithdrawals(filterData, true, false);
            }}
         >
            <DateFilter
               endDate={endDate}
               startDate={startDate}
               onChange={onChange}
            />
            <div className="form-group">
               <select
                  className="form-input"
                  id="expencetype"
                  name="expencetype"
                  onChange={onChange}
                  value={expencetype}
               >
                  <option value="">Seleccione el tipo de retiro</option>
                  {!loadingET &&
                     expencetypes.map((expT, i) => (
                        <React.Fragment key={i}>
                           <option value={expT._id}>{expT.name}</option>
                        </React.Fragment>
                     ))}
               </select>
               <label
                  htmlFor="expencetype"
                  className={`form-label ${expencetype === "" ? "lbl" : ""}`}
               >
                  Tipo de Retiro
               </label>
            </div>
            <div className="btn-right mb-1">
               <button type="submit" className="btn btn-light">
                  <BiFilterAlt />
                  &nbsp;Buscar
               </button>
            </div>
         </form>
         <div className="wrapper my-2">
            {!loading &&
               !loadingRegister &&
               expences[0] &&
               expences[0].month === undefined && (
                  <table>
                     <thead>
                        <tr>
                           <th>Fecha</th>
                           <th>Tipo</th>
                           <th>Importe</th>
                           <th>Descripción</th>
                           {expences[0].register &&
                              expences[0].register === register._id &&
                              register.temporary && <th>&nbsp;</th>}
                        </tr>
                     </thead>
                     <tbody>
                        {expences.map(
                           (expence, i) =>
                              i >= page * 10 &&
                              i < (page + 1) * 10 && (
                                 <tr key={expence._id}>
                                    <td>
                                       {format(
                                          new Date(expence.date),
                                          "dd/MM/yy"
                                       )}
                                    </td>
                                    <td>{expence.expencetype.name}</td>
                                    <td>${formatNumber(expence.value)}</td>
                                    <td>{expence.description}</td>
                                    {expences[0].register &&
                                       expences[0].register === register._id &&
                                       register.temporary && (
                                          <td>
                                             {expence.register &&
                                                expence.register ===
                                                   register._id && (
                                                   <button
                                                      type="button"
                                                      onClick={(e) => {
                                                         e.preventDefault();
                                                         setAdminValues(
                                                            (prev) => ({
                                                               ...prev,
                                                               toDelete:
                                                                  expence._id,
                                                            })
                                                         );
                                                         togglePopup("default");
                                                      }}
                                                      className="btn btn-danger"
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
               )}
         </div>
         {!loading && (
            <ListButtons
               page={page}
               type="transacciones"
               items={expences}
               changePage={(page) =>
                  setAdminValues((prev) => ({ ...prev, page }))
               }
               pdfGenerator={() => expencesPDF(expences, total)}
            />
         )}
      </>
   );
};

const mapStatetoProps = (state) => ({
   expences: state.expences,
   registers: state.registers,
});

export default connect(mapStatetoProps, {
   loadExpenceTypes,
   loadWithdrawals,
   loadRegister,
   expencesPDF,
   clearExpences,
   togglePopup,
   deleteExpence,
})(WithdrawalList);
