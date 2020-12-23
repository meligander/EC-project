import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

//Redux
import store from "./store";
import { Provider } from "react-redux";
import setAuthToken from "./utils/setAuthToken";
//actions
import { loadUser } from "./actions/auth";

//Unregister Pages
import About from "./components/unregister/About";
import Landing from "./components/unregister/Landing";
import Contact from "./components/unregister/Contact";

//Layout Items
import Navbar from "./components/layouts/Navbar";
import Footer from "./components/layouts/Footer";

import PublicRoutes from "./components/routing/PublicRoutes";
import Routes from "./components/routing/Routes";

import "./style/main.scss";

const App = () => {
   useEffect(() => {
      if (localStorage.token) {
         setAuthToken(localStorage.token);
         store.dispatch(loadUser());
      }
   }, []);
   return (
      <Provider store={store}>
         <Router>
            <Fragment>
               <Navbar />
               <Switch>
                  <PublicRoutes exact path="/" component={Landing} />
                  <PublicRoutes exact path="/about" component={About} />
                  <PublicRoutes exact path="/contact" component={Contact} />
                  <Route component={Routes} />
               </Switch>
               <Footer />
            </Fragment>
         </Router>
      </Provider>
   );
};

export default App;
