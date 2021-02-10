import api from "../utils/api";

import { setAlert } from "./alert";
import { updateLoadingSpinner } from "./mixvalues";

import {
   PENALTY_LOADED,
   PENALTY_REGISTERED,
   PENALTY_CLEARED,
   PENALTY_ERROR,
} from "./types";

export const loadPenalty = () => async (dispatch) => {
   try {
      const res = await api.get("/penalty/last");
      dispatch({
         type: PENALTY_LOADED,
         payload: res.data,
      });
   } catch (err) {
      dispatch({
         type: PENALTY_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
      window.scrollTo(0, 0);
   }
};

export const updatePenalty = (penalty) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   try {
      await api.post("/penalty", penalty);
      dispatch({
         type: PENALTY_REGISTERED,
      });
      dispatch(clearPenalty());
      dispatch(setAlert("Recargo Modificado", "success", "2"));
   } catch (err) {
      if (err.response.data.errors) {
         const errors = err.response.data.errors;
         errors.forEach((error) => {
            dispatch(setAlert(error.msg, "danger", "2"));
         });
         dispatch({
            type: PENALTY_ERROR,
            payload: errors,
         });
      } else {
         const msg = err.response.data.msg;
         const type = err.response.statusText;
         dispatch({
            type: PENALTY_ERROR,
            payload: {
               type,
               status: err.response.status,
               msg,
            },
         });
         dispatch(setAlert(msg ? msg : type, "danger", "2"));
      }
   }

   window.scrollTo(0, 0);
   dispatch(updateLoadingSpinner(false));
};

export const clearPenalty = () => (dispatch) => {
   dispatch({
      type: PENALTY_CLEARED,
   });
};
