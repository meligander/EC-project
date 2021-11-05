import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { FaDollarSign, FaPlus } from "react-icons/fa";
import { IoIosListBox } from "react-icons/io";

import {
   clearInstallments,
   clearInstallment,
   loadInstallments,
} from "../../../../../actions/installment";
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
   updatePenalty,
   loadPenalty,
   loadUser,
   loadInstallments,
}) => {
   const _id = match.params.user_id;

   const [adminValues, setAdminValues] = useState({
      toggleModal: false,
      student: {
         _id: "",
         name: "",
      },
   });

   const { toggleModal, student } = adminValues;

   useEffect(() => {
      if (loading) loadPenalty();
      if (_id !== "0" && loadingUsersInstallments) {
         loadInstallments(null, _id);
         loadUser(_id);
      } else {
         if (!userLoading && userLogged._id !== user._id) {
            const student = {
               _id: user._id,
               name: user.lastname + ", " + user.name,
            };

            setAdminValues((prev) => ({
               ...prev,
               student,
            }));
         }
      }
   }, [
      _id,
      loadingUsersInstallments,
      loadPenalty,
      user,
      userLogged,
      userLoading,
      loadUser,
      loading,
      loadInstallments,
   ]);

   const changeStudent = (student) => {
      setAdminValues((prev) => ({
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
                  setToggleModal={() =>
                     setAdminValues((prev) => ({
                        ...prev,
                        toggleModal: !toggleModal,
                     }))
                  }
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
                        setAdminValues((prev) => ({
                           ...prev,
                           toggleModal: !toggleModal,
                        }));
                     }}
                  >
                     <FaDollarSign />
                     &nbsp;Recargo
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
                  <IoIosListBox />
                  &nbsp;
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
                  <FaPlus />
                  &nbsp; Agregar cuota
               </Link>
            </div>
         </div>
      </>
   );
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
   loadInstallments,
})(Installments);
