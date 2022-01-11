import format from "date-fns/format";
import history from "../utils/history";
import { saveAs } from "file-saver";
import api from "../utils/api";
import store from "../utils/store";

import { setAlert } from "./alert";
import { updateLoadingSpinner } from "./mixvalues";
import { clearInstallments } from "./installment";
import { clearAttendances } from "./attendance";
import { clearGrades } from "./grade";
import { logOut, updateAuthUser } from "./auth";

import {
   USER_LOADED,
   USERS_LOADED,
   USERSBK_LOADED,
   USERSEARCHTYPE_CHANGED,
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
   USERSBK_ERROR,
   OTHERVALUES_LOADED,
} from "./types";

//Load User
export const loadUser = (user_id, spinner) => async (dispatch) => {
   if (spinner) dispatch(updateLoadingSpinner(true));
   let error = false;

   try {
      const res = await api.get(`/user/${user_id}`);
      dispatch({
         type: USER_LOADED,
         payload: res.data,
      });
   } catch (err) {
      if (err.response.status !== 401)
         dispatch(setUsersError(USER_ERROR, err.response));
      else error = true;
   }

   if (!error && spinner) dispatch(updateLoadingSpinner(false));
};

export const getStudentNumber = () => async (dispatch) => {
   try {
      let res = await api.get("/user/register/number");
      dispatch({
         type: OTHERVALUES_LOADED,
         payload: {
            type: "studentNumber",
            info: res.data,
         },
      });
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setUsersError(USERS_ERROR, err.response));
         window.scroll(0, 0);
      }
   }
};

export const getActiveUsers = (type) => async (dispatch) => {
   try {
      let res = await api.get(`/user?active=true&type=${type}`);
      let payload = {
         type: type === "student" ? "activeStudents" : "activeTeachers",
         info: res.data.length,
      };

      dispatch({
         type: OTHERVALUES_LOADED,
         payload,
      });
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setUsersError(USERS_ERROR, err.response, type));
         window.scroll(0, 0);
      }
   }
};

//LoadUsers
export const loadUsers =
   (filterData, spinner, primary, studentSearch) => async (dispatch) => {
      if (spinner) dispatch(updateLoadingSpinner(true));
      let error = false;

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

         dispatch({
            type: USERSEARCHTYPE_CHANGED,
            payload: filterData.type ? filterData.type : "",
         });
      } catch (err) {
         if (err.response.status !== 401) {
            dispatch(
               setAlert(
                  err.response.data.msg,
                  "danger",
                  studentSearch ? "3" : "2"
               )
            );
            dispatch(
               setUsersError(
                  primary ? USERS_ERROR : USERSBK_ERROR,
                  err.response
               )
            );
            window.scrollTo(0, 0);
         } else error = true;
      }

      if (!error && spinner) dispatch(updateLoadingSpinner(false));
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
      if (err.response.status !== 401)
         dispatch(setUsersError(USERSBK_ERROR, err.response));
   }
};

//Update or register a user
export const registerUpdateUser = (formData) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

   let user = {};
   for (const prop in formData)
      if (formData[prop] !== "") user[prop] = formData[prop];

   try {
      let res;
      if (formData._id === "") res = await api.post("/user", user);
      else res = await api.put(`/user/${formData._id}`, user);

      if (formData._id === store.getState().auth.userLogged._id)
         dispatch(updateAuthUser(res.data));
      else
         dispatch({
            type: formData._id === "" ? REGISTER_SUCCESS : USER_UPDATED,
            payload: res.data,
         });

      dispatch(
         setAlert(
            formData._id !== "" ? "Usuario modificado" : "Usuario registrado",
            "success",
            "1",
            7000
         )
      );

      history.push("/index/dashboard/0");
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setUsersError(USER_ERROR, err.response));

         if (err.response.data.errors)
            err.response.data.errors.forEach((error) => {
               dispatch(setAlert(error.msg, "danger", "2"));
            });
         else dispatch(setAlert(err.response.data.msg, "danger", "2"));
      } else error = true;
   }

   if (!error) {
      dispatch(updateLoadingSpinner(false));
      window.scrollTo(0, 0);
   }
};

//Update user's credentials
export const updateCredentials = (formData) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

   let user = {};
   for (const prop in formData) {
      if (formData[prop] !== "") user[prop] = formData[prop];
   }

   try {
      let res = await api.put(`/user/credentials/${formData._id}`, user);

      dispatch({
         type: USER_UPDATED,
         payload: res.data,
      });

      dispatch(setAlert("Credenciales modificadas", "success", "1", 7000));

      history.push("/index/dashboard/0");
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setUsersError(USER_ERROR, err.response));
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
      } else error = true;
   }

   if (!error) {
      window.scrollTo(0, 0);
      dispatch(updateLoadingSpinner(false));
   }
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

export const deleteUser = (user, self) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

   try {
      await api.delete(`/user/${user._id}/${user.type}`);

      dispatch({
         type: USER_DELETED,
      });
      dispatch(setAlert("Usuario Eliminado", "success", "1", 7000));

      if (self) dispatch(logOut());
      else history.push("/index/dashboard/0");

      dispatch(clearUsers());
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setUsersError(USER_ERROR, err.response));
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
      } else error = true;
   }

   if (!error) {
      window.scrollTo(0, 0);
      dispatch(updateLoadingSpinner(false));
   }
};

export const userPDF = (users, userSearchType) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

   try {
      await api.post("/pdf/user/list", { users, usersType: userSearchType });

      const pdf = await api.get("/pdf/user/fetch", {
         responseType: "blob",
      });

      const pdfBlob = new Blob([pdf.data], { type: "application/pdf" });

      let type = "";

      switch (userSearchType) {
         case "student":
            type = "Alumnos";
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

      saveAs(pdfBlob, `${type} ${format(new Date(), "dd-MM-yy")}.pdf`);

      dispatch(setAlert("PDF Generado", "success", "2"));
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setUsersError(USERS_ERROR, err.response));
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
      } else error = true;
   }

   if (!error) {
      window.scrollTo(0, 0);
      dispatch(updateLoadingSpinner(false));
   }
};

export const clearProfile = () => (dispatch) => {
   dispatch({
      type: USER_CLEARED,
   });
   dispatch(clearGrades());
   dispatch(clearInstallments());
   dispatch(clearAttendances());
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

const setUsersError = (type, response, userType) => (dispatch) => {
   dispatch({
      type: type,
      payload: response.data.errors
         ? response.data.errors
         : {
              type: response.statusText,
              status: response.status,
              msg: response.data.msg,
              ...(userType && {
                 userType:
                    userType === "student"
                       ? "activeStudents"
                       : "activeTeachers",
              }),
           },
   });
};
