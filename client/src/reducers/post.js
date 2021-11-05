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
} from "../actions/types";

const initialState = {
   posts: [],
   loading: true,
   unseenPosts: "",
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
            posts: state.posts.map((post) =>
               post._id === payload.post_id
                  ? { ...post, comments: payload.comments }
                  : post
            ),
            loading: false,
         };
      case POST_SEEN:
         return {
            ...state,
            posts: state.posts.map((post) =>
               post._id === payload.post_id
                  ? { ...post, seenArray: payload.seenArray }
                  : post
            ),
            loading: false,
         };
      case UNSEENPOSTS_CHANGED:
         return {
            ...state,
            unseenPosts: payload,
         };
      case POSTS_CLEARED:
         return initialState;
      case POST_ERROR:
         return {
            ...state,
            error: payload,
            loading: false,
            unseenPosts: 0,
         };
      default:
         return state;
   }
}
