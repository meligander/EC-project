import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import format from "date-fns/format";
import { FaFileInvoiceDollar, FaTrashAlt } from "react-icons/fa";

import {
   payCash,
   payTransfer,
   registerInvoice,
   removeDetail,
   addDiscount,
   removeDiscount,
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
   global: { discount },
   auth: { userLogged },
   togglePopup,
   registerInvoice,
   removeDetail,
   payCash,
   payTransfer,
   addDiscount,
   removeDiscount,
}) => {
   const day = format(new Date(), "dd/MM/yyyy");
   const month = new Date().getMonth() + 1;

   const [adminValues, setAdminValues] = useState({
      cash: false,
      total: 0,
   });

   const [formData, setFormData] = useState({
      user: {
         _id: null,
         lastname: "",
         name: "",
         email: "",
      },
      invoiceid: invoiceNumber,
      details: [],
   });

   const installment =
      "Insc,Part,Libre,Mar,Abr,May,Jun,Jul,Agto,Sept,Oct,Nov,Dic".split(",");

   const { details, user } = formData;

   const { cash, total } = adminValues;

   useEffect(() => {
      if (invoice) {
         setFormData((prev) => ({
            ...prev,
            details: invoice.details,
         }));
         setAdminValues((prev) => ({
            ...prev,
            total: invoice.extraDiscount
               ? invoice.details.reduce(
                    (accum, item) => accum + +item.payment,
                    0
                 )
               : 0,
         }));
      }
   }, [invoice]);

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
            : {
                 [e.target.name]: e.target.value,
              }),
      }));
   };

   const onChangePaymentMethod = (e) => {
      e.persist();
      const isCash = e.target.value === "cash";

      if (isCash) payCash(discount.number);
      else payTransfer();

      setAdminValues((prev) => ({ ...prev, cash: isCash }));
   };

   const onChangeValue = (e) => {
      e.persist();

      const newValue = e.target.value;
      const newDetails = [...details];

      // Permitir solo números, comas y puntos
      if (!/^[0-9.,]*$/.test(newValue)) return;

      //Para verificar que hayan solo dos decimales
      const decimal = newValue.replace(/,/g, ".").split(".");

      if (
         newDetails === "" ||
         (newDetails[e.target.id].value >=
            Number(newValue.replace(/,/g, ".")) &&
            (!decimal[1] || decimal[1].length < 3))
      ) {
         newDetails[e.target.id] = {
            ...newDetails[e.target.id],
            payment: newValue,
         };

         setFormData((prev) => ({
            ...prev,
            details: newDetails,
         }));
         setAdminValues((prev) => ({
            ...prev,
            total: newDetails.reduce(
               (accum, item) => accum + Number(item.payment.replace(/,/g, ".")),
               0
            ),
         }));
      }
   };

   return (
      <div className="invoice-tab">
         <PopUp
            confirm={() => {
               const newDetails = details.map((item) => {
                  const payment = Number(
                     item.payment.toString().replace(/,/g, ".")
                  );
                  return {
                     ...item,
                     payment,
                     //Si no se paga completo se saca el descuento
                     ...(item.discount !== undefined &&
                        (item.value !== payment || item.discount === 0) && {
                           discount: undefined,
                           value: item.value + item.discount,
                        }),
                  };
               });

               registerInvoice({
                  ...formData,
                  details: newDetails,
               });
            }}
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
            <UsersSearch
               primary={false}
               selectUser={(user) => setFormData((prev) => ({ ...prev, user }))}
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
                     user._id
                        ? user.email || "No tiene email registrado"
                        : user.email
                  }
                  placeholder="Email"
               />
               <label htmlFor="user" className="form-label">
                  Email
               </label>
            </div>
            <h3 className={"paragraph text-primary"}>Forma de Pago</h3>
            <div className="radio-group" id="radio-group">
               <input
                  className="form-radio"
                  type="radio"
                  disabled={!invoice}
                  value="transfer"
                  checked={!cash}
                  onChange={onChangePaymentMethod}
                  id="rbt"
               />
               <label className="radio-lbl" htmlFor="rbt">
                  Transferencia
               </label>
               <input
                  className="form-radio"
                  type="radio"
                  disabled={!invoice}
                  value="cash"
                  checked={cash}
                  onChange={onChangePaymentMethod}
                  id="rbc"
               />
               <label className="radio-lbl" htmlFor="rbc">
                  Efectivo
               </label>
            </div>
            {(userLogged.type === "admin" ||
               userLogged.type === "admin&teacher") && (
               <div className="form-group">
                  <input
                     className="form-checkbox"
                     onChange={(e) =>
                        e.target.checked ? addDiscount() : removeDiscount()
                     }
                     type="checkbox"
                     name="extraDiscount"
                     disabled={
                        details.filter(
                           (item) =>
                              item.status !== "expired" &&
                              item.student._id === details[0].student._id &&
                              item.number > month &&
                              item.value > 5000
                        ).length < 3
                     }
                     id="extraDiscount"
                  />

                  <label
                     className="checkbox-lbl tooltip"
                     htmlFor="extraDiscount"
                  >
                     Descuento Extra
                     <span className="tooltiptext">
                        Para cuando se pagan 3 o más cuotas de un mismo alumno
                     </span>
                  </label>
               </div>
            )}

            <h3 className="text-primary heading-tertiary mt-3">
               Detalle de Factura
            </h3>
            <Alert type="5" />
            {details.length > 0 && (
               <div className="wrapper mt-2">
                  <table>
                     <thead>
                        <tr>
                           <th>Nombre</th>
                           <th>Cuota</th>
                           <th>Año</th>
                           <th>
                              {invoice.cashDiscount || invoice.extraDiscount
                                 ? "Subtotal"
                                 : "Total"}
                           </th>
                           {(invoice.cashDiscount || invoice.extraDiscount) && (
                              <>
                                 <th>Dto</th>
                                 <th>Total</th>
                              </>
                           )}
                           <th>Abonado</th>
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
                                    <td>
                                       $
                                       {formatNumber(
                                          install.discount
                                             ? +install.discount + install.value
                                             : install.value
                                       )}
                                    </td>
                                    {(invoice.cashDiscount ||
                                       invoice.extraDiscount) && (
                                       <>
                                          <td>
                                             {install.discount > 0 ? (
                                                <>
                                                   $
                                                   {formatNumber(
                                                      install.discount
                                                   )}
                                                </>
                                             ) : (
                                                <>-</>
                                             )}
                                          </td>
                                          <td>
                                             ${formatNumber(install.value)}
                                          </td>
                                       </>
                                    )}
                                    <td>
                                       <input
                                          type="text"
                                          onChange={onChangeValue}
                                          id={index}
                                          disabled={invoice.extraDiscount}
                                          autoComplete="off"
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
               {(invoice?.extraDiscount || invoice?.cashDiscount) && (
                  <div className="invoice-detail">
                     <label>Descuento</label>
                     <input
                        value={formatNumber(
                           details.reduce(
                              (accum, item) => accum + item.discount,
                              0
                           )
                        )}
                        disabled
                     />
                  </div>
               )}
               {!invoice?.extraDiscount && (
                  <div className="invoice-detail">
                     <label>Saldo</label>
                     <input
                        value={formatNumber(
                           details.reduce(
                              (accum, item) => accum + item.value,
                              0 - total
                           )
                        )}
                        disabled
                     />
                  </div>
               )}
               <div className="invoice-detail">
                  <label>Total</label>
                  <input value={formatNumber(total)} disabled />
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
   global: state.global,
});

export default connect(mapStateToProps, {
   registerInvoice,
   removeDetail,
   togglePopup,
   payCash,
   payTransfer,
   addDiscount,
   removeDiscount,
})(InvoiceTab);
