import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import format from "date-fns/format";
import { ImFilePdf } from "react-icons/im";

import { loadInvoice, invoicesPDF } from "../../../../../../actions/invoice";
import { formatNumber } from "../../../../../../actions/global";

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
      "Cl Pa",
      "Ex Li",
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
      discount: 0,
      user: {},
   });

   const { remaining, user, discount } = adminValues;

   useEffect(() => {
      if (loadingInvoice) loadInvoice(match.params.invoice_id, true);
      else {
         const userData = invoice.user.user_id ||
            invoice.user || { lastname: "Usuario eliminado", name: "" };

         const fullName = [userData.lastname, userData.name]
            .filter(Boolean)
            .join(", ");

         setAdminValues((prev) => ({
            ...prev,
            remaining: invoice.details.reduce(
               (accum, item) => accum + item.value,
               0 - invoice.total
            ),
            discount: invoice.details.reduce(
               (sum, detail) => (detail.discount || 0) + sum,
               0
            ),
            user: {
               name: fullName,
               email: userData.email || "",
               cel: userData.cel || "",
            },
         }));
      }
   }, [loadInvoice, match.params.invoice_id, loadingInvoice, invoice]);

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
                     <p className="paragraph">{user.name}</p>
                     <p className="paragraph">{user.email}</p>
                     <p className="paragraph">{user.cel}</p>
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
                           <th>{discount !== 0 ? "Subtotal" : "Total"}</th>
                           {discount !== 0 && (
                              <>
                                 <th>Dto</th>
                                 <th>Total</th>
                              </>
                           )}
                           <th>Abonado</th>
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
                              <td>
                                 $
                                 {formatNumber(
                                    (invoice.discount || 0) + invoice.value
                                 )}
                              </td>
                              {discount !== 0 && (
                                 <>
                                    <td>
                                       {invoice.discount
                                          ? "$" + formatNumber(invoice.discount)
                                          : "-"}
                                    </td>
                                    <td>${formatNumber(invoice.value)}</td>
                                 </>
                              )}
                              <td>${formatNumber(invoice.payment)}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
               <div className="text-right mt-3">
                  {discount !== 0 && (
                     <p>
                        <span className="heading-tertiary text-dark">
                           Descuento:
                        </span>
                        <input
                           className="value paragraph"
                           value={`$${formatNumber(discount)}`}
                           disabled
                        />
                     </p>
                  )}
                  {remaining !== 0 && (
                     <p>
                        <span className="heading-tertiary text-dark">
                           Saldo:
                        </span>
                        <input
                           className="value paragraph"
                           value={`$${formatNumber(remaining)}`}
                           disabled
                        />
                     </p>
                  )}

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
                     invoicesPDF(invoice, "invoice");
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
