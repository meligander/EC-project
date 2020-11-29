import {
	POST_LOADED,
	POST_ERROR,
	POSTS_LOADED,
	LIKES_UPDATED,
	POST_DELETED,
	POST_ADDED,
	COMMENT_ADDED,
	COMMENT_DELETED,
	POSTS_CLEARED,
} from './types';
import axios from 'axios';
import { setAlert } from './alert';
import { updateLoadingSpinner } from './mixvalues';

//Get all posts
export const loadPosts = (class_id) => async (dispatch) => {
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
	try {
		dispatch(updateLoadingSpinner(true));
		const res = await axios.put(`/api/posts/like/${post_id}`);

		dispatch({
			type: LIKES_UPDATED,
			payload: { post_id, likes: res.data },
		});
		dispatch(updateLoadingSpinner(false));
	} catch (err) {
		dispatch({
			type: POST_ERROR,
			payload: {
				type: err.response.statusText,
				status: err.response.status,
				msg: err.response.data.msg,
			},
		});
		dispatch(updateLoadingSpinner(false));
	}
};

//Remove like
export const removeLike = (post_id) => async (dispatch) => {
	try {
		dispatch(updateLoadingSpinner(true));
		const res = await axios.put(`/api/posts/unlike/${post_id}`);

		dispatch({
			type: LIKES_UPDATED,
			payload: { post_id, likes: res.data },
		});
		dispatch(updateLoadingSpinner(false));
	} catch (err) {
		dispatch({
			type: POST_ERROR,
			payload: {
				type: err.response.statusText,
				status: err.response.status,
				msg: err.response.data.msg,
			},
		});
		dispatch(updateLoadingSpinner(false));
	}
};

//Delete a post
export const deletePost = (post_id) => async (dispatch) => {
	try {
		dispatch(updateLoadingSpinner(true));
		await axios.delete(`/api/posts/${post_id}`);

		dispatch({
			type: POST_DELETED,
			payload: post_id,
		});

		dispatch(updateLoadingSpinner(false));
		dispatch(setAlert('Posteo Eliminado', 'success', '2'));
		window.scroll(500, 0);
	} catch (err) {
		dispatch({
			type: POST_ERROR,
			payload: {
				type: err.response.statusText,
				status: err.response.status,
				msg: err.response.data.msg,
			},
		});
		dispatch(updateLoadingSpinner(false));
	}
};

//Add a post
export const addPost = (formData, class_id) => async (dispatch) => {
	const config = {
		headers: {
			'Content-Type': 'application/json',
		},
	};
	dispatch(updateLoadingSpinner(true));
	try {
		const res = await axios.post(`/api/posts/${class_id}`, formData, config);

		dispatch({
			type: POST_ADDED,
			payload: res.data,
		});

		dispatch(setAlert('Posteo Creado', 'success', '2'));
		dispatch(updateLoadingSpinner(false));
		window.scroll(500, 0);
	} catch (err) {
		if (err.response !== null) {
			if (err.response.data.msg !== undefined) {
				dispatch(setAlert(err.response.data.msg, 'danger', '2'));
			} else {
				const errors = err.response.data.errors;
				if (errors.length !== 0) {
					errors.forEach((error) => {
						dispatch(setAlert(error.msg, 'danger', '2'));
					});
				}
			}
			window.scrollTo(500, 0);
		}
		dispatch({
			type: POST_ERROR,
		});
		dispatch(updateLoadingSpinner(false));
	}
};
// Add comment
export const addComment = (post_id, formData) => async (dispatch) => {
	const config = {
		headers: {
			'Content-Type': 'application/json',
		},
	};
	dispatch(updateLoadingSpinner(true));
	try {
		const res = await axios.post(
			`/api/posts/comment/${post_id}`,
			formData,
			config
		);

		dispatch({
			type: COMMENT_ADDED,
			payload: res.data,
		});
		dispatch(updateLoadingSpinner(false));
		window.scroll(0, 0);
		dispatch(setAlert('Comentario Agregado', 'success', '2'));
	} catch (err) {
		if (err.response !== null) {
			if (err.response.data.msg !== undefined) {
				dispatch(setAlert(err.response.data.msg, 'danger', '2'));
			} else {
				const errors = err.response.data.errors;
				if (errors.length !== 0) {
					errors.forEach((error) => {
						dispatch(setAlert(error.msg, 'danger', '2'));
					});
				}
			}
			window.scrollTo(500, 0);
		}
		dispatch({
			type: POST_ERROR,
		});
		dispatch(updateLoadingSpinner(false));
	}
};

//Delete a comment
export const deleteComment = (post_id, comment_id) => async (dispatch) => {
	try {
		dispatch(updateLoadingSpinner(true));
		await axios.delete(`/api/posts/comment/${post_id}/${comment_id}`);

		dispatch({
			type: COMMENT_DELETED,
			payload: comment_id,
		});

		dispatch(setAlert('Comentario Eliminado', 'success', '2'));
		dispatch(updateLoadingSpinner(false));
		window.scroll(500, 0);
	} catch (err) {
		dispatch({
			type: POST_ERROR,
			payload: {
				type: err.response.statusText,
				status: err.response.status,
				msg: err.response.data.msg,
			},
		});
		dispatch(updateLoadingSpinner(false));
	}
};

export const clearPosts = () => (dispatch) => {
	dispatch({ type: POSTS_CLEARED });
};
