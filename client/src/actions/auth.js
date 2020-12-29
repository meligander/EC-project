import axios from "axios";

import { setAlert } from "./alert";
import { updateLoadingSpinner } from "./mixvalues";

import {
   USERAUTH_LOADED,
   AUTH_ERROR,
   LOGIN_SUCCESS,
   LOGIN_FAIL,
   LOGOUT,
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
   const config = {
      headers: {
         "Content-Type": "application/json",
      },
   };
   let user = JSON.stringify(formData);
   try {
      const res = await axios.post("/api/auth", user, config);
      dispatch({
         type: LOGIN_SUCCESS,
         payload: res.data,
      });
      dispatch(loadUser());
   } catch (err) {
      if (err.response.data.erros) {
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

export const logOut = () => (dispatch) => {
   dispatch({
      type: LOGOUT,
   });
};
