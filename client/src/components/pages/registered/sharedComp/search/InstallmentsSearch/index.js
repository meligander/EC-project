import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import PropTypes from "prop-types";

import { setAlert } from "../../../../../../actions/alert";
import {
   loadStudentInstallments,
   clearUserInstallments,
   clearInstallment,
   addInstallment,
} from "../../../../../../actions/installment";
import { clearSearch, clearProfile } from "../../../../../../actions/user";

import StudentSearch from "../StudentSearch";
import InstallmentsTable from "../../tables/InstallmentsTable";

import "./style.scss";

const InstallmentsSearch = ({
   history,
   location,
   installments: { usersInstallments, loadingUsersInstallments, installments },
   loadStudentInstallments,
   changeStudent,
   clearUserInstallments,
   clearInstallment,
   clearSearch,
   clearProfile,
   addInstallment,
   student,
   setAlert,
}) => {
   const [otherValues, setOtherValues] = useState({
      selectedStudent: {
         _id: "",
         name: "",
      },
      selectedItem: { _id: 0 },
      block: false,
   });

   const { selectedStudent, selectedItem, block } = otherValues;

   useEffect(() => {
      if (student) {
         setOtherValues((prev) => ({
            ...prev,
            selectedStudent: {
               _id: student._id,
               name: student.name,
            },
            block: true,
         }));
      }
   }, [student]);

   const invoice = location.pathname === "/invoice-generation";

   const selectStudent = (user) => {
      const student = {
         _id: user._id,
         name: user.lastname + ", " + user.name,
      };
      setOtherValues({
         ...otherValues,
         selectedStudent: student,
      });
      changeStudent(student);
   };

   const selectItem = (item) => {
      if (item._id !== "")
         setOtherValues({
            ...otherValues,
            selectedItem: item,
         });
      else
         setOtherValues({
            ...otherValues,
            selectedItem: { _id: 0 },
            year: "",
            month: "",
         });
   };

   const searchInstallments = () => {
      if (!selectedStudent._id)
         setAlert("Debe seleccionar un usuario primero", "danger", "3");
      else {
         loadStudentInstallments(selectedStudent._id, true);
         clearSearch();
         setOtherValues({
            ...otherValues,
            block: true,
         });
      }
   };

   const restore = () => {
      setOtherValues({
         ...otherValues,
         block: false,
         selectedStudent: {
            _id: "",
            name: "",
         },
      });
      clearProfile();
      clearUserInstallments();
      if (!invoice) history.push("/installments/0");
   };

   //Inside Installment for edit
   const seeInstallmentInfo = () => {
      if (selectedItem._id === 0) {
         setAlert("Debe seleccionar una cuota primero", "danger", "4");
      } else {
         history.push(`/edit-installment/1/${selectedItem._id}`);
         clearInstallment();
      }
   };

   //Inside Invoice to add them
   const addToList = () => {
      if (selectedItem._id === 0) {
         setAlert("No se ha seleccionado ninguna cuota", "danger", "4");
      } else {
         const pass = installments.every(
            (item) => item._id !== selectedItem._id
         );

         if (pass) {
            setAlert("Cuota agregada correctamente", "success", "4");
            addInstallment(selectedItem);
            setOtherValues({ ...otherValues, selectedItem: { _id: 0 } });
         } else {
            setAlert("Ya se ha agregado dicha cuota", "danger", "4");
         }
      }
   };

   return (
      <div className="installment-search">
         <div className="form">
            <StudentSearch
               selectedStudent={selectedStudent}
               actionForSelected={searchInstallments}
               selectStudent={selectStudent}
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
            {selectedStudent._id !== "" && (
               <button
                  className="btn-cancel"
                  type="button"
                  onClick={(e) => {
                     e.preventDefault();
                     restore();
                  }}
               >
                  <i className="fas fa-times"></i>
               </button>
            )}
         </div>
         {!loadingUsersInstallments && usersInstallments.rows.length > 0 ? (
            <InstallmentsTable
               installments={usersInstallments}
               forAdmin={true}
               selectedItem={selectedItem}
               student={selectedStudent._id}
               selectItem={selectItem}
               actionForSelected={invoice ? addToList : seeInstallmentInfo}
            />
         ) : (
            !loadingUsersInstallments &&
            usersInstallments.rows.length === 0 && (
               <p className="heading-tertiary text-center my-4">
                  El alumno no tiene deudas hasta el momento
               </p>
            )
         )}
      </div>
   );
};

InstallmentsSearch.propTypes = {
   installments: PropTypes.object.isRequired,
   student: PropTypes.object,
   loadStudentInstallments: PropTypes.func.isRequired,
   setAlert: PropTypes.func.isRequired,
   addInstallment: PropTypes.func.isRequired,
   clearUserInstallments: PropTypes.func.isRequired,
   clearInstallment: PropTypes.func.isRequired,
   clearSearch: PropTypes.func.isRequired,
   clearProfile: PropTypes.func.isRequired,
   changeStudent: PropTypes.func,
};

const mapStateToProps = (state) => ({
   installments: state.installments,
});

export default connect(mapStateToProps, {
   loadStudentInstallments,
   setAlert,
   clearUserInstallments,
   clearInstallment,
   clearSearch,
   clearProfile,
   addInstallment,
})(withRouter(InstallmentsSearch));
