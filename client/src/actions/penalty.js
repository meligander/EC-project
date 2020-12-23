import axios from "axios";

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
      const res = await axios.get("/api/penalty/last");
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
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
      window.scrollTo(0, 0);
   }
};

export const updatePenalty = (formData) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   try {
      let penalty = JSON.stringify(formData);
      const config = {
         headers: {
            "Content-Type": "application/json",
         },
      };
      await axios.post("/api/penalty", penalty, config);
      dispatch({
         type: PENALTY_REGISTERED,
      });
      dispatch(setAlert("Recargo Modificado", "success", "4"));
   } catch (err) {
      if (err.response.data.erros) {
         const errors = err.response.data.errors;
         errors.forEach((error) => {
            dispatch(setAlert(error.msg, "danger", "2"));
         });
         dispatch({
            type: PENALTY_ERROR,
            payload: errors,
         });
      } else {
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
         dispatch({
            type: PENALTY_ERROR,
            payload: {
               type: err.response.statusText,
               status: err.response.status,
               msg: err.response.data.msg,
            },
         });
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
