import React, { useState, useEffect } from "react";
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
   installment: { usersInstallments, loadingUsersInstallments },
   loadStudentInstallments,
   clearUserInstallments,
   student,
   setAlert,
}) => {
   const [selectedStudent, setSelectedStudent] = useState({
      _id: "",
      name: "",
   });

   useEffect(() => {
      if (student) {
         setSelectedStudent((prev) => ({
            ...prev,
            _id: student._id,
            name: student.name,
         }));
      }
   }, [student]);

   const selectStudent = (user) => {
      setSelectedStudent({
         ...selectedStudent,
         _id: user._id,
         name: user.lastname + ", " + user.name,
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
               typeSearch={"Installment"}
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
   student: PropTypes.object,
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
})(InstallmentsSearch);
