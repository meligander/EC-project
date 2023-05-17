import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { BiFilterAlt } from "react-icons/bi";

import {
   loadInstallments,
   installmentsPDF,
} from "../../../../../../actions/installment";
import { getEstimatedProfit } from "../../../../../../actions/installment";
import { formatNumber, loadDiscount } from "../../../../../../actions/global";
import { clearProfile } from "../../../../../../actions/user";

import ListButtons from "../sharedComp/ListButtons";
import NameField from "../../../sharedComp/NameField";

const InstallmentList = ({
   installments: {
      installments,
      loading,
      otherValues: { estimatedProfit },
   },
   global: { discount, loading: loadingDiscount },
   auth: { userLogged },
   loadInstallments,
   loadDiscount,
   getEstimatedProfit,
   clearProfile,
   installmentsPDF,
}) => {
   const thisYear = new Date().getFullYear();
   const installmentName =
      "Inscripción,Clases Particulares,Examen Libre,Marzo,Abril,Mayo,Junio,Julio,Agosto,Septiembre,Octubre,Noviembre,Diciembre".split(
         ","
      );
   const isAdmin = userLogged.type !== "secretary";

   const yearArray = new Array(6)
      .fill()
      .map((item, index) => thisYear + 1 - index);

   const [filterData, setFilterData] = useState({
      number: "",
      year: thisYear,
      name: "",
      lastname: "",
   });

   const [adminValues, setAdminValues] = useState({
      total: 0,
      page: 0,
   });

   const { total, page } = adminValues;

   const { number, year, name, lastname } = filterData;

   useEffect(() => {
      if (loading) loadInstallments({}, true, false, "all");
      else {
         if (isAdmin)
            setAdminValues((prev) => ({
               ...prev,
               total: installments.reduce(
                  (sum, installment) => sum + installment.value,
                  0
               ),
            }));
      }
   }, [installments, loading, loadInstallments, isAdmin]);

   useEffect(() => {
      if (estimatedProfit === "" && isAdmin) getEstimatedProfit();
   }, [estimatedProfit, getEstimatedProfit, isAdmin]);

   useEffect(() => {
      if (loadingDiscount) loadDiscount();
   }, [loadingDiscount, loadDiscount]);

   const onChange = (e) => {
      e.persist();
      setFilterData((prev) => ({
         ...prev,
         [e.target.name]: e.target.value,
      }));
   };

   const installmentNames = () => {
      return installmentName.map((item, index) => (
         <React.Fragment key={index}>
            {item !== "" && <option value={index}>{item}</option>}
         </React.Fragment>
      ));
   };

   return (
      <>
         <h2 className="p-1">Lista de Deudas</h2>

         {isAdmin && (
            <>
               <p className="heading-tertiary text-moved-right">
                  Total: ${formatNumber(total)}
               </p>
               <p className="heading-tertiary text-moved-right">
                  Ganancia Estimada por Mes: ${formatNumber(estimatedProfit)}
               </p>
            </>
         )}

         <form
            className="form"
            onSubmit={(e) => {
               e.preventDefault();
               setAdminValues((prev) => ({ ...prev, page: 0 }));
               loadInstallments(filterData, true, false, "all");
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
                  {installmentNames()}
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
                  {yearArray.map((item) => (
                     <option key={item} value={item}>
                        {item}
                     </option>
                  ))}
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
                     <th>Categoría</th>
                     <th>Valor</th>
                  </tr>
               </thead>
               <tbody>
                  {!loading &&
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
                                 <td>
                                    {installment.enrollment &&
                                       installment.enrollment.category.name}
                                 </td>
                                 <td
                                    className={
                                       installment.status === "expired"
                                          ? "installment"
                                          : ""
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
               changePage={(page) =>
                  setAdminValues((prev) => ({ ...prev, page }))
               }
               items={installments}
               pdfGenerator={() =>
                  installmentsPDF(installments, discount.number)
               }
            />
         )}
      </>
   );
};

const mapStatetoProps = (state) => ({
   installments: state.installments,
   global: state.global,
   auth: state.auth,
});

export default connect(mapStatetoProps, {
   loadInstallments,
   loadDiscount,
   getEstimatedProfit,
   installmentsPDF,
   clearProfile,
})(InstallmentList);
