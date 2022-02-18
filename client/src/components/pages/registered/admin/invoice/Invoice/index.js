import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import format from "date-fns/format";
import { ImFilePdf } from "react-icons/im";

import { loadInvoice, invoicesPDF } from "../../../../../../actions/invoice";
import { formatNumber } from "../../../../../../actions/mixvalues";

import logo from "../../../../../../img/fondoBlanco.png";

import "./style.scss";

const Invoice = ({
   invoices: { invoice, loadingInvoice },
   loadInvoice,
   invoicesPDF,
   match,
}) => {
   const installment = [
      "Insc",
      "",
      "",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Agto",
      "Sept",
      "Oct",
      "Nov",
      "Dic",
   ];

   const [adminValues, setAdminValues] = useState({
      remaining: 0,
   });

   const { remaining } = adminValues;

   useEffect(() => {
      if (loadingInvoice) loadInvoice(match.params.invoice_id, true);
      else
         setAdminValues((prev) => ({
            ...prev,
            remaining: invoice.details.reduce(
               (sum, detail) => sum + (detail.value - detail.payment),
               0
            ),
         }));
   }, [loadInvoice, match.params.invoice_id, loadingInvoice, invoice]);

   const name = (user) => {
      if (user.user_id === null) return "Usuario Eliminado";

      const lastname = user.user_id ? user.user_id.lastname : user.lastname;
      const name = user.user_id ? user.user_id.name : user.name;

      return `${lastname ? `${lastname}${name ? ", " : ""}` : ""}${
         name ? name : ""
      }`;
   };

   return (
      !loadingInvoice && (
         <>
            <div className="invoice">
               <div className="row">
                  <div>
                     <h3 className="heading-tertiary fancy-heading text-dark">
                        Villa de Merlo English Centre
                     </h3>
                     <p className="paragraph">Coronel Mercau 783</p>
                     <p className="paragraph">
                        Villa de Merlo, San Luis, Argentina
                     </p>
                     <p className="paragraph">(02656) 476-661</p>
                  </div>
                  <div className="logo">
                     <img src={logo} alt="" />
                  </div>
               </div>
               <div className="row mt-3">
                  <div>
                     <p className="paragraph text-dark">Cliente:</p>
                     <p className="paragraph">{name(invoice.user)}</p>
                     <p className="paragraph">
                        {invoice.user.email
                           ? invoice.user.email
                           : invoice.user.user_id && invoice.user.user_id.email
                           ? invoice.user.user_id.email
                           : ""}
                     </p>
                     <p className="paragraph">
                        {invoice.user.user_id && invoice.user.user_id.cel
                           ? invoice.user.user_id.cel
                           : ""}
                     </p>
                  </div>
                  <div className="invoice-info">
                     <p className="paragraph">
                        N° Factura: {invoice.invoiceid}
                     </p>
                     <p className="paragraph">
                        Fecha: {format(new Date(invoice.date), "dd/MM/yy")}
                     </p>
                  </div>
               </div>
               <div className="details my-2">
                  <table>
                     <thead>
                        <tr>
                           <th>Nombre</th>
                           <th>Cuota</th>
                           <th>Año</th>
                           <th>Importe</th>
                           <th>Pago</th>
                        </tr>
                     </thead>
                     <tbody>
                        {invoice.details.map((invoice, index) => (
                           <tr key={index}>
                              <td>
                                 {invoice.installment
                                    ? invoice.installment.student.lastname +
                                      ", " +
                                      invoice.installment.student.name
                                    : "Cuota eliminada"}
                              </td>
                              <td>
                                 {invoice.installment
                                    ? installment[invoice.installment.number]
                                    : "Indefinida"}
                              </td>
                              <td>
                                 {invoice.installment
                                    ? invoice.installment.year
                                    : "Indefinido"}
                              </td>
                              <td>${formatNumber(invoice.value)}</td>
                              <td>${formatNumber(invoice.payment)}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
               <div className="text-right mt-3">
                  <p>
                     <span className="heading-tertiary text-dark">Saldo:</span>
                     <input
                        className="value paragraph"
                        value={`$${
                           remaining > 0 ? formatNumber(remaining) : remaining
                        }`}
                        disabled
                     />
                  </p>
                  <p>
                     <span className="heading-tertiary text-dark">Total:</span>

                     <input
                        className="value paragraph"
                        value={`$${formatNumber(invoice.total)}`}
                        disabled
                     />
                  </p>
               </div>
            </div>
            <div className="btn-center">
               <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={(e) => {
                     e.preventDefault();
                     invoicesPDF({ invoice, remaining }, "invoice");
                  }}
               >
                  <ImFilePdf />
               </button>
            </div>
         </>
      )
   );
};

const mapStateToProps = (state) => ({
   invoices: state.invoices,
});

export default connect(mapStateToProps, { loadInvoice, invoicesPDF })(Invoice);
