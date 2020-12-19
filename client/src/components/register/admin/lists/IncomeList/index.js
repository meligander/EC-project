import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Moment from "react-moment";
import moment from "moment";
import PropTypes from "prop-types";

import {
   loadInvoices,
   deleteInvoice,
   invoicesPDF,
} from "../../../../../actions/invoice";
import { updatePageNumber } from "../../../../../actions/mixvalues";

import Loading from "../../../../modal/Loading";
import ListButtons from "../sharedComp/ListButtons";
import DateFilter from "../sharedComp/DateFilter";
import Confirm from "../../../../modal/Confirm";
import NameField from "../../../../sharedComp/NameField";

const IncomeList = ({
   auth: { userLogged },
   invoices: { loadingInvoices, invoices },
   mixvalues: { page },
   loadInvoices,
   updatePageNumber,
   invoicesPDF,
   deleteInvoice,
}) => {
   const [filterData, setFilterData] = useState({
      startDate: "",
      endDate: "",
      name: "",
      lastname: "",
   });

   const [otherValues, setOtherValues] = useState({
      toggleModal: false,
      invoiceDelete: "",
   });

   const { startDate, endDate, name, lastname } = filterData;
   const { toggleModal, invoiceDelete } = otherValues;

   useEffect(() => {
      if (loadingInvoices) {
         updatePageNumber(0);
         loadInvoices({ startDate: "", endDate: "", name: "", lastname: "" });
      }
   }, [loadingInvoices, loadInvoices, updatePageNumber]);

   const onChange = (e) => {
      setFilterData({
         ...filterData,
         [e.target.name]: e.target.value,
      });
   };

   const setToggle = (invoice_id) => {
      setOtherValues({ invoiceDelete: invoice_id, toggleModal: !toggleModal });
   };

   const confirm = () => {
      deleteInvoice(invoiceDelete);
   };

   const search = (e) => {
      e.preventDefault();
      loadInvoices(filterData);
   };

   const pdfGeneratorSave = () => {
      invoicesPDF(invoices);
   };

   return (
      <>
         {!loadingInvoices ? (
            <>
               <Confirm
                  toggleModal={toggleModal}
                  setToggleModal={setToggle}
                  text="¿Está seguro que desea eliminar la factura?"
                  confirm={confirm}
               />
               <h2>Listado Ingresos</h2>
               <form className="form bigger">
                  <DateFilter
                     endDate={endDate}
                     startDate={startDate}
                     onChange={onChange}
                  />
                  <NameField
                     name={name}
                     lastname={lastname}
                     onChange={onChange}
                     lastnamePlaceholder="Apellido alumno o tutor"
                     namePlaceholder="Nombre alumno o tutor"
                  />

                  <div className="btn-right mb-3">
                     <button onClick={search} className="btn btn-light">
                        <i className="fas fa-filter"></i> Buscar
                     </button>
                  </div>
               </form>

               {invoices.length > 0 && (
                  <div className="wrapper">
                     <table className="end-btn">
                        <thead>
                           <tr>
                              <th>Fecha</th>
                              <th>N° Factura</th>
                              <th>Nombre</th>
                              <th>Total</th>
                              <th>&nbsp;</th>
                              {userLogged.type === "Administrador" &&
                                 moment(invoices[0].date).date() ===
                                    moment().date() && <th>&nbsp;</th>}
                           </tr>
                        </thead>
                        <tbody>
                           {!loadingInvoices &&
                              invoices.length > 0 &&
                              invoices.map(
                                 (invoice, index, arr) =>
                                    index >= page * 10 &&
                                    index < (page + 1) * 10 && (
                                       <tr key={index}>
                                          <td>
                                             <Moment
                                                date={invoice.date}
                                                format="DD/MM/YY"
                                             />
                                          </td>
                                          <td>{invoice.invoiceid}</td>
                                          <td>
                                             {invoice.user
                                                ? invoice.user.lastname +
                                                  ", " +
                                                  invoice.user.name
                                                : invoice.lastname +
                                                  ", " +
                                                  invoice.name}
                                          </td>
                                          <td>{invoice.total}</td>
                                          <td>
                                             <a
                                                href={`/invoice/${invoice._id}`}
                                                className="btn-text"
                                             >
                                                Ver más &rarr;
                                             </a>
                                          </td>
                                          {userLogged.type ===
                                             "Administrador" &&
                                             moment(arr[0].date).date() ===
                                                moment().date() && (
                                                <td>
                                                   {moment(
                                                      invoice.date
                                                   ).date() ===
                                                      moment().date() && (
                                                      <button
                                                         onClick={() =>
                                                            setToggle(
                                                               invoice._id
                                                            )
                                                         }
                                                         className="btn btn-danger"
                                                      >
                                                         <i className="far fa-trash-alt"></i>
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
               )}

               <ListButtons
                  page={page}
                  items={invoices}
                  changePage={updatePageNumber}
                  pdfGeneratorSave={pdfGeneratorSave}
               />
            </>
         ) : (
            <Loading />
         )}
      </>
   );
};

IncomeList.propTypes = {
   auth: PropTypes.object.isRequired,
   invoices: PropTypes.object.isRequired,
   loadInvoices: PropTypes.func.isRequired,
   updatePageNumber: PropTypes.func.isRequired,
   deleteInvoice: PropTypes.func.isRequired,
   invoicesPDF: PropTypes.func.isRequired,
};

const mapStatetoProps = (state) => ({
   auth: state.auth,
   invoices: state.invoices,
   mixvalues: state.mixvalues,
});

export default connect(mapStatetoProps, {
   loadInvoices,
   updatePageNumber,
   deleteInvoice,
   invoicesPDF,
})(IncomeList);
