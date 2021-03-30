import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import PropTypes from "prop-types";

import {
   loadInvoices,
   clearInvoice,
   deleteInvoice,
   invoicesPDF,
} from "../../../../../../actions/invoice";
import { loadRegister } from "../../../../../../actions/register";
import {
   updatePageNumber,
   formatNumber,
} from "../../../../../../actions/mixvalues";

import ListButtons from "../sharedComp/ListButtons";
import DateFilter from "../sharedComp/DateFilter";
import NameField from "../../../sharedComp/NameField";
import Loading from "../../../../../modal/Loading";
import PopUp from "../../../../../modal/PopUp";

import "./style.scss";

const IncomeList = ({
   auth: { userLogged },
   invoices: { loadingInvoices, invoices },
   registers: { register, loading },
   mixvalues: { page },
   loadInvoices,
   loadRegister,
   clearInvoice,
   updatePageNumber,
   invoicesPDF,
   deleteInvoice,
}) => {
   const isAdmin =
      userLogged.type === "admin" || userLogged.type === "admin&teacher";

   const [filterData, setFilterData] = useState({
      startDate: "",
      endDate: "",
      name: "",
      lastname: "",
   });

   const [otherValues, setOtherValues] = useState({
      toggleModal: false,
      toDelete: "",
   });

   const { startDate, endDate, name, lastname } = filterData;
   const { toggleModal, toDelete } = otherValues;

   useEffect(() => {
      if (loadingInvoices) {
         updatePageNumber(0);
         loadInvoices({});
      }
      if (loading) loadRegister();
   }, [loadingInvoices, loadInvoices, loadRegister, updatePageNumber, loading]);

   const onChange = (e) => {
      setFilterData({
         ...filterData,
         [e.target.name]: e.target.value,
      });
   };

   const setToggle = (invoice_id) => {
      setOtherValues({
         toDelete: invoice_id ? invoice_id : "",
         toggleModal: !toggleModal,
      });
   };

   const setName = (invoice) => {
      let name = "";
      switch (invoice.user) {
         case null:
            name = "Usuario Eliminado";
            break;
         case undefined:
            if (invoice.lastname) {
               name = invoice.lastname + ", " + invoice.name;
            } else {
               name = "Usuario no definido";
            }
            break;
         default:
            name = invoice.user.lastname + ", " + invoice.user.name;
            break;
      }
      return name;
   };

   return (
      <>
         {!loadingInvoices && !loading ? (
            <>
               <PopUp
                  toggleModal={toggleModal}
                  setToggleModal={setToggle}
                  text="¿Está seguro que desea eliminar la factura?"
                  confirm={() => deleteInvoice(toDelete)}
               />
               <h2>Listado Ingresos</h2>
               <form
                  className="form bigger"
                  onSubmit={(e) => {
                     e.preventDefault();
                     loadInvoices(filterData);
                  }}
               >
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
                     <button type="submit" className="btn btn-light">
                        <i className="fas fa-filter"></i>&nbsp; Buscar
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
                              {isAdmin &&
                                 invoices[0].register &&
                                 invoices[0].register === register._id &&
                                 register.temporary && <th>&nbsp;</th>}
                           </tr>
                        </thead>
                        <tbody>
                           {invoices.length > 0 &&
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
                                          <td>{setName(invoice)}</td>
                                          <td>
                                             ${formatNumber(invoice.total)}
                                          </td>
                                          <td>
                                             <Link
                                                to={`/invoice/${invoice._id}`}
                                                onClick={() => {
                                                   window.scroll(0, 0);
                                                   clearInvoice();
                                                }}
                                                className="btn-text"
                                             >
                                                Ver más &rarr;
                                             </Link>
                                          </td>
                                          {isAdmin &&
                                             arr[0].register &&
                                             arr[0].register === register._id &&
                                             register.temporary && (
                                                <td>
                                                   {invoice.register &&
                                                      invoice.register ===
                                                         register._id &&
                                                      register.temporary && (
                                                         <button
                                                            type="button"
                                                            onClick={(e) => {
                                                               e.preventDefault();
                                                               setToggle(
                                                                  invoice._id
                                                               );
                                                            }}
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
                  type="ingresos"
                  items={invoices}
                  changePage={updatePageNumber}
                  pdfGenerator={() => invoicesPDF(invoices)}
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
   registers: PropTypes.object.isRequired,
   invoices: PropTypes.object.isRequired,
   loadInvoices: PropTypes.func.isRequired,
   loadRegister: PropTypes.func.isRequired,
   updatePageNumber: PropTypes.func.isRequired,
   deleteInvoice: PropTypes.func.isRequired,
   clearInvoice: PropTypes.func.isRequired,
   invoicesPDF: PropTypes.func.isRequired,
};

const mapStatetoProps = (state) => ({
   auth: state.auth,
   invoices: state.invoices,
   mixvalues: state.mixvalues,
   registers: state.registers,
});

export default connect(mapStatetoProps, {
   loadInvoices,
   updatePageNumber,
   deleteInvoice,
   invoicesPDF,
   clearInvoice,
   loadRegister,
})(IncomeList);
