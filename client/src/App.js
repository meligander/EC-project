import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Router, Route, Switch } from "react-router-dom";

import setAuthToken from "./utils/setAuthToken";
import history from "./utils/history";

//actions
import { loadUser } from "./actions/auth";

//Unregister Pages
import About from "./components/pages/guest/About";
import Landing from "./components/pages/guest/Landing";
import Contact from "./components/pages/guest/Contact";

//Layout Items
import Navbar from "./components/layouts/Navbar";
import Footer from "./components/layouts/Footer";

import PublicRoutes from "./components/routing/PublicRoutes";
import Routes from "./components/routing/Routes";

import "./style/main.scss";

const App = ({ loadUser, mixvalues: { navbar } }) => {
   useEffect(() => {
      if (localStorage.token) {
         setAuthToken(localStorage.token);
         loadUser();
      }
   }, [loadUser]);
   return (
      <Router history={history}>
         <Navbar />
         <div
            style={{
               /* minHeight: `calc(100vh - ${footer}px)`, */
               paddingTop: `${navbar}px`,
            }}
         >
            <Switch>
               <PublicRoutes exact path="/" component={Landing} />
               <PublicRoutes exact path="/about" component={About} />
               <PublicRoutes exact path="/contact" component={Contact} />
               <Route component={Routes} />
            </Switch>
         </div>
         <Footer />
      </Router>
   );
};

const mapStateToProps = (state) => ({
   mixvalues: state.mixvalues,
});

export default connect(mapStateToProps, { loadUser })(App);
