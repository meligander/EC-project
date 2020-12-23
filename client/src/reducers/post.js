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
      case POST_LOADED:
         return {
            ...state,
            post: payload,
            loading: false,
         };
      case POSTS_LOADED:
         return {
            ...state,
            posts: payload,
            loading: false,
         };
      case POST_ADDED:
         return {
            ...state,
            posts: [payload, ...state.posts],
            loding: false,
         };
      case POST_DELETED:
         return {
            ...state,
            posts: state.posts.filter((post) => post._id !== payload),
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
      case COMMENT_ADDED:
         return {
            ...state,
            post: {
               ...state.post,
               comments: payload,
            },
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
      case POST_CLEARED:
         return {
            ...state,
            post: null,
            loading: true,
         };
      case POSTS_CLEARED:
         return initialState;
      case POST_ERROR:
         return {
            ...state,
            error: payload,
            loading: false,
         };
      default:
         return state;
   }
}
