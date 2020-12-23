import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { setAlert } from "../../../../actions/alert";
import {
   loadStudentInstallments,
   clearUserInstallments,
} from "../../../../actions/installment";

import StudentSearch from "../StudentSearch";
import InstallmentsTable from "../../../tables/InstallmentsTable";

const InstallmentsSearch = ({
   match,
   installment: { usersInstallments, loadingUsersInstallments },
   loadStudentInstallments,
   clearUserInstallments,
   setAlert,
}) => {
   const _id = match.params.studentid;
   useEffect(() => {
      if (_id !== "0" && !loadingUsersInstallments) {
         setSelectedStudent((prev) => ({
            ...prev,
            _id: _id,
            name:
               usersInstallments.rows[0][0].student.lastname +
               ", " +
               usersInstallments.rows[0][0].student.name,
         }));
      }
   }, [_id, usersInstallments, loadingUsersInstallments]);

   const [selectedStudent, setSelectedStudent] = useState({
      _id: "",
      name: "",
   });

   const selectStudent = (user) => {
      setSelectedStudent({
         ...selectedStudent,
         name: user.lastname + ", " + user.name,
         _id: user._id,
      });
      clearUserInstallments();
   };

   const searchInstallments = (e) => {
      e.preventDefault();
      if (!selectedStudent._id)
         setAlert("Debe seleccionar un usuario primero", "danger", "3");
      else {
         loadStudentInstallments(selectedStudent._id, true);
      }
   };
   return (
      <>
         <div className="form">
            <StudentSearch
               selectedStudent={selectedStudent}
               actionForSelected={searchInstallments}
               selectStudent={selectStudent}
               studentInstallment={true}
               student={true}
            />
         </div>
         <p className="mb-3 paragraph">
            <span className="text-dark heading-tertiary">Alumno: </span>
            {selectedStudent.name}
         </p>
         {!loadingUsersInstallments && usersInstallments.rows.length > 0 ? (
            <InstallmentsTable forAdmin={true} />
         ) : (
            !loadingUsersInstallments &&
            usersInstallments.rows.length === 0 && (
               <p className="heading-tertiary text-center my-4">
                  El alumno no tiene deudas hasta el momento
               </p>
            )
         )}
      </>
   );
};

InstallmentsSearch.propTypes = {
   installment: PropTypes.object.isRequired,
   loadStudentInstallments: PropTypes.func.isRequired,
   setAlert: PropTypes.func.isRequired,
   clearUserInstallments: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   installment: state.installment,
});

export default connect(mapStateToProps, {
   loadStudentInstallments,
   setAlert,
   clearUserInstallments,
})(withRouter(InstallmentsSearch));
