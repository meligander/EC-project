import moment from "moment";
import { saveAs } from "file-saver";
import axios from "axios";

import { setAlert } from "./alert";
import { updateLoadingSpinner, clearValues } from "./mixvalues";
import { logOutAndToggle } from "./navbar";
import { clearInstallments } from "./installment";
import { clearClass } from "./class";
import { clearAttendances } from "./attendance";
import { clearGrades } from "./grade";

import {
   USER_LOADED,
   USERS_LOADED,
   USERSBK_LOADED,
   USERS_TYPE_CHANGED,
   REGISTER_SUCCESS,
   USER_UPDATED,
   SEARCH_CLEARED,
   USER_DELETED,
   USERFORLIST_ADDED,
   USERFROMLIST_REMOVED,
   USERS_CLEARED,
   USER_CLEARED,
   USER_ERROR,
   USERS_ERROR,
} from "./types";

//Load User
export const loadUser = (user_id) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   try {
      const res = await axios.get(`/api/users/${user_id}`);
      dispatch({
         type: USER_LOADED,
         payload: res.data,
      });
   } catch (err) {
      dispatch({
         type: USER_ERROR,
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

//Load Relatives
export const loadRelatives = (user_id) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   try {
      let res = await axios.get(`/api/users/tutor/${user_id}`);

      dispatch({
         type: USERS_LOADED,
         payload: res.data,
      });
   } catch (err) {
      dispatch({
         type: USERS_ERROR,
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

//LoadUsers
export const loadUsers = (
   filterData,
   primary = true,
   studentSearch = false,
   search = false
) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   //primary: to load it in main list or back up
   //StudentSearch: to have the alert coming in the square of 'Busqueda de Alumnos'
   //Search: to determine the type for the tabs in the search page
   try {
      let filter = "";

      const filternames = Object.keys(filterData);
      for (let x = 0; x < filternames.length; x++) {
         const name = filternames[x];
         if (filterData[name] !== "") {
            if (filter !== "") filter = filter + "&";
            filter = filter + filternames[x] + "=" + filterData[name];
         }
      }

      let res = await axios.get(`/api/users?${filter}`);

      dispatch({
         type: primary ? USERS_LOADED : USERSBK_LOADED,
         payload: res.data,
      });

      if (search) {
         dispatch({
            type: USERS_TYPE_CHANGED,
            payload: filterData.type,
         });
      }
   } catch (err) {
      dispatch(
         setAlert(err.response.data.msg, "danger", studentSearch ? "3" : "2")
      );
      dispatch({
         type: USERS_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
      if (!studentSearch) window.scrollTo(0, 0);
   }

   dispatch(updateLoadingSpinner(false));
};

export const loadEmployees = () => async (dispatch) => {
   try {
      let res = await axios.get("/api/users/team");

      dispatch({
         type: USERS_LOADED,
         payload: res.data,
      });
   } catch (err) {
      dispatch({
         type: USERS_ERROR,
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

export const loadClassStudents = (class_id) => async (dispatch) => {
   try {
      const res = await axios.get(
         `/api/users?type=Alumno&classroom=${class_id}`
      );
      dispatch({
         type: USERS_LOADED,
         payload: res.data,
      });
   } catch (err) {
      dispatch({
         type: USERS_ERROR,
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

//Update or register a user
export const registerUser = (formData, history, user_id) => async (
   dispatch
) => {
   dispatch(updateLoadingSpinner(true));

   let user = {};
   for (const prop in formData) {
      if (formData[prop]) {
         user[prop] = formData[prop];
      }
   }
   user = JSON.stringify(user);

   const config = {
      headers: {
         "Content-Type": "application/json",
      },
   };
   try {
      let res;
      if (!user_id) {
         res = await axios.post("/api/users", user, config);
      } else {
         //Update user
         res = await axios.put(`/api/users/${user_id}`, user, config);
      }

      dispatch({
         type: !user_id ? REGISTER_SUCCESS : USER_UPDATED,
         payload: res.data,
      });

      dispatch(
         setAlert(
            user_id ? "Usuario modificado" : "Usuario registrado",
            "success",
            "1"
         )
      );
      dispatch(clearValues());
      history.push(`/dashboard/${res.data._id}`);
   } catch (err) {
      if (err.response.data.erros) {
         const errors = err.response.data.errors;
         errors.forEach((error) => {
            dispatch(setAlert(error.msg, "danger", "2"));
         });
         dispatch({
            type: USERS_ERROR,
            payload: errors,
         });
      } else {
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
         dispatch({
            type: USERS_ERROR,
            payload: {
               type: err.response.statusText,
               status: err.response.status,
               msg: err.response.data.msg,
            },
         });
      }
      dispatch(updateLoadingSpinner(false));
   }

   window.scrollTo(0, 0);
};

//Update user's credentials
export const updateCredentials = (formData, history, user_id) => async (
   dispatch
) => {
   dispatch(updateLoadingSpinner(true));

   let user = {};
   for (const prop in formData) {
      if (formData[prop]) user[prop] = formData[prop];
   }

   user = JSON.stringify(user);

   const config = {
      headers: {
         "Content-Type": "application/json",
      },
   };

   try {
      let res = await axios.put(
         `/api/users/credentials/${user_id}`,
         user,
         config
      );

      dispatch({
         type: USER_UPDATED,
         payload: res.data,
      });
      dispatch(clearProfile());
      dispatch(setAlert("Credenciales modificadas", "success", "1"));
      history.push(`/dashboard/${user_id}`);
   } catch (err) {
      dispatch({
         type: USERS_ERROR,
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

export const deleteUser = (user_id, history, userLogged_id) => async (
   dispatch
) => {
   dispatch(updateLoadingSpinner(true));

   try {
      await axios.delete(`/api/users/${user_id}`);

      if (user_id === userLogged_id) dispatch(logOutAndToggle());
      else history.push(`/dashboard/${userLogged_id}`);

      dispatch({
         type: USER_DELETED,
      });
      dispatch(setAlert("Usuario Eliminado", "success", "1"));
      dispatch(clearValues());
   } catch (err) {
      dispatch({
         type: USER_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
   }

   window.scrollTo(0, 0);
   if (user_id === userLogged_id) dispatch(updateLoadingSpinner(false));
};

export const userPDF = (users, usersType) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   let user = JSON.stringify({ users, usersType });

   try {
      const config = {
         headers: {
            "Content-Type": "application/json",
         },
      };

      await axios.post("/api/users/create-list", user, config);

      const pdf = await axios.get("/api/users/lista/fetch-list", {
         responseType: "blob",
      });

      const pdfBlob = new Blob([pdf.data], { type: "application/pdf" });

      const date = moment().format("DD-MM-YY");

      saveAs(
         pdfBlob,
         `${usersType === "Alumno" ? "Alumnos" : usersType + "es"} ${date}.pdf`
      );

      dispatch(setAlert("PDF Generado", "success", "2"));
   } catch (err) {
      dispatch({
         type: USER_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
   }

   window.scrollTo(0, 0);
   dispatch(updateLoadingSpinner(true));
};

export const addUserToList = (user) => (dispatch) => {
   dispatch({
      type: USERFORLIST_ADDED,
      payload: user,
   });
};

export const removeUserFromList = (user_id) => (dispatch) => {
   dispatch({
      type: USERFROMLIST_REMOVED,
      payload: user_id,
   });
};

export const clearProfile = () => (dispatch) => {
   dispatch({
      type: USER_CLEARED,
   });
   dispatch(clearGrades());
   dispatch(clearInstallments());
   dispatch(clearAttendances);
   dispatch(clearClass());
};

export const clearUser = () => (dispatch) => {
   dispatch({
      type: USER_CLEARED,
   });
};

export const clearUsers = () => (dispatch) => {
   dispatch({
      type: USERS_CLEARED,
   });
};

export const clearSearch = () => (dispatch) => {
   dispatch({
      type: SEARCH_CLEARED,
   });
};
