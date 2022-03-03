import format from "date-fns/format";
import api from "../utils/api";
import { saveAs } from "file-saver";
import history from "../utils/history";
import store from "../utils/store";

import {
   filterData,
   newObject,
   updateLoadingSpinner,
   setError,
} from "./mixvalues";
import { addUserToList, clearUsers, removeUserFromList } from "./user";
import { setAlert } from "./alert";

import {
   CLASS_LOADED,
   CLASSES_LOADED,
   ACTIVECLASSES_LOADED,
   CLASS_REGISTERED,
   CLASSSTUDENT_ADDED,
   CLASS_UPDATED,
   CLASSSTUDENT_REMOVED,
   CLASS_DELETED,
   CLASS_CLEARED,
   CLASSES_CLEARED,
   CLASS_ERROR,
   CLASSES_ERROR,
   CLASSCATEGORY_UPDATED,
   CLASSES_PDF_ERROR,
} from "./types";

export const loadClass = (_id, spinner, user) => async (dispatch) => {
   if (spinner) dispatch(updateLoadingSpinner(true));
   try {
      let res;

      if (_id !== "0")
         res = await api.get(`/class/${user ? "student/" : ""}${_id}`);

      dispatch({
         type: CLASS_LOADED,
         payload: _id === "0" ? null : res.data,
      });
   } catch (err) {
      if (err.response.status !== 401)
         dispatch(setError(CLASS_ERROR, err.response));
   }
   if (spinner) dispatch(updateLoadingSpinner(false));
};

export const getActiveClasses = () => async (dispatch) => {
   try {
      let res = await api.get("/class");

      dispatch({
         type: ACTIVECLASSES_LOADED,
         payload: res.data.length,
      });
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setError(CLASSES_ERROR, err.response));
         window.scroll(0, 0);
      }
   }
};

export const loadClasses = (formData, spinner) => async (dispatch) => {
   if (spinner) dispatch(updateLoadingSpinner(true));
   let error = false;

   try {
      const res = await api.get(`/class?${filterData(formData)}`);

      dispatch({
         type: CLASSES_LOADED,
         payload: res.data,
      });
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setError(CLASSES_ERROR, err.response));
         if (spinner) dispatch(setAlert(err.response.data.msg, "danger", "2"));
         window.scrollTo(0, 0);
      } else error = true;
   }

   if (!error && spinner) dispatch(updateLoadingSpinner(false));
};

export const registerUpdateClass = (formData) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

   let newClass = newObject(formData);

   try {
      let res;

      if (!newClass._id) res = await api.post("/class", newClass);
      else res = await api.put(`/class/${newClass._id}`, newClass);

      if (store.getState().classes.loading) loadClasses({}, false);
      else
         dispatch({
            type: !newClass._id ? CLASS_REGISTERED : CLASS_UPDATED,
            payload: res.data,
         });

      dispatch(
         setAlert(
            !newClass._id ? "Nueva Clase Creada" : "Clase Modificada",
            "success",
            "2"
         )
      );
      history.push("/class/all");
      dispatch(clearUsers());
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setError(CLASS_ERROR, err.response));

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

export const addStudent = (student, classInfo) => (dispatch) => {
   let exist = classInfo
      ? classInfo.students.some((item) => item._id === student._id)
      : false;

   if (!exist) {
      dispatch({
         type: CLASSSTUDENT_ADDED,
         payload: student,
      });
      dispatch(removeUserFromList(student._id));
      dispatch(
         setAlert("El alumno se ha agregado correctamente", "success", "3")
      );
   } else {
      dispatch(setAlert("El alumno ya ha sido agregado", "danger", "3"));
   }
};

export const removeStudent = (student) => (dispatch) => {
   dispatch({
      type: CLASSSTUDENT_REMOVED,
      payload: student._id,
   });
   dispatch(addUserToList(student));
};

export const updateClassCategory = (category) => (dispatch) => {
   dispatch({
      type: CLASSCATEGORY_UPDATED,
      payload: category,
   });
};

export const deleteClass = (class_id) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

   try {
      await api.delete(`/class/${class_id}`);

      if (store.getState().classes.loading) dispatch(loadClasses({}, false));
      else
         dispatch({
            type: CLASS_DELETED,
            payload: class_id,
         });

      history.push("/class/all");
      dispatch(setAlert("Clase Eliminada", "success", "2"));
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setError(CLASS_ERROR, err.response));
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
      } else error = true;
   }

   if (!error) {
      window.scrollTo(0, 0);
      dispatch(updateLoadingSpinner(false));
   }
};

export const classPDF = (info, type) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

   try {
      let pdf;
      let name = "";

      switch (type) {
         case "classes":
            await api.post("/pdf/class/list", info);

            name = "Clases";
            break;
         case "class":
            await api.post("/pdf/class/one", info);

            name = `Clase ${info.category} de ${info.teacher}`;
            break;
         default:
            break;
      }

      pdf = await api.get("/pdf/class/fetch", {
         responseType: "blob",
      });

      const pdfBlob = new Blob([pdf.data], { type: "application/pdf" });

      saveAs(pdfBlob, `${name} ${format(new Date(), "dd-MM-yy")}.pdf`);

      dispatch(setAlert("PDF Generado", "success", "2"));
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setError(CLASSES_PDF_ERROR, err.response));
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
      }
   }

   if (!error) {
      window.scrollTo(0, 0);
      dispatch(updateLoadingSpinner(false));
   }
};

export const clearClass = () => (dispatch) => {
   dispatch({
      type: CLASS_CLEARED,
   });
};

export const clearClasses = () => (dispatch) => {
   dispatch({
      type: CLASSES_CLEARED,
   });
};
