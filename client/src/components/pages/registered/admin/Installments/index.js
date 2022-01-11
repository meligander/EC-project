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
import { togglePopup } from "../../../../../actions/mixvalues";

import InstallmentsSearch from "../../sharedComp/search/InstallmentsSearch";
import PopUp from "../../../../modal/PopUp";

const Installments = ({
   match,
   penalties: { loading: loadingPenalty },
   installments: { loading },
   auth: { userLogged },
   users: { user, loadingUser },
   clearInstallments,
   clearInstallment,
   clearUser,
   updatePenalty,
   loadPenalty,
   loadUser,
   loadInstallments,
   togglePopup,
}) => {
   const _id = match.params.user_id;

   const [adminValues, setAdminValues] = useState({
      student: {
         _id: "",
         name: "",
      },
   });
   const { student } = adminValues;

   useEffect(() => {
      if (loadingPenalty) loadPenalty();
   }, [loadingPenalty, loadPenalty]);

   useEffect(() => {
      if (_id !== "0" && loading)
         loadInstallments({ student: { _id } }, true, "student");
   }, [_id, loading, loadInstallments]);

   useEffect(() => {
      if (_id !== "0") {
         if (loadingUser) loadUser(_id, loading ? false : true);
         else
            setAdminValues((prev) => ({
               ...prev,
               student: {
                  _id: user._id,
                  name: user.lastname + ", " + user.name,
               },
            }));
      }
   }, [_id, loadingUser, loadUser, user, loading]);

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
            <PopUp confirm={(percentage) => updatePenalty({ percentage })} />

            <div className="btn-right my-3">
               {(userLogged.type === "admin" ||
                  userLogged.type === "admin&teacher") && (
                  <button
                     className="btn btn-secondary"
                     type="button"
                     onClick={(e) => {
                        e.preventDefault();
                        togglePopup("penalty");
                     }}
                  >
                     <FaDollarSign />
                     &nbsp;Recargo
                  </button>
               )}
               <Link
                  to="/index/installment/list"
                  onClick={() => {
                     window.scroll(0, 0);
                     clearInstallments();
                  }}
                  className="btn btn-light"
               >
                  <IoIosListBox />
                  &nbsp; <span className="hide-sm">Listado</span>&nbsp;Deudas
               </Link>
            </div>
            <InstallmentsSearch
               student={_id !== "0" ? student : null}
               changeStudent={changeStudent}
            />
            <div className="btn-right">
               <Link
                  className={`btn ${!loading ? "btn-primary" : "btn-black"}`}
                  to={
                     !loading && !loadingUser
                        ? `/index/installment/new/${student._id}`
                        : "#"
                  }
                  onClick={() => {
                     window.scroll(0, 0);
                     clearInstallment();
                     clearUser();
                  }}
               >
                  <FaPlus />
                  <span className="hide-md">&nbsp;Agregar cuota</span>
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
   togglePopup,
})(Installments);
