import format from "date-fns/format";
import api from "../utils/api";
import { saveAs } from "file-saver";
import history from "../utils/history";

import { updateLoadingSpinner } from "./mixvalues";
import { addUserToList, removeUserFromList } from "./user";
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
} from "./types";

export const loadClass = (class_id) => async (dispatch) => {
   try {
      let res;

      if (class_id !== "0") res = await api.get(`/class/${class_id}`);

      dispatch({
         type: CLASS_LOADED,
         payload: class_id === "0" ? null : res.data,
      });
   } catch (err) {
      if (err.response.status !== 401)
         dispatch(setClassesError(CLASS_ERROR, err.response));
   }
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
         dispatch(setClassesError(CLASSES_ERROR, err.response));
         window.scroll(0, 0);
      }
   }
};

export const loadStudentClass = (user_id) => async (dispatch) => {
   try {
      const res = await api.get(`/class/student/${user_id}`);

      dispatch({
         type: CLASS_LOADED,
         payload: res.data,
      });
   } catch (err) {
      if (err.response.status !== 401)
         dispatch(setClassesError(CLASS_ERROR, err.response));
   }
};

export const loadClasses = (filterData) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

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
      const res = await api.get(`/class?${filter}`);

      dispatch({
         type: CLASSES_LOADED,
         payload: res.data,
      });
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setClassesError(CLASSES_ERROR, err.response));
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
         window.scrollTo(0, 0);
      } else error = true;
   }

   if (!error) dispatch(updateLoadingSpinner(false));
};

export const registerUpdateClass = (formData) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

   let newClass = {};
   for (const prop in formData) {
      if (formData[prop] !== "" && formData[prop] !== 0) {
         newClass[prop] = formData[prop];
      }
   }

   try {
      let res;

      if (formData._id === "0") res = await api.post("/class", newClass);
      else res = await api.put(`/class/${formData._id}`, formData);

      dispatch({
         type: formData._id === "0" ? CLASS_REGISTERED : CLASS_UPDATED,
         payload: res.data,
      });

      dispatch(
         setAlert(
            formData._id === "0" ? "Nueva Clase Creada" : "Clase Modificada",
            "success",
            "2"
         )
      );

      dispatch(getActiveClasses());
      history.push("/class/all");
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setClassesError(CLASS_ERROR, err.response));

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
   let exist = classInfo.students.some((item) => item._id === student._id);
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

export const deleteClass = (class_id) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

   try {
      await api.delete(`/class/${class_id}`);

      dispatch({
         type: CLASS_DELETED,
         payload: class_id,
      });

      dispatch(getActiveClasses());

      history.push("/class/all");
      dispatch(setAlert("Clase Eliminada", "success", "2"));
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setClassesError(CLASS_ERROR, err.response));
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
      } else error = true;
   }

   if (!error) {
      window.scrollTo(0, 0);
      dispatch(updateLoadingSpinner(false));
   }
};

export const classPDF = (classInfo, type) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

   try {
      let pdf;
      let name = "";

      switch (type) {
         case "classes":
            await api.post("/pdf/class/list", classInfo);

            name = "Clases";
            break;
         case "class":
            await api.post("/pdf/class/one", classInfo);

            name = `Clase ${
               classInfo.teacher.lastname + ", " + classInfo.teacher.name
            } ${classInfo.category.name} `;
            break;
         case "blank":
            await api.post("/pdf/class/blank", classInfo);

            name = `${classInfo.category.name} de ${
               classInfo.teacher.lastname + ", " + classInfo.teacher.name
            } blanco`;
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
         dispatch(setClassesError(CLASS_ERROR, err.response));
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

const setClassesError = (type, response) => (dispatch) => {
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
