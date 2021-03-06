import React, { useEffect, useState, createRef } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import IdleTimer from "react-idle-timer";
import PropTypes from "prop-types";

import { expireSesion } from "../actions/auth";

import PopUp from "../components/modal/PopUp";

const ExpireAuthToken = ({ expireSesion, history }) => {
   const idleTimerRef = createRef(null);

   const timeIdle = 15;
   const timeLogOut = 5;

   const [otherValues, setOtherValues] = useState({
      timer: null,
      toggleModal: false,
   });

   const { toggleModal, timer } = otherValues;

   useEffect(() => {
      window.onunload = function () {
         if (window.performance && performance.navigation.type !== 1) {
            expireSesion(history);
         }
      };
   }, [expireSesion, history]);

   const onIdle = () => {
      setOtherValues({
         ...otherValues,
         toggleModal: true,
         timer: setTimeout(logOut, timeLogOut * 1000 * 60),
      });
   };

   const setToggle = () => {
      clearTimeout(timer);
      setOtherValues({
         ...otherValues,
         toggleModal: !toggleModal,
         timer: null,
      });
   };

   const logOut = () => {
      clearTimeout(timer);
      setOtherValues({ ...otherValues, toggleModal: false, timer: null });
      expireSesion(history);
   };

   return (
      <React.Fragment>
         <PopUp
            type="active"
            text={{
               question:
                  "Ha estado inactivo por un tiempo, ¿Desea salir de la sesión?",
               info:
                  "Saldrá de la sesión automáticamente si no realiza ninguna acción.",
            }}
            confirm={logOut}
            setToggleModal={setToggle}
            toggleModal={toggleModal}
         />
         <IdleTimer
            ref={idleTimerRef}
            onIdle={onIdle}
            timeout={timeIdle * 1000 * 60}
         ></IdleTimer>
      </React.Fragment>
   );
};

ExpireAuthToken.protoTypes = {
   expireSesion: PropTypes.func.isRequired,
};

export default connect(null, { expireSesion })(withRouter(ExpireAuthToken));
