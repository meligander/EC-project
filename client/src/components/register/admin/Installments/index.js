import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import {
   clearInstallments,
   clearInstallment,
} from "../../../../actions/installment";

import InstallmentsSearch from "../../../sharedComp/search/InstallmentsSearch";
import Confirm from "../../../modal/Confirm";
import { clearPenalty, updatePenalty } from "../../../../actions/penalty";

const Installments = ({
   installment: { usersInstallments },
   auth: { userLogged },
   clearInstallments,
   clearInstallment,
   clearPenalty,
   updatePenalty,
}) => {
   const [otherValues, setOtherValues] = useState({
      student: "",
      toggleModal: false,
   });

   const { student, toggleModal } = otherValues;

   useEffect(() => {
      if (usersInstallments.rows.length > 0) {
         for (let x = 0; x < usersInstallments.rows[0].length; x++) {
            if (usersInstallments.rows[0][x].student) {
               setOtherValues((prev) => ({
                  ...prev,
                  student: usersInstallments.rows[0][x].student._id,
               }));
               break;
            }
         }
      }
   }, [usersInstallments.rows.length, usersInstallments.rows]);

   const setToggle = () => {
      setOtherValues({ ...otherValues, toggleModal: !toggleModal });
   };

   const confirm = (percentage) => {
      updatePenalty(percentage);
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
            <InstallmentsSearch />
            <div className="btn-right">
               <Link
                  className={`btn ${
                     usersInstallments.rows.length > 0
                        ? "btn-primary"
                        : "btn-black"
                  }`}
                  to={
                     usersInstallments.rows.length > 0
                        ? `/edit-installment/${student}/0/0`
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
   installment: PropTypes.object.isRequired,
   auth: PropTypes.object.isRequired,
   clearInstallments: PropTypes.func.isRequired,
   clearInstallment: PropTypes.func.isRequired,
   clearPenalty: PropTypes.func.isRequired,
   updatePenalty: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   installment: state.installment,
   auth: state.auth,
});

export default connect(mapStateToProps, {
   clearInstallments,
   clearInstallment,
   clearPenalty,
   updatePenalty,
})(Installments);
