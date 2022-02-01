import format from "date-fns/format";
import api from "../utils/api";
import { saveAs } from "file-saver";
import history from "../utils/history";

import { setAlert } from "./alert";
import { updateLoadingSpinner } from "./mixvalues";

import {
   REGISTER_LOADED,
   REGISTERS_LOADED,
   REGISTER_CLOSED,
   REGISTER_DELETED,
   REGISTERS_CLEARED,
   REGISTER_ERROR,
   REGISTERS_ERROR,
   REGISTER_CLEARED,
} from "./types";

export const loadRegister = (spinner) => async (dispatch) => {
   if (spinner) dispatch(updateLoadingSpinner(true));
   let error = false;

   try {
      const res = await api.get(`/register/last`);
      dispatch({
         type: REGISTER_LOADED,
         payload: res.data,
      });
   } catch (err) {
      if (err.response.status !== 401)
         dispatch(setRegistersError(REGISTER_ERROR, err.response));
      else error = true;
   }

   if (!error && spinner) dispatch(updateLoadingSpinner(false));
};

export const loadRegisters =
   (filterData, spinner, byMonth) => async (dispatch) => {
      if (spinner) dispatch(updateLoadingSpinner(true));
      let error = false;

      let filter = "";
      if (!byMonth) {
         const filternames = Object.keys(filterData);
         for (let x = 0; x < filternames.length; x++) {
            const name = filternames[x];
            if (filterData[name] !== "") {
               if (filter !== "") filter = filter + "&";
               filter = filter + filternames[x] + "=" + filterData[name];
            }
         }
      }

      try {
         const res = await api.get(
            byMonth ? "/register/year/bymonth" : `/register?${filter}`
         );
         dispatch({
            type: REGISTERS_LOADED,
            payload: res.data,
         });
      } catch (err) {
         if (err.response.status !== 401) {
            dispatch(setRegistersError(REGISTERS_ERROR, err.response));
            dispatch(setAlert(err.response.data.msg, "danger", "2"));
            window.scrollTo(0, 0);
         } else error = true;
      }

      if (!error && spinner) dispatch(updateLoadingSpinner(false));
   };

export const createRegister = (formData) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

   let register = {};
   for (const prop in formData) {
      if (formData[prop] !== "" && formData[prop] !== 0) {
         register[prop] = formData[prop];
      }
   }
   try {
      await api.post("/register", register);

      dispatch(clearRegisters());

      history.push("/index/dashboard/0");

      dispatch(
         setAlert("Caja Abierta para Transacciones", "success", "1", 7000)
      );
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setRegistersError(REGISTER_ERROR, err.response));

         if (err.response.data.errors)
            err.response.data.errors.forEach((error) => {
               dispatch(setAlert(error.msg, "danger", "2"));
            });
         else dispatch(setAlert(err.response.data.msg, "danger", "2"));
      } else error = true;
   }

   if (!error) {
      window.scroll(0, 0);
      dispatch(updateLoadingSpinner(false));
   }
};

export const closeRegister = (formData) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

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

      history.push("/index/dashboard/0");
      dispatch(setAlert("Caja del día Cerrada", "success", "1", 7000));
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setRegistersError(REGISTER_ERROR, err.response));
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
      } else error = true;
   }

   if (!error) {
      window.scrollTo(0, 0);
      dispatch(updateLoadingSpinner(false));
   }
};

export const deleteRegister = (register_id) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

   try {
      await api.delete(`/register/${register_id}`);

      dispatch({
         type: REGISTER_DELETED,
         payload: register_id,
      });

      dispatch(setAlert("Cierre de Caja Eliminado", "success", "2"));
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setRegistersError(REGISTER_ERROR, err.response));
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
      } else error = true;
   }

   if (!error) {
      window.scrollTo(0, 0);
      dispatch(updateLoadingSpinner(false));
   }
};

export const registerPDF = (registers) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

   try {
      await api.post("/pdf/register/list", registers);

      const pdf = await api.get("/pdf/register/fetch", {
         responseType: "blob",
      });

      const pdfBlob = new Blob([pdf.data], { type: "application/pdf" });

      saveAs(
         pdfBlob,
         `${
            registers[0].temporary !== undefined
               ? "Caja Diaria"
               : "Cajas Mensuales"
         } ${format(new Date(), "dd-MM-yy")}.pdf`
      );

      dispatch(setAlert("PDF Generado", "success", "2"));
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setRegistersError(REGISTER_ERROR, err.response));
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
      } else error = true;
   }

   if (!error) {
      window.scrollTo(0, 0);
      dispatch(updateLoadingSpinner(false));
   }
};

export const clearRegister = () => (dispatch) => {
   dispatch({ type: REGISTER_CLEARED });
};

export const clearRegisters = () => (dispatch) => {
   dispatch({ type: REGISTERS_CLEARED });
};

const setRegistersError = (type, response) => (dispatch) => {
   dispatch({
      type: type,
      payload: response.data.errors
         ? response.data.errors
         : {
              type: response.statusText,
              status: response.status,
              msg: response.data.msg,
           },
   });
};
