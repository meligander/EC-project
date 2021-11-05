import React, { useState /* useEffect */ } from "react";
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

import StudentSearch from "../StudentSearch";
import InstallmentsTable from "../../tables/InstallmentsTable";

import "./style.scss";

const InstallmentsSearch = ({
   history,
   location,
   installments: { loading, installments },
   invoices: { invoice },
   loadInstallments,
   /* changeStudent, */
   clearInstallments,
   loadInstallment,
   clearProfile,
   addDetail,
   /* student, */
}) => {
   const [adminValues, setAdminValues] = useState({
      selectedStudent: {},
      selectedItem: {},
      block: false,
   });

   const { selectedStudent, selectedItem, block } = adminValues;

   /* useEffect(() => {
      if (student) {
         setAdminValues((prev) => ({
            ...prev,
            selectedStudent: {
               _id: student._id,
               name: student.name,
            },
            block: true,
         }));
      }
   }, [student]); */

   const newInvoice = location.pathname === "/invoice-generation";

   const restore = () => {
      setAdminValues((prev) => ({
         ...prev,
         block: false,
         selectedStudent: {},
      }));
      clearInstallments();
      if (!newInvoice) history.push("/installments/0");
   };

   return (
      <div className="installment-search">
         <div className="form">
            <StudentSearch
               selectedStudent={selectedStudent}
               actionForSelected={async () => {
                  const answer = await loadInstallments(
                     selectedStudent,
                     "student"
                  );
                  if (answer)
                     setAdminValues((prev) => ({
                        ...prev,
                        block: true,
                     }));
               }}
               selectStudent={(user) => {
                  setAdminValues((prev) => ({
                     ...prev,
                     selectedStudent: {
                        _id: user._id,
                        name: user.lastname + ", " + user.name,
                     },
                  }));
                  /* if (changeStudent) changeStudent(student); */
               }}
               typeSearch={"installment"}
               block={block}
            />
         </div>
         <div className="btn-end">
            <p className="heading-tertiary">
               <span className="text-dark">Alumno: </span> &nbsp;
               <Link
                  to={`/dashboard/${selectedStudent._id}`}
                  className="btn-text"
                  onClick={() => {
                     clearProfile();
                     window.scroll(0, 0);
                  }}
               >
                  {selectedStudent.name}
               </Link>
            </p>
            {selectedStudent._id && (
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
            )}
         </div>
         {!loading && (
            <>
               {installments.rows.length > 0 ? (
                  <InstallmentsTable
                     installments={installments}
                     forAdmin={true}
                     selectedItem={selectedItem}
                     student={selectedStudent._id}
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
