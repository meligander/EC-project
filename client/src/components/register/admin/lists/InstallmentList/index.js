import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";
import PropTypes from "prop-types";

import {
   loadInstallments,
   installmentsPDF,
   getTotalDebt,
} from "../../../../../actions/installment";
import { updatePageNumber } from "../../../../../actions/mixvalues";
import { clearProfile } from "../../../../../actions/user";

import Loading from "../../../../modal/Loading";
import ListButtons from "../sharedComp/ListButtons";
import NameField from "../../../../sharedComp/NameField";

const InstallmentList = ({
   installments: { installments, loadingInstallments },
   mixvalues: { totalDebt, page },
   loadInstallments,
   getTotalDebt,
   updatePageNumber,
   clearProfile,
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

   const { startDate, endDate, name, lastname } = filterData;

   useEffect(() => {
      if (loadingInstallments) {
         updatePageNumber(0);
         loadInstallments({});
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
      loadInstallments({
         ...filterData,
         ...(endDate === "" && { endDate: date.format("YYYY-MM") }),
      });
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
                  <div className="date-filter">
                     <div>
                        <input
                           className="form-input"
                           type="month"
                           name="startDate"
                           value={startDate}
                           id="startDate"
                           onChange={onChange}
                        />
                        <label htmlFor="startDate" className="form-label-show">
                           Ingrese desde que fecha desea ver
                        </label>
                     </div>
                     <div>
                        <input
                           className="form-input"
                           type="month"
                           name="endDate"
                           value={endDate}
                           max={date.format("YYYY-MM")}
                           onChange={onChange}
                        />
                        <label htmlFor="endDate" className="form-label-show">
                           Ingrese hasta que fecha desea ver
                        </label>
                     </div>
                  </div>
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
               <div className="wrapper list">
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
   installments: PropTypes.object.isRequired,
   mixvalues: PropTypes.object.isRequired,
   loadInstallments: PropTypes.func.isRequired,
   getTotalDebt: PropTypes.func.isRequired,
   updatePageNumber: PropTypes.func.isRequired,
   installmentsPDF: PropTypes.func.isRequired,
   clearProfile: PropTypes.func.isRequired,
};

const mapStatetoProps = (state) => ({
   installments: state.installments,
   mixvalues: state.mixvalues,
});

export default connect(mapStatetoProps, {
   loadInstallments,
   getTotalDebt,
   updatePageNumber,
   installmentsPDF,
   clearProfile,
})(InstallmentList);
