import api from "../utils/api";

import { setAlert } from "./alert";
import { updateLoadingSpinner, setError, togglePopup } from "./mixvalues";

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
      if (err.response.status !== 401) {
         dispatch(setError(PENALTY_ERROR, err.response));
         window.scrollTo(0, 0);
      }
   }
};

export const updatePenalty = (penalty) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

   try {
      const res = await api.post("/penalty", penalty);

      dispatch({
         type: PENALTY_REGISTERED,
         payload: res.data,
      });

      dispatch(setAlert("Recargo Modificado", "success", "2"));
      dispatch(togglePopup("default"));
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setError(PENALTY_ERROR, err.response));

         if (err.response.data.errors)
            err.response.data.errors.forEach((error) => {
               dispatch(setAlert(error.msg, "danger", "4"));
            });
         else dispatch(setAlert(err.response.data.msg, "danger", "4"));
      } else error = true;
   }

   if (!error) {
      window.scrollTo(0, 0);
      dispatch(updateLoadingSpinner(false));
   }
};

export const clearPenalty = () => (dispatch) => {
   dispatch({
      type: PENALTY_CLEARED,
   });
};
