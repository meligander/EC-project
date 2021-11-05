import api from "../utils/api";

import { updateLoadingSpinner } from "./mixvalues";
import { setAlert } from "./alert";

import {
   NEIGHBOURHOODS_LOADED,
   NEIGHBOURHOODS_UPDATED,
   NEIGHBOURHOOD_DELETED,
   NEIGHBOURHOODS_CLEARED,
   NEIGHBOURHOODS_ERROR,
   NEIGHBOURHOOD_ERROR,
} from "./types";

export const loadNeighbourhoods = (town_id) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

   try {
      const res = await api.get(
         `/neighbourhood${town_id ? `/town/${town_id}` : ""}`
      );
      dispatch({
         type: NEIGHBOURHOODS_LOADED,
         payload: res.data,
      });
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setNeightbourhoodError(NEIGHBOURHOODS_ERROR, err.response));
         if (!town_id) window.scroll(0, 0);
      } else error = true;
   }

   if (!error) dispatch(updateLoadingSpinner(false));
};

export const updateNeighbourhoods = (formData) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

   try {
      const res = await api.post("/neighbourhood", formData);

      dispatch({
         type: NEIGHBOURHOODS_UPDATED,
         payload: res.data,
      });

      dispatch(setAlert("Barrios Modificados", "success", "2"));
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setNeightbourhoodError(NEIGHBOURHOOD_ERROR, err.response));
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
      } else error = true;
   }

   if (!error) {
      window.scroll(0, 0);
      dispatch(updateLoadingSpinner(false));
   }
};

export const deleteNeighbourhood = (toDelete) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

   try {
      await api.delete(`/neighbourhood/${toDelete}`);

      dispatch({
         type: NEIGHBOURHOOD_DELETED,
         payload: toDelete,
      });

      dispatch(setAlert("Barrio Eliminado", "success", "2"));
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setNeightbourhoodError(NEIGHBOURHOOD_ERROR, err.response));
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
      } else error = true;
   }

   if (!error) {
      window.scrollTo(0, 0);
      dispatch(updateLoadingSpinner(false));
   }
};

export const clearNeighbourhoods = () => (dispatch) => {
   dispatch({
      type: NEIGHBOURHOODS_CLEARED,
   });
};

const setNeightbourhoodError = (type, response) => (dispatch) => {
   dispatch({
      type: type,
      payload: {
         type: response.statusText,
         status: response.status,
         msg: response.data.msg,
      },
   });
};
