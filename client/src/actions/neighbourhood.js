import axios from "axios";

import { updateLoadingSpinner } from "./mixvalues";
import { setAlert } from "./alert";

import {
   NEIGHBOURHOODS_LOADED,
   NEIGHBOURHOODS_UPDATED,
   NEIGHBOURHOOD_DELETED,
   NEIGHBOURHOODS_CLEARED,
   NEIGHBOURHOODS_ERROR,
} from "./types";

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
      window.scroll(0, 0);
   }
};

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
      window.scroll(0, 0);
   }

   dispatch(updateLoadingSpinner(false));
};

export const updateNeighbourhoods = (formData) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   try {
      const res = await axios.post("/api/neighbourhood", formData);

      dispatch({
         type: NEIGHBOURHOODS_UPDATED,
         payload: res.data,
      });

      dispatch(setAlert("Barrios Modificados", "success", "2"));
   } catch (err) {
      const msg = err.response.data.msg;
      const type = err.response.statusText;
      dispatch({
         type: NEIGHBOURHOODS_ERROR,
         payload: {
            type,
            status: err.response.status,
            msg,
         },
      });
      dispatch(setAlert(msg ? msg : type, "danger", "2"));
   }

   window.scroll(0, 0);
   dispatch(updateLoadingSpinner(false));
};

export const deleteNeighbourhood = (toDelete) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   try {
      await axios.delete(`/api/neighbourhood/${toDelete}`);

      dispatch({
         type: NEIGHBOURHOOD_DELETED,
         payload: toDelete,
      });

      dispatch(setAlert("Barrio Eliminado", "success", "2"));
   } catch (err) {
      const msg = err.response.data.msg;
      const type = err.response.statusText;
      dispatch({
         type: NEIGHBOURHOODS_ERROR,
         payload: {
            type,
            status: err.response.status,
            msg,
         },
      });
      dispatch(setAlert(msg ? msg : type, "danger", "2"));
   }

   window.scrollTo(0, 0);
   dispatch(updateLoadingSpinner(false));
};

export const clearNeighbourhoods = () => (dispatch) => {
   dispatch({
      type: NEIGHBOURHOODS_CLEARED,
   });
};
