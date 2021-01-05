import axios from "axios";

import { setAlert } from "./alert";
import { updateLoadingSpinner } from "./mixvalues";

import {
   POSTS_LOADED,
   POST_ADDED,
   POST_DELETED,
   COMMENT_ADDED,
   COMMENT_DELETED,
   LIKES_UPDATED,
   POST_SEEN,
   POSTS_CLEARED,
   POST_ERROR,
} from "./types";

//Get all posts
export const loadPosts = (class_id) => async (dispatch) => {
   try {
      const res = await axios.get(`/api/post/class/${class_id}`);
      dispatch({
         type: POSTS_LOADED,
         payload: res.data,
      });
   } catch (err) {
      dispatch({
         type: POST_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
   }
};

//Add a post
export const addPost = (formData, class_id) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   let post = {};
   for (const prop in formData) {
      if (formData[prop] !== "" && formData[prop] !== 0) {
         post[prop] = formData[prop];
      }
   }

   try {
      const res = await axios.post(`/api/post/${class_id}`, post);

      dispatch({
         type: POST_ADDED,
         payload: res.data,
      });

      dispatch(setAlert("Posteo Creado", "success", "2"));
   } catch (err) {
      if (err.response.data.errors) {
         const errors = err.response.data.errors;
         errors.forEach((error) => {
            dispatch(setAlert(error.msg, "danger", "2"));
         });
         dispatch({
            type: POST_ERROR,
            payload: errors,
         });
      } else {
         const msg = err.response.data.msg;
         const type = err.response.statusText;
         dispatch({
            type: POST_ERROR,
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

//Delete a post
export const deletePost = (post_id) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   try {
      await axios.delete(`/api/post/${post_id}`);

      dispatch({
         type: POST_DELETED,
         payload: post_id,
      });

      dispatch(setAlert("Posteo Eliminado", "success", "2"));
   } catch (err) {
      const msg = err.response.data.msg;
      const type = err.response.statusText;
      dispatch({
         type: POST_ERROR,
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

// Add comment
export const addComment = (post_id, formData, screen) => async (dispatch) => {
   //screen is to see where to go to see the alert
   //post_id is to create a type of alert so it does not create as many alerts as comments

   dispatch(updateLoadingSpinner(true));

   let comment = {};
   for (const prop in formData) {
      if (formData[prop] !== "" && formData[prop] !== 0) {
         comment[prop] = formData[prop];
      }
   }

   try {
      const res = await axios.post(`/api/post/comment/${post_id}`, comment);

      dispatch({
         type: COMMENT_ADDED,
         payload: { post_id, comments: res.data },
      });

      dispatch(setAlert("Comentario Agregado", "success", post_id));
   } catch (err) {
      if (err.response.data.errors) {
         const errors = err.response.data.errors;
         errors.forEach((error) => {
            dispatch(setAlert(error.msg, "danger", post_id));
         });
         dispatch({
            type: POST_ERROR,
            payload: errors,
         });
      } else {
         const msg = err.response.data.msg;
         const type = err.response.statusText;
         dispatch({
            type: POST_ERROR,
            payload: {
               type,
               status: err.response.status,
               msg,
            },
         });
         dispatch(setAlert(msg ? msg : type, "danger", post_id));
      }
   }

   window.scrollBy(0, screen);
   dispatch(updateLoadingSpinner(false));
};

//Delete a comment
export const deleteComment = (post_id, comment_id, screen) => async (
   dispatch
) => {
   dispatch(updateLoadingSpinner(true));
   try {
      const res = await axios.delete(
         `/api/post/comment/${post_id}/${comment_id}`
      );

      dispatch({
         type: COMMENT_DELETED,
         payload: { post_id, comments: res.data },
      });

      dispatch(setAlert("Comentario Eliminado", "success", post_id));
   } catch (err) {
      const msg = err.response.data.msg;
      const type = err.response.statusText;
      dispatch({
         type: POST_ERROR,
         payload: {
            type,
            status: err.response.status,
            msg,
         },
      });
      dispatch(setAlert(msg ? msg : type, "danger", post_id));
   }

   window.scrollBy(0, screen);
   dispatch(updateLoadingSpinner(false));
};

export const addRemoveLike = (post_id) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   try {
      const res = await axios.put(`/api/post/like/${post_id}`);

      dispatch({
         type: LIKES_UPDATED,
         payload: { post_id, likes: res.data },
      });
   } catch (err) {
      const msg = err.response.data.msg;
      const type = err.response.statusText;
      dispatch({
         type: POST_ERROR,
         payload: {
            type,
            status: err.response.status,
            msg,
         },
      });
      dispatch(setAlert(msg ? msg : type, "danger", post_id));
   }
   dispatch(updateLoadingSpinner(false));
};

export const seenPost = (post_id, data) => async (dispatch) => {
   try {
      const res = await axios.put(`/api/post/seen/${post_id}`, data);

      dispatch({
         type: POST_SEEN,
         payload: { post_id, seenArray: res.data },
      });
   } catch (err) {
      const msg = err.response.data.msg;
      const type = err.response.statusText;
      dispatch({
         type: POST_ERROR,
         payload: {
            type,
            status: err.response.status,
            msg,
         },
      });
      dispatch(setAlert(msg ? msg : type, "danger", post_id));
   }
};

export const clearPosts = () => (dispatch) => {
   dispatch({ type: POSTS_CLEARED });
};
