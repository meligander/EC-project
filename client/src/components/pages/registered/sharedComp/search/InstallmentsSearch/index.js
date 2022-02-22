import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { FaMoneyCheckAlt } from "react-icons/fa";

import { setAlert } from "../../../../../../actions/alert";
import {
   loadInstallments,
   clearInstallments,
   loadInstallment,
   deleteInstallment,
} from "../../../../../../actions/installment";
import { clearEnrollments } from "../../../../../../actions/enrollment";
import { togglePopup } from "../../../../../../actions/mixvalues";
import { addDetail } from "../../../../../../actions/invoice";

import InstallmentsTable from "../../tables/InstallmentsTable";
import UsersSearch from "../UsersSearch";

import "./style.scss";

const InstallmentsSearch = ({
   match,
   history,
   installments: { loading, installments },
   loadInstallments,
   clearInstallments,
   clearEnrollments,
   deleteInstallment,
   loadInstallment,
   togglePopup,
   addDetail,
   changeStudent,
   student,
}) => {
   const newInvoice = match.params.user_id === undefined;

   const restore = () => {
      changeStudent(null);
      clearInstallments();
      if (!newInvoice) history.push("/index/installments/0");
   };

   return (
      <div className="installment-search">
         <form className="form">
            <h3 className="text-dark">Búsqueda de Alumnos</h3>
            <UsersSearch
               usersType="student"
               selectUser={changeStudent}
               selectedUser={student}
               autoComplete="off"
               primary={true}
               restore={restore}
            />
            <div className="btn-right mt-2">
               <button
                  type="button"
                  className={`btn ${student ? "btn-dark" : ""}`}
                  onClick={(e) => {
                     e.preventDefault();
                     loadInstallments({ student }, true, true, "all");
                  }}
               >
                  <FaMoneyCheckAlt />
                  <span className="hide-md">&nbsp; Ver Cuotas</span>
               </button>
            </div>
         </form>
         {!loading && student && student._id === installments[0].student._id && (
            <>
               {installments[0] ? (
                  <div className="mt-3">
                     <InstallmentsTable
                        installments={installments}
                        forAdmin={true}
                        student={student._id}
                        deleteInstallment={deleteInstallment}
                        actionForSelected={(item) => {
                           if (newInvoice) addDetail(item);
                           else {
                              loadInstallment(item._id, true);
                              clearEnrollments();
                           }
                        }}
                        togglePopup={togglePopup}
                     />
                  </div>
               ) : (
                  <p className="heading-tertiary text-center my-4">
                     El alumno no tiene deudas hasta el momento
                  </p>
               )}
            </>
         )}
      </div>
   );
};

const mapStateToProps = (state) => ({
   installments: state.installments,
});

export default connect(mapStateToProps, {
   loadInstallments,
   setAlert,
   clearInstallments,
   clearEnrollments,
   loadInstallment,
   addDetail,
   deleteInstallment,
   togglePopup,
})(withRouter(InstallmentsSearch));
