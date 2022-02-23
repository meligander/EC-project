import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { setAlert } from "../../../../../../actions/alert";
import {
   loadInstallments,
   clearInstallments,
   loadInstallment,
   deleteInstallment,
} from "../../../../../../actions/installment";
import { clearCategories } from "../../../../../../actions/category";
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
   clearCategories,
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
         <div className="form">
            <UsersSearch
               usersType="student"
               selectUser={changeStudent}
               selectedUser={student}
               autoComplete="off"
               primary={true}
               restore={restore}
               button="installments"
               actionForSelected={(e) => {
                  e.preventDefault();
                  loadInstallments(
                     { student },
                     true,
                     true,
                     newInvoice ? "student" : "all"
                  );
               }}
            />
         </div>
         {!loading && student && student._id === installments[0].student._id && (
            <>
               {installments[0] ? (
                  <div className="mt-3">
                     <InstallmentsTable
                        installments={installments}
                        forAdmin={true}
                        student={student._id}
                        deleteInstallment={deleteInstallment}
                        addDetail={
                           newInvoice ? (item) => addDetail(item) : null
                        }
                        clearCategories={clearCategories}
                        loadInstallment={loadInstallment}
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
   clearCategories,
   loadInstallment,
   addDetail,
   deleteInstallment,
   togglePopup,
})(withRouter(InstallmentsSearch));
