import {
   LOADINGSPINNER_UPDATED,
   FOOTER_HEIGHT_SETTED,
   NAVBAR_HEIGHT_SETTED,
   CURRENTNAV_CHANGED,
   MENU_TOGGLED,
   POPUP_TOGGLED,
} from "./types";

export const updateLoadingSpinner = (bool) => (dispatch) => {
   dispatch({
      type: LOADINGSPINNER_UPDATED,
      payload: bool,
   });
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
