import format from "date-fns/format";
import api from "../utils/api";
import { saveAs } from "file-saver";
import history from "../utils/history";

import { setAlert } from "./alert";
import {
   filterData,
   newObject,
   updateLoadingSpinner,
   setError,
} from "./mixvalues";
import { clearSearch } from "./user";

import {
   INSTALLMENT_LOADED,
   TOTALDEBT_LOADED,
   INSTALLMENTS_LOADED,
   INSTALLMENT_UPDATED,
   INSTALLMENT_REGISTERED,
   INSTALLMENT_DELETED,
   EXPIREDINSTALLMENTS_UPDATED,
   INSTALLMENT_CLEARED,
   INSTALLMENTS_CLEARED,
   INSTALLMENTS_ERROR,
   INSTALLMENT_ERROR,
} from "./types";

export const loadInstallment =
   (installment_id, spinner) => async (dispatch) => {
      if (spinner) dispatch(updateLoadingSpinner(true));
      try {
         const res = await api.get(`/installment/${installment_id}`);
         dispatch({
            type: INSTALLMENT_LOADED,
            payload: res.data,
         });
      } catch (err) {
         if (err.response.status !== 401) {
            dispatch(setError(INSTALLMENT_ERROR, err.response));
            if (spinner)
               dispatch(setAlert(err.response.data.msg, "danger", "4"));
         }
      }
      if (spinner) dispatch(updateLoadingSpinner(false));
   };

export const getTotalDebt = () => async (dispatch) => {
   try {
      let res = await api.get("/installment/month/debts");

      dispatch({
         type: TOTALDEBT_LOADED,
         payload: res.data,
      });
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setError(INSTALLMENTS_ERROR, err.response));
         window.scroll(0, 0);
      }
   }
};

export const loadInstallments =
   (formData, spinner, student, type) => async (dispatch) => {
      if (spinner) dispatch(updateLoadingSpinner(true));
      let error = false;
      try {
         let res;
         if (student) {
            if (!formData.student) {
               const errorMessage = {
                  response: {
                     status: 402,
                     data: {
                        msg: "Debe buscar un usuario primero",
                     },
                  },
               };
               throw errorMessage;
            } else {
               res = await api.get(
                  `/installment/student/${formData.student._id}/${type}`
               );
               if (spinner) dispatch(clearSearch());
            }
         } else res = await api.get(`/installment?${filterData(formData)}`);

         dispatch({
            type: INSTALLMENTS_LOADED,
            payload: res.data,
         });
      } catch (err) {
         if (err.response.status !== 401) {
            dispatch(setError(INSTALLMENTS_ERROR, err.response));
            if (spinner)
               dispatch(setAlert(err.response.data.msg, "danger", "2"));
         } else error = true;
      }

      if (spinner && !error) dispatch(updateLoadingSpinner(false));
   };

export const updateIntallment = (formData, loaded) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

   let installment = newObject({
      ...formData,
      ...(formData.student._id && { student: formData.student._id }),
   });

   try {
      if (!loaded)
         dispatch(
            loadInstallments(
               { student: installment.student },
               false,
               true,
               "all"
            )
         );

      let res;
      if (!installment._id) res = await api.post("/installment", installment);
      else res = await api.put(`/installment/${installment._id}`, installment);
      dispatch({
         type: installment._id ? INSTALLMENT_UPDATED : INSTALLMENT_REGISTERED,
         payload: res.data,
      });

      dispatch(
         setAlert(
            installment._id ? "Cuota Modificada" : "Cuota Agregada",
            "success",
            "2"
         )
      );
      history.push(`/index/installments/${installment.student}`);
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setError(INSTALLMENT_ERROR, err.response));
         if (err.response.data.errors)
            err.response.data.errors.forEach((error) => {
               dispatch(setAlert(error.msg, "danger", "2"));
            });
         else dispatch(setAlert(err.response.data.msg, "danger", "2"));
      } else error = true;
   }

   if (!error) {
      window.scrollTo(0, 0);
      dispatch(updateLoadingSpinner(false));
   }
};

export const updateExpiredIntallments = () => async (dispatch) => {
   try {
      await api.put("/installment");

      dispatch({
         type: EXPIREDINSTALLMENTS_UPDATED,
      });
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setError(INSTALLMENTS_ERROR, err.response));
         dispatch(setAlert(err.response.data.msg, "danger", "1", 7000));
         window.scroll(0, 0);
      }
   }
};

export const deleteInstallment = (_id) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

   try {
      await api.delete(`/installment/${_id}`);

      dispatch({
         type: INSTALLMENT_DELETED,
         payload: _id,
      });

      dispatch(setAlert("Cuota eliminada", "success", "2"));
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setError(INSTALLMENT_ERROR, err.response));
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
      } else error = true;
   }

   if (!error) {
      window.scroll(0, 0);
      dispatch(updateLoadingSpinner(false));
   }
};

export const installmentsPDF = (installments) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

   try {
      await api.post("/pdf/installment/list", installments);

      const pdf = await api.get("/pdf/installment/fetch", {
         responseType: "blob",
      });

      const pdfBlob = new Blob([pdf.data], { type: "application/pdf" });

      saveAs(pdfBlob, `Deudas ${format(new Date(), "dd-MM-yy")}.pdf`);

      dispatch(setAlert("PDF Generado", "success", "2"));
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setError(INSTALLMENTS_ERROR, err.response));
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
      } else error = true;
   }

   if (!error) {
      window.scroll(0, 0);
      dispatch(updateLoadingSpinner(false));
   }
};

export const clearInstallment = () => (dispatch) => {
   dispatch({
      type: INSTALLMENT_CLEARED,
   });
};

export const clearInstallments = () => (dispatch) => {
   dispatch({
      type: INSTALLMENTS_CLEARED,
   });
};
