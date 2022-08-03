import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { ImFilePdf } from "react-icons/im";
import { BiFilterAlt } from "react-icons/bi";

import {
   loadWithdrawals,
   transactionsPDF,
} from "../../../../../../actions/expence";
import { formatNumber } from "../../../../../../actions/global";

const WithdrawalXMonthList = ({
   expences: { transactions, loading },
   loadWithdrawals,
   transactionsPDF,
}) => {
   const thisYear = new Date().getFullYear();
   const yearArray = new Array(3).fill().map((item, index) => thisYear - index);

   const [filterData, setFilterData] = useState({
      year: thisYear,
   });

   const { year } = filterData;

   useEffect(() => {
      if (loading) loadWithdrawals({ year: thisYear }, true, true);
   }, [loading, loadWithdrawals, thisYear]);

   const onChange = (e) => {
      e.persist();
      setFilterData({
         ...filterData,
         [e.target.name]: e.target.value,
      });
   };

   return (
      <>
         <h2>Retiros por Mes</h2>

         <form
            className="form"
            onSubmit={(e) => {
               e.preventDefault();
               loadWithdrawals(filterData, true, true);
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
                     {!loading &&
                        typeof transactions[0] === "object" &&
                        Object.keys(transactions[0]).map(
                           (item, index) =>
                              item !== "month" && <th key={index}>{item}</th>
                        )}
                  </tr>
               </thead>
               <tbody>
                  {!loading &&
                     transactions.map((transaction, index1) => (
                        <tr key={index1}>
                           {Object.keys(transaction).map((item, index) =>
                              index === 0 ? (
                                 <th key={index} className="small">
                                    {transaction[item]}
                                 </th>
                              ) : (
                                 <td key={index}>
                                    {transaction[item] === 0
                                       ? "-"
                                       : "$" + formatNumber(transaction[item])}
                                 </td>
                              )
                           )}
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
                        transactionsPDF(transactions, "withdrawal");
                     }}
                  >
                     <ImFilePdf />
                  </button>
                  <span className="tooltiptext">PDF con retiros mensuales</span>
               </div>
            </div>
         )}
      </>
   );
};

const mapStatetoProps = (state) => ({
   expences: state.expences,
});

export default connect(mapStatetoProps, {
   loadWithdrawals,
   transactionsPDF,
})(WithdrawalXMonthList);
