import {
   CLASS_ERROR,
   CLASS_LOADED,
   CLASSES_LOADED,
   CLASS_CLEARED,
   CLASS_UPDATED,
   CLASS_REGISTERED,
   CLASSES_UPDATED,
   CLASSSTUDENTS_LOADED,
   CLASSSTUDENTS_ERROR,
   CLASSES_DELETED,
} from "./types";
import { updateLoadingSpinner, updateAdminDashLoading } from "./mixvalues";
import { setAlert } from "./alert";
import moment from "moment";
import { saveAs } from "file-saver";
import axios from "axios";

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
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
      window.scrollTo(500, 0);
   }
};

export const loadClass = (class_id, loading = true) => async (dispatch) => {
   try {
      if (loading) dispatch(updateLoadingSpinner(true));
      const res = await axios.get(`/api/class/${class_id}`);
      dispatch({
         type: CLASS_LOADED,
         payload: res.data,
      });
      dispatch(loadClassStudents(class_id, loading));
   } catch (err) {
      dispatch({
         type: CLASS_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
      window.scrollTo(500, 0);
      dispatch(updateLoadingSpinner(false));
   }
};

export const loadClassStudents = (class_id, loading) => async (dispatch) => {
   try {
      const res = await axios.get(
         `/api/users?type=Alumno&classroom=${class_id}`
      );
      dispatch({
         type: CLASSSTUDENTS_LOADED,
         payload: res.data,
      });
      if (loading) dispatch(updateLoadingSpinner(false));
   } catch (err) {
      dispatch({
         type: CLASSSTUDENTS_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
      window.scrollTo(500, 0);
      if (loading) dispatch(updateLoadingSpinner(false));
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
      dispatch(updateLoadingSpinner(false));
   } catch (err) {
      dispatch({
         type: CLASS_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
      window.scrollTo(500, 0);
      dispatch(updateLoadingSpinner(false));
   }
};

export const registerUpdateClass = (formData, history, class_id = 0) => async (
   dispatch
) => {
   dispatch(updateLoadingSpinner(true));
   let newClass = {};
   for (const prop in formData) {
      if (formData[prop]) newClass[prop] = formData[prop];
   }

   newClass = JSON.stringify(newClass);

   const config = {
      headers: {
         "Content-Type": "application/json",
      },
   };

   try {
      let res;
      if (class_id === 0) {
         res = await axios.post("/api/class", newClass, config);
      } else {
         res = await axios.put(`/api/class/${class_id}`, newClass, config);
      }

      dispatch({
         type: class_id === 0 ? CLASS_REGISTERED : CLASSES_UPDATED,
         payload: res.data,
      });
      dispatch(
         setAlert(
            class_id === 0 ? "Nueva Clase Creada" : "Clase Modificada",
            "success",
            "2"
         )
      );
      window.scrollTo(500, 0);
      history.push("/classes");
      dispatch(updateAdminDashLoading());
      dispatch(updateLoadingSpinner(false));
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
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
         dispatch({
            type: CLASS_ERROR,
            payload: {
               type: err.response.statusText,
               status: err.response.status,
               msg: err.response.data.msg,
            },
         });
      }

      window.scrollTo(500, 0);
      dispatch(updateLoadingSpinner(false));
   }
};

export const updateClass = (classInfo) => (dispatch) => {
   dispatch({ type: CLASS_UPDATED, payload: classInfo });
};

export const deleteClass = (class_id, history) => async (dispatch) => {
   try {
      dispatch(updateLoadingSpinner(true));
      await axios.delete(`/api/class/${class_id}`);

      dispatch({
         type: CLASSES_DELETED,
         payload: class_id,
      });

      dispatch(setAlert("Curso Eliminado", "success", "2"));
      dispatch(updateAdminDashLoading());
      history.push("/classes");
      dispatch(updateLoadingSpinner(false));
      window.scroll(500, 0);
   } catch (err) {
      dispatch({
         type: CLASS_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
      window.scrollTo(500, 0);
      dispatch(updateLoadingSpinner(false));
   }
};

export const classPDF = (classInfo, type) => async (dispatch) => {
   let tableInfo = JSON.stringify(classInfo);
   dispatch(updateLoadingSpinner(true));
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
      window.scroll(500, 0);
      dispatch(updateLoadingSpinner(false));
   } catch (err) {
      dispatch({
         type: CLASS_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
      window.scrollTo(500, 0);
      dispatch(updateLoadingSpinner(false));
   }
};

export const clearClass = () => (dispatch) => {
   dispatch({
      type: CLASS_CLEARED,
   });
};
