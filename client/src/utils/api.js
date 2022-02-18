import axios from "axios";
import store from "./store";

import { logOut, setAuthError } from "../actions/auth";
import { updateLoadingSpinner } from "../actions/mixvalues";
import { setAlert } from "../actions/alert";
import { AUTH_ERROR } from "../actions/types";

const api = axios.create({
   baseURL: "/api",
   headers: {
      "Content-Type": "application/json",
   },
});
/**
 intercept any error responses from the api
 and check if the token is no longer valid.
 ie. Token has expired or user is no longer
 authenticated.
 logout the user if the token has expired
**/

api.interceptors.response.use(
   (res) => res,
   (err) => {
      if (err.response.status === 401) {
         store.dispatch(logOut());
         if (
            !store
               .getState()
               .alert.some((item) => item.msg === err.response.data.msg)
         ) {
            store.dispatch(setAlert(err.response.data.msg, "danger", "0"));
            store.dispatch(setAuthError(AUTH_ERROR, err.response));
            store.dispatch(updateLoadingSpinner(false));
            window.scrollTo(0, 0);
         }
      }
      return Promise.reject(err);
   }
);

export default api;
