import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { FaUnlock } from "react-icons/fa";
import { FiSave } from "react-icons/fi";

//Actions
import { updateCredentials, loadUser } from "../../../../../../actions/user";
import { togglePopup } from "../../../../../../actions/mixvalues";

import PopUp from "../../../../../modal/PopUp";

const Credentials = ({
   match,
   updateCredentials,
   loadUser,
   togglePopup,
   auth: { userLogged },
   users: { user, loadingUser },
}) => {
   const [formData, setFormData] = useState({
      email: "",
      password: "",
      password2: "",
   });

   const { email, password, password2 } = formData;

   const isAdmin =
      userLogged.type === "admin" ||
      userLogged.type === "admin&teacher" ||
      userLogged.type === "secretary";

   useEffect(() => {
      if (!loadingUser)
         setFormData((prev) => ({
            ...prev,
            email: !user.email ? "" : user.email,
         }));
      else loadUser(match.params.user_id, true);
   }, [loadingUser, match.params, loadUser, user]);

   const onChange = (e) => {
      e.persist();
      setFormData({
         ...formData,
         [e.target.name]: e.target.value,
      });
   };

   return (
      <div className="p-4">
         <PopUp
            confirm={() => updateCredentials(formData)}
            text="¿Está seguro que desea aplicar los cambios?"
         />
         <h3 className="heading-secondary text-primary">
            Modificar Credenciales
         </h3>
         <h4 className="heading-tertiary text-lighter-primary text-moved-right">
            <FaUnlock />
            &nbsp;
            {`Cambio de ${isAdmin ? "Email y/o " : ""}Contraseña`}
         </h4>
         {!loadingUser && (
            <form
               className="form"
               onSubmit={(e) => {
                  e.preventDefault();
                  togglePopup();
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
                        onChange={onChange}
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
                     onChange={onChange}
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
                     onChange={onChange}
                     name="password2"
                  />
                  <label htmlFor="email" className="form-label">
                     Confirmación de contraseña
                  </label>
               </div>
               <div className="btn-right">
                  <button type="submit" className="btn btn-primary">
                     <FiSave />
                     &nbsp;Guardar Cambios
                  </button>
               </div>
            </form>
         )}
      </div>
   );
};

const mapStateToProps = (state) => ({
   users: state.users,
   auth: state.auth,
});

export default connect(mapStateToProps, {
   updateCredentials,
   loadUser,
   togglePopup,
})(Credentials);
