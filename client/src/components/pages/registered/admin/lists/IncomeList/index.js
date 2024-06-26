import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import format from "date-fns/format";
import { FaTrashAlt } from "react-icons/fa";
import { BiFilterAlt } from "react-icons/bi";

import {
   loadInvoices,
   clearInvoice,
   deleteInvoice,
   invoicesPDF,
} from "../../../../../../actions/invoice";
import { loadRegister } from "../../../../../../actions/register";
import { formatNumber, togglePopup } from "../../../../../../actions/global";

import ListButtons from "../sharedComp/ListButtons";
import DateFilter from "../sharedComp/DateFilter";
import NameField from "../../../sharedComp/NameField";
import PopUp from "../../../../../modal/PopUp";

import "./style.scss";

const IncomeList = ({
   auth: { userLogged },
   invoices: { loading, invoices },
   registers: { register, loadingRegister },
   loadInvoices,
   loadRegister,
   clearInvoice,
   invoicesPDF,
   deleteInvoice,
   togglePopup,
}) => {
   const [filterData, setFilterData] = useState({
      startDate: "",
      endDate: "",
      name: "",
      lastname: "",
   });

   const [adminValues, setAdminValues] = useState({
      toDelete: "",
      page: 0,
      total: 0,
   });

   const { startDate, endDate, name, lastname } = filterData;
   const { toDelete, page, total } = adminValues;

   useEffect(() => {
      if (loading) loadInvoices({}, true);
      else {
         setAdminValues((prev) => ({
            ...prev,
            total: invoices.reduce((sum, invoice) => sum + invoice.total, 0),
         }));
      }
   }, [loading, loadInvoices, invoices]);

   useEffect(() => {
      if (loadingRegister) loadRegister(false);
   }, [loadRegister, loadingRegister]);

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
         <PopUp
            info="¿Está seguro que desea eliminar la factura?"
            confirm={() => deleteInvoice(toDelete)}
         />
         <h2>Listado Ingresos</h2>
         {userLogged.type !== "secretary" && total !== 0 && (
            <p className="heading-tertiary text-moved-right">
               Total: ${formatNumber(total)}
            </p>
         )}
         <form
            className="form bigger"
            onSubmit={(e) => {
               e.preventDefault();
               setAdminValues((prev) => ({ ...prev, page: 0 }));
               loadInvoices(filterData, true);
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
               lastnamePlaceholder="Apellido alumno"
               namePlaceholder="Nombre alumno"
            />

            <div className="btn-right mb-3">
               <button type="submit" className="btn btn-light">
                  <BiFilterAlt />
                  &nbsp;Buscar
               </button>
            </div>
         </form>

         {!loadingRegister && !loading && invoices[0] && (
            <div className="wrapper">
               <table className="end-btn">
                  <thead>
                     <tr>
                        <th>Fecha</th>
                        <th>N° Factura</th>
                        <th>Nombre</th>
                        <th>Total</th>
                        <th>&nbsp;</th>
                        {invoices[0].register &&
                           invoices[0].register === register._id &&
                           register.temporary && <th>&nbsp;</th>}
                     </tr>
                  </thead>
                  <tbody>
                     {invoices.map(
                        (invoice, index, arr) =>
                           index >= page * 10 &&
                           index < (page + 1) * 10 && (
                              <tr key={index}>
                                 <td>
                                    {format(new Date(invoice.date), "dd/MM/yy")}
                                 </td>
                                 <td>{invoice.invoiceid}</td>
                                 <td>{setName(invoice.user)}</td>
                                 <td>${formatNumber(invoice.total)}</td>
                                 <td>
                                    <Link
                                       to={`/invoice/single/${invoice._id}`}
                                       onClick={() => {
                                          window.scroll(0, 0);
                                          clearInvoice();
                                       }}
                                       className="btn-text"
                                    >
                                       Ver más &rarr;
                                    </Link>
                                 </td>
                                 {arr[0].register &&
                                    arr[0].register === register._id &&
                                    register.temporary && (
                                       <td>
                                          {invoice.register &&
                                             invoice.register ===
                                                register._id && (
                                                <button
                                                   type="button"
                                                   onClick={(e) => {
                                                      e.preventDefault();
                                                      setAdminValues(
                                                         (prev) => ({
                                                            ...prev,
                                                            toDelete:
                                                               invoice._id,
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
            </div>
         )}
         {!loading && (
            <ListButtons
               page={page}
               type="ingresos"
               items={invoices}
               changePage={(page) =>
                  setAdminValues((prev) => ({ ...prev, page }))
               }
               pdfGenerator={() => invoicesPDF(invoices, "list")}
            />
         )}
      </>
   );
};

const mapStatetoProps = (state) => ({
   invoices: state.invoices,
   registers: state.registers,
   auth: state.auth,
});

export default connect(mapStatetoProps, {
   loadInvoices,
   deleteInvoice,
   invoicesPDF,
   clearInvoice,
   loadRegister,
   togglePopup,
})(IncomeList);
