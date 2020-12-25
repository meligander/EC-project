import moment from "moment";
import axios from "axios";
import { saveAs } from "file-saver";

import { clearValues, updateLoadingSpinner } from "./mixvalues";
import { loadClassStudents, addUserToList, removeUserFromList } from "./user";
import { setAlert } from "./alert";

import {
   CLASS_LOADED,
   CLASSES_LOADED,
   CLASS_REGISTERED,
   CLASS_UPDATED,
   CLASS_DELETED,
   CLASSCATEGORY_UPDATED,
   CLASS_CLEARED,
   CLASSES_CLEARED,
   CLASS_ERROR,
   CLASSSTUDENT_ADDED,
   CLASSSTUDENT_REMOVED,
} from "./types";

export const loadUsersClass = (user_id) => async (dispatch) => {
   try {
      const res = await axios.get(`/api/class/user/${user_id}`);
      dispatch({
         type: CLASS_LOADED,
         payload: res.data,
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
   }
};

export const loadClass = (class_id, post = false) => async (dispatch) => {
   //post: to start the spinner when we get to the chat, and finish it when the posts are loaded
   if (post) dispatch(updateLoadingSpinner(true));

   try {
      if (class_id === "0") {
         dispatch({
            type: CLASS_LOADED,
            payload: null,
         });
      } else {
         const res = await axios.get(`/api/class/${class_id}`);
         dispatch({
            type: CLASS_LOADED,
            payload: res.data,
         });
         if (!post) dispatch(loadClassStudents(class_id));
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
      const res = await axios.get(`/api/class?${filter}`);

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

export const registerUpdateClass = (formData, history, class_id = 0) => async (
   dispatch
) => {
   dispatch(updateLoadingSpinner(true));

   let newClass = JSON.stringify(formData);

   const config = {
      headers: {
         "Content-Type": "application/json",
      },
   };

   try {
      let res = {};
      if (class_id === 0) {
         res = await axios.post("/api/class", newClass, config);
      } else {
         res = await axios.put(`/api/class/${class_id}`, newClass, config);
      }

      dispatch({
         type: class_id === 0 ? CLASS_REGISTERED : CLASS_UPDATED,
         payload: res.data,
      });

      dispatch(
         setAlert(
            class_id === 0 ? "Nueva Clase Creada" : "Clase Modificada",
            "success",
            "2"
         )
      );

      history.push("/classes");
      dispatch(clearValues());
      dispatch(clearClasses());
   } catch (err) {
      if (err.response.data.erros) {
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

export const deleteClass = (class_id, history) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   try {
      await axios.delete(`/api/class/${class_id}`);

      dispatch({
         type: CLASS_DELETED,
         payload: class_id,
      });

      dispatch(setAlert("Curso Eliminado", "success", "2"));
      dispatch(clearValues());
      history.push("/classes");
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

   let tableInfo = JSON.stringify(classInfo);
   try {
      const config = {
         headers: {
            "Content-Type": "application/json",
         },
      };
      let pdf;
      let name = "";

      switch (type) {
         case "classes":
            await axios.post("/api/class/create-list", tableInfo, config);

            pdf = await axios.get("/api/class/list/fetch-list", {
               responseType: "blob",
            });
            name = "Cursos";
            break;
         case "class":
            await axios.post(
               "/api/class/oneclass/create-list",
               classInfo,
               config
            );

            pdf = await axios.get("/api/class/oneclass/fetch-list", {
               responseType: "blob",
            });
            name = `Curso ${
               classInfo.teacher.lastname + ", " + classInfo.teacher.name
            } ${classInfo.category.name} `;
            break;
         case "blank":
            await axios.post("/api/class/blank/create-list", tableInfo, config);

            pdf = await axios.get("/api/class/blank/fetch-list", {
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
