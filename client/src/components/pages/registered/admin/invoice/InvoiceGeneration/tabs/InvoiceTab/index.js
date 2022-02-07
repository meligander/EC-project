import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import format from "date-fns/format";
import {
   FaFileInvoiceDollar,
   FaTimes,
   FaTrashAlt,
   FaUserCircle,
} from "react-icons/fa";
import { ImSearch } from "react-icons/im";

import {
   clearProfile,
   clearSearch,
} from "../../../../../../../../actions/user";
import {
   registerInvoice,
   removeDetail,
} from "../../../../../../../../actions/invoice";
import {
   formatNumber,
   togglePopup,
} from "../../../../../../../../actions/mixvalues";

import Alert from "../../../../../../sharedComp/Alert";
import UserSearch from "../../../../../sharedComp/search/UserSearch";
import PopUp from "../../../../../../../modal/PopUp";

import "./style.scss";

const InvoiceTab = ({
   invoices: {
      invoice,
      otherValues: { invoiceNumber },
   },
   togglePopup,
   clearSearch,
   registerInvoice,
   clearProfile,
   removeDetail,
}) => {
   const [adminValues, setAdminValues] = useState({
      day: format(new Date(), "dd/MM/yyyy"),
      selectedUser: {},
      registeredUser: false,
      toggleSearch: false,
      toDelete: "",
      installmentTotal: 0,
   });

   const [formData, setFormData] = useState({
      user: {
         _id: "",
         lastname: "",
         name: "",
         email: "",
      },
      invoiceid: invoiceNumber,
      total: 0,
      details: [],
   });

   const installment = "Insc,,,Mar,Abr,May,Jun,Jul,Agto,Sept,Oct,Nov,Dic".split(
      ","
   );

   const { invoiceid, details, total, user } = formData;

   const { _id, email, name, lastname } = user;

   const {
      day,
      selectedUser,
      installmentTotal,
      registeredUser,
      toggleSearch,
      toDelete,
   } = adminValues;

   useEffect(() => {
      if (invoice) {
         if (invoice.details.length > details.length) {
            const newItem = invoice.details[invoice.details.length - 1];
            setFormData((prev) => ({
               ...prev,
               details: [...prev.details, newItem],
            }));
            setAdminValues((prev) => ({
               ...prev,
               installmentTotal: prev.installmentTotal + newItem.value,
            }));
         } else if (invoice.details.length < details.length) {
            setFormData((prev) => ({
               ...prev,
               total: prev.total - toDelete.payment,
               details: prev.details.filter(
                  (detail) => detail.installment !== toDelete.installment
               ),
            }));
            setAdminValues((prev) => ({
               ...prev,
               toDelete: "",
               installmentTotal: prev.installmentTotal - toDelete.value,
            }));
         }
      }
   }, [invoice, invoiceid, details.length, toDelete]);

   const addUser = () => {
      setAdminValues((prev) => ({
         ...prev,
         registeredUser: true,
         toggleSearch: !toggleSearch,
      }));
      setFormData((prev) => ({
         ...prev,
         user: selectedUser,
      }));
      clearSearch();
   };

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

      if (newDetails[e.target.id].value >= e.target.value) {
         newDetails[e.target.id] = {
            ...newDetails[e.target.id],
            payment: e.target.value,
         };

         setFormData((prev) => ({
            ...prev,
            details: newDetails,
            total: newDetails.reduce(
               (accum, item) => accum + Number(item.payment),
               0
            ),
         }));
      }
   };

   const removeItem = (item) => {
      removeDetail(item.installment);
      setAdminValues((prev) => ({ ...prev, toDelete: item }));
   };

   const confirm = () => {
      registerInvoice({
         ...formData,
         remaining: installmentTotal - total,
      });
   };

   return (
      <div className="invoice-tab">
         <PopUp
            confirm={confirm}
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
            <div className="paying-user">
               <h3 className="paragraph text-primary ">Usuario a Pagar</h3>
               <div className="tooltip">
                  <button
                     onClick={(e) => {
                        e.preventDefault();
                        setAdminValues((prev) => ({
                           ...prev,
                           toggleSearch: !toggleSearch,
                        }));
                     }}
                     type="button"
                     className="btn-cancel search"
                  >
                     <ImSearch />
                  </button>
                  <span className="tooltiptext">Buscar usuario registrado</span>
               </div>
            </div>
            <div className="mb-2">
               <div className="form-group">
                  {!registeredUser ? (
                     <>
                        <div className="two-in-row">
                           <input
                              className="form-input"
                              type="text"
                              onChange={onChange}
                              name="name"
                              id="user"
                              value={name}
                              placeholder="Nombre"
                           />
                           <input
                              className="form-input"
                              type="text"
                              onChange={onChange}
                              id="user"
                              value={lastname}
                              name="lastname"
                              placeholder="Apellido"
                           />
                        </div>
                        <div className="two-in-row">
                           <label
                              className={`form-label ${
                                 name === "" ? "lbl" : ""
                              }`}
                           >
                              Nombre
                           </label>
                           <label
                              className={`form-label ${
                                 lastname === "" ? "lbl" : ""
                              }`}
                           >
                              Apellido
                           </label>
                        </div>
                     </>
                  ) : (
                     <>
                        <div className="btn-end">
                           <input
                              className="form-input"
                              type="text"
                              value={lastname + ", " + name}
                              placeholder="Alumno"
                              disabled
                              id="full-name"
                           />
                           <div className="tooltip">
                              <Link
                                 onClick={() => {
                                    window.scroll(0, 0);
                                    clearProfile();
                                 }}
                                 className="btn-cancel search"
                                 to={`/index/dashboard/${_id}`}
                              >
                                 <FaUserCircle />
                              </Link>
                              <span className="tooltiptext">Ver perfil</span>
                           </div>
                           <div className="tooltip">
                              <button
                                 type="button"
                                 onClick={(e) => {
                                    e.preventDefault();
                                    setAdminValues((prev) => ({
                                       ...prev,
                                       registeredUser: !registeredUser,
                                    }));
                                 }}
                                 className="btn-cancel"
                              >
                                 <FaTimes />
                              </button>
                              <span className="tooltiptext">
                                 Quitar usuario
                              </span>
                           </div>
                        </div>
                        <label htmlFor="full-name" className="form-label">
                           Nombre
                        </label>
                     </>
                  )}
               </div>
               <div className="form-group">
                  <input
                     className={`form-input ${
                        registeredUser && !user.email ? "text-danger" : ""
                     }`}
                     type="email"
                     name="email"
                     id="user"
                     onChange={onChange}
                     disabled={registeredUser}
                     value={
                        !registeredUser
                           ? email
                           : email
                           ? email
                           : "No tiene email registrado"
                     }
                     placeholder="Email"
                  />
                  <label htmlFor="user" className="form-label">
                     Email
                  </label>
               </div>
            </div>
            {toggleSearch && (
               <UserSearch
                  selectStudent={(user) => {
                     setAdminValues((prev) => ({
                        ...prev,
                        selectedUser: user,
                     }));
                  }}
                  selectedStudent={selectedUser}
                  actionForSelected={addUser}
                  typeSearch="guardian/student"
               />
            )}
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
                                          type="number"
                                          onChange={onChangeValue}
                                          id={index}
                                          placeholder="Monto"
                                          min="0"
                                          max={install.value}
                                          value={install.payment}
                                       />
                                    </td>
                                    <td>
                                       <button
                                          type="button"
                                          onClick={(e) => {
                                             e.preventDefault();
                                             removeItem(install);
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
   clearSearch,
   registerInvoice,
   clearProfile,
   removeDetail,
   togglePopup,
})(InvoiceTab);
