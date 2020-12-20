import axios from "axios";

import { setAlert } from "./alert";
import { updateLoadingSpinner } from "./mixvalues";
import { clearNeighbourhoods } from "./neighbourhood";

import {
   TOWNS_ERROR,
   TOWNS_LOADED,
   TOWNS_UPDATED,
   TOWNS_CLEARED,
} from "./types";

export const loadTowns = () => async (dispatch) => {
   try {
      const res = await axios.get("/api/town");
      dispatch({
         type: TOWNS_LOADED,
         payload: res.data,
      });
   } catch (err) {
      dispatch({
         type: TOWNS_ERROR,
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

export const updateTowns = (formData) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   try {
      let towns = JSON.stringify(formData);
      const config = {
         headers: {
            "Content-Type": "application/json",
         },
      };
      const res = await axios.post("/api/town", towns, config);
      dispatch({
         type: TOWNS_UPDATED,
         payload: res.data,
      });
      dispatch(setAlert("Localidades Modificadas", "success", "2"));
      dispatch(clearTowns());
      dispatch(clearNeighbourhoods());
   } catch (err) {
      dispatch({
         type: TOWNS_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
   }

   window.scrollTo(0, 0);
   dispatch(updateLoadingSpinner(false));
};

export const clearTowns = () => (dispatch) => {
   dispatch({
      type: TOWNS_CLEARED,
   });
};
