import React from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

import { setAlert } from "../../../../../../actions/alert";
import {
   loadInstallments,
   clearInstallments,
   loadInstallment,
   deleteInstallment,
} from "../../../../../../actions/installment";
import { togglePopup } from "../../../../../../actions/mixvalues";
import { addDetail } from "../../../../../../actions/invoice";
import { clearProfile, clearUser } from "../../../../../../actions/user";

import UserSearch from "../UserSearch";
import InstallmentsTable from "../../tables/InstallmentsTable";

import "./style.scss";

const InstallmentsSearch = ({
   match,
   history,
   installments: { loading, installments },
   invoices: { invoice },
   loadInstallments,
   clearInstallments,
   deleteInstallment,
   loadInstallment,
   togglePopup,
   clearProfile,
   addDetail,
   changeStudent,
   student,
}) => {
   const newInvoice = match.params.user_id === undefined;

   const restore = () => {
      changeStudent({});
      clearInstallments();
      if (!newInvoice) history.push("/index/installments/0");
   };

   return (
      <div className="installment-search">
         <div className="form">
            <UserSearch
               selectedStudent={student}
               actionForSelected={async () =>
                  await loadInstallments({ student }, true, true, "all")
               }
               selectStudent={(user) => {
                  changeStudent({
                     _id: user._id,
                     name: user.lastname + ", " + user.name,
                  });
               }}
               typeSearch="installment"
               block={!loading}
               newInvoice={newInvoice}
            />
         </div>
         <div className="btn-end">
            {student._id && !loading && (
               <>
                  <p className="heading-tertiary">
                     <span className="text-dark">Alumno: </span> &nbsp;
                     <Link
                        to={`/index/dashboard/${student._id}`}
                        className="btn-text"
                        onClick={() => {
                           clearProfile();
                           window.scroll(0, 0);
                        }}
                     >
                        {student.name}
                     </Link>
                  </p>
                  <button
                     className="btn-cancel"
                     type="button"
                     onClick={(e) => {
                        e.preventDefault();
                        restore();
                     }}
                  >
                     <FaTimes />
                  </button>
               </>
            )}
         </div>
         {!loading && (
            <>
               {student._id &&
               installments[0] &&
               student._id === installments[0].student._id ? (
                  <InstallmentsTable
                     installments={installments}
                     forAdmin={true}
                     student={student._id}
                     deleteInstallment={deleteInstallment}
                     actionForSelected={(item) => {
                        if (newInvoice) addDetail(item);
                        else loadInstallment(item._id, true);
                     }}
                     togglePopup={togglePopup}
                  />
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
   invoices: state.invoices,
});

export default connect(mapStateToProps, {
   loadInstallments,
   setAlert,
   clearInstallments,
   loadInstallment,
   clearProfile,
   clearUser,
   addDetail,
   deleteInstallment,
   togglePopup,
})(withRouter(InstallmentsSearch));
