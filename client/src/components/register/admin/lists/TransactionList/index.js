import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import PropTypes from "prop-types";

import {
   loadTransactions,
   deleteExpence,
   transactionsPDF,
} from "../../../../../actions/expence";
import { clearInvoice } from "../../../../../actions/invoice";
import { loadRegister } from "../../../../../actions/register";
import { updatePageNumber } from "../../../../../actions/mixvalues";

import Loading from "../../../../modal/Loading";
import ListButtons from "../sharedComp/ListButtons";
import DateFilter from "../sharedComp/DateFilter";
import Confirm from "../../../../modal/Confirm";

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
   const [filterData, setFilterData] = useState({
      startDate: "",
      endDate: "",
      transactionType: "",
   });

   const { startDate, endDate, transactionType } = filterData;

   const [otherValues, setOtherValues] = useState({
      expenceDelete: "",
      toggleModal: false,
   });

   const { expenceDelete, toggleModal } = otherValues;

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
         expenceDelete: expence_id,
         toggleModal: !toggleModal,
      });
   };

   const search = (e) => {
      e.preventDefault();
      loadTransactions(filterData);
   };

   const confirm = () => {
      deleteExpence(expenceDelete);
   };

   const pdfGeneratorSave = () => {
      transactionsPDF(transactions);
   };

   const type = (transaction) => {
      if (transaction.expencetype) {
         let trClass = "";
         switch (transaction.expencetype.type) {
            case "Ingreso Especial":
               trClass = "bg-refund";
               break;
            case "Retiro":
               trClass = "bg-withdrawal";
               break;
            case "Gasto":
               trClass = "bg-expence";
               break;
            default:
               break;
         }

         return (
            <tr key={transaction._id} className={trClass}>
               <td>
                  <Moment date={transaction.date} format="DD/MM/YY" />
               </td>
               <td>{`${transaction.expencetype.type} - ${transaction.expencetype.name}`}</td>
               <td>${transaction.value}</td>
               <td>{transaction.description}</td>
               <td>
                  {register.date < transaction.date && (
                     <button
                        onClick={() => setToggle(transaction._id)}
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

         if (transaction.user) {
            name = transaction.user.lastname + ", " + transaction.user.name;
         } else {
            name = transaction.lastname + ", " + transaction.name;
         }

         return (
            <tr key={transaction._id} className="bg-income">
               <td>
                  <Moment date={transaction.date} format="DD/MM/YY" />
               </td>
               <td>Ingreso</td>
               <td>${transaction.total}</td>
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
               <Confirm
                  toggleModal={toggleModal}
                  setToggleModal={setToggle}
                  text="¿Está seguro que desea eliminar el movimiento?"
                  confirm={confirm}
               />
               <form className="form">
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
                        <option value="Ingreso">Ingreso</option>
                        <option value="Gasto">Gasto</option>
                        <option value="Retiro">Retiro</option>
                        <option value="Ingreso Especial">
                           Ingreso Especial
                        </option>
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
                     <button onClick={search} className="btn btn-light">
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
                  items={transactions}
                  changePage={updatePageNumber}
                  pdfGeneratorSave={pdfGeneratorSave}
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
