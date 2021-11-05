import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Moment from "react-moment";
import { BiFilterAlt } from "react-icons/bi";

import {
   loadWithdrawals,
   loadExpenceTypes,
   transactionsPDF,
} from "../../../../../../actions/expence";
import {
   updatePageNumber,
   formatNumber,
} from "../../../../../../actions/mixvalues";

import ListButtons from "../sharedComp/ListButtons";
import DateFilter from "../sharedComp/DateFilter";

const WithdrawalList = ({
   loadWithdrawals,
   loadExpenceTypes,
   updatePageNumber,
   transactionsPDF,
   expences: { transactions, loading, expencetypes, loadingET },
   mixvalues: { page },
}) => {
   const [filterData, setFilterData] = useState({
      startDate: "",
      endDate: "",
      expencetype: "",
   });

   const { startDate, endDate, expencetype } = filterData;

   const [adminValues, setAdminValues] = useState({
      total: 0,
   });

   const { total } = adminValues;

   useEffect(() => {
      if (loading) {
         loadWithdrawals({});
         loadExpenceTypes(false);
      } else
         setAdminValues((prev) => ({
            ...prev,
            total: transactions.reduce((item, sum) => sum + item.value, 0),
         }));
   }, [loading, loadWithdrawals, transactions, loadExpenceTypes]);

   const onChange = (e) => {
      setFilterData({
         ...filterData,
         [e.target.name]: e.target.value,
      });
   };

   return (
      <>
         <h2>Listado Retiros de Dinero</h2>
         <form
            className="form"
            onSubmit={(e) => {
               e.preventDefault();
               loadWithdrawals(filterData);
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
                     transactions.length > 0 &&
                     transactions.map(
                        (transaction, i) =>
                           i >= page * 10 &&
                           i < (page + 1) * 10 && (
                              <tr key={transaction._id}>
                                 <td>
                                    <Moment
                                       date={transaction.date}
                                       format="DD/MM/YY"
                                    />
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

         <h4 className="m-1 heading-tertiary text-right">
            Total: ${formatNumber(total)}
         </h4>
         {!loading && (
            <ListButtons
               page={page}
               type="transacciones"
               items={transactions}
               changePage={updatePageNumber}
               pdfGenerator={() => transactionsPDF(transactions, total)}
            />
         )}
      </>
   );
};

const mapStatetoProps = (state) => ({
   expences: state.expences,
   mixvalues: state.mixvalues,
});

export default connect(mapStatetoProps, {
   loadExpenceTypes,
   loadWithdrawals,
   updatePageNumber,
   transactionsPDF,
})(WithdrawalList);
