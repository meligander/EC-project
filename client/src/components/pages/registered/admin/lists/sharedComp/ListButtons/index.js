import React from "react";
import PropTypes from "prop-types";

import "./style.scss";

const ListButtons = ({ changePage, items, page, pdfGenerator, type }) => {
   const itemsNumber = page * 10;
   const sub = items.length - itemsNumber;
   return (
      <>
         {items.length > 10 && (
            <div className="btn-list btn-ctr">
               {page !== 0 && (
                  <button
                     type="button"
                     onClick={(e) => {
                        e.preventDefault();
                        changePage(page - 1);
                     }}
                     className="btn btn-primary"
                  >
                     <i className="fas fa-angle-double-left"></i>
                  </button>
               )}

               {sub >= 10 && (
                  <button
                     type="button"
                     onClick={(e) => {
                        e.preventDefault();
                        changePage(page + 1);
                     }}
                     className="btn btn-primary"
                  >
                     <i className="fas fa-angle-double-right"></i>
                  </button>
               )}
            </div>
         )}

         <div className="btn-right">
            <div className="tooltip">
               <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={(e) => {
                     e.preventDefault();
                     pdfGenerator();
                  }}
               >
                  <i className="fas fa-file-pdf"></i>
               </button>
               <span className="tooltiptext">PDF lista de {type}</span>
            </div>
         </div>
      </>
   );
};

ListButtons.propTypes = {
   page: PropTypes.number.isRequired,
   items: PropTypes.array.isRequired,
   changePage: PropTypes.func.isRequired,
   pdfGenerator: PropTypes.func.isRequired,
   type: PropTypes.string.isRequired,
};

export default ListButtons;
