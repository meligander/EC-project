import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import {
   clearInstallments,
   clearInstallment,
   loadStudentInstallments,
} from "../../../../actions/installment";
import { updatePreviousPage } from "../../../../actions/mixvalues";
import { clearPenalty, updatePenalty } from "../../../../actions/penalty";

import InstallmentsSearch from "../../../sharedComp/search/InstallmentsSearch";
import Confirm from "../../../modal/Confirm";

const Installments = ({
   match,
   installments: { usersInstallments, loadingUsersInstallments },
   auth: { userLogged },
   clearInstallments,
   clearInstallment,
   clearPenalty,
   updatePreviousPage,
   updatePenalty,
   loadStudentInstallments,
}) => {
   const _id = match.params.user_id;

   const [otherValues, setOtherValues] = useState({
      toggleModal: false,
      student: {
         _id: "",
         name: "",
      },
   });

   const { toggleModal, student } = otherValues;

   useEffect(() => {
      if (_id !== "0" && loadingUsersInstallments) {
         loadStudentInstallments(_id, true);
      } else {
         if (!loadingUsersInstallments && usersInstallments.rows.length > 0) {
            setOtherValues((prev) => ({
               ...prev,
               student: {
                  _id: usersInstallments.rows[0][0].student._id,
                  name:
                     usersInstallments.rows[0][0].student.lastname +
                     ", " +
                     usersInstallments.rows[0][0].student.name,
               },
            }));
         }
      }
      updatePreviousPage("dashboard");
   }, [
      _id,
      updatePreviousPage,
      loadStudentInstallments,
      loadingUsersInstallments,
      usersInstallments.rows,
   ]);

   const setToggle = () => {
      setOtherValues({ ...otherValues, toggleModal: !toggleModal });
   };

   const confirm = (percentage) => {
      updatePenalty({ percentage });
      clearPenalty();
   };

   return (
      <>
         <div>
            <h1>Cuotas</h1>
            <Confirm
               toggleModal={toggleModal}
               setToggleModal={setToggle}
               type="penalty"
               confirm={confirm}
            />
            <div className="btn-right my-3">
               {userLogged.type === "Administrador" ||
                  userLogged.type === "Admin/Profesor"}
               <button className="btn btn-secondary" onClick={setToggle}>
                  <i className="fas fa-dollar-sign"></i> Recargo
               </button>
               <Link
                  to="/installment-list"
                  onClick={() => {
                     window.scroll(0, 0);
                     clearInstallments();
                  }}
                  className="btn btn-light"
               >
                  Ver Listado Deudas
               </Link>
            </div>
            <InstallmentsSearch student={student} />
            <div className="btn-right">
               <Link
                  className={`btn ${
                     usersInstallments.rows.length > 0
                        ? "btn-primary"
                        : "btn-black"
                  }`}
                  to={
                     usersInstallments.rows.length > 0
                        ? `/edit-installment/2/${student._id}`
                        : "#"
                  }
                  onClick={() => {
                     window.scroll(0, 0);
                     clearInstallment();
                  }}
               >
                  <i className="fas fa-plus-circle"></i> &nbsp; Agregar una
                  cuota
               </Link>
            </div>
         </div>
      </>
   );
};

Installments.propTypes = {
   installments: PropTypes.object.isRequired,
   auth: PropTypes.object.isRequired,
   clearInstallments: PropTypes.func.isRequired,
   clearInstallment: PropTypes.func.isRequired,
   clearPenalty: PropTypes.func.isRequired,
   updatePenalty: PropTypes.func.isRequired,
   updatePreviousPage: PropTypes.func.isRequired,
   loadStudentInstallments: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   installments: state.installments,
   auth: state.auth,
});

export default connect(mapStateToProps, {
   clearInstallments,
   clearInstallment,
   clearPenalty,
   updatePenalty,
   updatePreviousPage,
   loadStudentInstallments,
})(withRouter(Installments));
