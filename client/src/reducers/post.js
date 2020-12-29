import {
   POSTS_LOADED,
   POST_ADDED,
   POST_DELETED,
   COMMENT_ADDED,
   COMMENT_DELETED,
   LIKES_UPDATED,
   POSTS_CLEARED,
   POST_ERROR,
} from "../actions/types";

const initialState = {
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
      case POST_ADDED:
         return {
            ...state,
            posts: [payload, ...state.posts],
            loading: false,
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
      case COMMENT_DELETED:
         return {
            ...state,
            posts: state.posts.map((post) => {
               if (payload._id === post._id) return payload;
               else return post;
            }),
            loading: false,
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
