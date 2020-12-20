import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import moment from "moment";
import PropTypes from "prop-types";

import { clearInstallment, addInstallment } from "../../../actions/installment";
import { setAlert } from "../../../actions/alert";

import Alert from "../../sharedComp/Alert";

import "./style.scss";

const InstallmentsTable = ({
   location,
   history,
   installment: {
      installments,
      usersInstallments: { years, rows },
   },
   clearInstallment,
   addInstallment,
   setAlert,
   forAdmin,
}) => {
   const day = moment();
   const month = day.month() + 1;
   const year = day.year();
   const invoice = location.pathname === "/invoice-generation";

   const [otherValues, setOtherValues] = useState({
      selectedItem: { _id: 0 },
      student: "",
   });

   const { selectedItem, student } = otherValues;

   useEffect(() => {
      if (rows.length > 0) {
         for (let x = 0; x < rows[0].length; x++) {
            if (rows[0][x].student) {
               setOtherValues((prev) => ({
                  ...prev,
                  student: rows[0][x].student._id,
               }));
               break;
            }
         }
      }
   }, [rows]);

   const seeInstallmentInfo = (installment_id, edit, year, month) => {
      let number = month !== 0 ? month + 2 : month;
      clearInstallment();
      if (edit) history.push(`/edit-installment/${installment_id}`);
      else
         history.push(`/edit-installment/${installment_id}/${year}/${number}`);
   };

   const selectItem = (item) => {
      if (item._id !== "")
         setOtherValues({ ...otherValues, selectedItem: item });
   };

   const addToList = (e) => {
      e.preventDefault();
      if (selectedItem._id === 0) {
         setAlert("No se ha seleccionado ninguna cuota", "danger", "4");
      } else {
         const pass = installments.every(
            (item) => item._id !== selectedItem._id
         );
         if (pass) {
            setAlert("Cuota agregada correctamente", "success", "4");
            addInstallment(selectedItem);
            setOtherValues({ ...otherValues, selectedItem: { _id: 0 } });
         } else {
            setAlert("Ya se ha agregado dicha cuota", "danger", "4");
         }
      }
   };

   return (
      <>
         <Alert type="4" />
         <div className="wrapper">
            <table
               className={`${
                  forAdmin ? "modify installments" : "installments"
               }`}
            >
               <thead>
                  <tr>
                     <th className={`${forAdmin ? "blank" : "inherit"}`}>
                        &nbsp;
                     </th>
                     <th>
                        I<span className="hide-md">nsc</span>
                     </th>
                     <th>
                        M<span className="hide-md">a</span>r
                     </th>
                     <th>
                        A<span className="hide-md">br</span>
                     </th>
                     <th>
                        M<span className="hide-md">a</span>y
                     </th>
                     <th>
                        J<span className="hide-md">u</span>n
                     </th>
                     <th>
                        J<span className="hide-md">u</span>l
                     </th>
                     <th>
                        A<span className="hide-md">gto</span>
                     </th>
                     <th>
                        S<span className="hide-md">ept</span>
                     </th>
                     <th>
                        O<span className="hide-md">ct</span>
                     </th>
                     <th>
                        N<span className="hide-md">ov</span>
                     </th>
                     <th>
                        D<span className="hide-md">ic</span>
                     </th>
                  </tr>
               </thead>
               <tbody>
                  {rows.map((row, i) => (
                     <tr key={i}>
                        {(forAdmin || years[i] <= year) && <th>{years[i]}</th>}

                        {row.map((item, index) =>
                           !forAdmin ? (
                              item.year <= year && (
                                 <React.Fragment key={index}>
                                    {item.value === 0 ? (
                                       <td className="paid">PGO</td>
                                    ) : (month < item.number &&
                                         year === item.year) ||
                                      item._id === "" ? (
                                       <td></td>
                                    ) : (
                                       <td
                                          className={item.expired ? "debt" : ""}
                                       >
                                          {item.value}
                                       </td>
                                    )}
                                 </React.Fragment>
                              )
                           ) : (
                              <React.Fragment key={index}>
                                 {item.value === 0 ? (
                                    <td
                                       onDoubleClick={
                                          !invoice
                                             ? () =>
                                                  seeInstallmentInfo(
                                                     item._id !== ""
                                                        ? item._id
                                                        : student,
                                                     item._id !== "",
                                                     years[i],
                                                     index
                                                  )
                                             : null
                                       }
                                       className="paid"
                                    >
                                       PGO
                                    </td>
                                 ) : (
                                    <td
                                       onDoubleClick={
                                          !invoice
                                             ? () =>
                                                  seeInstallmentInfo(
                                                     item._id !== ""
                                                        ? item._id
                                                        : rows[0][0].student
                                                        ? rows[0][0].student._id
                                                        : rows[0][10].student
                                                             ._id,
                                                     item._id !== "",
                                                     years[i],
                                                     index
                                                  )
                                             : () => selectItem(item)
                                       }
                                       className={`${
                                          item.expired ? "debt" : ""
                                       } ${
                                          selectedItem._id === item._id
                                             ? "selected"
                                             : ""
                                       }`}
                                    >
                                       {item.value}
                                    </td>
                                 )}
                              </React.Fragment>
                           )
                        )}
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
         {invoice && (
            <div className="btn-right">
               <button className="btn btn-light" onClick={addToList}>
                  <i className="fas fa-plus"></i>
                  <span className="hide-md"> Agregar</span>
               </button>
            </div>
         )}
      </>
   );
};

InstallmentsTable.prototypes = {
   installment: PropTypes.object.isRequired,
   forAdmin: PropTypes.bool.isRequired,
   clearInstallment: PropTypes.func.isRequired,
   setAlert: PropTypes.func.isRequired,
   addInstallment: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   installment: state.installment,
});

export default connect(mapStateToProps, {
   clearInstallment,
   addInstallment,
   setAlert,
})(withRouter(InstallmentsTable));
