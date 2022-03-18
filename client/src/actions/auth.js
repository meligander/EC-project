import api from "../utils/api";
import history from "../utils/history";

import { setAlert } from "./alert";
import {
   newObject,
   updateLoadingSpinner,
   setError,
   checkBackup,
   togglePopup,
} from "./global";
import { updateExpiredIntallments } from "./installment";
import { clearProfile } from "./user";

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
         if (res.data.type === "secretary" && (await dispatch(checkBackup())))
            dispatch(togglePopup("default"));
      }
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setError(AUTH_ERROR, err.response));
      }
   }
};

export const loginUser = (formData) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   let user = newObject(formData);

   try {
      const res = await api.post("/auth", user);
      dispatch({
         type: LOGIN_SUCCESS,
         payload: res.data,
      });

      dispatch(loadUser(true));
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setError(LOGIN_FAIL, err.response));

         if (err.response.data.errors)
            err.response.data.errors.forEach((error) => {
               dispatch(setAlert(error.msg, "danger", "0"));
            });
         else dispatch(setAlert(err.response.data.msg, "danger", "0"));

         window.scrollTo(0, 0);
         dispatch(updateLoadingSpinner(false));
      }
   }
};

export const logOut = () => (dispatch) => {
   dispatch({
      type: LOGOUT,
   });
   dispatch(clearProfile());
   history.push("/login");
};

export const updateAuthUser = (user) => (dispatch) => {
   dispatch({
      type: USERAUTH_UPDATED,
      payload: user,
   });
};
