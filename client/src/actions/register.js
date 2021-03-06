import moment from "moment";
import api from "../utils/api";
import { saveAs } from "file-saver";

import { setAlert } from "./alert";
import { updateLoadingSpinner } from "./mixvalues";
import { clearProfile } from "./user";

import {
   REGISTER_LOADED,
   REGISTERS_LOADED,
   NEWREGISTER_ADDED,
   REGISTER_CLOSED,
   NEWREGISTER_ALLOWED,
   REGISTER_DELETED,
   REGISTERS_CLEARED,
   REGISTER_ERROR,
} from "./types";

export const loadRegister = () => async (dispatch) => {
   try {
      const res = await api.get(`/register/last`);
      dispatch({
         type: REGISTER_LOADED,
         payload: res.data,
      });
   } catch (err) {
      dispatch({
         type: REGISTER_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
   }
};

export const loadRegisters = (filterData) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   let filter = "";
   const filternames = Object.keys(filterData);
   for (let x = 0; x < filternames.length; x++) {
      const name = filternames[x];
      if (filterData[name] !== "") {
         if (filter !== "") filter = filter + "&";
         filter = filter + filternames[x] + "=" + filterData[name];
      }
   }
   try {
      const res = await api.get(`/register?${filter}`);
      dispatch({
         type: REGISTERS_LOADED,
         payload: res.data,
      });
   } catch (err) {
      const msg = err.response.data.msg;
      const type = err.response.statusText;
      dispatch({
         type: REGISTER_ERROR,
         payload: {
            type,
            status: err.response.status,
            msg,
         },
      });
      dispatch(setAlert(msg ? msg : type, "danger", "2"));
      window.scrollTo(0, 0);
   }

   dispatch(updateLoadingSpinner(false));
};

export const loadRegistersByMonth = () => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   try {
      const res = await api.get("/register/year/bymonth");
      dispatch({
         type: REGISTERS_LOADED,
         payload: res.data,
      });
   } catch (err) {
      const msg = err.response.data.msg;
      const type = err.response.statusText;
      dispatch({
         type: REGISTER_ERROR,
         payload: {
            type,
            status: err.response.status,
            msg,
         },
      });
      dispatch(setAlert(msg ? msg : type, "danger", "2"));
      window.scrollTo(0, 0);
   }

   dispatch(updateLoadingSpinner(false));
};

export const createRegister = (formData, user_id, history) => async (
   dispatch
) => {
   dispatch(updateLoadingSpinner(true));

   let register = {};
   for (const prop in formData) {
      if (formData[prop] !== "" && formData[prop] !== 0) {
         register[prop] = formData[prop];
      }
   }
   try {
      await api.post("/register", register);

      dispatch({ type: NEWREGISTER_ADDED });
      dispatch(clearRegisters());

      dispatch(clearProfile());
      history.push(`/dashboard/${user_id}`);

      dispatch(
         setAlert("Caja Abierta para Transacciones", "success", "1", 7000)
      );
   } catch (err) {
      if (err.response.data.errors) {
         const errors = err.response.data.errors;
         errors.forEach((error) => {
            dispatch(setAlert(error.msg, "danger", "2"));
         });
         dispatch({
            type: REGISTER_ERROR,
            payload: errors,
         });
      } else {
         const msg = err.response.data.msg;
         const type = err.response.statusText;
         dispatch({
            type: REGISTER_ERROR,
            payload: {
               type,
               status: err.response.status,
               msg,
            },
         });
         dispatch(setAlert(msg ? msg : type, "danger", "2"));
      }
   }

   window.scroll(0, 0);
   dispatch(updateLoadingSpinner(false));
};

export const closeRegister = (formData, user_id, history) => async (
   dispatch
) => {
   dispatch(updateLoadingSpinner(true));

   try {
      let register = {};
      for (const prop in formData) {
         if (formData[prop] !== "" || formData[prop] === true)
            register[prop] = formData[prop];
      }

      await api.put("/register", register);

      dispatch({
         type: REGISTER_CLOSED,
      });

      dispatch(clearRegisters());

      history.push(`/dashboard/${user_id}`);
      dispatch(setAlert("Caja del día Cerrada", "success", "1", 7000));
   } catch (err) {
      const msg = err.response.data.msg;
      const type = err.response.statusText;
      dispatch({
         type: REGISTER_ERROR,
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

export const deleteRegister = (register_id) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   try {
      await api.delete(`/register/${register_id}`);

      dispatch({
         type: REGISTER_DELETED,
         payload: register_id,
      });
      dispatch(setAlert("Cierre de Caja Eliminado", "success", "2"));

      dispatch({ type: REGISTERS_CLEARED });
   } catch (err) {
      const msg = err.response.data.msg;
      const type = err.response.statusText;
      dispatch({
         type: REGISTER_ERROR,
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

export const registerPDF = (registers) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   try {
      await api.post("/register/create-list", registers);

      const pdf = await api.get("/register/fetch-list", {
         responseType: "blob",
      });

      const pdfBlob = new Blob([pdf.data], { type: "application/pdf" });

      const date = moment().format("DD-MM-YY");

      saveAs(
         pdfBlob,
         `${
            registers[0].temporary !== undefined
               ? "Caja Diaria"
               : "Cajas Mensuales"
         } ${date}.pdf`
      );

      dispatch(setAlert("PDF Generado", "success", "2"));
   } catch (err) {
      const msg = err.response.data.msg;
      const type = err.response.statusText;
      dispatch({
         type: REGISTER_ERROR,
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

export const allowNewRegister = () => (dispatch) => {
   dispatch({ type: NEWREGISTER_ALLOWED });
};

export const clearRegisters = () => (dispatch) => {
   dispatch({ type: REGISTERS_CLEARED });
};
