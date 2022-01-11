import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getYear, getMonth } from "date-fns";
import { BiFilterAlt } from "react-icons/bi";

import {
   loadInstallments,
   installmentsPDF,
   getMonthlyDebt,
} from "../../../../../../actions/installment";
import {
   updatePageNumber,
   formatNumber,
} from "../../../../../../actions/mixvalues";
import { clearProfile } from "../../../../../../actions/user";

import ListButtons from "../sharedComp/ListButtons";
import NameField from "../../../sharedComp/NameField";

const InstallmentList = ({
   installments: {
      installments,
      loading,
      otherValues: { estimatedProfit },
   },
   auth: { userLogged },
   mixvalues: { page },
   loadInstallments,
   getMonthlyDebt,
   updatePageNumber,
   clearProfile,
   installmentsPDF,
}) => {
   const date = new Date();
   const thisYear = getYear(date);

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

   const [filterData, setFilterData] = useState({
      number: "",
      year: "",
      name: "",
      lastname: "",
   });

   const [adminValues, setAdminValues] = useState({
      total: 0,
   });

   const { total } = adminValues;

   const { number, year, name, lastname } = filterData;

   useEffect(() => {
      if (loading) {
         loadInstallments({}, true, "list");
         getMonthlyDebt(12);
      } else
         setAdminValues((prev) => ({
            ...prev,
            total: installments.reduce(
               (installment, sum) => sum + installment.value,
               0
            ),
         }));
   }, [installments, loading, loadInstallments, getMonthlyDebt]);

   const onChange = (e) => {
      e.persist();
      setFilterData((prev) => ({
         ...prev,
         [e.target.name]: e.target.value,
      }));
   };

   return (
      <>
         <h2 className="p-1">Lista de Deudas</h2>

         <p className="heading-tertiary text-moved-right">
            Total: ${total !== 0 ? formatNumber(total) : 0}
         </p>
         {getMonth(date) !== 11 &&
            (userLogged.type === "admin" ||
               userLogged.type === "admin&teacher") && (
               <p className="heading-tertiary text-moved-right">
                  Ganancia Estimada por Mes: $
                  {estimatedProfit !== 0 ? formatNumber(estimatedProfit) : 0}
               </p>
            )}

         <form
            className="form"
            onSubmit={(e) => {
               e.preventDefault();
               loadInstallments(filterData, true, "list");
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
            <NameField name={name} lastname={lastname} onChange={onChange} />

            <div className="btn-right my-1">
               <button type="submit" className="btn btn-light">
                  <BiFilterAlt />
                  &nbsp;Buscar
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
                  {!loading &&
                     installments.length > 0 &&
                     installments.map(
                        (installment, i) =>
                           i >= page * 10 &&
                           i < (page + 1) * 10 && (
                              <tr key={installment._id}>
                                 <td>
                                    <Link
                                       to={`/index/dashboard/${installment.student._id}`}
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
                                 <td>{installmentName[installment.number]}</td>
                                 <td>{installment.year}</td>
                                 <td
                                    className={
                                       installment.expired ? "installment" : ""
                                    }
                                 >
                                    {"$" + formatNumber(installment.value)}
                                 </td>
                              </tr>
                           )
                     )}
               </tbody>
            </table>
         </div>
         {!loading && (
            <ListButtons
               page={page}
               type="deudas"
               changePage={updatePageNumber}
               items={installments}
               pdfGenerator={() => installmentsPDF(installments)}
            />
         )}
      </>
   );
};

const mapStatetoProps = (state) => ({
   installments: state.installments,
   mixvalues: state.mixvalues,
   auth: state.auth,
});

export default connect(mapStatetoProps, {
   loadInstallments,
   getMonthlyDebt,
   updatePageNumber,
   installmentsPDF,
   clearProfile,
})(InstallmentList);
