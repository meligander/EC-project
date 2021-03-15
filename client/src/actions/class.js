import moment from "moment";
import api from "../utils/api";
import { saveAs } from "file-saver";

import { updateLoadingSpinner } from "./mixvalues";
import { addUserToList, removeUserFromList } from "./user";
import { setAlert } from "./alert";

import {
   CLASS_LOADED,
   CLASSES_LOADED,
   CLASSSTUDENTS_LOADED,
   ACTIVECLASSES_LOADED,
   CLASS_REGISTERED,
   CLASSSTUDENT_ADDED,
   CLASS_UPDATED,
   CLASSSTUDENT_REMOVED,
   CLASS_DELETED,
   CLASSCATEGORY_UPDATED,
   CLASS_CLEARED,
   CLASSES_CLEARED,
   ACTIVECLASSES_CLEARED,
   CLASS_ERROR,
   CLASSSTUDENTS_ERROR,
} from "./types";

export const loadClass = (class_id) => async (dispatch) => {
   try {
      if (class_id === "0") {
         dispatch({
            type: CLASS_LOADED,
            payload: null,
         });
      } else {
         const res = await api.get(`/class/${class_id}`);
         dispatch({
            type: CLASS_LOADED,
            payload: res.data,
         });
         dispatch(loadClassStudents(class_id));
      }
   } catch (err) {
      dispatch({
         type: CLASS_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
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
      dispatch({
         type: CLASS_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
      window.scroll(0, 0);
   }
};

export const loadStudentClass = (user_id) => async (dispatch) => {
   try {
      const res = await api.get(`/class/student/${user_id}`);
      dispatch({
         type: CLASS_LOADED,
         payload: res.data,
      });
      dispatch(loadClassStudents(res.data._id));
   } catch (err) {
      dispatch({
         type: CLASS_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
   }
};

export const loadClassStudents = (class_id) => async (dispatch) => {
   try {
      const res = await api.get(`/user?type=student&classroom=${class_id}`);
      dispatch({
         type: CLASSSTUDENTS_LOADED,
         payload: res.data,
      });
   } catch (err) {
      dispatch({
         type: CLASSSTUDENTS_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
   }
};

export const loadClasses = (filterData) => async (dispatch) => {
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
      const res = await api.get(`/class?${filter}`);

      dispatch({
         type: CLASSES_LOADED,
         payload: res.data,
      });
   } catch (err) {
      const msg = err.response.data.msg;
      const type = err.response.statusText;
      dispatch({
         type: CLASS_ERROR,
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

export const registerUpdateClass = (formData, history, class_id) => async (
   dispatch
) => {
   dispatch(updateLoadingSpinner(true));

   let newClass = {};
   for (const prop in formData) {
      if (formData[prop] !== "" && formData[prop] !== 0) {
         newClass[prop] = formData[prop];
      }
   }

   try {
      let res = {};
      if (!class_id) {
         res = await api.post("/class", newClass);
      } else {
         res = await api.put(`/class/${class_id}`, formData);
      }

      dispatch({
         type: !class_id ? CLASS_REGISTERED : CLASS_UPDATED,
         payload: res.data,
      });

      dispatch(
         setAlert(
            !class_id ? "Nueva Clase Creada" : "Clase Modificada",
            "success",
            "2"
         )
      );

      history.push("/classes");
      dispatch(clearActiveClasses());
   } catch (err) {
      if (err.response.data.errors) {
         const errors = err.response.data.errors;
         errors.forEach((error) => {
            dispatch(setAlert(error.msg, "danger", "2"));
         });
         dispatch({
            type: CLASS_ERROR,
            payload: errors,
         });
      } else {
         const msg = err.response.data.msg;
         const type = err.response.statusText;
         dispatch({
            type: CLASS_ERROR,
            payload: {
               type,
               status: err.response.status,
               msg,
            },
         });
         dispatch(setAlert(msg ? msg : type, "danger", "2"));
      }
   }

   window.scrollTo(0, 0);
   dispatch(updateLoadingSpinner(false));
};

export const updateClassCategory = (classInfo) => (dispatch) => {
   dispatch({ type: CLASSCATEGORY_UPDATED, payload: classInfo });
};

export const addStudent = (student) => (dispatch) => {
   dispatch({
      type: CLASSSTUDENT_ADDED,
      payload: student,
   });
   dispatch(removeUserFromList(student._id));
};

export const removeStudent = (student) => (dispatch) => {
   dispatch({
      type: CLASSSTUDENT_REMOVED,
      payload: student._id,
   });
   dispatch(addUserToList(student));
};

export const deleteClass = (class_id, history) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   try {
      await api.delete(`/class/${class_id}`);

      dispatch({
         type: CLASS_DELETED,
         payload: class_id,
      });

      dispatch(clearActiveClasses());

      history.push("/classes");
      dispatch(setAlert("Clase Eliminada", "success", "2"));
   } catch (err) {
      const msg = err.response.data.msg;
      const type = err.response.statusText;
      dispatch({
         type: CLASS_ERROR,
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

export const classPDF = (classInfo, type) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   try {
      let pdf;
      let name = "";

      switch (type) {
         case "classes":
            await api.post("/class/create-list", classInfo);

            pdf = await api.get("/class/list/fetch-list", {
               responseType: "blob",
            });
            name = "Clases";
            break;
         case "class":
            await api.post("/class/oneclass/create-list", classInfo);

            pdf = await api.get("/class/oneclass/fetch-list", {
               responseType: "blob",
            });
            name = `Clase ${
               classInfo.teacher.lastname + ", " + classInfo.teacher.name
            } ${classInfo.category.name} `;
            break;
         case "blank":
            await api.post("/class/blank/create-list", classInfo);

            pdf = await api.get("/class/blank/fetch-list", {
               responseType: "blob",
            });
            name = `${classInfo.category.name} de ${
               classInfo.teacher.lastname + ", " + classInfo.teacher.name
            } blanco`;
            break;
         default:
            break;
      }

      const pdfBlob = new Blob([pdf.data], { type: "application/pdf" });

      const date = moment().format("DD-MM-YY");

      saveAs(pdfBlob, `${name} ${date}.pdf`);

      dispatch(setAlert("PDF Generado", "success", "2"));
   } catch (err) {
      console.log(err);
      const msg = err.response.data.msg;
      const type = err.response.statusText;
      dispatch({
         type: CLASS_ERROR,
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

export const clearClass = () => (dispatch) => {
   dispatch({
      type: CLASS_CLEARED,
   });
};

export const clearActiveClasses = () => (dispatch) => {
   dispatch({
      type: ACTIVECLASSES_CLEARED,
   });
};

export const clearClasses = () => (dispatch) => {
   dispatch({
      type: CLASSES_CLEARED,
   });
};
