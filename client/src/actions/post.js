import api from "../utils/api";

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
   UNSEENPOSTS_CHANGED,
   POSTS_CLEARED,
   POST_ERROR,
} from "./types";

//Get all posts
export const loadPosts = (class_id) => async (dispatch) => {
   try {
      let res = await api.get(`/post/class/${class_id}`);

      dispatch({
         type: POSTS_LOADED,
         payload: res.data,
      });
   } catch (err) {
      if (err.response.status !== 401)
         dispatch(setPostsError(POST_ERROR, err.response));
   }
};

export const getUnseenPosts = (class_id) => async (dispatch) => {
   try {
      let res;
      if (!class_id) res = await api.get(`/post/unseen/teacher`);
      else res = await api.get(`/post/unseen/class/${class_id}`);
      dispatch({
         type: UNSEENPOSTS_CHANGED,
         payload: res.data,
      });
   } catch (err) {
      if (err.response.status !== 401)
         dispatch(setPostsError(POST_ERROR, err.response));
   }
};

//Add a post
export const addPost = (formData, class_id) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

   let post = {};
   for (const prop in formData) {
      if (formData[prop] !== "" && formData[prop] !== 0) {
         post[prop] = formData[prop];
      }
   }

   try {
      const res = await api.post(`/post/${class_id}`, post);

      dispatch({
         type: POST_ADDED,
         payload: res.data,
      });

      dispatch(setAlert("Posteo Creado", "success", "2"));
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setPostsError(POST_ERROR, err.response));

         if (err.response.data.errors)
            err.response.data.errors.forEach((error) => {
               dispatch(setAlert(error.msg, "danger", "2"));
            });
         else dispatch(setAlert(err.response.data.msg, "danger", "2"));
      } else error = true;
   }

   if (!error) {
      window.scrollTo(0, 0);
      dispatch(updateLoadingSpinner(false));
   }
};

//Delete a post
export const deletePost = (post_id) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

   try {
      await api.delete(`/post/${post_id}`);

      dispatch({
         type: POST_DELETED,
         payload: post_id,
      });

      dispatch(setAlert("Posteo Eliminado", "success", "2"));
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setPostsError(POST_ERROR, err.response));
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
      } else error = true;
   }

   if (!error) {
      window.scrollTo(0, 0);
      dispatch(updateLoadingSpinner(false));
   }
};

// Add comment
export const addComment = (post_id, formData, screen) => async (dispatch) => {
   //screen is to see where to go to see the alert
   //post_id is to create a type of alert so it does not create as many alerts as comments

   dispatch(updateLoadingSpinner(true));
   let error = false;

   let comment = {};
   for (const prop in formData) {
      if (formData[prop] !== "" && formData[prop] !== 0) {
         comment[prop] = formData[prop];
      }
   }

   try {
      const res = await api.post(`/post/comment/${post_id}`, comment);

      dispatch({
         type: COMMENT_ADDED,
         payload: { post_id, comments: res.data },
      });

      dispatch(setAlert("Comentario Agregado", "success", post_id));
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setPostsError(POST_ERROR, err.response));

         if (err.response.data.errors)
            err.response.data.errors.forEach((error) => {
               dispatch(setAlert(error.msg, "danger", post_id));
            });
         else dispatch(setAlert(err.response.data.msg, "danger", post_id));
      } else error = true;
   }

   if (!error) {
      window.scrollBy(0, screen);
      dispatch(updateLoadingSpinner(false));
   }
};

//Delete a comment
export const deleteComment =
   (post_id, comment_id, screen) => async (dispatch) => {
      dispatch(updateLoadingSpinner(true));
      let error = false;

      try {
         const res = await api.delete(`/post/comment/${post_id}/${comment_id}`);

         dispatch({
            type: COMMENT_DELETED,
            payload: { post_id, comments: res.data },
         });

         dispatch(setAlert("Comentario Eliminado", "success", post_id));
      } catch (err) {
         if (err.response.status !== 401) {
            dispatch(setPostsError(POST_ERROR, err.response));
            dispatch(setAlert(err.response.data.msg, "danger", post_id));
         } else error = true;
      }

      if (!error) {
         window.scrollBy(0, screen);
         dispatch(updateLoadingSpinner(false));
      }
   };

export const addRemoveLike = (post_id) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   let error = false;

   try {
      const res = await api.put(`/post/like/${post_id}`);

      dispatch({
         type: LIKES_UPDATED,
         payload: { post_id, likes: res.data },
      });
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setPostsError(POST_ERROR, err.response));
         dispatch(setAlert(err.response.data.msg, "danger", post_id));
      } else error = true;
   }
   if (!error) dispatch(updateLoadingSpinner(false));
};

export const seenPost = (post_id, data) => async (dispatch) => {
   try {
      const res = await api.put(`/post/seen/${post_id}`, data);

      dispatch({
         type: POST_SEEN,
         payload: { post_id, seenArray: res.data },
      });
   } catch (err) {
      if (err.response.status !== 401) {
         dispatch(setPostsError(POST_ERROR, err.response));
         dispatch(setAlert(err.response.data.msg, "danger", post_id));
      }
   }
};

export const clearPosts = () => (dispatch) => {
   dispatch({ type: POSTS_CLEARED });
};

const setPostsError = (type, response) => (dispatch) => {
   dispatch({
      type: type,
      payload: response.data.errors
         ? response.data.errors
         : {
              type: response.statusText,
              status: response.status,
              msg: response.data.msg,
           },
   });
};
