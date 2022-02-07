import React, { useState } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

import { setAlert } from "../../../../../../actions/alert";
import {
   loadInstallments,
   clearInstallments,
   loadInstallment,
} from "../../../../../../actions/installment";
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
   loadInstallment,
   clearProfile,
   addDetail,
   changeStudent,
   student,
}) => {
   const newInvoice = match.params.user_id === undefined;

   const [adminValues, setAdminValues] = useState({
      selectedItem: {},
   });

   const { selectedItem } = adminValues;

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
                  await loadInstallments({ student }, true, true)
               }
               selectStudent={(user) => {
                  changeStudent({
                     _id: user._id,
                     name: user.lastname + ", " + user.name,
                  });
               }}
               typeSearch="installment"
               block={!loading && installments.student}
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
         {!loading && student._id === installments.student._id && (
            <>
               {installments.rows ? (
                  <InstallmentsTable
                     installments={installments}
                     forAdmin={true}
                     selectedItem={selectedItem}
                     student={student._id}
                     selectItem={(item) =>
                        setAdminValues((prev) => ({
                           ...prev,
                           selectedItem: item._id !== "" ? item : {},
                        }))
                     }
                     actionForSelected={() => {
                        if (newInvoice) {
                           addDetail(selectedItem, invoice && invoice.details);

                           setAdminValues((prev) => ({
                              ...prev,
                              selectedItem: {},
                           }));
                        } else loadInstallment(selectedItem._id, true);
                     }}
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
})(withRouter(InstallmentsSearch));
