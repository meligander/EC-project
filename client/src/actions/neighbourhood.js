import axios from "axios";

import { updateLoadingSpinner } from "./mixvalues";
import { setAlert } from "./alert";

import {
   NEIGHBOURHOODS_LOADED,
   NEIGHBOURHOODS_ERROR,
   NEIGHBOURHOODS_UPDATED,
   NEIGHBOURHOODS_CLEARED,
} from "./types";

export const loadTownNeighbourhoods = (town_id) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   try {
      const res = await axios.get(`/api/neighbourhood/town/${town_id}`);
      dispatch({
         type: NEIGHBOURHOODS_LOADED,
         payload: res.data,
      });
   } catch (err) {
      dispatch({
         type: NEIGHBOURHOODS_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
      window.scroll(0, 0);
   }

   dispatch(updateLoadingSpinner(false));
};

export const loadNeighbourhoods = () => async (dispatch) => {
   try {
      const res = await axios.get("/api/neighbourhood");
      dispatch({
         type: NEIGHBOURHOODS_LOADED,
         payload: res.data,
      });
   } catch (err) {
      dispatch({
         type: NEIGHBOURHOODS_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
      window.scroll(0, 0);
   }
};

export const updateNeighbourhoods = (formData) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   try {
      let neighbourhoods = JSON.stringify(formData);

      const config = {
         headers: {
            "Content-Type": "application/json",
         },
      };
      const res = await axios.post(
         "/api/neighbourhood",
         neighbourhoods,
         config
      );
      dispatch({
         type: NEIGHBOURHOODS_UPDATED,
         payload: res.data,
      });

      dispatch(setAlert("Barrios Modificados", "success", "2"));
      dispatch(clearNeighbourhoods());
   } catch (err) {
      dispatch({
         type: NEIGHBOURHOODS_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
   }

   window.scroll(0, 0);
   dispatch(updateLoadingSpinner(false));
};

export const clearNeighbourhoods = () => (dispatch) => {
   dispatch({
      type: NEIGHBOURHOODS_CLEARED,
   });
};
