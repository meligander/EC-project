import moment from "moment";
import { saveAs } from "file-saver";
import api from "../utils/api";

import { setAlert } from "./alert";
import { updateLoadingSpinner } from "./mixvalues";
import { logOutAndToggle } from "./navbar";
import { clearInstallments } from "./installment";
import { clearClass, clearClasses } from "./class";
import { clearAttendances } from "./attendance";
import { clearGrades } from "./grade";

import {
   USER_LOADED,
   USERS_LOADED,
   USERSBK_LOADED,
   STUDENTNUMBER_LOADED,
   ACTIVEUSERS_LOADED,
   USERSEARCHTYPE_CHANGED,
   REGISTER_SUCCESS,
   USER_UPDATED,
   SEARCH_CLEARED,
   USER_DELETED,
   USERFORLIST_ADDED,
   USERFROMLIST_REMOVED,
   USERS_CLEARED,
   USER_CLEARED,
   OTHERVALUES_CLEARED,
   USER_ERROR,
   USERS_ERROR,
   USERSBK_ERROR,
} from "./types";

//Load User
export const loadUser = (user_id) => async (dispatch) => {
   try {
      const res = await api.get(`/user/${user_id}`);
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
   }
   dispatch(updateLoadingSpinner(false));
};

export const getStudentNumber = () => async (dispatch) => {
   try {
      let res = await api.get("/user/register/number");
      dispatch({
         type: STUDENTNUMBER_LOADED,
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
      window.scroll(0, 0);
   }
};

export const getActiveUsers = (type) => async (dispatch) => {
   try {
      let res;
      let payload = {};

      if (type === "student") {
         res = await api.get("/user?active=true&type=student");
         payload.type = "activeStudents";
         payload.info = res.data.length;
      } else {
         res = await api.get("/user?active=true&type=teacher");
         payload.type = "activeTeachers";
         payload.info = res.data.length;
      }

      dispatch({
         type: ACTIVEUSERS_LOADED,
         payload,
      });
   } catch (err) {
      dispatch({
         type: USER_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
            userType: type === "student" ? "activeStudents" : "activeTeachers",
         },
      });
      window.scroll(0, 0);
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
      let res = await api.get(`/user?${filter}`);

      dispatch({
         type: primary ? USERS_LOADED : USERSBK_LOADED,
         payload: res.data,
      });

      if (search) {
         dispatch({
            type: USERSEARCHTYPE_CHANGED,
            payload: filterData.type,
         });
      }
   } catch (err) {
      dispatch(
         setAlert(err.response.data.msg, "danger", studentSearch ? "3" : "2")
      );
      dispatch({
         type: primary ? USERS_ERROR : USERSBK_ERROR,
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

//Load Relatives
export const loadRelatives = (user_id) => async (dispatch) => {
   try {
      let res = await api.get(`/user/tutor/${user_id}`);

      dispatch({
         type: USERSBK_LOADED,
         payload: res.data,
      });
   } catch (err) {
      dispatch({
         type: USERSBK_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
   }
};

//Update or register a user
export const registerUser = (formData, history, userToUpdate) => async (
   dispatch
) => {
   dispatch(updateLoadingSpinner(true));

   let user = {};
   for (const prop in formData) {
      if (formData[prop] !== "") {
         user[prop] = formData[prop];
      }
   }

   try {
      let res;
      if (!userToUpdate) {
         res = await api.post("/user", user);
      } else {
         //Update user
         await api.put(`/user/${userToUpdate._id}`, user);
      }

      dispatch({
         type: !userToUpdate ? REGISTER_SUCCESS : USER_UPDATED,
      });

      dispatch(
         setAlert(
            userToUpdate ? "Usuario modificado" : "Usuario registrado",
            "success",
            "1",
            7000
         )
      );

      if (userToUpdate && userToUpdate.type === "student")
         dispatch(clearClass());
      if (userToUpdate && userToUpdate.type === "teacher")
         dispatch(clearClasses());
      dispatch(clearProfile());

      dispatch(clearOtherValues("activeStudents"));

      history.push(`/dashboard/${userToUpdate ? userToUpdate._id : res.data}`);
   } catch (err) {
      if (err.response.data.errors) {
         const errors = err.response.data.errors;
         errors.forEach((error) => {
            dispatch(setAlert(error.msg, "danger", "2"));
         });
         dispatch({
            type: USERS_ERROR,
            payload: errors,
         });
      } else {
         const msg = err.response.data.msg;
         const type = err.response.statusText;
         dispatch({
            type: USERS_ERROR,
            payload: {
               type,
               status: err.response.status,
               msg,
            },
         });
         dispatch(setAlert(msg ? msg : type, "danger", "2"));
      }
   }

   dispatch(updateLoadingSpinner(false));
   window.scrollTo(0, 0);
};

//Update user's credentials
export const updateCredentials = (formData, history, user_id) => async (
   dispatch
) => {
   dispatch(updateLoadingSpinner(true));

   let user = {};
   for (const prop in formData) {
      if (formData[prop] !== "") user[prop] = formData[prop];
   }

   try {
      let res = await api.put(`/user/credentials/${user_id}`, user);

      dispatch({
         type: USER_UPDATED,
         payload: res.data,
      });
      dispatch(clearProfile());
      dispatch(setAlert("Credenciales modificadas", "success", "1", 7000));
      history.push(`/dashboard/${user_id}`);
   } catch (err) {
      const msg = err.response.data.msg;
      const type = err.response.statusText;
      dispatch({
         type: USERS_ERROR,
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

export const deleteUser = (user, history, userLogged_id) => async (
   dispatch
) => {
   dispatch(updateLoadingSpinner(true));

   try {
      if (user._id === userLogged_id) dispatch(logOutAndToggle());
      else {
         dispatch(clearProfile());
         history.push(`/dashboard/${userLogged_id}`);
      }

      await api.delete(`/user/${user._id}/${user.type}`);

      dispatch({
         type: USER_DELETED,
      });
      dispatch(setAlert("Usuario Eliminado", "success", "1", 7000));

      dispatch(clearOtherValues("activeStudents"));
   } catch (err) {
      const msg = err.response.data.msg;
      const type = err.response.statusText;
      dispatch({
         type: USER_ERROR,
         payload: {
            type,
            status: err.response.status,
            msg,
         },
      });
      dispatch(setAlert(msg ? msg : type, "danger", "2"));
   }

   window.scrollTo(0, 0);
   if (user._id === userLogged_id) dispatch(updateLoadingSpinner(false));
};

export const userPDF = (users, userSearchType) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   try {
      await api.post("/user/create-list", { users, userSearchType });

      const pdf = await api.get("/user/lista/fetch-list", {
         responseType: "blob",
      });

      const pdfBlob = new Blob([pdf.data], { type: "application/pdf" });

      const date = moment().format("DD-MM-YY");

      let type = "";

      switch (userSearchType) {
         case "student":
            type = "Alumno";
            break;
         case "guardian":
            type = "Tutores";
            break;
         case "teacher":
            type = "Profesores";
            break;
         case "admin":
            type = "Administradores";
            break;
         default:
            break;
      }

      saveAs(pdfBlob, `${type} ${date}.pdf`);

      dispatch(setAlert("PDF Generado", "success", "2"));
   } catch (err) {
      const msg = err.response.data.msg;
      const type = err.response.statusText;
      dispatch({
         type: USER_ERROR,
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

export const clearProfile = (all = true) => (dispatch) => {
   dispatch({
      type: USER_CLEARED,
   });
   dispatch(clearGrades());
   dispatch(clearInstallments());
   dispatch(clearAttendances());
   if (all) dispatch(clearClass());
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

export const clearOtherValues = (type) => (dispatch) => {
   dispatch({
      type: OTHERVALUES_CLEARED,
      payload: type,
   });
};
