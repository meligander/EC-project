import api from "../utils/api";

import { setAlert } from "./alert";
import { updateLoadingSpinner, setError } from "./global";
import { clearNeighbourhoods } from "./neighbourhood";

import {
   TOWNS_LOADED,
   TOWNS_UPDATED,
   TOWN_DELETED,
   TOWNS_CLEARED,
   TOWNS_ERROR,
} from "./types";

export const loadTowns = (spinner) => async (dispatch) => {
   if (spinner) dispatch(updateLoadingSpinner(true));
   try {
      const res = await api.get("/town");
      dispatch({
         type: TOWNS_LOADED,
         payload: res.data,
      });
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setError(TOWNS_ERROR, err.response));
         window.scrollTo(0, 0);
      }
   }
   if (spinner) dispatch(updateLoadingSpinner(false));
};

export const updateTowns = (formData) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

   try {
      const res = await api.post("/town", formData);

      dispatch({
         type: TOWNS_UPDATED,
         payload: res.data,
      });

      dispatch(clearNeighbourhoods());

      dispatch(setAlert("Localidades Modificadas", "success", "2"));
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setError(TOWNS_ERROR, err.response));
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
      } else error = true;
   }

   if (!error) {
      window.scrollTo(0, 0);
      dispatch(updateLoadingSpinner(false));
   }
};

export const deleteTown = (town_id) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

   try {
      await api.delete(`/town/${town_id}`);

      dispatch(clearNeighbourhoods());

      dispatch({
         type: TOWN_DELETED,
         payload: town_id,
      });

      dispatch(
         setAlert("Localidad y Barrios Relacionados Eliminados", "success", "2")
      );
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setError(TOWNS_ERROR, err.response));
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
      } else error = true;
   }

   if (!error) {
      window.scrollTo(0, 0);
      dispatch(updateLoadingSpinner(false));
   }
};

export const clearTowns = () => (dispatch) => {
   dispatch({
      type: TOWNS_CLEARED,
   });
};
