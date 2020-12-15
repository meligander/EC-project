import { PENALTY_REGISTERED, PENALTY_ERROR, PENALTY_LOADED } from "./types";
import { setAlert } from "./alert";
import { updateLoadingSpinner } from "./mixvalues";
import axios from "axios";

export const loadPenalty = () => async (dispatch) => {
   try {
      dispatch(updateLoadingSpinner(true));
      const res = await axios.get("/api/penalty/last");
      dispatch({
         type: PENALTY_LOADED,
         payload: res.data,
      });
      dispatch(updateLoadingSpinner(false));
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
      window.scrollTo(500, 0);
      dispatch(updateLoadingSpinner(false));
   }
};

export const updatePenalty = (formData) => async (dispatch) => {
   try {
      dispatch(updateLoadingSpinner(true));
      window.scrollTo(500, 0);

      let penalty = JSON.stringify(formData);
      const config = {
         headers: {
            "Content-Type": "application/json",
         },
      };
      const res = await axios.post("/api/penalty", penalty, config);
      dispatch({
         type: PENALTY_REGISTERED,
         payload: res.data,
      });
      dispatch(updateLoadingSpinner(false));
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

      window.scrollTo(500, 0);
      dispatch(updateLoadingSpinner(false));
   }
};
