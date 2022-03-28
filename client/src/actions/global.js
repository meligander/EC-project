import api from "../utils/api";
import format from "date-fns/format";
import { saveAs } from "file-saver";

import { setAlert } from "./alert";

import {
   LOADINGSPINNER_UPDATED,
   FOOTER_HEIGHT_SETTED,
   NAVBAR_HEIGHT_SETTED,
   CURRENTNAV_CHANGED,
   MENU_TOGGLED,
   POPUP_TOGGLED,
   GLOBAL_ERROR,
   BACKUP_GENERATED,
   BD_RESTORED,
} from "./types";
import { logOut } from "./auth";

export const updateLoadingSpinner = (bool) => (dispatch) => {
   dispatch({
      type: LOADINGSPINNER_UPDATED,
      payload: bool,
   });
};

export const checkBackup = () => async (dispatch) => {
   try {
      const res = await api.get("/backup/check");

      return res.data;
   } catch (err) {
      if (err.response.status !== 401)
         dispatch(setError(GLOBAL_ERROR, err.response));
      return false;
   }
};

export const createBackup = (local) => async (dispatch) => {
   let error = false;
   dispatch(updateLoadingSpinner(true));
   try {
      const res = await api.post("/backup", { local });

      const blob = await api.get(`/backup/fetch${local ? "?local=true" : ""}`, {
         responseType: "arraybuffer",
      });

      saveAs(
         new Blob([blob.data], { type: "application/x-gzip" }),
         `BD-${format(new Date(), "dd-MM-yy")}`
      );

      dispatch({
         type: BACKUP_GENERATED,
      });

      if (local) dispatch(togglePopup("default"));
      dispatch(setAlert(res.data.msg, "success", "1"));
      window.scrollTo(0, 0);
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setError(GLOBAL_ERROR, err.response));
         dispatch(setAlert(err.response.data.msg, "danger", "4"));
      } else error = true;
   }

   if (!error) dispatch(updateLoadingSpinner(false));
};

export const restoreBackup = (data) => async (dispatch) => {
   let error = false;
   dispatch(updateLoadingSpinner(true));
   try {
      if (data === "") {
         const errorMessage = {
            response: {
               status: 402,
               data: {
                  msg: "Debe seleccionar un archivo",
               },
            },
         };
         throw errorMessage;
      }
      const res = await api.post("/backup/restore", data);

      dispatch({
         type: BD_RESTORED,
      });

      window.location.reload();
      dispatch(logOut());
      dispatch(togglePopup("default"));
      window.scrollTo(0, 0);
      dispatch(setAlert(res.data.msg, "success", "0"));
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setError(GLOBAL_ERROR, err.response));
         dispatch(setAlert(err.response.data.msg, "danger", "4"));
      } else error = true;
   }

   if (!error) dispatch(updateLoadingSpinner(false));
};

export const toggleMenu = () => (dispatch) => {
   dispatch({
      type: MENU_TOGGLED,
   });
};

export const togglePopup = (type) => (dispatch) => {
   dispatch({
      type: POPUP_TOGGLED,
      payload: {
         type,
      },
   });
};

export const updateCurrentNav = (currentNav, toggle) => (dispatch) => {
   dispatch({
      type: CURRENTNAV_CHANGED,
      payload: {
         nav: currentNav,
         toggle,
      },
   });
};

export const setFooterHeight = (height) => (dispatch) => {
   dispatch({
      type: FOOTER_HEIGHT_SETTED,
      payload: height,
   });
};

export const setNavbarHeight = (height) => (dispatch) => {
   dispatch({
      type: NAVBAR_HEIGHT_SETTED,
      payload: height,
   });
};

export const setError = (type, response, userType) => (dispatch) => {
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

export const formatNumber = (number) => {
   if (number || number !== 0)
      return new Intl.NumberFormat("de-DE").format(number);
   else return 0;
};

export const whenNull = (value) => {
   return value !== null && value !== undefined && value !== "";
};

export const filterData = (formData) => {
   let filter = "";
   const filternames = Object.keys(formData);
   for (let x = 0; x < filternames.length; x++) {
      const name = filternames[x];
      if (formData[name] !== "") {
         if (filter !== "") filter += "&";
         filter += name + "=" + formData[name];
      }
   }
   return filter;
};

export const newObject = (formData) => {
   let newObject = {};
   for (const prop in formData) {
      if (formData[prop] !== "") newObject[prop] = formData[prop];
   }
   return newObject;
};
