import axios from "axios";

import { setAlert } from "./alert";
import { updateLoadingSpinner } from "./mixvalues";
import { clearNeighbourhoods } from "./neighbourhood";

import {
   TOWNS_LOADED,
   TOWNS_UPDATED,
   TOWN_DELETED,
   TOWNS_CLEARED,
   TOWNS_ERROR,
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
      window.scrollTo(0, 0);
   }
};

export const updateTowns = (formData) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   try {
      const res = await axios.post("/api/town", formData);

      dispatch({
         type: TOWNS_UPDATED,
         payload: res.data,
      });

      dispatch(clearNeighbourhoods());

      dispatch(setAlert("Localidades Modificadas", "success", "2"));
   } catch (err) {
      const msg = err.response.data.msg;
      const type = err.response.statusText;
      dispatch({
         type: TOWNS_ERROR,
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

export const deleteTown = (toDelete) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   try {
      await axios.delete(`/api/town/${toDelete}`);

      dispatch(clearNeighbourhoods());

      dispatch({
         type: TOWN_DELETED,
         payload: toDelete,
      });

      dispatch(
         setAlert("Localidad y Barrios Relacionados Eliminados", "success", "2")
      );
   } catch (err) {
      const msg = err.response.data.msg;
      const type = err.response.statusText;
      dispatch({
         type: TOWNS_ERROR,
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

export const clearTowns = () => (dispatch) => {
   dispatch({
      type: TOWNS_CLEARED,
   });
};
