import axios from "axios";

import { setAlert } from "./alert";
import { changePage } from "./navbar";
import { updateLoadingSpinner } from "./mixvalues";
import { updateExpiredIntallments } from "./installment";
import { clearProfile } from "./user";
import { clearClasses } from "./class";

import {
   USERAUTH_LOADED,
   AUTH_ERROR,
   LOGIN_SUCCESS,
   LOGIN_FAIL,
   LOGOUT,
   STARTLOGOUT,
   FINISHLOGOUT,
} from "./types";

export const loadUser = () => async (dispatch) => {
   try {
      const res = await axios.get("/api/auth");
      dispatch({
         type: USERAUTH_LOADED,
         payload: res.data,
      });
   } catch (err) {
      dispatch({
         type: AUTH_ERROR,
      });
   }
};

export const loginUser = (formData) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   let user = {};

   for (const prop in formData) {
      if (formData[prop] !== "") user[prop] = formData[prop];
   }

   try {
      const res = await axios.post("/api/auth", user);
      dispatch({
         type: LOGIN_SUCCESS,
         payload: res.data,
      });

      dispatch(loadUser());
      dispatch(updateExpiredIntallments());
   } catch (err) {
      if (err.response.data.errors) {
         const errors = err.response.data.errors;
         errors.forEach((error) => {
            dispatch(setAlert(error.msg, "danger", "2"));
         });
         dispatch({
            type: LOGIN_FAIL,
            payload: errors,
         });
      } else {
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
         dispatch({
            type: LOGIN_FAIL,
            payload: {
               type: err.response.statusText,
               status: err.response.status,
               msg: err.response.data.msg,
            },
         });
      }

      window.scrollTo(0, 0);
      dispatch(updateLoadingSpinner(false));
   }
};

export const expireSesion = (history) => (dispatch) => {
   dispatch({
      type: STARTLOGOUT,
   });
   dispatch(clearProfile(false));
   dispatch(clearClasses());
   history.push("/login");
   dispatch(changePage("login"));
   dispatch({
      type: FINISHLOGOUT,
   });
};

export const logOut = () => (dispatch) => {
   dispatch({
      type: LOGOUT,
   });
};
