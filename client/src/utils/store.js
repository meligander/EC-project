import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "../reducers";
import setAuthToken from "./setAuthToken";

const initialState = {};

const middleware = [thunk];

const composeEnhancers = composeWithDevTools({
   trace: true,
   traceLimit: 25,
});
const store = createStore(
   rootReducer,
   initialState,
   composeEnhancers(applyMiddleware(...middleware))
);

// set up a store subscription listener
// to store the users token in localStorage

// prevent auth error on first run of subscription
let currentState = {
   auth: { token: null, isAuthenticated: null, loading: true, user: null },
};

store.subscribe(() => {
   // keep track of the previous and current state to compare changes
   let previousState = currentState;
   currentState = store.getState();
   // if the token changes set the value in localStorage and axios headers
   if (previousState.auth.token !== currentState.auth.token) {
      const token = currentState.auth.token;
      setAuthToken(token);
   }
});

export default store;
