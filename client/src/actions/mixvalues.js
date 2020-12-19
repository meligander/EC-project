import axios from "axios";
import {
   ADMIN_DASH_LOADED,
   INVOICENUMBER_LOADED,
   STUDENTNUMBER_LOADED,
   TOTAL_DEBT_LOADED,
   LOADING_SPINNER_UPDATED,
   VALUES_CLEARED,
   VALUES_ERROR,
   SEARCH_PAGE_CHANGED,
   LOADING_ADMINDASH_UPDATED,
   INVOICE_NUMBER_UPDATED,
} from "./types";
import { setAlert } from "./alert";

export const getStudentNumber = () => async (dispatch) => {
   try {
      let res = await axios.get("/api/users/register/number");
      dispatch({
         type: STUDENTNUMBER_LOADED,
         payload: res.data,
      });
   } catch (err) {
      dispatch({
         type: VALUES_ERROR,
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

export const getTotalDebt = () => async (dispatch) => {
   try {
      let res = await axios.get("/api/installment/month/debts");

      dispatch({
         type: TOTAL_DEBT_LOADED,
         payload: res.data,
      });
   } catch (err) {
      dispatch({
         type: VALUES_ERROR,
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

export const getAdminDash = () => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   try {
      let payload = {};
      let res = await axios.get("/api/installment/month/debts");
      payload.totalDebt = res.data;
      res = await axios.get("/api/users/active/Alumno");
      payload.activeStudents = res.data;
      res = await axios.get("/api/users/active/Profesor");
      payload.activeTeachers = res.data;
      res = await axios.get("/api/class/year/active");
      payload.activeClasses = res.data;
      res = await axios.get("/api/enrollment/year");
      payload.enrollments = res.data;

      dispatch({
         type: ADMIN_DASH_LOADED,
         payload,
      });
   } catch (err) {
      dispatch({
         type: VALUES_ERROR,
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

export const getInvoiceNumber = () => async (dispatch) => {
   try {
      let res = await axios.get("/api/invoice/id");
      dispatch({
         type: INVOICENUMBER_LOADED,
         payload: res.data,
      });
   } catch (err) {
      dispatch({
         type: VALUES_ERROR,
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

export const clearValues = () => (dispatch) => {
   dispatch({
      type: VALUES_CLEARED,
   });
};

export const updateInvoiceNumber = () => (dispatch) => {
   dispatch({
      type: INVOICE_NUMBER_UPDATED,
   });
};

export const updateLoadingSpinner = (bool) => (dispatch) => {
   dispatch({
      type: LOADING_SPINNER_UPDATED,
      payload: bool,
   });
};

export const updatePageNumber = (page) => (dispatch) => {
   dispatch({
      type: SEARCH_PAGE_CHANGED,
      payload: page,
   });
};

export const updateAdminDashLoading = () => (dispatch) => {
   dispatch({
      type: LOADING_ADMINDASH_UPDATED,
   });
};
