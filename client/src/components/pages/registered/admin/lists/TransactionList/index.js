import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import format from "date-fns/format";
import { FaTrashAlt } from "react-icons/fa";
import { BiFilterAlt } from "react-icons/bi";

import {
   loadTransactions,
   deleteExpence,
   transactionsPDF,
} from "../../../../../../actions/expence";
import { clearInvoice } from "../../../../../../actions/invoice";
import { loadRegister } from "../../../../../../actions/register";
import { formatNumber, togglePopup } from "../../../../../../actions/global";

import ListButtons from "../sharedComp/ListButtons";
import DateFilter from "../sharedComp/DateFilter";
import PopUp from "../../../../../modal/PopUp";

import "./style.scss";

const TransactionList = ({
   auth: { userLogged },
   expences: { transactions, loading },
   registers: { register, loadingRegister },
   loadTransactions,
   togglePopup,
   loadRegister,
   deleteExpence,
   clearInvoice,
   transactionsPDF,
}) => {
   const isAdmin = userLogged.type !== "secretary";

   const expenceType = {
      withdrawal: {
         trClass: "bg-withdrawal",
         nameType: "Retiro",
      },
      expence: {
         trClass: "bg-expence",
         nameType: "Gasto",
      },
   };

   const [filterData, setFilterData] = useState({
      startDate: "",
      endDate: "",
      transactionType: "",
   });

   const { startDate, endDate, transactionType } = filterData;

   const [adminValues, setAdminValues] = useState({
      toDelete: "",
      page: 0,
   });

   const { toDelete, page } = adminValues;

   useEffect(() => {
      if (loadingRegister) loadRegister(false);
   }, [loadingRegister, loadRegister]);

   useEffect(() => {
      if (loading)
         loadTransactions({ ...(!isAdmin && { isNotAdmin: !isAdmin }) }, true);
   }, [loading, loadTransactions, isAdmin]);

   const onChange = (e) => {
      e.persist();
      setFilterData({
         ...filterData,
         [e.target.name]: e.target.value,
      });
   };

   const setName = (user) => {
      if (user.user_id === null) return "Usuario Eliminado";

      const lastname = user.user_id ? user.user_id.lastname : user.lastname;
      const name = user.user_id ? user.user_id.name : user.name;

      return `${lastname ? `${lastname}${name ? ", " : ""}` : ""}${
         name ? name : ""
      }`;
   };

   return (
      <>
         <h2>Listado Movimientos</h2>
         <PopUp
            info="¿Está seguro que desea eliminar el movimiento?"
            confirm={() => deleteExpence(toDelete)}
         />
         <form
            className="form"
            onSubmit={(e) => {
               e.preventDefault();
               setAdminValues((prev) => ({ ...prev, page: 0 }));
               loadTransactions(filterData, true);
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
                  id="transactionType"
                  name="transactionType"
                  onChange={onChange}
                  value={transactionType}
               >
                  <option value="">Seleccione el tipo de movimiento</option>
                  <option value="income">Ingreso</option>
                  <option value="expence">Gasto</option>
                  {isAdmin && <option value="withdrawal">Retiro</option>}
               </select>
               <label
                  htmlFor="transactionType"
                  className={`form-label ${
                     transactionType === "" ? "lbl" : ""
                  }`}
               >
                  Tipo de Movimiento
               </label>
            </div>
            <div className="btn-right mb-1">
               <button type="submit" className="btn btn-light">
                  <BiFilterAlt />
                  &nbsp; Buscar
               </button>
            </div>
         </form>
         <div className="wrapper my-2">
            <table className="expences">
               <thead>
                  <tr>
                     <th>Fecha</th>
                     <th>Tipo</th>
                     <th>Importe</th>
                     <th>Descripción</th>
                     <th>&nbsp;</th>
                  </tr>
               </thead>
               <tbody>
                  {!loading &&
                     !loadingRegister &&
                     transactions.map(
                        (transaction, i) =>
                           i >= page * 10 &&
                           i < (page + 1) * 10 && (
                              <React.Fragment key={i}>
                                 {transaction.expencetype ? (
                                    <tr
                                       key={transaction._id}
                                       className={
                                          expenceType[
                                             transaction.expencetype.type
                                          ].trClass
                                       }
                                    >
                                       <td>
                                          {format(
                                             new Date(transaction.date),
                                             "dd/MM/yy"
                                          )}
                                       </td>
                                       <td>{`${
                                          expenceType[
                                             transaction.expencetype.type
                                          ].nameType
                                       } - ${
                                          transaction.expencetype.name
                                       }`}</td>
                                       <td>
                                          ${formatNumber(transaction.value)}
                                       </td>
                                       <td>{transaction.description}</td>
                                       <td>
                                          {transaction.register ===
                                             register._id &&
                                             register.temporary && (
                                                <button
                                                   onClick={(e) => {
                                                      e.preventDefault();
                                                      setAdminValues(
                                                         (prev) => ({
                                                            ...prev,
                                                            toDelete:
                                                               transaction._id,
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
                                    </tr>
                                 ) : (
                                    <tr
                                       key={transaction._id}
                                       className="bg-income"
                                    >
                                       <td>
                                          {format(
                                             new Date(transaction.date),
                                             "dd/MM/yy"
                                          )}
                                       </td>
                                       <td>Ingreso</td>
                                       <td>
                                          ${formatNumber(transaction.total)}
                                       </td>
                                       <td>
                                          Factura {setName(transaction.user)}
                                       </td>
                                       <td>
                                          <Link
                                             to={`/invoice/single/${transaction._id}`}
                                             onClick={() => {
                                                window.scroll(0, 0);
                                                clearInvoice();
                                             }}
                                             className="btn-text"
                                          >
                                             Ver más &rarr;
                                          </Link>
                                       </td>
                                    </tr>
                                 )}
                              </React.Fragment>
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
               pdfGenerator={() => transactionsPDF(transactions)}
            />
         )}
      </>
   );
};

const mapStatetoProps = (state) => ({
   expences: state.expences,
   registers: state.registers,
   auth: state.auth,
});

export default connect(mapStatetoProps, {
   loadTransactions,
   loadRegister,
   deleteExpence,
   clearInvoice,
   togglePopup,
   transactionsPDF,
})(TransactionList);
