import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import logo from "../../img/logoSinLetras.png";
import PropTypes from "prop-types";
import ToggleNavbars from "./navbars/ToggleNavbars";
import { toggleMenu } from "../../actions/navbar";
import GuestNavbar from "./navbars/GuestNavbar";
import portrait from "./../../img/logo.png";

const Navbar = ({
   auth: { userLogged, loading, isAuthenticated, visitor },
   navbar: { showMenu },
   toggleMenu,
}) => {
   return (
      <nav className="navbar bg-primary">
         <Link
            className="navbar-homebtn"
            to={isAuthenticated ? `/dashboard/${userLogged._id}` : "/"}
         >
            <div>
               <img src={logo} alt="Logo English Center" />
            </div>
            <p className="heading-navbar hide-sm">
               Villa de Merlo English Center
            </p>
         </Link>
         {userLogged !== null && (
            <h3 className="navbar-name">Welcome {userLogged.name}</h3>
         )}
         <div
            className={!showMenu ? "menu-btn" : "menu-btn close"}
            onClick={toggleMenu}
         >
            <div className="btn-line"></div>
            <div className="btn-line"></div>
            <div className="btn-line"></div>
         </div>

         <div className={!showMenu ? "menu" : "menu show"}>
            <div className={!showMenu ? "menu-branding" : "menu-branding show"}>
               <div className="portrait">
                  <img src={portrait} alt="English Center logo" />
               </div>
               <div className="address">
                  <h3 className="heading-tertiary">
                     Villa de Merlo English Center
                  </h3>
                  <p className="paragraph">
                     Villa De Merlo - San Luis <br /> Argentina
                  </p>
               </div>
            </div>
            {!visitor ? (
               <>
                  {!loading ? (
                     <ToggleNavbars />
                  ) : (
                     <ul className={!showMenu ? "menu-nav" : "menu-nav show"}>
                        <li
                           className={
                              !showMenu ? "nav-item" : "nav-item show current"
                           }
                        >
                           <p className="lead">
                              <i className="far fa-clock"></i> &nbsp;
                              <span className="hide-md">Cargando...</span>
                           </p>
                        </li>
                     </ul>
                  )}
               </>
            ) : (
               <GuestNavbar />
            )}
         </div>
      </nav>
   );
};

Navbar.prototypes = {
   auth: PropTypes.object.isRequired,
   navbar: PropTypes.object.isRequired,
   toggleMenu: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   auth: state.auth,
   navbar: state.navbar,
});

export default connect(mapStateToProps, { toggleMenu })(Navbar);
