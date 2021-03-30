import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";
import PropTypes from "prop-types";

import {
   loadInstallments,
   installmentsPDF,
   getTotalDebt,
   getMonthlyDebt,
} from "../../../../../../actions/installment";
import {
   updatePageNumber,
   formatNumber,
} from "../../../../../../actions/mixvalues";
import { clearProfile } from "../../../../../../actions/user";

import Loading from "../../../../../modal/Loading";
import ListButtons from "../sharedComp/ListButtons";
import NameField from "../../../sharedComp/NameField";

const InstallmentList = ({
   installments: {
      installments,
      loadingInstallments,
      otherValues: { totalDebt, estimatedProfit, monthlyDebt },
   },
   auth: { userLogged },
   mixvalues: { page },
   loadInstallments,
   getTotalDebt,
   getMonthlyDebt,
   updatePageNumber,
   clearProfile,
   installmentsPDF,
}) => {
   const date = moment();
   const thisYear = date.year();

   const [adminValues, setAdminValues] = useState({
      oneLoad: true,
   });

   const { oneLoad } = adminValues;

   const [filterData, setFilterData] = useState({
      number: "",
      year: "",
      name: "",
      lastname: "",
   });

   const installmentName = [
      "Inscripción",
      "",
      "",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
   ];

   const { number, year, name, lastname } = filterData;

   useEffect(() => {
      if (oneLoad) {
         updatePageNumber(0);
         loadInstallments({});
         getTotalDebt();
         getMonthlyDebt(12);
         getMonthlyDebt(date.month() + 1);
         setAdminValues((prev) => ({ ...prev, oneLoad: false }));
      }
   }, [
      oneLoad,
      date,
      loadInstallments,
      getTotalDebt,
      getMonthlyDebt,
      updatePageNumber,
   ]);

   const onChange = (e) => {
      setFilterData({
         ...filterData,
         [e.target.name]: e.target.value,
      });
   };

   return (
      <>
         {!loadingInstallments &&
         totalDebt !== "" &&
         monthlyDebt !== "" &&
         estimatedProfit !== "" ? (
            <>
               <h2 className="p-1">Lista de Deudas</h2>
               <p className="heading-tertiary text-moved-right">
                  Total: {totalDebt !== 0 ? "$" + formatNumber(totalDebt) : "$"}
               </p>
               <p className="heading-tertiary text-moved-right">
                  Deuda del Mes:{" "}
                  {monthlyDebt !== 0 ? "$" + formatNumber(monthlyDebt) : "$"}
               </p>
               {date.month + 1 !== 12 &&
                  (userLogged.type === "admin" ||
                     userLogged.type === "admin&teacher") && (
                     <p className="heading-tertiary text-moved-right">
                        Ganancia Estimada por Mes:{" "}
                        {estimatedProfit !== 0
                           ? "$" + formatNumber(estimatedProfit)
                           : "$"}
                     </p>
                  )}

               <form
                  className="form"
                  onSubmit={(e) => {
                     e.preventDefault();
                     loadInstallments(filterData);
                  }}
               >
                  <div className="form-group">
                     <select
                        className="form-input"
                        id="number"
                        name="number"
                        onChange={onChange}
                        value={number}
                     >
                        <option value="">* Seleccione la cuota</option>
                        {installmentName.map(
                           (name, i) =>
                              name !== "" && (
                                 <option key={i} value={i}>
                                    {name}
                                 </option>
                              )
                        )}
                     </select>
                     <label
                        htmlFor="number"
                        className={`form-label ${number === "" ? "lbl" : ""}`}
                     >
                        Cuota
                     </label>
                  </div>
                  <div className="form-group">
                     <select
                        className="form-input"
                        id="year"
                        name="year"
                        onChange={onChange}
                        value={year}
                     >
                        <option value="">* Seleccione el Año</option>
                        <option value={thisYear - 1}>{thisYear - 1}</option>
                        <option value={thisYear}>{thisYear}</option>
                        <option value={thisYear + 1}>{thisYear + 1}</option>
                     </select>
                     <label
                        htmlFor="year"
                        className={`form-label ${year === "" ? "lbl" : ""}`}
                     >
                        Año
                     </label>
                  </div>
                  <NameField
                     name={name}
                     lastname={lastname}
                     onChange={onChange}
                  />

                  <div className="btn-right my-1">
                     <button type="submit" className="btn btn-light">
                        <i className="fas fa-filter"></i>&nbsp; Buscar
                     </button>
                  </div>
               </form>
               <div className="wrapper">
                  <table className="my-2">
                     <thead>
                        <tr>
                           <th>Nombre</th>
                           <th>Cuota</th>
                           <th>Año</th>
                           <th>Valor</th>
                        </tr>
                     </thead>
                     <tbody>
                        {installments.length > 0 &&
                           installments.map(
                              (installment, i) =>
                                 i >= page * 10 &&
                                 i < (page + 1) * 10 && (
                                    <tr key={installment._id}>
                                       <td>
                                          <Link
                                             to={`/dashboard/${installment.student._id}`}
                                             className="btn-text"
                                             onClick={() => {
                                                window.scroll(0, 0);
                                                clearProfile();
                                             }}
                                          >
                                             {installment.student.lastname +
                                                ", " +
                                                installment.student.name}
                                          </Link>
                                       </td>
                                       <td>
                                          {installmentName[installment.number]}
                                       </td>
                                       <td>{installment.year}</td>
                                       <td
                                          className={
                                             installment.expired
                                                ? "installment"
                                                : ""
                                          }
                                       >
                                          {"$" +
                                             formatNumber(installment.value)}
                                       </td>
                                    </tr>
                                 )
                           )}
                     </tbody>
                  </table>
               </div>
               <ListButtons
                  page={page}
                  type="deudas"
                  changePage={updatePageNumber}
                  items={installments}
                  pdfGenerator={() => installmentsPDF(installments)}
               />
            </>
         ) : (
            <Loading />
         )}
      </>
   );
};

InstallmentList.propTypes = {
   installments: PropTypes.object.isRequired,
   mixvalues: PropTypes.object.isRequired,
   auth: PropTypes.object.isRequired,
   loadInstallments: PropTypes.func.isRequired,
   getTotalDebt: PropTypes.func.isRequired,
   getMonthlyDebt: PropTypes.func.isRequired,
   updatePageNumber: PropTypes.func.isRequired,
   installmentsPDF: PropTypes.func.isRequired,
   clearProfile: PropTypes.func.isRequired,
};

const mapStatetoProps = (state) => ({
   installments: state.installments,
   mixvalues: state.mixvalues,
   auth: state.auth,
});

export default connect(mapStatetoProps, {
   loadInstallments,
   getTotalDebt,
   getMonthlyDebt,
   updatePageNumber,
   installmentsPDF,
   clearProfile,
})(InstallmentList);
