import React from "react";
import format from "date-fns/format";
import { Link } from "react-router-dom";

import { formatNumber } from "../../../../actions/global";

const InvoiceList = ({ invoices, clearInvoice, togglePopup }) => {
   return (
      <div className="popup-invoices">
         <h3 className="heading-tertiary text-left p-1 my-1">
            Listado de Facturas Pagas
         </h3>
         <div className="wrapper both">
            <table>
               <tbody>
                  {invoices.length > 0 ? (
                     invoices.map((invoice, i) => (
                        <React.Fragment key={i}>
                           {
                              <tr>
                                 <td>
                                    {format(new Date(invoice.date), "dd/MM/yy")}
                                 </td>
                                 <td>${formatNumber(invoice.total)}</td>
                                 <td>
                                    <Link
                                       to={`/invoice/single/${invoice._id}`}
                                       onClick={() => {
                                          window.scroll(0, 0);
                                          clearInvoice();
                                          togglePopup("default");
                                       }}
                                       className="btn-text"
                                    >
                                       Ver más &rarr;
                                    </Link>
                                 </td>
                              </tr>
                           }
                        </React.Fragment>
                     ))
                  ) : (
                     <p className="heading-tertiary text-center">
                        No hay facturas registradas
                     </p>
                  )}
               </tbody>
            </table>
         </div>
      </div>
   );
};

export default InvoiceList;
