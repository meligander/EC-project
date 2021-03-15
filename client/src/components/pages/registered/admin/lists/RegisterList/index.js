import React, { useEffect, useState } from "react";
import Moment from "react-moment";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import {
   updatePageNumber,
   updatePreviousPage,
} from "../../../../../../actions/mixvalues";
import {
   loadRegisters,
   deleteRegister,
   registerPDF,
   clearRegisters,
} from "../../../../../../actions/register";

import ListButtons from "../sharedComp/ListButtons";
import DateFilter from "../sharedComp/DateFilter";
import Loading from "../../../../../modal/Loading";
import PopUp from "../../../../../modal/PopUp";

const RegisterList = ({
   auth: { userLogged },
   registers: { registers, loadingRegisters },
   mixvalues: { page },
   loadRegisters,
   updatePageNumber,
   updatePreviousPage,
   deleteRegister,
   clearRegisters,
   registerPDF,
}) => {
   const isAdmin =
      userLogged.type === "admin" || userLogged.type === "admin&teacher";

   const [filterData, setFilterData] = useState({
      startDate: "",
      endDate: "",
   });

   const { startDate, endDate } = filterData;

   const [toggleModal, setToggleModal] = useState(false);

   useEffect(() => {
      if (loadingRegisters) {
         updatePageNumber(0);
         loadRegisters({ startDate: "", endDate: "" });
      }
   }, [loadingRegisters, loadRegisters, updatePageNumber]);

   const onChange = (e) => {
      setFilterData({
         ...filterData,
         [e.target.name]: e.target.value,
      });
   };

   const setToggle = () => {
      setToggleModal(!toggleModal);
   };

   return (
      <>
         {!loadingRegisters ? (
            <>
               <PopUp
                  toggleModal={toggleModal}
                  confirm={() => deleteRegister(registers[0]._id)}
                  text="¿Está seguro que desea eliminar el cierre de caja?"
                  setToggleModal={setToggle}
               />
               <h2>Caja Diaria</h2>
               {isAdmin && (
                  <div className="btn-right my-3">
                     <Link
                        to="/monthlyregister-list"
                        onClick={() => {
                           window.scroll(0, 0);
                           clearRegisters();
                           updatePreviousPage("register");
                        }}
                        className="btn btn-light"
                     >
                        <i className="fas fa-list-ul"></i>&nbsp;{" "}
                        <span className="hide-sm">Listado</span> Mensual
                     </Link>
                  </div>
               )}

               <form
                  className="form"
                  onSubmit={(e) => {
                     e.preventDefault();
                     loadRegisters(filterData);
                  }}
               >
                  <DateFilter
                     endDate={endDate}
                     startDate={startDate}
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
                           <th>Fecha</th>
                           <th>Ingresos</th>
                           <th>Egresos</th>
                           <th>Otros Ing.</th>
                           <th>Retiro</th>
                           <th>Plata Caja</th>
                           <th>Diferencia</th>
                           <th>Detalles</th>
                           {isAdmin && !registers[0].temporary && (
                              <th>&nbsp;</th>
                           )}
                        </tr>
                     </thead>
                     <tbody>
                        {!loadingRegisters &&
                           registers.length > 0 &&
                           registers.map(
                              (register, i) =>
                                 i >= page * 10 &&
                                 i < (page + 1) * 10 &&
                                 !register.temporary && (
                                    <tr key={i}>
                                       <td>
                                          <Moment
                                             date={register.date}
                                             format="DD/MM/YY"
                                          />
                                       </td>
                                       <td>
                                          {register.income &&
                                             "$" + register.income}
                                       </td>
                                       <td>
                                          {register.expence &&
                                             "$" + register.expence}
                                       </td>
                                       <td>
                                          {register.cheatincome &&
                                             "$" + register.cheatincome}
                                       </td>
                                       <td>
                                          {register.withdrawal &&
                                             "$" + register.withdrawal}
                                       </td>
                                       <td>${register.registermoney}</td>
                                       <td
                                          className={
                                             register.negative ? "debt" : ""
                                          }
                                       >
                                          {register.difference !== 0 &&
                                             register.difference &&
                                             (register.negative
                                                ? "-$" + register.difference
                                                : "+$" + register.difference)}
                                       </td>
                                       <td>
                                          {register.description &&
                                             register.description}
                                       </td>
                                       {!registers[0].temporary && (
                                          <td>
                                             {isAdmin && i === 0 && (
                                                <button
                                                   type="button"
                                                   className="btn btn-danger"
                                                   onClick={(e) => {
                                                      e.preventDefault();
                                                      setToggle();
                                                   }}
                                                >
                                                   <i className="far fa-trash-alt"></i>
                                                </button>
                                             )}
                                          </td>
                                       )}
                                    </tr>
                                 )
                           )}
                     </tbody>
                  </table>
               </div>
               <ListButtons
                  items={registers}
                  type="cajas diarias"
                  page={page}
                  changePage={updatePageNumber}
                  pdfGenerator={() => registerPDF(registers)}
               />
            </>
         ) : (
            <Loading />
         )}
      </>
   );
};

RegisterList.propTypes = {
   auth: PropTypes.object.isRequired,
   registers: PropTypes.object.isRequired,
   mixvalues: PropTypes.object.isRequired,
   loadRegisters: PropTypes.func.isRequired,
   updatePageNumber: PropTypes.func.isRequired,
   updatePreviousPage: PropTypes.func.isRequired,
   deleteRegister: PropTypes.func.isRequired,
   clearRegisters: PropTypes.func.isRequired,
   registerPDF: PropTypes.func.isRequired,
};

const mapStatetoProps = (state) => ({
   auth: state.auth,
   registers: state.registers,
   mixvalues: state.mixvalues,
});

export default connect(mapStatetoProps, {
   loadRegisters,
   updatePageNumber,
   updatePreviousPage,
   deleteRegister,
   clearRegisters,
   registerPDF,
})(RegisterList);
