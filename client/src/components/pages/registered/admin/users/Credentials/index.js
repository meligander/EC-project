import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

//Actions
import { updateCredentials, loadUser } from "../../../../../../actions/user";

import Loading from "../../../../../modal/Loading";
import PopUp from "../../../../../modal/PopUp";

const Credentials = ({
   match,
   updateCredentials,
   history,
   loadUser,
   auth: { userLogged },
   users: { user, loading },
}) => {
   const [formData, setFormData] = useState({
      email: "",
      password: "",
      password2: "",
   });

   const [otherValues, setOtherValues] = useState({
      toggleModal: false,
   });

   const { toggleModal } = otherValues;

   const { email, password, password2 } = formData;

   const isAdmin =
      userLogged.type === "admin" ||
      userLogged.type === "admin&teacher" ||
      userLogged.type === "secretary";

   useEffect(() => {
      if (!loading)
         setFormData((prev) => ({
            ...prev,
            email: !user.email ? "" : user.email,
         }));
      else {
         loadUser(match.params.user_id);
      }
   }, [loading, match.params, loadUser, user]);

   const onChange = (e) => {
      setFormData({
         ...formData,
         [e.target.name]: e.target.value,
      });
   };

   const setToggle = () => {
      setOtherValues({ ...otherValues, toggleModal: !toggleModal });
   };

   return (
      <>
         {!loading ? (
            <div className="p-4">
               <PopUp
                  toggleModal={toggleModal}
                  setToggleModal={setToggle}
                  confirm={() => updateCredentials(formData, history, user._id)}
                  text="¿Está seguro que desea aplicar los cambios?"
               />
               <h3 className="heading-secondary text-primary">
                  Modificar Credenciales
               </h3>
               <h4 className="heading-tertiary text-lighter-primary text-moved-right">
                  <i className="fas fa-unlock"></i>&nbsp;{" "}
                  {`Cambio de ${isAdmin ? "Email y/o " : ""}Contraseña`}
               </h4>
               <form
                  className="form"
                  onSubmit={(e) => {
                     e.preventDefault();
                     setToggle();
                  }}
               >
                  {isAdmin && (
                     <div className="form-group">
                        <input
                           className="form-input"
                           id="email"
                           type="text"
                           value={email}
                           name="email"
                           onChange={(e) => onChange(e)}
                           placeholder="Dirección de correo electrónico"
                        />
                        <label htmlFor="email" className="form-label">
                           Dirección de correo electrónico
                        </label>
                     </div>
                  )}

                  <div className="form-group">
                     <input
                        className="form-input"
                        id="password"
                        type="password"
                        value={password}
                        placeholder="Nueva contraseña"
                        onChange={(e) => onChange(e)}
                        name="password"
                     />
                     <label htmlFor="email" className="form-label">
                        Nueva contraseña
                     </label>
                  </div>
                  <div className="form-group">
                     <input
                        className="form-input"
                        id="password2"
                        type="password"
                        value={password2}
                        placeholder="Confirmación de contraseña"
                        onChange={(e) => onChange(e)}
                        name="password2"
                     />
                     <label htmlFor="email" className="form-label">
                        Confirmación de contraseña
                     </label>
                  </div>
                  <div className="btn-right">
                     <button type="submit" className="btn btn-primary">
                        <i className="fas fa-user-check"></i>&nbsp; Guardar
                        Cambios
                     </button>
                  </div>
               </form>
            </div>
         ) : (
            <Loading />
         )}
      </>
   );
};

Credentials.prototypes = {
   updateCredentials: PropTypes.func.isRequired,
   loadUser: PropTypes.func.isRequired,
   users: PropTypes.object.isRequired,
   auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
   users: state.users,
   auth: state.auth,
});

export default connect(mapStateToProps, {
   updateCredentials,
   loadUser,
})(Credentials);
