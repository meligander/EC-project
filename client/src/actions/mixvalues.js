import axios from "axios";

import { setAlert } from "./alert";

import {
   ADMIN_DASH_LOADED,
   INVOICENUMBER_LOADED,
   STUDENTNUMBER_LOADED,
   TOTAL_DEBT_LOADED,
   LOADING_SPINNER_UPDATED,
   VALUES_CLEARED,
   VALUES_ERROR,
   SEARCH_PAGE_CHANGED,
   INVOICENUMBER_CLEARED,
   STUDENTNUMBER_CLEARED,
   PREVPAGE_UPDATED,
} from "./types";

export const getStudentNumber = () => async (dispatch) => {
   try {
      let res = await axios.get("/api/user/register/number");
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
      let res;
      res = await axios.get("/api/installment/month/debts");
      payload.totalDebt = res.data;
      res = await axios.get("/api/user?active=true&type=Alumno");
      payload.activeStudents = res.data.length;
      res = await axios.get("/api/user?active=true&type=Profesor");
      payload.activeTeachers = res.data.length;
      res = await axios.get("/api/class");
      payload.activeClasses = res.data.length;
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

export const clearInvoiceNumber = () => (dispatch) => {
   dispatch({
      type: INVOICENUMBER_CLEARED,
   });
};

export const clearStudentNumber = () => (dispatch) => {
   dispatch({
      type: STUDENTNUMBER_CLEARED,
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

export const updatePreviousPage = (page) => (dispatch) => {
   dispatch({
      type: PREVPAGE_UPDATED,
      payload: page,
   });
};
