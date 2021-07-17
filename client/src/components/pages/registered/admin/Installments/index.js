import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import {
   clearInstallments,
   clearInstallment,
   loadStudentInstallments,
} from "../../../../../actions/installment";
import { updatePreviousPage } from "../../../../../actions/mixvalues";
import { loadPenalty, updatePenalty } from "../../../../../actions/penalty";
import { clearUser, loadUser } from "../../../../../actions/user";

import InstallmentsSearch from "../../sharedComp/search/InstallmentsSearch";
import PopUp from "../../../../modal/PopUp";

const Installments = ({
   match,
   penalties: { loading, penalty },
   installments: { loadingUsersInstallments },
   auth: { userLogged },
   users: { user, loading: userLoading },
   clearInstallments,
   clearInstallment,
   clearUser,
   updatePreviousPage,
   updatePenalty,
   loadPenalty,
   loadUser,
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
      if (loading) loadPenalty();
      if (_id !== "0" && loadingUsersInstallments) {
         loadStudentInstallments(_id, true);
         loadUser(_id);
      } else {
         if (!userLoading && userLogged._id !== user._id) {
            const student = {
               _id: user._id,
               name: user.lastname + ", " + user.name,
            };

            setOtherValues((prev) => ({
               ...prev,
               student,
            }));
         }
      }
      updatePreviousPage("dashboard");
   }, [
      _id,
      loadingUsersInstallments,
      loadPenalty,
      user,
      userLogged,
      userLoading,
      loadUser,
      loading,
      updatePreviousPage,
      loadStudentInstallments,
   ]);

   const setToggle = () => {
      setOtherValues({ ...otherValues, toggleModal: !toggleModal });
   };

   const changeStudent = (student) => {
      setOtherValues((prev) => ({
         ...prev,
         student,
      }));
   };

   return (
      <>
         <div>
            <h1>Cuotas</h1>
            {toggleModal && !loading && (
               <PopUp
                  toggleModal={toggleModal}
                  setToggleModal={setToggle}
                  type="penalty"
                  confirm={(percentage) => updatePenalty({ percentage })}
                  penalty={penalty}
               />
            )}

            <div className="btn-right my-3">
               {(userLogged.type === "admin" ||
                  userLogged.type === "admin&teacher") && (
                  <button
                     className="btn btn-secondary"
                     type="button"
                     onClick={(e) => {
                        e.preventDefault();
                        setToggle();
                     }}
                  >
                     <i className="fas fa-dollar-sign"></i>&nbsp; Recargo
                  </button>
               )}
               <Link
                  to="/installment-list"
                  onClick={() => {
                     window.scroll(0, 0);
                     clearInstallments();
                  }}
                  className="btn btn-light"
               >
                  <i className="fas fa-list-ul"></i>&nbsp;{" "}
                  <span className="hide-sm">Listado</span> Deudas
               </Link>
            </div>
            <InstallmentsSearch
               student={_id !== "0" ? student : null}
               changeStudent={changeStudent}
            />
            <div className="btn-right">
               <Link
                  className={`btn ${
                     !loadingUsersInstallments ? "btn-primary" : "btn-black"
                  }`}
                  to={
                     !loadingUsersInstallments
                        ? `/edit-installment/2/${student._id}`
                        : "#"
                  }
                  onClick={() => {
                     window.scroll(0, 0);
                     clearInstallment();
                     clearUser();
                  }}
               >
                  <i className="fas fa-plus-circle"></i>&nbsp; Agregar cuota
               </Link>
            </div>
         </div>
      </>
   );
};

Installments.propTypes = {
   installments: PropTypes.object.isRequired,
   auth: PropTypes.object.isRequired,
   penalties: PropTypes.object.isRequired,
   users: PropTypes.object.isRequired,
   clearInstallments: PropTypes.func.isRequired,
   clearInstallment: PropTypes.func.isRequired,
   loadPenalty: PropTypes.func.isRequired,
   loadUser: PropTypes.func.isRequired,
   clearUser: PropTypes.func.isRequired,
   updatePenalty: PropTypes.func.isRequired,
   updatePreviousPage: PropTypes.func.isRequired,
   loadStudentInstallments: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   installments: state.installments,
   penalties: state.penalties,
   users: state.users,
   auth: state.auth,
});

export default connect(mapStateToProps, {
   clearInstallments,
   clearInstallment,
   loadPenalty,
   loadUser,
   clearUser,
   updatePenalty,
   updatePreviousPage,
   loadStudentInstallments,
})(withRouter(Installments));
