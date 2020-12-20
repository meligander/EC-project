import moment from "moment";
import { saveAs } from "file-saver";
import axios from "axios";

import { setAlert } from "./alert";
import {
   updateLoadingSpinner,
   updateAdminDashLoading,
   clearValues,
} from "./mixvalues";
import { logOutAndToggle } from "./navbar";
import { clearInstallments } from "./installment";
import { clearClass } from "./class";
import { clearAttendances } from "./attendance";
import { clearGrades } from "./grade";

import {
   USER_ERROR,
   USERS_ERROR,
   USER_LOADED,
   USERS_LOADED,
   TEAM_LOADED,
   USER_UPDATED,
   RELATIVES_LOADED,
   USERS_CLEARED,
   USER_CLEARED,
   USERS_TYPE_CHANGED,
   SEARCH_CLEARED,
   USER_DELETED,
   REGISTER_SUCCESS,
   USER_ADDED,
   USER_REMOVED,
   TEACHERS_LOADED,
   TEACHERS_ERROR,
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
export const loadRelatives = (user_id, tutor) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   try {
      let res;
      if (tutor) {
         res = await axios.get(`/api/users/tutor/${user_id}`);
      } else {
         res = await axios.get(`/api/users/students/${user_id}`);
      }

      dispatch({
         type: RELATIVES_LOADED,
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
   if (!tutor) dispatch(updateLoadingSpinner(false));
};

export const loadTeachers = () => async (dispatch) => {
   try {
      let res = await axios.get("/api/users?type=Profesor");

      dispatch({
         type: TEACHERS_LOADED,
         payload: res.data,
      });
   } catch (err) {
      dispatch({
         type: TEACHERS_ERROR,
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
   search = false
   /* studentRelation = false,
   alert = true */
) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   ///Seeeeeee why all those booleans
   ////
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
      if (search) {
         dispatch({
            type: USERS_TYPE_CHANGED,
            payload: filterData.type,
         });
      }
      let res = await axios.get(`/api/users?${filter}`);
      dispatch({
         type: USERS_LOADED,
         payload: res.data,
      });
   } catch (err) {
      /* if (alert)
         dispatch(
            setAlert(
               err.response.data.msg,
               "danger",
               studentRelation ? "3" : "2"
            )
         ); */
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
      dispatch({
         type: USERS_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
      window.scrollTo(0, 0);
   }

   dispatch(updateLoadingSpinner(false));
};

//Load team for about page
export const loadTeam = () => async (dispatch) => {
   try {
      let res = await axios.get("/api/users/team");

      dispatch({
         type: TEAM_LOADED,
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

//Update or register a user
export const registerUser = (
   formData,
   history,
   edit = false,
   user_id
) => async (dispatch) => {
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
      if (!edit) {
         res = await axios.post("/api/users", user, config);

         dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data,
         });
      } else {
         //Update user
         res = await axios.put(`/api/users/${user_id}`, user, config);

         dispatch({
            type: USER_UPDATED,
            payload: res.data,
         });
      }

      dispatch(
         setAlert(
            edit ? "Usuario modificado" : "Usuario registrado",
            "success",
            "1"
         )
      );
      dispatch(updateAdminDashLoading());
      dispatch(clearProfile());
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
      history.push(`/dashboard/${res.data._id}`);
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
      dispatch(updateAdminDashLoading());
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

   try {
      const config = {
         headers: {
            "Content-Type": "application/json",
         },
      };

      await axios.post("/api/users/create-list", { users, usersType }, config);

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

export const addUser = (user) => (dispatch) => {
   dispatch({
      type: USER_ADDED,
      payload: user,
   });
};

export const removeUser = (user_id) => (dispatch) => {
   dispatch({
      type: USER_REMOVED,
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
