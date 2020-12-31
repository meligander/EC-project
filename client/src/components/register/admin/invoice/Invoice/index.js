import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Moment from "react-moment";
import PropTypes from "prop-types";

import { loadInvoice, invoicePDF } from "../../../../../actions/invoice";

import Loading from "../../../../modal/Loading";
import logo from "../../../../../img/fondoBlanco.png";

import "./style.scss";

const Invoice = ({
   loadInvoice,
   invoicePDF,
   match,
   invoices: { invoice, loading },
}) => {
   const [remaining, setRemaining] = useState(0);

   useEffect(() => {
      if (!loading) {
         let rem = 0;
         for (let x = 0; x < invoice.details.length; x++) {
            rem += invoice.details[x].value - invoice.details[x].payment;
         }
         setRemaining(rem);
      } else loadInvoice(match.params.invoice_id);
   }, [loadInvoice, match.params, invoice, loading]);

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

   const pdfGeneratorSave = () => {
      invoicePDF(invoice, remaining);
   };

   return (
      <>
         {!loading ? (
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
                        <p className="paragraph">
                           {invoice.user
                              ? invoice.user.lastname + ", " + invoice.user.name
                              : invoice.lastname + ", " + invoice.name}
                        </p>
                        <p className="paragraph">
                           {!invoice.email
                              ? invoice.user
                                 ? invoice.user.email
                                 : ""
                              : invoice.email}
                        </p>
                        <p className="paragraph">
                           {invoice.user
                              ? invoice.user.cel
                                 ? invoice.user.cel
                                 : ""
                              : ""}
                        </p>
                     </div>
                     <div className="invoice-info">
                        <p className="paragraph">
                           N° Factura: {invoice.invoiceid}
                        </p>
                        <p className="paragraph">
                           Fecha:{" "}
                           <Moment date={invoice.date} format="DD/MM/YY" />
                        </p>
                     </div>
                  </div>
                  <div className="details my-2">
                     <table>
                        <thead>
                           <tr>
                              <th>Nombre</th>
                              <th>Cuota</th>
                              <th>Importe</th>
                              <th>Pago</th>
                           </tr>
                        </thead>
                        <tbody>
                           {invoice.details.length > 0 &&
                              invoice.details.map((invoice, index) => (
                                 <tr key={index}>
                                    <td>
                                       {invoice.installment.student.lastname +
                                          ", " +
                                          invoice.installment.student.name}
                                    </td>
                                    <td>
                                       {installment[invoice.installment.number]}
                                    </td>
                                    <td>${invoice.value}</td>
                                    <td>${invoice.payment}</td>
                                 </tr>
                              ))}
                        </tbody>
                     </table>
                  </div>
                  <div className="text-right mt-3">
                     <p>
                        <span className="heading-tertiary text-dark">
                           Saldo:
                        </span>
                        <input
                           className="value paragraph"
                           value={`$${remaining}`}
                           disabled
                        />
                     </p>
                     <p>
                        <span className="heading-tertiary text-dark">
                           Total:
                        </span>

                        <input
                           className="value paragraph"
                           value={`$${invoice.total}`}
                           disabled
                        />
                     </p>
                  </div>
               </div>
               <div className="btn-ctr">
                  <button
                     className="btn btn-secondary"
                     onClick={pdfGeneratorSave}
                  >
                     <i className="fas fa-file-pdf"></i>
                  </button>
               </div>
            </>
         ) : (
            <Loading />
         )}
      </>
   );
};

Invoice.propTypes = {
   loadInvoice: PropTypes.func.isRequired,
   invoicePDF: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   invoices: state.invoices,
});

export default connect(mapStateToProps, { loadInvoice, invoicePDF })(
   withRouter(Invoice)
);
