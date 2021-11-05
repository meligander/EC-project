import React from "react";
import { ImFilePdf } from "react-icons/im";
import {
   HiOutlineChevronDoubleLeft,
   HiOutlineChevronDoubleRight,
} from "react-icons/hi";

import "./style.scss";

const ListButtons = ({ changePage, items, page, pdfGenerator, type }) => {
   const itemsNumber = page * 10;
   const sub = items.length - itemsNumber;
   return (
      <>
         {items.length > 10 && (
            <div className="btn-list btn-center">
               {page !== 0 && (
                  <button
                     type="button"
                     onClick={(e) => {
                        e.preventDefault();
                        changePage(page - 1);
                     }}
                     className="btn btn-primary"
                  >
                     <HiOutlineChevronDoubleLeft />
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
                     <HiOutlineChevronDoubleRight />
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
                  <ImFilePdf />
               </button>
               <span className="tooltiptext">PDF lista de {type}</span>
            </div>
         </div>
      </>
   );
};

export default ListButtons;
