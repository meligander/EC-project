import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import format from "date-fns/format";
import { FaFileInvoiceDollar, FaTrashAlt } from "react-icons/fa";

import {
   registerInvoice,
   removeDetail,
} from "../../../../../../../../actions/invoice";
import {
   formatNumber,
   togglePopup,
} from "../../../../../../../../actions/global";

import Alert from "../../../../../../sharedComp/Alert";
import UsersSearch from "../../../../../sharedComp/search/UsersSearch";
import PopUp from "../../../../../../../modal/PopUp";

import "./style.scss";

const InvoiceTab = ({
   invoices: {
      invoice,
      otherValues: { invoiceNumber },
   },
   togglePopup,
   registerInvoice,
   removeDetail,
}) => {
   const day = format(new Date(), "dd/MM/yyyy");

   const [adminValues, setAdminValues] = useState({
      installmentTotal: 0,
   });

   const [formData, setFormData] = useState({
      user: {
         _id: null,
         lastname: "",
         name: "",
         email: "",
      },
      invoiceid: invoiceNumber,
      total: 0,
      details: [],
   });

   const installment =
      "Insc,Part,Libre,Mar,Abr,May,Jun,Jul,Agto,Sept,Oct,Nov,Dic".split(",");

   const { details, total, user } = formData;

   const { installmentTotal } = adminValues;

   useEffect(() => {
      if (invoice) {
         setFormData((prev) => ({
            ...prev,
            details: invoice.details,
            ...(invoice.studentsD && {
               total: invoice.details.reduce(
                  (sum, detail) =>
                     detail.discount !== undefined ? sum + detail.value : sum,
                  0
               ),
            }),
         }));
         setAdminValues((prev) => ({
            ...prev,
            installmentTotal: invoice.details.reduce(
               (sum, detail) => sum + detail.value,
               0
            ),
         }));
      } else {
         setFormData((prev) => ({
            ...prev,
            details: [],
            total: 0,
            user: {
               _id: null,
               lastname: "",
               name: "",
               email: "",
            },
            invoiceid: invoiceNumber,
         }));
         setAdminValues((prev) => ({ ...prev, installmentTotal: 0 }));
      }
   }, [invoice, invoiceNumber]);

   const onChange = (e) => {
      e.persist();
      setFormData((prev) => ({
         ...prev,
         ...(e.target.id === "user"
            ? {
                 user: {
                    ...user,
                    [e.target.name]: e.target.value,
                 },
              }
            : { [e.target.name]: e.target.value }),
      }));
   };

   const onChangeValue = (e) => {
      e.persist();
      let newDetails = [...details];

      if (
         newDetails[e.target.id].value >=
         Number(e.target.value.replace(/,/g, "."))
      ) {
         newDetails[e.target.id] = {
            ...newDetails[e.target.id],
            payment: e.target.value,
         };

         setFormData((prev) => ({
            ...prev,
            details: newDetails,
            total: newDetails.reduce(
               (accum, item) =>
                  accum +
                  (typeof item.payment === "number"
                     ? item.payment
                     : Number(item.payment.replace(/,/g, "."))),
               0
            ),
         }));
      }
   };

   return (
      <div className="invoice-tab">
         <PopUp
            confirm={() =>
               registerInvoice({
                  ...formData,
                  remaining: installmentTotal - total,
                  details: details.map((item) => {
                     return {
                        ...item,
                        payment:
                           typeof item.payment === "number"
                              ? item.payment
                              : Number(item.payment.replace(/,/g, ".")),
                     };
                  }),
               })
            }
            info="¿Está seguro que la factura es correcta?"
         />
         <form
            className="form bigger"
            onSubmit={(e) => {
               e.preventDefault();
               togglePopup("default");
            }}
         >
            <div className="form-group mb-2">
               <div className="two-in-row">
                  <input
                     className="form-input"
                     type="number"
                     name="invoiceid"
                     value={invoiceNumber}
                     disabled
                  />
                  <input
                     className="form-input"
                     type="text"
                     value={day}
                     disabled
                  />
               </div>
               <div className="two-in-row">
                  <label className="form-label">Factura ID</label>
                  <label className="form-label">Fecha</label>
               </div>
            </div>
            <div className="mb-2">
               <UsersSearch
                  primary={false}
                  selectUser={(user) =>
                     setFormData((prev) => ({ ...prev, user }))
                  }
                  usersType="guardian/student"
                  onChangeForm={onChange}
                  autoComplete="new-password"
                  restore={() =>
                     setFormData((prev) => ({
                        ...prev,
                        user: {
                           _id: null,
                           lastname: "",
                           name: "",
                           email: "",
                        },
                     }))
                  }
               />
               <div className="form-group">
                  <input
                     className={`form-input ${
                        user._id && !user.email ? "text-danger" : ""
                     }`}
                     type="email"
                     name="email"
                     id="user"
                     onChange={onChange}
                     disabled={user._id}
                     value={
                        !user._id
                           ? user.email
                           : user.email
                           ? user.email
                           : "No tiene email registrado"
                     }
                     placeholder="Email"
                  />
                  <label htmlFor="user" className="form-label">
                     Email
                  </label>
               </div>
            </div>
            <h3 className="text-primary heading-tertiary">
               Detalle de Factura
            </h3>
            <Alert type="5" />
            {details.length > 0 && (
               <div className="wrapper">
                  <table>
                     <thead>
                        <tr>
                           <th>Nombre</th>
                           <th>Cuota</th>
                           <th>Año</th>
                           <th>Importe</th>
                           <th>A Pagar</th>
                           <th>&nbsp;</th>
                        </tr>
                     </thead>
                     <tbody>
                        {details.length > 0 &&
                           details.map((install, index) => {
                              return (
                                 <tr key={index}>
                                    <td>
                                       {install.student.lastname +
                                          ", " +
                                          install.student.name}
                                    </td>
                                    <td>{installment[install.number]}</td>
                                    <td>{install.year}</td>
                                    <td>${formatNumber(install.value)}</td>
                                    <td>
                                       <input
                                          type="text"
                                          onChange={onChangeValue}
                                          id={index}
                                          disabled={
                                             install.discount !== undefined
                                          }
                                          placeholder="Monto"
                                          value={install.payment}
                                       />
                                    </td>
                                    <td>
                                       <button
                                          type="button"
                                          onClick={(e) => {
                                             e.preventDefault();
                                             removeDetail(install);
                                          }}
                                          className="btn btn-danger"
                                       >
                                          <FaTrashAlt />
                                       </button>
                                    </td>
                                 </tr>
                              );
                           })}
                     </tbody>
                  </table>
               </div>
            )}
            <div className="text-right mt-3">
               <div className="invoice-detail">
                  <label htmlFor="remaining">Saldo</label>
                  <input
                     type="number"
                     value={installmentTotal - total}
                     disabled
                     name="remaining"
                  />
               </div>
               <div className="invoice-detail">
                  <label htmlFor="total">Total a Pagar</label>
                  <input type="number" name="total" value={total} disabled />
               </div>
               <div className="btn-center">
                  <button type="submit" className="btn btn-primary">
                     <FaFileInvoiceDollar />
                     &nbsp;Pagar
                  </button>
               </div>
            </div>
         </form>
      </div>
   );
};

const mapStateToProps = (state) => ({
   invoices: state.invoices,
   auth: state.auth,
});

export default connect(mapStateToProps, {
   registerInvoice,
   removeDetail,
   togglePopup,
})(InvoiceTab);
