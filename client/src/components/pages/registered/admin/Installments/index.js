import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { FaDollarSign, FaPlus } from "react-icons/fa";
import { IoIosListBox } from "react-icons/io";

import {
   clearInstallments,
   clearInstallment,
   loadInstallments,
} from "../../../../../actions/installment";
import { loadPenalty, updatePenalty } from "../../../../../actions/global";
import { clearUser } from "../../../../../actions/user";
import { togglePopup } from "../../../../../actions/global";
import { clearEnrollments } from "../../../../../actions/enrollment";

import InstallmentsSearch from "../../sharedComp/search/InstallmentsSearch";
import PopUp from "../../../../modal/PopUp";

const Installments = ({
   match,
   global: { loading: loadingPenalty, penalty },
   installments: { loading, installments },
   auth: { userLogged },
   clearInstallments,
   clearInstallment,
   clearUser,
   clearEnrollments,
   updatePenalty,
   loadPenalty,
   loadInstallments,
   togglePopup,
}) => {
   const _id = match.params.user_id;
   const isAdmin =
      userLogged.type === "admin" || userLogged.type === "admin&teacher";

   const [adminValues, setAdminValues] = useState({
      student: null,
   });
   const { student } = adminValues;

   useEffect(() => {
      if (loadingPenalty) loadPenalty();
   }, [loadingPenalty, loadPenalty]);

   useEffect(() => {
      if (_id !== "0") {
         if (loading) loadInstallments({ student: { _id } }, true, true, "all");
         else if (installments.length > 0)
            setAdminValues((prev) => ({
               ...prev,
               student: installments[0].student,
            }));
      }
   }, [_id, loading, loadInstallments, installments]);

   const changeStudent = (student) => {
      setAdminValues((prev) => ({
         ...prev,
         student,
      }));
   };

   return (
      <>
         <div>
            <h1>Cuotas</h1>
            {!loadingPenalty && (
               <PopUp
                  confirm={(number) => updatePenalty({ number })}
                  info={{ penalty }}
                  error
               />
            )}

            <div className="btn-right my-3">
               {isAdmin && (
                  <button
                     className="btn btn-secondary"
                     type="button"
                     disabled={loadingPenalty}
                     onClick={(e) => {
                        e.preventDefault();
                        togglePopup("penalty");
                     }}
                  >
                     <FaDollarSign />
                     &nbsp;Recargo
                  </button>
               )}
               <Link
                  to="/index/installment/list"
                  onClick={() => {
                     window.scroll(0, 0);
                     clearInstallments();
                  }}
                  className="btn btn-light"
               >
                  <IoIosListBox />
                  &nbsp; <span className="hide-sm">Listado</span>&nbsp;Deudas
               </Link>
            </div>
            <InstallmentsSearch
               student={student}
               changeStudent={changeStudent}
            />
            <div className="btn-right">
               <Link
                  className={`btn ${
                     !loading && student ? "btn-primary" : "btn-black"
                  }`}
                  to={
                     !loading && student
                        ? `/index/installment/new/${student._id}`
                        : "#"
                  }
                  onClick={() => {
                     if (!loading) {
                        window.scroll(0, 0);
                        clearInstallment();
                        clearEnrollments();
                        clearUser();
                     }
                  }}
               >
                  <FaPlus />
                  <span className="hide-md">&nbsp;Agregar cuota</span>
               </Link>
            </div>
         </div>
      </>
   );
};

const mapStateToProps = (state) => ({
   installments: state.installments,
   global: state.global,
   auth: state.auth,
});

export default connect(mapStateToProps, {
   clearInstallments,
   clearInstallment,
   loadPenalty,
   clearUser,
   clearEnrollments,
   updatePenalty,
   loadInstallments,
   togglePopup,
})(Installments);
