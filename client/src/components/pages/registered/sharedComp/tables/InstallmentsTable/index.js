import React from "react";
import { withRouter } from "react-router-dom";
import { getMonth, getYear } from "date-fns";
import { FaEdit, FaPlus } from "react-icons/fa";

import { formatNumber } from "../../../../../../actions/mixvalues";

import Alert from "../../../../sharedComp/Alert";

import "./style.scss";

const InstallmentsTable = ({
   location,
   forAdmin,
   installments,
   selectedItem,
   selectItem,
   actionForSelected,
}) => {
   const invoice = location.pathname === "/invoice/register";
   const day = new Date();
   const month = getMonth(day) + 1;
   const year = getYear(day);

   return (
      <>
         <Alert type="4" />
         <div className="wrapper">
            <table
               className={`${
                  forAdmin ? "modify installments" : "installments"
               }`}
            >
               <thead>
                  <tr>
                     <th className={`${forAdmin ? "blank" : "inherit"}`}>
                        &nbsp;
                     </th>
                     <th>
                        I<span className="hide-md">nsc</span>
                     </th>
                     <th>
                        M<span className="hide-md">a</span>r
                     </th>
                     <th>
                        A<span className="hide-md">br</span>
                     </th>
                     <th>
                        M<span className="hide-md">a</span>y
                     </th>
                     <th>
                        J<span className="hide-md">u</span>n
                     </th>
                     <th>
                        J<span className="hide-md">u</span>l
                     </th>
                     <th>
                        A<span className="hide-md">gto</span>
                     </th>
                     <th>
                        S<span className="hide-md">ept</span>
                     </th>
                     <th>
                        O<span className="hide-md">ct</span>
                     </th>
                     <th>
                        N<span className="hide-md">ov</span>
                     </th>
                     <th>
                        D<span className="hide-md">ic</span>
                     </th>
                  </tr>
               </thead>
               <tbody>
                  {installments.rows.map((row, i) => (
                     <tr key={i}>
                        {(forAdmin || installments.years[i] <= year) && (
                           <th>{installments.years[i]}</th>
                        )}

                        {row.map((item, index) =>
                           !forAdmin ? (
                              year >= item.year && (
                                 <td
                                    key={index}
                                    className={
                                       item.value === 0
                                          ? "paid"
                                          : item.expired
                                          ? "debt"
                                          : ""
                                    }
                                 >
                                    {item.value === 0
                                       ? "PGO"
                                       : ((year === item.year &&
                                            month >= item.number) ||
                                            year > item.year) &&
                                         item.value}
                                 </td>
                              )
                           ) : (
                              <td
                                 key={index}
                                 onDoubleClick={() => {
                                    if (invoice) {
                                       if (item.value !== 0) selectItem(item);
                                    } else selectItem(item);
                                 }}
                                 className={`${
                                    item.value === 0
                                       ? "paid "
                                       : item.expired
                                       ? "debt "
                                       : ""
                                 }
                               ${
                                  selectedItem._id === item._id &&
                                  (!invoice || (invoice && item.value > 0))
                                     ? "selected"
                                     : ""
                               }`}
                              >
                                 {item.value === 0
                                    ? "PGO"
                                    : item.value
                                    ? "$" + formatNumber(item.value)
                                    : ""}
                              </td>
                           )
                        )}
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
         {forAdmin && (
            <div className={`btn-center ${!invoice ? "move-down" : ""}`}>
               <button
                  type="button"
                  className={`btn ${
                     !invoice ? "btn-mix-secondary" : "btn-dark"
                  } `}
                  onClick={(e) => {
                     e.preventDefault();
                     actionForSelected();
                  }}
               >
                  {!invoice ? (
                     <>
                        <FaEdit />
                        <span className="hide-md">&nbsp;Editar</span>
                     </>
                  ) : (
                     <>
                        <FaPlus />
                        <span className="hide-md">&nbsp;Agregar</span>
                     </>
                  )}
               </button>
            </div>
         )}
      </>
   );
};

export default withRouter(InstallmentsTable);
