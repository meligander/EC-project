import moment from "moment";
import axios from "axios";
import { saveAs } from "file-saver";

import { setAlert } from "./alert";
import { updateLoadingSpinner } from "./mixvalues";

import {
   REGISTER_LOADED,
   REGISTERS_LOADED,
   REGISTER_CLOSED,
   REGISTER_DELETED,
   REGISTERS_CLEARED,
   REGISTER_ERROR,
} from "./types";

export const loadRegister = () => async (dispatch) => {
   try {
      const res = await axios.get(`/api/register/last`);
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
      const res = await axios.get(`/api/register?${filter}`);
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

      register = JSON.stringify(register);

      const config = {
         headers: {
            "Content-Type": "application/json",
         },
      };

      await axios.put("/api/register", register, config);

      dispatch({
         type: REGISTER_CLOSED,
      });

      history.push(`/dashboard/${user_id}`);
      dispatch(clearRegisters());
      dispatch(setAlert("Caja del día Cerrada", "success", "1"));
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
      await axios.delete(`/api/register/${register_id}`);

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

   let register = JSON.stringify(registers);

   try {
      const config = {
         headers: {
            "Content-Type": "application/json",
         },
      };

      await axios.post("/api/register/create-list", register, config);

      const pdf = await axios.get("/api/register/fetch-list", {
         responseType: "blob",
      });

      const pdfBlob = new Blob([pdf.data], { type: "application/pdf" });

      const date = moment().format("DD-MM-YY");

      saveAs(pdfBlob, `Caja Diaria ${date}.pdf`);

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

export const clearRegisters = () => (dispatch) => {
   dispatch({ type: REGISTERS_CLEARED });
};
