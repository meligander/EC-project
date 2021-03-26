import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import PropTypes from "prop-types";

import {
   loadTransactions,
   deleteExpence,
   transactionsPDF,
} from "../../../../../../actions/expence";
import { clearInvoice } from "../../../../../../actions/invoice";
import { loadRegister } from "../../../../../../actions/register";
import { updatePageNumber } from "../../../../../../actions/mixvalues";

import ListButtons from "../sharedComp/ListButtons";
import DateFilter from "../sharedComp/DateFilter";
import Loading from "../../../../../modal/Loading";
import PopUp from "../../../../../modal/PopUp";

import "./style.scss";

const TransactionList = ({
   loadTransactions,
   loadRegister,
   updatePageNumber,
   deleteExpence,
   clearInvoice,
   transactionsPDF,
   expences: { transactions, loadingTransactions },
   registers: { register, loading },
   mixvalues: { page },
}) => {
   const expenceType = {
      "special-income": {
         trClass: "bg-refund",
         nameType: "Ingreso Especial",
      },
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

   const [otherValues, setOtherValues] = useState({
      toDelete: "",
      toggleModal: false,
   });

   const { toDelete, toggleModal } = otherValues;

   useEffect(() => {
      if (loadingTransactions) {
         updatePageNumber(0);
         loadTransactions({});
         loadRegister();
      }
   }, [loadingTransactions, loadTransactions, updatePageNumber, loadRegister]);

   const onChange = (e) => {
      setFilterData({
         ...filterData,
         [e.target.name]: e.target.value,
      });
   };

   const setToggle = (expence_id) => {
      setOtherValues({
         toDelete: expence_id ? expence_id : "",
         toggleModal: !toggleModal,
      });
   };

   const formatNumber = (number) => {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
   };

   const type = (transaction) => {
      if (transaction.expencetype) {
         return (
            <tr
               key={transaction._id}
               className={expenceType[transaction.expencetype.type].trClass}
            >
               <td>
                  <Moment date={transaction.date} format="DD/MM/YY" />
               </td>
               <td>{`${expenceType[transaction.expencetype.type].nameType} - ${
                  transaction.expencetype.name
               }`}</td>
               <td>${formatNumber(transaction.value)}</td>
               <td>{transaction.description}</td>
               <td>
                  {transaction.register &&
                     transaction.register === register._id &&
                     register.temporary && (
                        <button
                           onClick={(e) => {
                              e.preventDefault();
                              setToggle(transaction._id);
                           }}
                           className="btn btn-danger"
                        >
                           <i className="far fa-trash-alt"></i>
                        </button>
                     )}
               </td>
            </tr>
         );
      } else {
         let name = "";

         switch (transaction.user) {
            case null:
               name = "Usuario Eliminado";
               break;
            case undefined:
               if (transaction.lastname) {
                  name = transaction.lastname + ", " + transaction.name;
               } else {
                  name = "Usuario no definido";
               }
               break;
            default:
               name = transaction.user.lastname + ", " + transaction.user.name;
               break;
         }
         return (
            <tr key={transaction._id} className="bg-income">
               <td>
                  <Moment date={transaction.date} format="DD/MM/YY" />
               </td>
               <td>Ingreso</td>
               <td>${formatNumber(transaction.total)}</td>
               <td>Factura {name}</td>
               <td>
                  <Link
                     to={`/invoice/${transaction._id}`}
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
         );
      }
   };

   return (
      <>
         {!loadingTransactions && !loading ? (
            <div>
               <h2>Listado Movimientos</h2>
               <PopUp
                  toggleModal={toggleModal}
                  setToggleModal={setToggle}
                  text="¿Está seguro que desea eliminar el movimiento?"
                  confirm={() => deleteExpence(toDelete)}
               />
               <form
                  className="form"
                  onSubmit={(e) => {
                     e.preventDefault();
                     loadTransactions(filterData);
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
                        <option value="">
                           Seleccione el tipo de movimiento
                        </option>
                        <option value="income">Ingreso</option>
                        <option value="expence">Gasto</option>
                        <option value="withdrawal">Retiro</option>
                        <option value="special-income">Ingreso Especial</option>
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
                        <i className="fas fa-filter"></i>&nbsp; Buscar
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
                        {!loadingTransactions &&
                           transactions.length > 0 &&
                           transactions.map(
                              (transaction, i) =>
                                 i >= page * 10 &&
                                 i < (page + 1) * 10 && (
                                    <React.Fragment key={i}>
                                       {type(transaction)}
                                    </React.Fragment>
                                 )
                           )}
                     </tbody>
                  </table>
               </div>
               <ListButtons
                  page={page}
                  type="transacciones"
                  items={transactions}
                  changePage={updatePageNumber}
                  pdfGenerator={() => transactionsPDF(transactions)}
               />
            </div>
         ) : (
            <Loading />
         )}
      </>
   );
};

TransactionList.propTypes = {
   mixvalues: PropTypes.object.isRequired,
   expences: PropTypes.object.isRequired,
   registers: PropTypes.object.isRequired,
   loadTransactions: PropTypes.func.isRequired,
   loadRegister: PropTypes.func.isRequired,
   updatePageNumber: PropTypes.func.isRequired,
   deleteExpence: PropTypes.func.isRequired,
   transactionsPDF: PropTypes.func.isRequired,
   clearInvoice: PropTypes.func.isRequired,
};

const mapStatetoProps = (state) => ({
   expences: state.expences,
   registers: state.registers,
   mixvalues: state.mixvalues,
});

export default connect(mapStatetoProps, {
   loadTransactions,
   loadRegister,
   updatePageNumber,
   deleteExpence,
   clearInvoice,
   transactionsPDF,
})(TransactionList);
