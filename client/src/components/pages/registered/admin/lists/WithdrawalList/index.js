import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import format from "date-fns/format";
import { BiFilterAlt } from "react-icons/bi";

import {
   loadWithdrawals,
   loadExpenceTypes,
   transactionsPDF,
} from "../../../../../../actions/expence";
import { formatNumber } from "../../../../../../actions/global";

import ListButtons from "../sharedComp/ListButtons";
import DateFilter from "../sharedComp/DateFilter";

const WithdrawalList = ({
   expences: { transactions, loading, expencetypes, loadingET },
   loadWithdrawals,
   loadExpenceTypes,
   transactionsPDF,
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
      if (loading) loadWithdrawals({}, true);
      else
         setAdminValues((prev) => ({
            ...prev,
            total: transactions.reduce((sum, item) => sum + item.value, 0),
         }));
   }, [loading, loadWithdrawals, transactions]);

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
         <form
            className="form"
            onSubmit={(e) => {
               e.preventDefault();
               setAdminValues((prev) => ({ ...prev, page: 0 }));
               loadWithdrawals(filterData, true);
               console.log(filterData);
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
                  htmlFor="transactionType"
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
                     transactions.map(
                        (transaction, i) =>
                           i >= page * 10 &&
                           i < (page + 1) * 10 && (
                              <tr key={transaction._id}>
                                 <td>
                                    {format(
                                       new Date(transaction.date),
                                       "dd/MM/yy"
                                    )}
                                 </td>
                                 <td>{transaction.expencetype.name}</td>
                                 <td>${formatNumber(transaction.value)}</td>
                                 <td>{transaction.description}</td>
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
               items={transactions}
               changePage={(page) =>
                  setAdminValues((prev) => ({ ...prev, page }))
               }
               pdfGenerator={() => transactionsPDF(transactions, total)}
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
   transactionsPDF,
})(WithdrawalList);
