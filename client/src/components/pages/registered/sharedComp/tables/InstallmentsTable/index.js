import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaPlus, FaTrashAlt } from "react-icons/fa";

import { formatNumber } from "../../../../../../actions/global";

import Alert from "../../../../sharedComp/Alert";
import PopUp from "../../../../../modal/PopUp";

const InstallmentsTable = ({
   forAdmin,
   installments,
   addDetail,
   deleteInstallment,
   clearCategories,
   clearEnrollments,
   loadInstallment,
   togglePopup,
   dash,
}) => {
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
         <Alert type="3" />
         {!addDetail && !dash && (
            <PopUp
               confirm={() => deleteInstallment(toDelete)}
               info="¿Está seguro que desea eliminar la cuota?"
            />
         )}

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
                        {!addDetail && <th className="fit">&nbsp;</th>}
                     </tr>
                  </thead>
               )}

               <tbody>
                  {installments.map((item, i) => (
                     <React.Fragment key={i}>
                        {
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
                                       {addDetail ? (
                                          <button
                                             type="button"
                                             className="btn btn-success"
                                             onClick={() => addDetail(item)}
                                          >
                                             <FaPlus />
                                          </button>
                                       ) : (
                                          <Link
                                             to={`/index/installment/edit/${item._id}`}
                                             className="btn btn-success"
                                             onClick={() => {
                                                window.scroll(0, 0);
                                                clearCategories();
                                                clearEnrollments();
                                                loadInstallment(item._id, true);
                                             }}
                                          >
                                             <FaEdit />
                                          </Link>
                                       )}
                                    </td>
                                    {!addDetail && (
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
                        }
                     </React.Fragment>
                  ))}
               </tbody>
            </table>
         </div>
      </>
   );
};

export default InstallmentsTable;
