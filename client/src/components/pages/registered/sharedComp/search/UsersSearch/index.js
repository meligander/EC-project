import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { FaTimes, FaUserCircle, FaPlus, FaMoneyCheckAlt } from "react-icons/fa";

import {
   loadUsers,
   clearSearch,
   clearProfile,
} from "../../../../../../actions/user";

import NameField from "../../NameField";
import Alert from "../../../../sharedComp/Alert";

import "./style.scss";

const UsersSearch = ({
   users: { users: primaryUsers, loading: primaryLoading, loadingBK, usersBK },
   autoComplete,
   selectUser,
   selectedUser,
   clearSearch,
   clearProfile,
   usersType,
   primary,
   onChangeForm,
   loadUsers,
   restore,
   disabled,
   button,
   actionForSelected,
}) => {
   const [filterData, setFilterData] = useState({
      name: "",
      lastname: "",
   });

   const [adminValues, setAdminValues] = useState({
      searchDisplay: false,
      user: null,
      users: [],
      loading: true,
   });

   const { name, lastname } = filterData;

   const { searchDisplay, user, users, loading } = adminValues;

   useEffect(() => {
      setAdminValues((prev) => ({
         ...prev,
         users: primary ? primaryUsers : usersBK,
         loading: primary ? primaryLoading : loadingBK,
      }));
   }, [primary, primaryUsers, usersBK, primaryLoading, loadingBK]);

   useEffect(() => {
      setAdminValues((prev) => ({ ...prev, user: selectedUser }));
   }, [selectedUser]);

   const chooseUser = (user) => {
      setAdminValues((prev) => ({ ...prev, user, searchDisplay: false }));
      setFilterData((prev) => ({ ...prev, name: "", lastname: "" }));
      selectUser(user);
      clearSearch(primary);
   };

   const onChange = (e) => {
      e.persist();
      setFilterData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

      if (onChangeForm) onChangeForm(e);

      if (e.target.value.length > 0) {
         if (!searchDisplay)
            setAdminValues((prev) => ({ ...prev, searchDisplay: true }));
         loadUsers(
            { ...filterData, [e.target.name]: e.target.value, type: usersType },
            false,
            primary
         );
      }
      if (
         e.target.value === "" &&
         ((e.target.name === "name" && lastname === "") ||
            (e.target.name === "lastname" && name === ""))
      ) {
         setAdminValues((prev) => ({ ...prev, searchDisplay: false }));
         clearSearch(primary);
      }
   };

   const cancelUser = () => {
      restore();
      setAdminValues((prev) => ({ ...prev, user: null }));
   };

   return (
      <>
         <h3
            className={`${
               primary ? "heading-tertiary" : "paragraph"
            } text-primary`}
         >
            {usersType === "student"
               ? "Búsqueda de Alumnos"
               : "Usuario a Pagar"}
         </h3>
         <Alert type="3" />
         <div className="form-group form-search">
            {user ? (
               <div>
                  <input
                     className="form-input"
                     type="text"
                     value={user.lastname + ", " + user.name}
                     disabled
                     onChange={onChange}
                  />
                  <label htmlFor="name" className="form-label">
                     Nombre
                  </label>
                  <Link
                     onClick={() => {
                        window.scroll(0, 0);
                        clearProfile();
                     }}
                     className="form-search-user profile"
                     to={`/index/dashboard/${user._id}`}
                  >
                     <FaUserCircle />
                  </Link>
                  <button
                     disabled={disabled}
                     type="button"
                     onClick={cancelUser}
                     className={`form-search-user cancel ${
                        disabled ? "disabled" : ""
                     }`}
                  >
                     <FaTimes />
                  </button>
               </div>
            ) : (
               <NameField
                  name={name}
                  lastname={lastname}
                  onChange={onChange}
                  autoComplete={autoComplete}
               />
            )}
            {searchDisplay && (
               <div
                  className={`form-search-display ${
                     users.length === 0 ? "danger" : ""
                  }`}
               >
                  <div className="form-search-close">
                     <button
                        type="button"
                        className="form-search-close-icon"
                        onClick={() =>
                           setAdminValues((prev) => ({
                              ...prev,
                              searchDisplay: false,
                           }))
                        }
                     >
                        <FaTimes />
                     </button>
                  </div>
                  <ul className="form-search-list">
                     {!loading && (
                        <Fragment>
                           {users.length > 0 ? (
                              users.map((user) => (
                                 <li
                                    className="form-search-item"
                                    onClick={() => chooseUser(user)}
                                    key={user._id}
                                 >
                                    <span>
                                       {user.lastname + ", " + user.name}
                                    </span>
                                    <span>
                                       {usersType === "student"
                                          ? user.category
                                          : user.type === "student"
                                          ? "Alumno"
                                          : "Tutor"}
                                    </span>
                                 </li>
                              ))
                           ) : (
                              <li className="bg-danger form-search-item">
                                 No matching results
                              </li>
                           )}
                        </Fragment>
                     )}
                  </ul>
               </div>
            )}
         </div>
         {button && (
            <div className="btn-right mt-1">
               <button
                  type="button"
                  className="btn btn-dark"
                  onClick={actionForSelected}
               >
                  {button === "children" ? (
                     <>
                        <FaPlus />
                        <span className="hide-md">&nbsp; Agregar</span>
                     </>
                  ) : (
                     <>
                        <FaMoneyCheckAlt />
                        <span className="hide-md">&nbsp; Ver Cuotas</span>
                     </>
                  )}
               </button>
            </div>
         )}
      </>
   );
};

const mapStateToProps = (state) => ({
   users: state.users,
});

export default connect(mapStateToProps, {
   loadUsers,
   clearSearch,
   clearProfile,
})(UsersSearch);
