import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import format from "date-fns/format";
import { Link } from "react-router-dom";
import { BiFilterAlt } from "react-icons/bi";
import { IoIosListBox } from "react-icons/io";

import {
   loadWithdrawals,
   loadExpenceTypes,
   expencesPDF,
   clearExpences,
} from "../../../../../../actions/expence";
import { formatNumber } from "../../../../../../actions/global";

import ListButtons from "../sharedComp/ListButtons";
import DateFilter from "../sharedComp/DateFilter";

const WithdrawalList = ({
   expences: { expences, loading, expencetypes, loadingET },
   loadWithdrawals,
   loadExpenceTypes,
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
   });

   const { total, page } = adminValues;

   useEffect(() => {
      if (loadingET) loadExpenceTypes(false, false);
   }, [loadingET, loadExpenceTypes]);

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
            <table>
               <thead>
                  <tr>
                     <th>Fecha</th>
                     <th>Tipo</th>
                     <th>Importe</th>
                     <th>Descripción</th>
                  </tr>
               </thead>
               <tbody>
                  {!loading &&
                     expences[0] &&
                     expences[0].month === undefined &&
                     expences.map(
                        (expence, i) =>
                           i >= page * 10 &&
                           i < (page + 1) * 10 && (
                              <tr key={expence._id}>
                                 <td>
                                    {format(new Date(expence.date), "dd/MM/yy")}
                                 </td>
                                 <td>{expence.expencetype.name}</td>
                                 <td>${formatNumber(expence.value)}</td>
                                 <td>{expence.description}</td>
                              </tr>
                           )
                     )}
               </tbody>
            </table>
         </div>
         {!loading && (
            <ListButtons
               page={page}
               type="transacciones"
               items={expences}
               changePage={(page) =>
                  setAdminValues((prev) => ({ ...prev, page }))
               }
               pdfGenerator={() => expencesPDF(expences, "withdrawal", total)}
            />
         )}
      </>
   );
};

const mapStatetoProps = (state) => ({
   expences: state.expences,
});

export default connect(mapStatetoProps, {
   loadExpenceTypes,
   loadWithdrawals,
   expencesPDF,
   clearExpences,
})(WithdrawalList);
