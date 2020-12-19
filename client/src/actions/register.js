import {
   REGISTER_ERROR,
   REGISTER_LOADED,
   REGISTERS_LOADED,
   REGISTER_CLOSED,
   REGISTER_CLEARED,
   REGISTER_DELETED,
} from "./types";
import { setAlert } from "./alert";
import moment from "moment";
import { saveAs } from "file-saver";
import { updateLoadingSpinner } from "./mixvalues";
import axios from "axios";

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
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
      window.scrollTo(0, 0);
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
      dispatch({
         type: REGISTER_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
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
         if (formData[prop]) register[prop] = formData[prop];
      }

      register = JSON.stringify(register);

      const config = {
         headers: {
            "Content-Type": "application/json",
         },
      };
      const res = await axios.put("/api/register", register, config);
      dispatch({
         type: REGISTER_CLOSED,
         payload: res.data,
      });

      history.push(`/dashboard/${user_id}`);
      dispatch(clearRegister());
      dispatch(setAlert("Caja del día Cerrada", "success", "1"));
   } catch (err) {
      dispatch({
         type: REGISTER_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
   }

   window.scrollTo(0, 0);
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
      dispatch({ type: REGISTER_CLEARED });
   } catch (err) {
      dispatch({
         type: REGISTER_ERROR,
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
      dispatch({
         type: REGISTER_ERROR,
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

export const clearRegister = () => (dispatch) => {
   dispatch({ type: REGISTER_CLEARED });
};
