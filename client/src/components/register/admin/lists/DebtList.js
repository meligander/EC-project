import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import moment from "moment";
import PropTypes from "prop-types";
import { loadDebts, debtsPDF } from "../../../../actions/debts";
import { getTotalDebt, updatePageNumber } from "../../../../actions/mixvalues";
import Loading from "../../../modal/Loading";
import ListButtons from "./ListButtons";
import DateFilter from "./DateFilter";
import NameField from "../../../NameField";

const DebtList = ({
   debt: { debts, loadingDebts },
   mixvalues: { totalDebt, page },
   loadDebts,
   getTotalDebt,
   updatePageNumber,
   debtsPDF,
}) => {
   const [filterData, setFilterData] = useState({
      startDate: "",
      endDate: "",
      name: "",
      lastname: "",
   });

   const [installments] = useState([
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
      if (loadingDebts) {
         updatePageNumber(0);
         loadDebts({ startDate: "", endDate: "", name: "", lastname: "" });
         getTotalDebt();
      }
   }, [loadingDebts, loadDebts, getTotalDebt, updatePageNumber]);

   const onChange = (e) => {
      setFilterData({
         ...filterData,
         [e.target.name]: e.target.value,
      });
   };

   const search = (e) => {
      e.preventDefault();
      if (endDate === "") {
         loadDebts({ ...filterData, endDate: date.format("YYYY-MM-DD") });
      } else loadDebts(filterData);
   };

   const pdfGeneratorSave = () => {
      debtsPDF(debts);
   };

   return (
      <>
         {!loadingDebts ? (
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
                        {!loadingDebts &&
                           debts.length > 0 &&
                           debts.map(
                              (debt, i) =>
                                 i >= page * 10 &&
                                 i < (page + 1) * 10 && (
                                    <tr key={debt._id}>
                                       <td>
                                          {debt.student.lastname +
                                             ", " +
                                             debt.student.name}
                                       </td>
                                       <td>{installments[debt.number]}</td>
                                       <td>{debt.year}</td>
                                       <td
                                          className={debt.expired ? "debt" : ""}
                                       >
                                          {"$" + debt.value}
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
                  items={debts}
                  pdfGeneratorSave={pdfGeneratorSave}
               />
            </>
         ) : (
            <Loading />
         )}
      </>
   );
};

DebtList.propTypes = {
   debt: PropTypes.object.isRequired,
   mixvalues: PropTypes.object.isRequired,
   loadDebts: PropTypes.func.isRequired,
   getTotalDebt: PropTypes.func.isRequired,
   updatePageNumber: PropTypes.func.isRequired,
   debtsPDF: PropTypes.func.isRequired,
};

const mapStatetoProps = (state) => ({
   debt: state.debt,
   mixvalues: state.mixvalues,
});

export default connect(mapStatetoProps, {
   loadDebts,
   getTotalDebt,
   updatePageNumber,
   debtsPDF,
})(DebtList);
