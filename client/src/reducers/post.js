import {
   POST_LOADED,
   POSTS_LOADED,
   POST_ERROR,
   LIKES_UPDATED,
   POST_DELETED,
   POST_ADDED,
   COMMENT_ADDED,
   COMMENT_DELETED,
   POSTS_CLEARED,
   POST_CLEARED,
} from "../actions/types";

const initialState = {
   post: null,
   posts: [],
   loading: true,
   error: {},
};

export default function (state = initialState, action) {
   const { type, payload } = action;
   switch (type) {
      case POSTS_LOADED:
         return {
            ...state,
            posts: payload,
            loading: false,
         };
      case POST_LOADED:
         return {
            ...state,
            post: payload,
            loading: false,
         };
      case POST_ADDED:
         return {
            ...state,
            posts: [payload, ...state.posts],
            loding: false,
         };
      case POST_ERROR:
         return {
            ...state,
            error: payload,
            loading: false,
         };
      case COMMENT_ADDED:
         return {
            ...state,
            post: {
               ...state.post,
               comments: payload,
            },
            loading: false,
         };
      case LIKES_UPDATED:
         return {
            ...state,
            posts: state.posts.map((post) =>
               post._id === payload.post_id
                  ? { ...post, likes: payload.likes }
                  : post
            ),
            loading: false,
         };
      case COMMENT_DELETED:
         return {
            ...state,
            post: {
               ...state.post,
               comments: state.post.comments.filter(
                  (comment) => comment._id !== payload
               ),
            },
            loading: false,
         };
      case POST_DELETED:
         return {
            ...state,
            posts: state.posts.filter((post) => post._id !== payload),
            loading: false,
         };
      case POSTS_CLEARED:
         return initialState;
      case POST_CLEARED:
         return {
            ...state,
            post: null,
            loading: true,
         };
      default:
         return state;
   }
}
