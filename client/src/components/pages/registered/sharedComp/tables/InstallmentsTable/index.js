import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { FaEdit, FaPlus, FaTrashAlt } from "react-icons/fa";

import { formatNumber } from "../../../../../../actions/mixvalues";

import Alert from "../../../../sharedComp/Alert";
import PopUp from "../../../../../modal/PopUp";

const InstallmentsTable = ({
   location,
   forAdmin,
   installments,
   actionForSelected,
   deleteInstallment,
   togglePopup,
}) => {
   const invoice = location.pathname === "/invoice/register";

   const installment = [
      "Inscripción",
      "Clase Particular",
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

   const [adminValues, setAdminValues] = useState({
      toDelete: "",
   });

   const { toDelete } = adminValues;

   return (
      <>
         <Alert type="4" />
         <PopUp
            confirm={() => deleteInstallment(toDelete)}
            info="¿Está seguro que desea eliminar la cuota?"
         />
         <div className="wrapper">
            <table>
               {forAdmin && (
                  <thead>
                     <tr>
                        <th>Cuota</th>
                        <th>Año</th>
                        <th>Categoría</th>
                        <th>Importe</th>
                        <th className="fit">&nbsp;</th>
                        {!invoice && <th className="fit">&nbsp;</th>}
                     </tr>
                  </thead>
               )}

               <tbody>
                  {installments.map((item, i) => (
                     <React.Fragment key={i}>
                        {(!invoice || (invoice && item.value > 0)) && (
                           <tr>
                              <td>{installment[item.number]}</td>
                              <td>{item.year}</td>
                              <td>
                                 {item.enrollment
                                    ? item.enrollment.category.name
                                    : ""}
                              </td>
                              <td
                                 className={`${item.value === 0 ? "paid" : ""}${
                                    item.value !== 0 &&
                                    item.expired &&
                                    item.number !== 1
                                       ? "debt"
                                       : ""
                                 }`}
                              >
                                 {item.value === 0
                                    ? "Pagado"
                                    : "$" + formatNumber(item.value)}
                              </td>
                              {forAdmin && (
                                 <>
                                    <td>
                                       <button
                                          type="button"
                                          className="btn btn-success"
                                          onClick={() =>
                                             actionForSelected(item)
                                          }
                                       >
                                          {invoice ? <FaPlus /> : <FaEdit />}
                                       </button>
                                    </td>
                                    {!invoice && (
                                       <td>
                                          <button
                                             className="btn btn-danger"
                                             onClick={(e) => {
                                                e.preventDefault();
                                                setAdminValues((prev) => ({
                                                   ...prev,
                                                   toDelete: item._id,
                                                }));
                                                togglePopup("default");
                                             }}
                                          >
                                             <FaTrashAlt />
                                          </button>
                                       </td>
                                    )}
                                 </>
                              )}
                           </tr>
                        )}
                     </React.Fragment>
                  ))}
               </tbody>
            </table>
         </div>
      </>
   );
};

export default withRouter(InstallmentsTable);
