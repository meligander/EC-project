import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import moment from "moment";
import PropTypes from "prop-types";

import {
   loadInstallments,
   installmentsPDF,
} from "../../../../../actions/installment";
import {
   getTotalDebt,
   updatePageNumber,
} from "../../../../../actions/mixvalues";

import Loading from "../../../../modal/Loading";
import ListButtons from "../sharedComp/DateFilter";
import DateFilter from "../sharedComp/DateFilter";
import NameField from "../../../../sharedComp/NameField";

const InstallmentList = ({
   installment: { installments, loadingInstallments },
   mixvalues: { totalDebt, page },
   loadInstallments,
   getTotalDebt,
   updatePageNumber,
   installmentsPDF,
}) => {
   const [filterData, setFilterData] = useState({
      startDate: "",
      endDate: "",
      name: "",
      lastname: "",
   });

   const [installmentName] = useState([
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
   ]);

   const date = moment();
   const daysOfMonth = date.daysInMonth();
   date.set("date", daysOfMonth);

   const { startDate, endDate, name, lastname } = filterData;

   useEffect(() => {
      if (loadingInstallments) {
         updatePageNumber(0);
         loadInstallments({
            startDate: "",
            endDate: "",
            name: "",
            lastname: "",
         });
         getTotalDebt();
      }
   }, [loadingInstallments, loadInstallments, getTotalDebt, updatePageNumber]);

   const onChange = (e) => {
      setFilterData({
         ...filterData,
         [e.target.name]: e.target.value,
      });
   };

   const search = (e) => {
      e.preventDefault();
      if (endDate === "") {
         loadInstallments({
            ...filterData,
            endDate: date.format("YYYY-MM-DD"),
         });
      } else loadInstallments(filterData);
   };

   const pdfGeneratorSave = () => {
      installmentsPDF(installments);
   };

   return (
      <>
         {!loadingInstallments ? (
            <>
               <h2 className="p-1">Lista de Deudas</h2>
               <p className="heading-tertiary text-moved-right">
                  Total: {totalDebt !== "" ? "$" + totalDebt : "$"}
               </p>

               <form className="form">
                  <DateFilter
                     endDate={endDate}
                     startDate={startDate}
                     onChange={onChange}
                     max={date.format("YYYY-MM")}
                  />
                  <NameField
                     name={name}
                     lastname={lastname}
                     onChange={onChange}
                  />

                  <div className="btn-right my-1">
                     <button onClick={search} className="btn btn-light">
                        <i className="fas fa-filter"></i> Buscar
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
                        {!loadingInstallments &&
                           installments.length > 0 &&
                           installments.map(
                              (installment, i) =>
                                 i >= page * 10 &&
                                 i < (page + 1) * 10 && (
                                    <tr key={installment._id}>
                                       <td>
                                          {installment.student.lastname +
                                             ", " +
                                             installment.student.name}
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
                                          {"$" + installment.value}
                                       </td>
                                    </tr>
                                 )
                           )}
                     </tbody>
                  </table>
               </div>
               <ListButtons
                  page={page}
                  changePage={updatePageNumber}
                  items={installments}
                  pdfGeneratorSave={pdfGeneratorSave}
               />
            </>
         ) : (
            <Loading />
         )}
      </>
   );
};

InstallmentList.propTypes = {
   installment: PropTypes.object.isRequired,
   mixvalues: PropTypes.object.isRequired,
   loadInstallments: PropTypes.func.isRequired,
   getTotalDebt: PropTypes.func.isRequired,
   updatePageNumber: PropTypes.func.isRequired,
   installmentsPDF: PropTypes.func.isRequired,
};

const mapStatetoProps = (state) => ({
   installment: state.installment,
   mixvalues: state.mixvalues,
});

export default connect(mapStatetoProps, {
   loadInstallments,
   getTotalDebt,
   updatePageNumber,
   installmentsPDF,
})(InstallmentList);
