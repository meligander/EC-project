import React, { useState } from "react";
import { connect } from "react-redux";
import { RiLoginCircleLine } from "react-icons/ri";
import { FaUserAlt } from "react-icons/fa";

import { loginUser } from "../../../../actions/auth";

import Alert from "../../sharedComp/Alert";
import Loading from "../../../modal/Loading";

import "./style.scss";

const Login = ({ loginUser }) => {
   const [formData, setFormData] = useState({
      email: "",
      password: "",
   });

   const { email, password } = formData;

   const onChange = (e) => {
      setFormData({
         ...formData,
         [e.target.name]: e.target.value,
      });
   };

   const onSubmit = (e) => {
      e.preventDefault();
      loginUser(formData);
   };

   return (
      <div className="inner-container login">
         <Loading />
         <h3 className="heading-secondary text-primary">Iniciar Sesión</h3>
         <p className="heading-tertiary text-lighter-primary text-moved-right">
            <FaUserAlt /> Inicie sesión en su cuenta
         </p>
         <form onSubmit={onSubmit} className="form">
            <Alert type="1" />
            <div className="form-group">
               <input
                  className="form-input"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => onChange(e)}
                  placeholder="Dirección de correo electrónico"
               />
               <label htmlFor="email" className="form-label">
                  Dirección de correo electrónico
               </label>
            </div>
            <div className="form-group">
               <input
                  className="form-input"
                  type="password"
                  value={password}
                  name="password"
                  onChange={(e) => onChange(e)}
                  placeholder="Contraseña"
               />
               <label htmlFor="name" className="form-label">
                  Contraseña
               </label>
            </div>
            <div className="btn-right">
               <button type="submit" className="btn btn-primary">
                  <RiLoginCircleLine />
                  &nbsp;Iniciar Sesión
               </button>
            </div>
         </form>
      </div>
   );
};

export default connect(null, {
   loginUser,
})(Login);
