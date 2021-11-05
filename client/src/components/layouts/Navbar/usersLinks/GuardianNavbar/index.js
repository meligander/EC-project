import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { FaUserCircle, FaRegUserCircle } from "react-icons/fa";

import { clearProfile } from "../../../../../actions/user";

const GuardianNavbar = ({
   auth: { userLogged },
   toggleMenu,
   currentNav,
   setCurrentNav,
   clearProfile,
}) => {
   return (
      <>
         {userLogged.children.length > 0 &&
            userLogged.children.map((child, index) => (
               <li
                  key={child._id}
                  className={`nav-item ${toggleMenu ? "show" : ""} ${
                     currentNav === "child" + index ? "current" : ""
                  }`}
               >
                  <Link
                     className="nav-link"
                     to={`/dashboard/${child._id}`}
                     onClick={() => {
                        window.scroll(0, 0);
                        clearProfile();
                        setCurrentNav(`child${index}`);
                     }}
                  >
                     {index % 2 === 0 ? <FaRegUserCircle /> : <FaUserCircle />}
                     <span className="hide-md">
                        &nbsp; {child.lastname + ", " + child.name}
                     </span>
                  </Link>
               </li>
            ))}
      </>
   );
};

const mapStateToProps = (state) => ({
   auth: state.auth,
});

export default connect(mapStateToProps, { clearProfile })(GuardianNavbar);
