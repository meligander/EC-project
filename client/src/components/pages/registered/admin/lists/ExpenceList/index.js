import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import format from "date-fns/format";
import { FaTrashAlt } from "react-icons/fa";
import { BiFilterAlt } from "react-icons/bi";

import {
   loadExpences,
   deleteExpence,
   expencesPDF,
} from "../../../../../../actions/expence";
import { clearInvoice } from "../../../../../../actions/invoice";
import { loadRegister } from "../../../../../../actions/register";
import { formatNumber, togglePopup } from "../../../../../../actions/global";

import ListButtons from "../sharedComp/ListButtons";
import DateFilter from "../sharedComp/DateFilter";
import PopUp from "../../../../../modal/PopUp";

import "./style.scss";

const ExpenceList = ({
   auth: { userLogged },
   expences: { expences, loading },
   registers: { register, loadingRegister },
   loadExpences,
   togglePopup,
   loadRegister,
   deleteExpence,
   clearInvoice,
   expencesPDF,
}) => {
   const isAdmin = userLogged.type !== "secretary";

   const [filterData, setFilterData] = useState({
      startDate: `${new Date().getFullYear()}-01-01`,
      endDate: "",
      expencetype: "expence",
   });

   const { startDate, endDate } = filterData;

   const [adminValues, setAdminValues] = useState({
      toDelete: "",
      page: 0,
      total: 0,
   });

   const { toDelete, page, total } = adminValues;

   useEffect(() => {
      if (loadingRegister) loadRegister(false);
   }, [loadingRegister, loadRegister]);

   useEffect(() => {
      if (loading) loadExpences(filterData, true);
      else {
         setAdminValues((prev) => ({
            ...prev,
            total: expences.reduce((sum, item) => sum + item.value, 0),
         }));
      }
      // eslint-disable-next-line
   }, [loading, loadExpences, isAdmin, expences]);

   const onChange = (e) => {
      e.persist();
      setFilterData({
         ...filterData,
         [e.target.name]: e.target.value,
      });
   };

   return (
      <>
         <h2>Listado Egresos</h2>
         <PopUp
            info="¿Está seguro que desea eliminar el movimiento?"
            confirm={() => deleteExpence(toDelete)}
         />
         {isAdmin && total !== 0 && (
            <p className="heading-tertiary text-moved-right">
               Total: ${formatNumber(total)}
            </p>
         )}
         <form
            className="form"
            onSubmit={(e) => {
               e.preventDefault();
               setAdminValues((prev) => ({ ...prev, page: 0 }));
               loadExpences(filterData, true);
            }}
         >
            <DateFilter
               endDate={endDate}
               startDate={startDate}
               onChange={onChange}
            />
            <div className="btn-right mb-1">
               <button type="submit" className="btn btn-light">
                  <BiFilterAlt />
                  &nbsp; Buscar
               </button>
            </div>
         </form>
         <div className="wrapper my-2">
            <table className="expences">
               <thead>
                  <tr>
                     <th>Fecha</th>
                     <th>Tipo</th>
                     <th>Importe</th>
                     <th>Descripción</th>
                     <th>&nbsp;</th>
                  </tr>
               </thead>
               <tbody>
                  {!loading &&
                     !loadingRegister &&
                     expences.map(
                        (expence, i) =>
                           i >= page * 10 &&
                           i < (page + 1) * 10 && (
                              <React.Fragment key={i}>
                                 <tr key={expence._id}>
                                    <td>
                                       {format(
                                          new Date(expence.date),
                                          "dd/MM/yy"
                                       )}
                                    </td>
                                    <td>{expence.expencetype.name}</td>
                                    <td>${formatNumber(expence.value)}</td>
                                    <td>{expence.description}</td>
                                    <td>
                                       {expence.register === register._id &&
                                          register.temporary && (
                                             <button
                                                onClick={(e) => {
                                                   e.preventDefault();
                                                   setAdminValues((prev) => ({
                                                      ...prev,
                                                      toDelete: expence._id,
                                                   }));
                                                   togglePopup("default");
                                                }}
                                                className="btn btn-danger"
                                             >
                                                <FaTrashAlt />
                                             </button>
                                          )}
                                    </td>
                                 </tr>
                              </React.Fragment>
                           )
                     )}
               </tbody>
            </table>
         </div>
         {!loading && (
            <ListButtons
               page={page}
               type="transacciones"
               items={expences}
               changePage={(page) =>
                  setAdminValues((prev) => ({ ...prev, page }))
               }
               pdfGenerator={() => expencesPDF(expences, "list")}
            />
         )}
      </>
   );
};

const mapStatetoProps = (state) => ({
   expences: state.expences,
   registers: state.registers,
   auth: state.auth,
});

export default connect(mapStatetoProps, {
   loadExpences,
   loadRegister,
   deleteExpence,
   clearInvoice,
   togglePopup,
   expencesPDF,
})(ExpenceList);
