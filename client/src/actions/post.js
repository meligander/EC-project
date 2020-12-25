import axios from "axios";

import { setAlert } from "./alert";
import { updateLoadingSpinner } from "./mixvalues";

import {
   POST_LOADED,
   POSTS_LOADED,
   POST_ADDED,
   POST_DELETED,
   LIKES_UPDATED,
   COMMENT_ADDED,
   COMMENT_DELETED,
   POSTS_CLEARED,
   POST_CLEARED,
   POST_ERROR,
} from "./types";

//Get all posts
export const loadPosts = (class_id) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   try {
      const res = await axios.get(`/api/posts/class/${class_id}`);
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

   dispatch(updateLoadingSpinner(false));
};

//Get a post by ID
export const loadPostById = (post_id) => async (dispatch) => {
   try {
      const res = await axios.get(`/api/posts/${post_id}`);

      dispatch({
         type: POST_LOADED,
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

//Add like
export const addLike = (post_id) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   try {
      const res = await axios.put(`/api/posts/like/${post_id}`);

      dispatch({
         type: LIKES_UPDATED,
         payload: { post_id, likes: res.data },
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
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
      window.scrollTo(0, 0);
   }
   dispatch(updateLoadingSpinner(false));
};

//Remove like
export const removeLike = (post_id) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   try {
      const res = await axios.put(`/api/posts/unlike/${post_id}`);

      dispatch({
         type: LIKES_UPDATED,
         payload: { post_id, likes: res.data },
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
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
      window.scrollTo(0, 0);
   }
   dispatch(updateLoadingSpinner(false));
};

//Delete a post
export const deletePost = (post_id) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   try {
      await axios.delete(`/api/posts/${post_id}`);

      dispatch({
         type: POST_DELETED,
         payload: post_id,
      });

      dispatch(setAlert("Posteo Eliminado", "success", "2"));
   } catch (err) {
      dispatch({
         type: POST_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
      dispatch(setAlert(err.response.data.msg, "danger", "2"));
   }

   window.scrollTo(0, 0);
   dispatch(updateLoadingSpinner(false));
};

//Add a post
export const addPost = (formData, class_id) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));

   const config = {
      headers: {
         "Content-Type": "application/json",
      },
   };
   try {
      let post = JSON.stringify(formData);

      const res = await axios.post(`/api/posts/${class_id}`, post, config);

      dispatch({
         type: POST_ADDED,
         payload: res.data,
      });

      dispatch(setAlert("Posteo Creado", "success", "2"));
   } catch (err) {
      if (err.response.data.erros) {
         const errors = err.response.data.errors;
         errors.forEach((error) => {
            dispatch(setAlert(error.msg, "danger", "2"));
         });
         dispatch({
            type: POST_ERROR,
            payload: errors,
         });
      } else {
         dispatch(setAlert(err.response.data.msg, "danger", "2"));
         dispatch({
            type: POST_ERROR,
            payload: {
               type: err.response.statusText,
               status: err.response.status,
               msg: err.response.data.msg,
            },
         });
      }
   }

   window.scrollTo(0, 0);
   dispatch(updateLoadingSpinner(false));
};
// Add comment
export const addComment = (post_id, formData, screen) => async (dispatch) => {
   //screen is to see where to go to see the alert
   //post_id is to create a type of alert so it does not create as many alerts as comments

   dispatch(updateLoadingSpinner(true));

   const config = {
      headers: {
         "Content-Type": "application/json",
      },
   };
   try {
      let comment = JSON.stringify(formData);

      const res = await axios.post(
         `/api/posts/comment/${post_id}`,
         comment,
         config
      );

      dispatch({
         type: COMMENT_ADDED,
         payload: res.data,
      });

      dispatch(setAlert("Comentario Agregado", "success", post_id));
   } catch (err) {
      if (err.response.data.erros) {
         const errors = err.response.data.errors;
         errors.forEach((error) => {
            dispatch(setAlert(error.msg, "danger", post_id));
         });
         dispatch({
            type: POST_ERROR,
            payload: errors,
         });
      } else {
         dispatch(setAlert(err.response.data.msg, "danger", post_id));
         dispatch({
            type: POST_ERROR,
            payload: {
               type: err.response.statusText,
               status: err.response.status,
               msg: err.response.data.msg,
            },
         });
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
         `/api/posts/comment/${post_id}/${comment_id}`
      );

      dispatch({
         type: COMMENT_DELETED,
         payload: res.data,
      });

      dispatch(setAlert("Comentario Eliminado", "success", post_id));
   } catch (err) {
      dispatch({
         type: POST_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
      dispatch(setAlert(err.response.data.msg, "danger", post_id));
   }

   window.scrollBy(0, screen);
   dispatch(updateLoadingSpinner(false));
};

export const clearPost = () => (dispatch) => {
   dispatch({ type: POST_CLEARED });
};

export const clearPosts = () => (dispatch) => {
   dispatch({ type: POSTS_CLEARED });
};
