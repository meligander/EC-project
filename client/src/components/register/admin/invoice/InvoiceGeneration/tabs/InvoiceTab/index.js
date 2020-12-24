import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import moment from "moment";
import PropTypes from "prop-types";

import { clearSearch } from "../../../../../../../actions/user";
import { registerInvoice } from "../../../../../../../actions/invoice";
import { removeInstallmentFromList } from "../../../../../../../actions/installment";
import { setAlert } from "../../../../../../../actions/alert";

import Alert from "../../../../../../sharedComp/Alert";
import StudentSearch from "../../../../../../sharedComp/search/StudentSearch";
import Confirm from "../../../../../../modal/Confirm";

import "./style.scss";

const InvoiceTab = ({
   history,
   installment: { installments },
   auth: { userLogged },
   mixvalues: { invoiceNumber },
   clearSearch,
   setAlert,
   registerInvoice,
   removeInstallmentFromList,
}) => {
   const [otherValues, setOtherValues] = useState({
      day: moment().format("DD/MM/YYYY"),
      selectedUser: {
         _id: "",
         lastname: "",
         name: "",
         email: "",
      },
      registerUser: false,
      toggleModal: false,
   });

   const [invoice, setInvoice] = useState({
      name: "",
      lastname: "",
      email: "",
      user: {
         _id: "",
         lastname: "",
         name: "",
         email: "",
      },
      invoiceid: "",
      total: 0,
      details: [],
      remaining: 0,
   });

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

   const {
      name,
      lastname,
      email,
      user,
      invoiceid,
      details,
      total,
      remaining,
   } = invoice;

   const { day, selectedUser, registerUser, toggleModal } = otherValues;

   useEffect(() => {
      const initInput = () => {
         if (installments.length > details.length) {
            const newItem = {
               item: installments[installments.length - 1],
               payment: "",
            };

            setInvoice((prev) => ({
               ...prev,
               details: [...prev.details, newItem],
               remaining:
                  prev.remaining + installments[installments.length - 1].value,
            }));
         }
      };

      if (installments.length > 0) initInput();
   }, [installments, invoiceid, details.length]);

   const selectUser = (user) => {
      setOtherValues({
         ...otherValues,
         selectedUser: user,
      });
   };

   const addUser = (e) => {
      e.preventDefault();
      setOtherValues({
         ...otherValues,
         registerUser: true,
      });

      setInvoice({
         ...invoice,
         user: {
            _id: selectedUser._id,
            lastname: selectedUser.lastname,
            name: selectedUser.name,
            email: selectedUser.email,
         },
      });
      clearSearch();
   };

   const onChange = (e) => {
      setInvoice({
         ...invoice,
         [e.target.name]: e.target.value,
      });
   };

   const onChangeValue = (e, item, index) => {
      let newDetails = [...details];
      newDetails[index] = {
         item,
         payment: e.target.value,
         value: item.value,
      };
      const totalAmount = newDetails.reduce(
         (accum, item) => accum + Number(item.payment),
         0
      );
      const totalRemaining = newDetails.reduce(
         (accum, item) => accum + (item.item.value - Number(item.payment)),
         0
      );
      setInvoice({
         ...invoice,
         details: newDetails,
         total: totalAmount,
         remaining: totalRemaining,
      });
      setOtherValues({ ...otherValues });
   };

   const removeItem = (item) => {
      removeInstallmentFromList(item._id);
      setInvoice({
         ...invoice,
         remaining: remaining - item.value,
         details: details.filter((detail) => detail.item._id !== item._id),
      });
   };

   const setToggle = () => {
      setOtherValues({ ...otherValues, toggleModal: !toggleModal });
   };

   const beforeToggle = () => {
      if (total === 0) {
         setAlert("Debe registrar el pago de una cuota primero", "danger", "2");
         window.scroll(0, 0);
      } else setOtherValues({ ...otherValues, toggleModal: !toggleModal });
   };

   const confirm = () => {
      registerInvoice(
         { ...invoice, invoiceid: invoiceNumber },
         remaining,
         history,
         userLogged._id
      );
   };

   return (
      <div className="invoice-tab">
         <Confirm
            toggleModal={toggleModal}
            setToggleModal={setToggle}
            confirm={confirm}
            text="¿Está seguro que la factura es correcta?"
         />
         <form className="form bigger">
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
            <h3 className="paragraph text-primary ">Usuario a Pagar</h3>
            <div className="mb-2">
               {!registerUser ? (
                  <>
                     <div className="form-group">
                        <div className="two-in-row">
                           <input
                              className="form-input"
                              type="text"
                              onChange={onChange}
                              name="name"
                              value={name}
                              placeholder="Nombre"
                           />
                           <input
                              className="form-input"
                              type="text"
                              onChange={onChange}
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
                     </div>
                     <div className="form-group">
                        <input
                           className="form-input"
                           type="email"
                           name="email"
                           id="email"
                           onChange={onChange}
                           value={email}
                           placeholder="Email"
                        />
                        <label htmlFor="email" className="form-label">
                           Email
                        </label>
                     </div>
                  </>
               ) : (
                  <>
                     <div className="form-group">
                        <div className="end-btn">
                           <input
                              className="form-input"
                              type="text"
                              value={
                                 selectedUser.lastname +
                                 ", " +
                                 selectedUser.name
                              }
                              placeholder="Alumno"
                              disabled
                              id="full-name"
                           />
                           <button
                              onClick={(e) => {
                                 e.preventDefault();
                                 setOtherValues({
                                    ...otherValues,
                                    registerUser: !registerUser,
                                 });
                              }}
                              className="btn-cancel"
                           >
                              <i className="fas fa-times"></i>
                           </button>
                        </div>
                        <label htmlFor="full-name" className="form-label">
                           Nombre Completo
                        </label>
                     </div>
                     <div className="form-group">
                        <input
                           className="form-input"
                           type="email"
                           name="email-user"
                           id="email-user"
                           value={user.email}
                           disabled
                           placeholder="Email"
                        />
                        <label htmlFor="email-user" className="form-label">
                           Email
                        </label>
                     </div>
                  </>
               )}
            </div>
            <StudentSearch
               selectStudent={selectUser}
               selectedStudent={selectedUser}
               actionForSelected={addUser}
               typeSearch="Tutor/Student"
            />
         </form>
         <h3 className="text-primary heading-tertiary">Detalle de Factura</h3>
         <Alert type="5" />
         {details.length > 0 && (
            <div className="wrapper">
               <table>
                  <thead>
                     <tr>
                        <th>Nombre</th>
                        <th>Cuota</th>
                        <th>Importe</th>
                        <th>A Pagar</th>
                        <th>&nbsp;</th>
                     </tr>
                  </thead>
                  <tbody>
                     {details.map((invoice, index) => {
                        const name = "payment" + index;
                        return (
                           <tr key={index}>
                              <td>
                                 {invoice.item.student.lastname +
                                    ", " +
                                    invoice.item.student.name}
                              </td>
                              <td>{installment[invoice.item.number]}</td>
                              <td>{invoice.item.value}</td>
                              <td>
                                 <input
                                    type="number"
                                    onChange={(e) =>
                                       onChangeValue(e, invoice.item, index)
                                    }
                                    placeholder="Monto"
                                    min="0"
                                    max="1800"
                                    name={name}
                                    value={invoice.payment}
                                 />
                              </td>
                              <td>
                                 <button
                                    onClick={(e) => {
                                       e.preventDefault();
                                       removeItem(invoice.item);
                                    }}
                                    className="btn btn-danger"
                                 >
                                    <i className="far fa-trash-alt"></i>
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
                  value={remaining}
                  disabled
                  name="remaining"
               />
            </div>
            <div className="invoice-detail">
               <label htmlFor="total">Total a Pagar</label>
               <input type="number" name="total" value={total} disabled />
            </div>
            <button
               type="submit"
               onClick={beforeToggle}
               className="btn btn-primary mt-3"
            >
               <i className="fas fa-file-invoice-dollar"></i> Pagar
            </button>
         </div>
      </div>
   );
};

InvoiceTab.propTypes = {
   installment: PropTypes.object.isRequired,
   auth: PropTypes.object.isRequired,
   clearSearch: PropTypes.func.isRequired,
   registerInvoice: PropTypes.func.isRequired,
   setAlert: PropTypes.func.isRequired,
   removeInstallmentFromList: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   installment: state.installment,
   auth: state.auth,
   mixvalues: state.mixvalues,
});

export default connect(mapStateToProps, {
   clearSearch,
   setAlert,
   registerInvoice,
   removeInstallmentFromList,
})(withRouter(InvoiceTab));
