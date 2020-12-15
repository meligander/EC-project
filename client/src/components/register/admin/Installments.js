import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import InstallmentsSearch from "../../InstallmentsSearch";
import Confirm from "../../modal/Confirm";

const Installments = ({ debt: { usersDebts }, auth: { userLogged } }) => {
   const [otherValues, setOtherValues] = useState({
      student: "",
      toggleModal: false,
   });

   const { student, toggleModal } = otherValues;

   useEffect(() => {
      if (usersDebts.rows.length > 0) {
         for (let x = 0; x < usersDebts.rows[0].length; x++) {
            if (usersDebts.rows[0][x].student) {
               setOtherValues((prev) => ({
                  ...prev,
                  student: usersDebts.rows[0][x].student._id,
               }));
               break;
            }
         }
      }
   }, [usersDebts.rows.length, usersDebts.rows]);

   const setToggle = () => {
      setOtherValues({ ...otherValues, toggleModal: !toggleModal });
   };

   return (
      <>
         <div>
            <h1>Cuotas</h1>
            <Confirm
               toggleModal={toggleModal}
               setToggleModal={setToggle}
               type="penalty"
            />
            <div className="btn-right my-3">
               {userLogged.type === "Administrador" ||
                  userLogged.type === "Admin/Profesor"}
               <button className="btn btn-secondary" onClick={setToggle}>
                  <i className="fas fa-dollar-sign"></i> Recargo
               </button>
               <Link to="/debt-list" className="btn btn-light">
                  Ver Listado Deudas
               </Link>
            </div>
            <InstallmentsSearch />
            <div className="btn-right">
               <Link
                  className={`btn ${
                     usersDebts.rows.length > 0 ? "btn-primary" : "btn-black"
                  }`}
                  to={
                     usersDebts.rows.length > 0
                        ? `/edit-installment/${student}/0/0`
                        : "#"
                  }
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
   debt: PropTypes.object.isRequired,
   auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
   debt: state.debt,
   auth: state.auth,
});

export default connect(mapStateToProps)(Installments);
