import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { FaTimes, FaUserCircle, FaPlus, FaMoneyCheckAlt } from "react-icons/fa";

import {
   loadUsers,
   clearSearch,
   clearProfile,
} from "../../../../../../actions/user";

import NameField from "../../NameField";

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
   const modalRef = useRef();

   const [filterData, setFilterData] = useState({
      name: "",
      lastname: "",
   });

   const [adminValues, setAdminValues] = useState({
      user: null,
      users: [],
      loading: true,
      searchDisplay: false,
   });

   const { name, lastname } = filterData;

   const { user, users, loading, searchDisplay } = adminValues;

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

   useEffect(() => {
      const handler = (event) =>
         setAdminValues((prev) => ({
            ...prev,
            searchDisplay: modalRef.current?.contains(event.target),
         }));

      window.addEventListener("click", handler);
      return () => window.removeEventListener("click", handler);
   }, []);

   const chooseUser = (user) => {
      setAdminValues((prev) => ({ ...prev, user }));
      setFilterData((prev) => ({ ...prev, name: "", lastname: "" }));
      selectUser(user);
      clearSearch(primary);
   };

   const onChange = (e) => {
      e.persist();
      setFilterData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

      if (onChangeForm) onChangeForm(e);

      if (e.target.value.length > 0)
         loadUsers(
            {
               ...filterData,
               [e.target.name]: e.target.value,
               type: usersType,
               ...(disabled !== undefined && { active: true }),
            },
            false,
            primary
         );
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
         <div className="form-group form-search" ref={modalRef}>
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
            {!loading && users.length > 0 && searchDisplay && (
               <ul className="form-search-display">
                  {users.map((user) => (
                     <li
                        className="form-search-item"
                        onClick={() => chooseUser(user)}
                        key={user._id}
                     >
                        <span>{user.lastname + ", " + user.name}</span>
                        <span>
                           {usersType === "student"
                              ? user.category
                              : user.type === "student"
                              ? "Alumno"
                              : "Tutor"}
                        </span>
                     </li>
                  ))}
               </ul>
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
