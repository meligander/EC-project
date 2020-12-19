import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Routes from "./components/routing/Routes";

//Redux
import store from "./store";
import { Provider } from "react-redux";
import setAuthToken from "./utils/setAuthToken";
//actions
import { loadUser } from "./actions/auth";
import { updateExpiredIntallments } from "./actions/debts";

//Unregister Pages
import About from "./components/unregister/About";
import Landing from "./components/unregister/Landing";
import Contact from "./components/unregister/Contact";

//Layout Items
import Navbar from "./components/layouts/Navbar";
import Footer from "./components/layouts/Footer";

import "./style/main.scss";

const App = () => {
   useEffect(() => {
      if (localStorage.token) {
         setAuthToken(localStorage.token);
         store.dispatch(loadUser());
         store.dispatch(updateExpiredIntallments());
      }
   }, []);
   return (
      <Provider store={store}>
         <Router>
            <Fragment>
               <Navbar />
               <Switch>
                  <Route exact path="/" component={Landing} />
                  <Route exact path="/about" component={About} />
                  <Route exact path="/contact" component={Contact} />
                  <Route component={Routes} />
               </Switch>
               <Footer />
            </Fragment>
         </Router>
      </Provider>
   );
};

export default App;
