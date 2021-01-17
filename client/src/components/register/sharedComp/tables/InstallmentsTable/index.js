import React from "react";
import { withRouter } from "react-router-dom";
import moment from "moment";
import PropTypes from "prop-types";

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
   const invoice = location.pathname === "/invoice-generation";
   const day = moment();
   const month = day.month() + 1;
   const year = day.year();

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
                              item.year <= year && (
                                 <React.Fragment key={index}>
                                    {item.value === 0 ? (
                                       <td className="paid">PGO</td>
                                    ) : (month < item.number &&
                                         year === item.year) ||
                                      item._id === "" ? (
                                       <td></td>
                                    ) : (
                                       <td
                                          className={item.expired ? "debt" : ""}
                                       >
                                          {item.value}
                                       </td>
                                    )}
                                 </React.Fragment>
                              )
                           ) : (
                              <React.Fragment key={index}>
                                 {item.value === 0 ? (
                                    <td
                                       onDoubleClick={
                                          !invoice
                                             ? () => selectItem(item)
                                             : null
                                       }
                                       className={`paid ${
                                          selectedItem._id === item._id &&
                                          !invoice
                                             ? "selected"
                                             : ""
                                       }`}
                                    >
                                       PGO
                                    </td>
                                 ) : (
                                    <td
                                       onDoubleClick={
                                          !invoice
                                             ? () => selectItem(item)
                                             : () => selectItem(item)
                                       }
                                       className={`${
                                          item.expired ? "debt" : ""
                                       } ${
                                          selectedItem._id === item._id
                                             ? "selected"
                                             : ""
                                       }`}
                                    >
                                       {item.value}
                                    </td>
                                 )}
                              </React.Fragment>
                           )
                        )}
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
         {forAdmin && (
            <div className={`btn-right ${!invoice ? "next-btn" : ""}`}>
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
                        <i className="far fa-edit"></i>
                        <span className="hide-md">&nbsp; Editar</span>
                     </>
                  ) : (
                     <>
                        <i className="fas fa-plus"></i>
                        <span className="hide-md">&nbsp; Agregar</span>
                     </>
                  )}
               </button>
            </div>
         )}
      </>
   );
};

InstallmentsTable.prototypes = {
   forAdmin: PropTypes.bool.isRequired,
   installments: PropTypes.array.isRequired,
   selectedItem: PropTypes.object,
   selectItem: PropTypes.func,
   actionForSelected: PropTypes.func,
};

export default withRouter(InstallmentsTable);
