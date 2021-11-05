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
      if (err.response.status !== 401) {
         dispatch(setPenaltiesError(PENALTY_ERROR, err.response));
         window.scrollTo(0, 0);
      }
   }
};

export const updatePenalty = (penalty) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

   try {
      await api.post("/penalty", penalty);
      dispatch({
         type: PENALTY_REGISTERED,
      });
      dispatch(clearPenalty());
      dispatch(setAlert("Recargo Modificado", "success", "2"));
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setPenaltiesError(PENALTY_ERROR, err.response));

         if (err.response.data.errors)
            err.response.data.errors.forEach((error) => {
               dispatch(setAlert(error.msg, "danger", "2"));
            });
         else dispatch(setAlert(err.response.data.msg, "danger", "2"));
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

const setPenaltiesError = (type, response) => (dispatch) => {
   dispatch({
      type: type,
      payload: {
         type: response.statusText,
         status: response.status,
         msg: response.data.msg,
      },
   });
};
