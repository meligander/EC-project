import api from "../utils/api";
import history from "../utils/history";

import { setAlert } from "./alert";
import { updateLoadingSpinner } from "./mixvalues";
import { updateExpiredIntallments } from "./installment";

import {
   USERAUTH_LOADED,
   AUTH_ERROR,
   LOGIN_SUCCESS,
   LOGIN_FAIL,
   LOGOUT,
   USERAUTH_UPDATED,
} from "./types";

export const loadUser = (login) => async (dispatch) => {
   try {
      const res = await api.get("/auth");
      dispatch({
         type: USERAUTH_LOADED,
         payload: res.data,
      });
      if (login) {
         dispatch(updateLoadingSpinner(false));
         dispatch(updateExpiredIntallments());
      }
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setAuthError(AUTH_ERROR, err.response));
      }
   }
};

export const loginUser = (formData) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   let user = {};

   for (const prop in formData) {
      if (formData[prop] !== "") user[prop] = formData[prop];
   }

   try {
      const res = await api.post("/auth", user);
      dispatch({
         type: LOGIN_SUCCESS,
         payload: res.data,
      });

      dispatch(loadUser(true));
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setAuthError(LOGIN_FAIL, err.response));

         if (err.response.data.errors)
            err.response.data.errors.forEach((error) => {
               dispatch(setAlert(error.msg, "danger", "2"));
            });
         else dispatch(setAlert(err.response.data.msg, "danger", "2"));

         window.scrollTo(0, 0);
         dispatch(updateLoadingSpinner(false));
      }
   }
};

export const logOut = () => (dispatch) => {
   dispatch({
      type: LOGOUT,
   });
   history.push("/login");
};

export const updateAuthUser = (user) => (dispatch) => {
   dispatch({
      type: USERAUTH_UPDATED,
      payload: user,
   });
};

export const setAuthError = (type, response) => (dispatch) => {
   dispatch({
      type: type,
      payload: response.data.errors
         ? response.data.errors
         : {
              type: response.statusText,
              status: response.status,
              msg: response.data.msg,
           },
   });
};
